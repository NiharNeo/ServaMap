import io
import os
import sys
import tempfile
import re
from gtts import gTTS
from pydub import AudioSegment

# pydub needs ffmpeg for MP3 decode/encode. If ffmpeg isn't on PATH,
# use imageio-ffmpeg to supply a bundled binary.
try:
    from imageio_ffmpeg import get_ffmpeg_exe

    AudioSegment.converter = get_ffmpeg_exe()
except Exception:
    # Install-only in-repo vendored packages path (works in restricted envs).
    vendor_dir = os.path.join(os.path.dirname(__file__), "_vendor")
    if os.path.isdir(vendor_dir) and vendor_dir not in sys.path:
        sys.path.insert(0, vendor_dir)
    try:
        from imageio_ffmpeg import get_ffmpeg_exe

        AudioSegment.converter = get_ffmpeg_exe()
    except Exception:
        pass

# Pitch shifting (librosa) is imported lazily in `_pitch_shift_segment` to
# avoid importing heavy native deps at server startup.

# ---------------------------------------------------------------------------
# Raga → semitone offset from base pitch
# ---------------------------------------------------------------------------
RAGA_PITCH_MAP = {
    "Bhairavi": -2,
    "Darbari Kanada": -4,
    "Yaman": +2,
    "Bhairav": -1,
    "Kafi": 0,
    "Todi": -3,
    "Bhupali": +3,
    "Malkauns": -5,
    "Marwa": +1,
    "Purvi": -1,
    "default": 0,
}

# ---------------------------------------------------------------------------
# Solfege → semitone offset (12-TET approximation for PoC)
# ---------------------------------------------------------------------------
SOLFEGE_TO_SEMITONE = {
    "Sa": 0,
    "Re": 2,
    "Ga": 4,
    "Ma": 5,
    "Pa": 7,
    "Dha": 9,
    "Ni": 11,
}

# ---------------------------------------------------------------------------
# Tempo → speed ratio  (Vilambit = slow, Drut = fast)
# ---------------------------------------------------------------------------
TEMPO_SPEED = {
    "Vilambit": 0.7,
    "Madhya": 1.0,
    "Drut": 1.4,
}

SILENCE_BETWEEN_PADAS_MS = 300


def _get_pitch_shift(ragas: list[str]) -> int:
    """Return semitone shift for the first recognised raga in the list."""
    for raga in ragas:
        for key in RAGA_PITCH_MAP:
            if key.lower() in raga.lower() or raga.lower() in key.lower():
                return RAGA_PITCH_MAP[key]
    return RAGA_PITCH_MAP["default"]


def _pitch_shift_segment(segment: AudioSegment, semitones: int) -> AudioSegment:
    """
    Pitch-shift an AudioSegment by `semitones`.

    We intentionally use pydub's frame-rate trick (no numpy/librosa) so the
    synthesis can run in restricted environments.
    """
    if semitones == 0:
        return segment

    # 12-TET ratio: semitones -> frequency scale.
    original_duration_ms = len(segment)
    ratio = 2 ** (semitones / 12.0)
    new_frame_rate = int(segment.frame_rate * ratio)
    if new_frame_rate <= 0:
        return segment

    # Change frame rate to shift pitch, then restore the original frame rate
    # so duration stays roughly comparable.
    pitched = segment._spawn(segment.raw_data, overrides={"frame_rate": new_frame_rate})
    pitched = pitched.set_frame_rate(segment.frame_rate)

    # Correct small duration drift so meter-based slicing remains consistent.
    if original_duration_ms > 0:
        current_duration_ms = len(pitched)
        if current_duration_ms > 0 and abs(current_duration_ms - original_duration_ms) > 1:
            # `_speed_change` keeps pitch while adjusting duration.
            speed = current_duration_ms / original_duration_ms
            pitched = _speed_change(pitched, speed)

    return pitched


def _speed_change(segment: AudioSegment, speed: float) -> AudioSegment:
    """Change playback speed without changing pitch by altering frame rate."""
    if abs(speed - 1.0) < 0.01:
        return segment
    altered = segment._spawn(
        segment.raw_data,
        overrides={"frame_rate": int(segment.frame_rate * speed)},
    )
    return altered.set_frame_rate(segment.frame_rate)


def _parse_pitch_tokens(pitch: str) -> list[str]:
    """
    Parse a "Sa Re Ga Ma Pa ..." solfege string into canonical tokens.
    We intentionally ignore any non-solfège words like "(sequence)".
    """
    if not pitch:
        return []

    # Keep only letters/spaces; this strips parentheses and punctuation.
    cleaned = re.sub(r"[^A-Za-z\\s]", " ", str(pitch))
    raw_tokens = [t for t in cleaned.split() if t]

    tokens: list[str] = []
    for t in raw_tokens:
        t_norm = t.strip().lower()
        for canon in SOLFEGE_TO_SEMITONE.keys():
            if t_norm == canon.lower():
                tokens.append(canon)
                break
    return tokens


def _apply_syllable_rhythm_and_pitch(
    segment: AudioSegment,
    syllable_durations: list[float],
    solfege_tokens: list[str],
    raga_semitone_shift: int,
) -> AudioSegment:
    """
    Split the pada audio into syllable-proportional slices and apply a
    syllable-by-syllable pitch contour derived from solfege + raga.
    """
    if not syllable_durations:
        # No rhythm data: keep the original behavior (global raga shift).
        return _pitch_shift_segment(segment, raga_semitone_shift)

    durations = [max(0.0, float(d)) for d in syllable_durations]
    durations_sum = sum(durations)
    if durations_sum <= 0:
        return _pitch_shift_segment(segment, raga_semitone_shift)

    total_ms = len(segment)
    if total_ms <= 10:
        return _pitch_shift_segment(segment, raga_semitone_shift)

    # Convert durations -> boundary fractions -> millisecond boundaries.
    fractions: list[float] = []
    running = 0.0
    for d in durations:
        running += d
        fractions.append(running / durations_sum)

    boundaries = [0.0] + fractions
    ms_boundaries = [int(round(f * total_ms)) for f in boundaries]
    ms_boundaries[0] = 0
    ms_boundaries[-1] = total_ms

    # Ensure monotonic boundaries (rounding can cause tiny inversions).
    for i in range(1, len(ms_boundaries)):
        if ms_boundaries[i] < ms_boundaries[i - 1]:
            ms_boundaries[i] = ms_boundaries[i - 1]

    out: AudioSegment | None = None
    n_tokens = len(solfege_tokens) if solfege_tokens else 0

    for i in range(len(durations)):
        start_ms = ms_boundaries[i]
        end_ms = ms_boundaries[i + 1]
        if end_ms <= start_ms:
            continue

        slice_seg = segment[start_ms:end_ms]
        if n_tokens:
            token = solfege_tokens[i % n_tokens]
            token_shift = SOLFEGE_TO_SEMITONE.get(token, 0)
            shift = raga_semitone_shift + token_shift
        else:
            shift = raga_semitone_shift

        shifted = _pitch_shift_segment(slice_seg, shift)
        out = shifted if out is None else (out + shifted)

    return out if out is not None else _pitch_shift_segment(segment, raga_semitone_shift)


def synthesize_audio(analysis: dict) -> bytes:
    """
    Generate audio from the analysis dict.

    For each pāda:
      1. gTTS → base Sanskrit speech
      2. pydub speed change per tempo
      3. syllable slices (meter) + pitch contour (solfege + raga)
    Concatenate with 300 ms silence between pādas.
    Return raw MP3 bytes.
    """
    padas = analysis.get("padas", [])
    ragas = analysis.get("ragas", ["Kafi"])
    semitone_shift = _get_pitch_shift(ragas)

    combined: AudioSegment | None = None
    silence = AudioSegment.silent(duration=SILENCE_BETWEEN_PADAS_MS)

    for pada in padas:
        text = pada.get("text", "").strip()
        if not text:
            continue

        tempo = pada.get("tempo", "Madhya")
        speed = TEMPO_SPEED.get(tempo, 1.0)
        syllable_durations = pada.get("syllable_durations", []) or []
        solfege_tokens = _parse_pitch_tokens(pada.get("pitch", ""))

        # 1. gTTS — synthesize Sanskrit text to MP3 bytes in memory
        tts = gTTS(text=text, lang="hi", slow=(speed < 0.85))
        mp3_buf = io.BytesIO()
        tts.write_to_fp(mp3_buf)
        mp3_buf.seek(0)

        # 2. Load into pydub via librosa bypass (bypasses ffprobe dependency)
        import librosa
        import numpy as np
        try:
            # librosa.load can read MP3 from a file-like object
            y, sr = librosa.load(mp3_buf, sr=None)
            # Convert float32 [-1, 1] to int16 [-32768, 32767]
            y_int16 = (y * 32767).astype(np.int16)
            seg = AudioSegment(
                y_int16.tobytes(),
                frame_rate=sr,
                sample_width=2,
                channels=1
            )
        except Exception as e:
            # If librosa fails, try one last time with pydub (might work if env set up)
            mp3_buf.seek(0)
            seg = AudioSegment.from_file(mp3_buf, format="mp3")

        # 3. Speed change
        seg = _speed_change(seg, speed)

        # 4. Meter (syllable durations) + melodic contour (solfege + raga)
        seg = _apply_syllable_rhythm_and_pitch(
            seg,
            syllable_durations=syllable_durations,
            solfege_tokens=solfege_tokens,
            raga_semitone_shift=semitone_shift,
        )

        # 5. Append
        if combined is None:
            combined = seg
        else:
            combined = combined + silence + seg

    if combined is None:
        # Fallback: 1 second of silence
        combined = AudioSegment.silent(duration=1000)

    # Export to MP3 bytes
    out_buf = io.BytesIO()
    combined.export(out_buf, format="mp3")
    out_buf.seek(0)
    return out_buf.read()
