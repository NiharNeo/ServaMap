import React from 'react'
import { Link } from 'react-router-dom'

export default function Archives() {
  const [archives, setArchives] = React.useState([])

  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('svaramap_archives') || '[]')
    setArchives(saved)
  }, [])

  const handleDelete = (id) => {
    const updated = archives.filter(a => a.id !== id)
    localStorage.setItem('svaramap_archives', JSON.stringify(updated))
    setArchives(updated)
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-headline" style={{ fontSize: '2.4rem', color: '#ede0d5' }}>Archives</h1>
        <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.95rem', fontStyle: 'italic' }}>
          "The preserved echoes of antiquity, inscribed in the digital stone."
        </p>
      </div>

      <div className="frieze-divider my-8" />

      {archives.length === 0 ? (
        <div className="folio p-12 text-center opacity-30">
          <span className="material-symbols-outlined mb-4 block" style={{ fontSize: 48 }}>history_edu</span>
          <p className="font-label" style={{ fontSize: '0.7rem', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>No Inscriptions Yet</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {archives.map((item) => (
            <div key={item.id} className="folio p-6 group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label" style={{ color: 'rgba(212,160,23,0.5)', fontSize: '0.62rem', letterSpacing: '0.2rem' }}>
                  INSCRIBED: {new Date(item.id).toLocaleDateString()}
                </p>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity"
                  title="Delete Inscription"
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: '#ffb4ab' }}>delete</span>
                </button>
              </div>
              
              <h2 className="font-yatra text-xl mb-3" style={{ color: '#D4A017' }}>{item.analysis.meter}</h2>
              
              <p className="font-body line-clamp-2 mb-6" style={{ color: 'rgba(237,224,213,0.7)', fontSize: '1rem', lineHeight: 1.6 }}>
                {item.verse}
              </p>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <Link 
                  to="/" 
                  state={{ verse: item.verse, analysis: item.analysis }}
                  className="btn-secondary !py-2 !px-4 !text-[0.65rem]"
                >
                  <span className="material-symbols-outlined align-middle mr-2" style={{ fontSize: 14 }}>pageview</span>
                  Revisit Terrain
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
