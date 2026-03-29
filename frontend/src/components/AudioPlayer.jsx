import React from 'react'

export default function AudioPlayer({ analysis, onProgress }) {
  const [status, setStatus] = React.useState('idle')
  const [audioUrl, setAudioUrl] = React.useState(null)
  const audioRef = React.useRef(null)

  const handlePlay = async () => {
    if (status === 'loading') return
    if (audioUrl && audioRef.current) {
      if (status === 'playing') {
        audioRef.current.pause()
        setStatus('idle')
      } else {
        audioRef.current.play()
        setStatus('playing')
      }
      return
    }
    setStatus('loading')
    try {
      const resp = await fetch('/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysis),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.detail || 'Audio synthesis failed')
      }
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      setStatus('playing')
      setTimeout(() => { if (audioRef.current) audioRef.current.play() }, 80)
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  const bars = [0.4, 0.7, 1.0, 0.8, 0.6, 0.9, 0.5, 0.75, 0.95, 0.65, 0.85, 0.5]

  const label = status === 'loading' ? 'Composing…'
    : status === 'playing' ? '⏸ Pause'
      : status === 'error' ? 'Retry Audio'
        : audioUrl ? '▶ Play Again'
          : '▶ Hear the Verse'

  return (
    <div className="folio p-6 flex flex-col items-center gap-5 animate-fade-up delay-400">
      {/* Header */}
      <p
        className="font-label"
        style={{ color: 'rgba(212,160,23,0.5)', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}
      >
        ॐ स्वरसंश्लेषण — Melodic Synthesis
      </p>

      {/* Waveform bars */}
      <div className="flex items-end gap-1" style={{ height: 44 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            className="wave-bar"
            style={{
              height: `${h * 44}px`,
              background: status === 'loading' || status === 'playing'
                ? `hsl(${28 + i * 10}, 70%, 55%)`
                : 'rgba(212,160,23,0.18)',
              animationDuration: `${0.6 + i * 0.07}s`,
              animationPlayState: status === 'loading' || status === 'playing' ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      {/* Play button */}
      <button
        className="btn-primary"
        onClick={handlePlay}
        disabled={status === 'loading'}
        aria-label="Play synthesized audio"
      >
        <span className="material-symbols-outlined align-middle mr-2" style={{ fontSize: 16 }}>
          {status === 'playing' ? 'pause' : 'play_arrow'}
        </span>
        {label}
      </button>

      {status === 'error' && (
        <p className="font-label text-center animate-fade-up" style={{ color: '#f87171', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
          ॥ Audio synthesis failed. Ensure backend + ffmpeg are running. ॥
        </p>
      )}

      <p className="font-headline text-center" style={{ color: 'rgba(237,224,213,0.3)', fontSize: '0.76rem', fontStyle: 'italic', maxWidth: 340 }}>
        Pitch-shifted per rāga · Tempo modulated per pāda · Synthesized in Devanagari
      </p>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={() => {
            if (audioRef.current && onProgress) {
              const cur = audioRef.current.currentTime
              const dur = audioRef.current.duration
              if (!isNaN(dur) && dur > 0) {
                onProgress(cur / dur)
              }
            }
          }}
          onEnded={() => {
            setStatus('idle')
            if (onProgress) onProgress(0)
          }}
          onPause={() => { if (status === 'playing') setStatus('idle') }}
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
}
