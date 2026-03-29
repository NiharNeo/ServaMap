import React from 'react'

export default function Rituals() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Rituals</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "The geometry of sound in sacred space."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="folio p-8 text-center border-dashed border-2 border-amber-900/20">
         <span className="material-symbols-outlined mb-4" style={{ fontSize: 48, color: 'rgba(212,160,23,0.2)' }}>
           history_edu
         </span>
         <h2 className="font-yatra text-2xl mb-2" style={{ color: '#D4A017', opacity: 0.6 }}>Ritual Patterns Loading...</h2>
         <p className="font-body" style={{ color: 'rgba(237,224,213,0.4)', maxWidth: 400, margin: '0 auto' }}>
           We are currently digitizing the structural phonetics of Agnihotra and Soma-Yaga. 
           Please check back when the ink has dried.
         </p>
      </div>
    </div>
  )
}
