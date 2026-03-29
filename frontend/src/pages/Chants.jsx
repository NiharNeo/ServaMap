import React from 'react'

export default function Chants() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Chants</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "Oral traditions mapped into the digital ether."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Gayatri Mantra', meter: 'Gayatri', effect: 'Luminous / Shanta' },
          { name: 'Maha Mrityunjaya', meter: 'Anushtubh', effect: 'Protective / Karuna' },
          { name: 'Shiva Tandava', meter: 'Panchachamara', effect: 'Dynamic / Raudra' },
          { name: 'Purusha Suktam', meter: 'Anushtubh', effect: 'Cosmic / Adbhuta' },
        ].map((chant, i) => (
          <div key={i} className="folio p-5 hover:border-amber-900/50 transition-colors cursor-pointer">
            <h3 className="font-yatra text-lg" style={{ color: '#D4A017' }}>{chant.name}</h3>
            <div className="flex gap-4 mt-2">
              <div>
                <p className="font-label" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.55rem' }}>METER</p>
                <p className="font-body text-xs" style={{ color: '#ede0d5' }}>{chant.meter}</p>
              </div>
              <div>
                <p className="font-label" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.55rem' }}>EFFECT</p>
                <p className="font-body text-xs" style={{ color: '#ede0d5' }}>{chant.effect}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
