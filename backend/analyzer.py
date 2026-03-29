import os
import json
import asyncio
import re
import httpx
from dotenv import load_dotenv

load_dotenv()

# NVIDIA NIM uses an OpenAI-compatible API
NVIDIA_API_KEY = os.getenv("GEMINI_API_KEY", "")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
GEMINI_MODEL = "meta/llama-3.1-70b-instruct"

SYSTEM_PROMPT = """You are an expert in Sanskrit poetics, Chandas (meters), Rasa theory (Natyashastra), and Indian classical music (ragas). Analyze the Sanskrit verse and return ONLY a JSON object.

The output MUST be a valid JSON matching this schema:
{
  "meter": "Chanda name",
  "ragas": ["raga1", "raga2"],
  "padas": [
    {
      "text": "pada text",
      "rasa": "one of: shringara|vira|karuna|adbhuta|shanta|raudra|hasya|bhayanaka",
      "intensity": 0.0,
      "explanation": "2-sentence poetic explanation",
      "pitch": "Sa Re Ga Ma Pa (solfege sequence)",
      "tempo": "Vilambit|Madhya|Drut",
      "syllable_durations": [0.3, 0.3],
      "syllable_weights": ["L", "G"]
    }
  ]
}

Instructions:
1. Split the verse into natural pādas (usually 2 or 4).
2. 'intensity' is a float from 0.0 to 1.0.
3. 'syllable_durations' should be a list of floats (durations in seconds) matching the number of syllables in the pāda.
4. 'syllable_weights' is a list of "L" (Laghu/Light) or "G" (Guru/Heavy) for each syllable.
5. Be poetic, precise, and culturally accurate.
5. Return ONLY THE JSON OBJECT. No markdown, no backticks, no preamble."""


def _fallback_analyze_verse(verse: str) -> dict:
    """
    Deterministic, keyless fallback so the PoC can still produce audio.
    This is intentionally approximate: it estimates pādas and syllable timing.
    """
    cleaned = (verse or "").strip()
    if not cleaned:
        raise ValueError("Verse cannot be empty.")

    # Rough pāda splitting for Devanagari input (handles danda separators too).
    parts = [p.strip() for p in re.split(r"[।॥\\n]+", cleaned) if p.strip()]
    if not parts:
        parts = [cleaned]

    # Limit to 4 pādas by evenly chunking.
    if len(parts) > 4:
        n = len(parts)
        chunked: list[str] = []
        for i in range(4):
            start = int(i * n / 4)
            end = int((i + 1) * n / 4)
            chunked.append(" ".join(parts[start:end]).strip())
        parts = [p for p in chunked if p][:4]
    parts = parts[:4]

    # Deterministic raga pick based on input text.
    raga_candidates = ["Bhairavi", "Yaman", "Kafi", "Todi", "Bhairav"]
    idx = sum(ord(c) for c in cleaned) % len(raga_candidates)
    primary_raga = raga_candidates[idx]
    secondary_raga = raga_candidates[(idx + 2) % len(raga_candidates)]

    meter = "Anushtubh"
    tempo = "Madhya"

    if primary_raga == "Yaman":
        pitch = "Sa Re Ga Ma Pa Ni"
    elif primary_raga == "Todi":
        pitch = "Sa Re Ga Ma Pa Dha Ni"
    else:
        pitch = "Sa Re Ga Ma Pa"

    padas = []
    for i, pada_text in enumerate(parts):
        words = [w for w in re.split(r"\\s+", pada_text) if w]
        n_units = max(4, min(12, len(words)))  # PoC approximation of syllable count

        # Meter proxy: spread durations with light variation.
        base = 0.28 if i % 2 == 0 else 0.24
        syllable_durations = [base * (0.85 + (j % 3) * 0.15) for j in range(n_units)]

        intensity = min(1.0, 0.15 + len(pada_text) / 180.0)
        if intensity < 0.35:
            rasa = "shanta"
        elif intensity < 0.6:
            rasa = "karuna"
        elif intensity < 0.8:
            rasa = "vira"
        else:
            rasa = "adbhuta"

        padas.append(
            {
                "text": pada_text,
                "rasa": rasa,
                "intensity": float(intensity),
                "explanation": (
                    "This pāda is rendered with a fixed metrical timing proxy. "
                    "The melodic contour follows the selected rāga flavor."
                ),
                "pitch": pitch,
                "tempo": tempo,
                "syllable_durations": syllable_durations,
                "syllable_weights": ["L" if j % 2 == 0 else "G" for j in range(n_units)],
            }
        )

    return {"meter": meter, "ragas": [primary_raga, secondary_raga], "padas": padas}


async def analyze_verse(verse: str) -> dict:
    """Call NVIDIA NIM (OpenAI-compatible) to analyze a Sanskrit verse and return structured JSON."""
    if not NVIDIA_API_KEY:
        return _fallback_analyze_verse(verse)

    prompt = f"{SYSTEM_PROMPT}\n\nAnalyze this Sanskrit verse:\n\n{verse}"

    payload = {
        "model": GEMINI_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }

    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
    }

    limits = httpx.Limits(max_keepalive_connections=5, max_connections=10)
    print(f"DEBUG: Calling NVIDIA NIM with verse: {verse[:50]}...")
    
    for attempt in range(2):
        try:
            async with httpx.AsyncClient(timeout=45.0, limits=limits) as client:
                print(f"DEBUG: Sending request to NVIDIA (Attempt {attempt+1})...")
                response = await client.post(
                    f"{NVIDIA_BASE_URL}/chat/completions",
                    json=payload,
                    headers=headers
                )
                print(f"DEBUG: NVIDIA responded with status {response.status_code}")
                if response.status_code != 200:
                    print(f"DEBUG: Error details: {response.text}")
                response.raise_for_status()
                data = response.json()
                raw_text = data["choices"][0]["message"]["content"].strip()
                break # Success
        except (httpx.ConnectError, httpx.WriteError, BrokenPipeError) as e:
            print(f"DEBUG: Network error on attempt {attempt+1}: {e}")
            if attempt == 1: raise
            await asyncio.sleep(1)
        except Exception as e:
            import traceback
            print("DEBUG: Unexpected exception in analyze_verse:")
            traceback.print_exc()
            raise RuntimeError(f"NVIDIA API error: {e}")

    # Sometimes the model adds text before/after the JSON — extract it
    start = raw_text.find("{")
    end = raw_text.rfind("}") + 1
    if start != -1 and end > start:
        raw_text = raw_text[start:end]

    try:
        analysis = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Failed to parse Gemini response as JSON: {e}\nRaw: {raw_text[:400]}"
        )

    # Validate / coerce expected structure
    analysis.setdefault("meter", "Unknown")
    analysis.setdefault("ragas", ["Bhairavi"])
    analysis.setdefault("padas", [])

    for pada in analysis["padas"]:
        pada.setdefault("rasa", "shanta")
        pada.setdefault("intensity", 0.5)
        pada.setdefault("explanation", "")
        pada.setdefault("pitch", "Sa Re Ga Ma Pa")
        pada.setdefault("tempo", "Madhya")
        pada.setdefault("syllable_durations", [0.3])
        pada.setdefault("syllable_weights", ["L"])
        # Ensure intensity is a float
        try:
            pada["intensity"] = max(0.0, min(1.0, float(pada["intensity"])))
        except (ValueError, TypeError):
            pada["intensity"] = 0.5

    return analysis
