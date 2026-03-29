import React from 'react'

export default function Manuscripts() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Manuscripts</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "The visual score of the infinite."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="surface-card-high aspect-[3/4] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-transparent transition-colors duration-700" />
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'rgba(212,160,23,0.1)' }}>
              image
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/60 backdrop-blur-sm">
               <p className="font-label text-[0.6rem]" style={{ color: '#D4A017' }}>MNS_{100 + i}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
