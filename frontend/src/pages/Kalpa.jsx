import React from 'react'

export default function Kalpa() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Kalpa</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "The ritual rhythm of the cosmos."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="folio p-10 flex flex-col items-center">
         <div className="relative w-48 h-48 mb-8">
            <div className="absolute inset-0 border-2 border-amber-900/10 rounded-full animate-spin-slow" />
            <div className="absolute inset-4 border border-amber-900/10 rounded-full animate-spin-reverse-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'rgba(212,160,23,0.1)' }}>
                 wb_sunny
               </span>
            </div>
         </div>
         <h2 className="font-yatra text-2xl mb-4" style={{ color: '#D4A017' }}>Cyclical Geometries</h2>
         <p className="font-body text-center" style={{ color: 'rgba(237,224,213,0.6)', maxWidth: 500 }}>
           Kalpa provides the temporal framework for SvaraMap. 
           It tracks the progression of sound through Yugas, seasons, and Muhurtas.
         </p>
      </div>
    </div>
  )
}
