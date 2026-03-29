import React from 'react'

export default function Shruti() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Shruti</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "That which is heard."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="surface-card p-8">
        <h2 className="font-yatra text-2xl mb-4" style={{ color: '#D4A017' }}>The Oral Cartography</h2>
        <p className="font-body mb-6" style={{ color: 'rgba(237,224,213,0.8)', lineHeight: 1.8 }}>
          Shruti represents the divinely revealed knowledge of the Vedas, preserved through 
          exact oral transmission. In SvaraMap, we analyze the micro-tonal shifts (Swaras) 
          that define this auditory landscape.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {['Udatta', 'Anudatta', 'Svarita'].map(acc => (
            <div key={acc} className="folio p-4 text-center">
              <p className="font-label mb-1" style={{ color: 'rgba(212,160,23,0.5)', fontSize: '0.6rem' }}>ACCENT</p>
              <p className="font-yatra text-lg" style={{ color: '#D4A017' }}>{acc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
