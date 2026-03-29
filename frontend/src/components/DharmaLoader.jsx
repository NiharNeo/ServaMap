import React from 'react'

const MESSAGES = [
  'छन्दःपदानि विश्लेष्यन्ते…',
  'Detecting syllable patterns…',
  'Identifying Chanda (meter)…',
  'Consulting Natyashastra…',
  'Mapping melodic framework…',
  'Composing emotional terrain…',
  'रसान् निर्धारयामः…',
]

export default function DharmaLoader() {
  const [msgIdx, setMsgIdx] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(() => setMsgIdx(i => (i + 1) % MESSAGES.length), 2200)
    return () => clearInterval(id)
  }, [])

  const spokes = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24
    const rad = (angle * Math.PI) / 180
    const inner = 28, outer = 62
    return {
      x1: 80 + inner * Math.cos(rad), y1: 80 + inner * Math.sin(rad),
      x2: 80 + outer * Math.cos(rad), y2: 80 + outer * Math.sin(rad),
      i,
    }
  })

  const arches = Array.from({ length: 16 }, (_, i) => {
    const r = (i * 360) / 16
    const rad = (r * Math.PI) / 180
    return { x: 80 + 68 * Math.cos(rad), y: 80 + 68 * Math.sin(rad) }
  })

  return (
    <div className="flex flex-col items-center justify-center gap-10 py-16">
      {/* Wheel */}
      <div style={{ filter: 'drop-shadow(0 0 18px rgba(212,160,23,0.3))' }}>
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{ animation: 'spin 9s linear infinite' }}
        >
          <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="2" />
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(212,160,23,0.45)" strokeWidth="1" />
          {arches.map((a, i) => (
            <circle key={i} cx={a.x} cy={a.y} r="4" fill="none" stroke="rgba(212,160,23,0.35)" strokeWidth="1" />
          ))}
          {spokes.map(s => (
            <line
              key={s.i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={s.i % 3 === 0 ? 'rgba(212,160,23,0.75)' : 'rgba(212,160,23,0.3)'}
              strokeWidth={s.i % 3 === 0 ? 1.5 : 0.8}
            />
          ))}
          <circle cx="80" cy="80" r="24" fill="none" stroke="rgba(212,160,23,0.45)" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="18" fill="none" stroke="rgba(212,160,23,0.25)" strokeWidth="1" />
          <circle cx="80" cy="80" r="6"  fill="rgba(212,160,23,0.55)" />
          <circle cx="80" cy="80" r="3"  fill="#D4A017" />
        </svg>
        {/* ॐ counter-rotation */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ position: 'absolute', inset: 0, animation: 'spin 18s linear infinite reverse', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span className="font-yatra" style={{ fontSize: '1.3rem', color: 'rgba(212,160,23,0.65)', position: 'absolute' }}>ॐ</span>
        </div>
      </div>

      {/* Message */}
      <div style={{ minHeight: '2.5rem', textAlign: 'center' }}>
        <p
          key={msgIdx}
          className="font-label animate-fade-up"
          style={{ color: 'rgba(237,224,213,0.65)', letterSpacing: '0.1em', fontSize: '0.78rem', textTransform: 'uppercase' }}
        >
          {MESSAGES[msgIdx]}
        </p>
      </div>

      {/* Dot pulses */}
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'rgba(212,160,23,0.4)',
              animation: `barPulse ${0.9 + i * 0.15}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
