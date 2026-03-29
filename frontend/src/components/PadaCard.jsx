import React from 'react'
import { getRasaData } from './RasaLegend.jsx'

const PADA_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

export default function PadaCard({ pada, index, totalCount, isActive }) {
  const [expanded, setExpanded] = React.useState(false)
  const rasa = getRasaData(pada.rasa)
  const numeral = PADA_NUMERALS[index] || `${index + 1}`

  return (
    <div 
      className={`folio transition-all duration-500 cursor-pointer ${expanded ? 'bg-black/20' : ''} ${isActive ? 'active-stone' : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div
            className="font-label carved-label px-2 flex-shrink-0"
            style={{ color: '#C0392B', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', paddingTop: 2 }}
          >
            पाद {numeral}
          </div>
          <span
            className="rasa-tag"
            style={{ background: rasa.bg, color: rasa.color, border: `1px solid ${rasa.color}40` }}
          >
            {rasa.sanskrit} · {rasa.name}
          </span>
        </div>

        {/* Verse text */}
        <p className="font-body" style={{ color: '#ede0d5', fontSize: '1.15rem', lineHeight: 2, letterSpacing: '0.01em' }}>
          {pada.text}
        </p>

        {/* Intensity bar */}
        <div className="intensity-bar mt-4">
          <div className="intensity-fill" style={{ width: `${pada.intensity * 100}%`, background: `linear-gradient(to right, ${rasa.color}70, ${rasa.color})` }} />
        </div>
        <div className="flex justify-between mt-1 font-label" style={{ color: 'rgba(237,224,213,0.25)', fontSize: '0.58rem', letterSpacing: '0.08em' }}>
          <span>INTENSITY</span>
          <span>{(pada.intensity * 100).toFixed(0)}%</span>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span
            className="font-label"
            style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(212,160,23,0.65)', background: 'rgba(212,160,23,0.07)', border: '1px solid rgba(212,160,23,0.18)', padding: '0.18rem 0.55rem' }}
          >
            <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: 10 }}>music_note</span>
            {pada.tempo}
          </span>
          <span
            className="font-label"
            style={{ fontSize: '0.6rem', letterSpacing: '0.06em', color: 'rgba(182,196,255,0.8)', background: 'rgba(44,62,122,0.12)', border: '1px solid rgba(44,62,122,0.28)', padding: '0.18rem 0.55rem' }}
          >
            {pada.pitch}
          </span>
        </div>

        {/* Expand hint */}
        <div className="font-label mt-3 text-right" style={{ color: 'rgba(237,224,213,0.2)', fontSize: '0.56rem', letterSpacing: '0.12em' }}>
          {expanded ? '▲ collapse' : '▼ expand'}
        </div>

        {/* Expanded */}
        {expanded && (
          <div className="mt-4 pt-4 animate-fade-up" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
            <p className="font-headline mb-4" style={{ color: 'rgba(237,224,213,0.8)', fontSize: '0.88rem', lineHeight: 1.85, fontStyle: 'italic' }}>
              ॥ {pada.explanation} ॥
            </p>

            {pada.syllable_weights && (
              <div className="mt-5 border-t border-white/5 pt-4">
                <p className="font-label mb-3" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Metrical Weight (Laghu/Guru)
                </p>
                <div className="flex flex-wrap gap-2">
                  {pada.syllable_weights.map((w, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        className={`w-6 h-6 flex items-center justify-center rounded-sm text-[10px] font-bold ${w === 'G' ? 'bg-[#D4A017]/20 text-[#D4A017]' : 'bg-white/5 text-white/40'}`}
                        style={{ border: w === 'G' ? '1px solid rgba(212,160,23,0.3)' : '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {w}
                      </div>
                      <span className="text-[8px] mt-1 opacity-20">{(pada.syllable_durations?.[i] || 0.3).toFixed(1)}s</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Bottom accent */}
      <div style={{ height: 2, background: `linear-gradient(to right, transparent, ${rasa.color}50, transparent)` }} />
    </div>
  )
}
