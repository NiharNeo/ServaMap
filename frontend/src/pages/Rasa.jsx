import React from 'react'
import RasaLegend from '../components/RasaLegend.jsx'

export default function Rasa() {
  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Rasa-Vijñana</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "The science of aesthetic essence."
        </p>
      </div>
      <div className="frieze-divider my-8" />
      <div className="folio p-6 mb-8">
         <p className="font-body" style={{ color: 'rgba(237,224,213,0.8)', lineHeight: 1.8 }}>
           The Natyashastra defines Rasa as the 'flavor' or 'essence' of an artistic work. 
           SvaraMap's core algorithm maps phonetic density and melodic intervals to these 
           foundational emotional states.
         </p>
      </div>
      <RasaLegend />
    </div>
  )
}
