import React from 'react'

export const RASA_DATA = [
  { key: 'shringara', sanskrit: 'शृङ्गार', name: 'Shringara', meaning: 'Love & Beauty',        deity: 'Vishnu', color: '#e84393', bg: 'rgba(232,67,147,0.12)',  glyph: '❤' },
  { key: 'vira',      sanskrit: 'वीर',     name: 'Vira',      meaning: 'Heroism & Courage',     deity: 'Indra',  color: '#e8a020', bg: 'rgba(232,160,32,0.12)', glyph: '⚔' },
  { key: 'karuna',    sanskrit: 'करुण',    name: 'Karuna',    meaning: 'Compassion & Grief',    deity: 'Yama',   color: '#6b9ef8', bg: 'rgba(107,158,248,0.12)',glyph: '🌊' },
  { key: 'adbhuta',   sanskrit: 'अद्भुत',  name: 'Adbhuta',   meaning: 'Wonder & Marvel',       deity: 'Brahma', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',glyph: '✦' },
  { key: 'shanta',    sanskrit: 'शान्त',   name: 'Shanta',    meaning: 'Peace & Serenity',      deity: 'Vishnu', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', glyph: '☽' },
  { key: 'raudra',    sanskrit: 'रौद्र',   name: 'Raudra',    meaning: 'Fury & Wrath',          deity: 'Rudra',  color: '#f87171', bg: 'rgba(248,113,113,0.12)',glyph: '⚡' },
  { key: 'hasya',     sanskrit: 'हास्य',   name: 'Hasya',     meaning: 'Comedy & Mirth',        deity: 'Shiva',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', glyph: '☀' },
  { key: 'bhayanaka', sanskrit: 'भयानक',   name: 'Bhayanaka', meaning: 'Terror & Fear',         deity: 'Kala',   color: '#94a3b8', bg: 'rgba(148,163,184,0.12)',glyph: '☠' },
]

export function getRasaData(key) {
  return RASA_DATA.find(r => r.key === key) || RASA_DATA[4]
}

export default function RasaLegend() {
  return (
    <div className="surface-card p-6 animate-fade-up">
      {/* Header */}
      <p
        className="font-label text-center mb-5"
        style={{ color: 'rgba(212,160,23,0.5)', fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}
      >
        ॥ रसो वै सः — That which is Rasa is the very Self ॥
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '0.75rem' }}>
        {RASA_DATA.map(rasa => (
          <div
            key={rasa.key}
            className="flex items-start gap-3 p-3"
            style={{
              background: rasa.bg,
              borderLeft: `2px solid ${rasa.color}`,
              transition: 'transform 0.5s ease',
            }}
          >
            <span style={{ fontSize: '1rem', color: rasa.color, flexShrink: 0, lineHeight: 1, marginTop: 3 }}>
              {rasa.glyph}
            </span>
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-body" style={{ color: rasa.color, fontSize: '1rem', fontWeight: 700 }}>
                  {rasa.sanskrit}
                </span>
                <span className="font-label" style={{ color: 'rgba(237,224,213,0.4)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {rasa.name}
                </span>
              </div>
              <p className="font-headline" style={{ color: 'rgba(237,224,213,0.6)', fontSize: '0.76rem', marginTop: 1, fontStyle: 'italic' }}>
                {rasa.meaning}
              </p>
              <p className="font-label" style={{ color: 'rgba(212,160,23,0.3)', fontSize: '0.56rem', letterSpacing: '0.08em', marginTop: 2 }}>
                देवता: {rasa.deity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
