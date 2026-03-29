import React from 'react'
import { useLocation } from 'react-router-dom'
import DharmaLoader from '../components/DharmaLoader.jsx'
import RasaLegend, { getRasaData } from '../components/RasaLegend.jsx'
import TerrainGraph from '../components/TerrainGraph.jsx'
import PadaCard from '../components/PadaCard.jsx'
import AudioPlayer from '../components/AudioPlayer.jsx'

const DEFAULT_VERSE =
  'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥'

function FriezeDivider({ label }) {
  return (
    <div className="my-8">
      {label && (
        <p
          className="font-label text-center mb-2"
          style={{
            color: 'rgba(212,160,23,0.45)',
            fontSize: '0.62rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </p>
      )}
      <div className="frieze-divider" />
    </div>
  )
}

export default function Home() {
  const location = useLocation()
  const [verse, setVerse] = React.useState(DEFAULT_VERSE)
  const [phase, setPhase] = React.useState('input')
  const [analysis, setAnalysis] = React.useState(null)
  
  React.useEffect(() => {
    if (location.state?.verse && location.state?.analysis) {
      setVerse(location.state.verse)
      setAnalysis(location.state.analysis)
      setPhase('results')
    }
  }, [location.state])

  const [error, setError] = React.useState(null)
  const [currentProgress, setCurrentProgress] = React.useState(0)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleAnalyze = async () => {
    const trimmed = verse.trim()
    if (!trimmed) return
    setError(null)
    setPhase('analyzing')
    try {
      const resp = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verse: trimmed }),
      })
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.detail || `Server error ${resp.status}`)
      }
      const data = await resp.json()
      setAnalysis(data)
      setPhase('results')
    } catch (e) {
      setError(e.message)
      setPhase('input')
    }
  }

  const handleReset = () => {
    setPhase('input')
    setAnalysis(null)
    setError(null)
    setCurrentProgress(0)
  }

  const handleSaveToArchives = () => {
    if (!analysis) return
    const archives = JSON.parse(localStorage.getItem('svaramap_archives') || '[]')
    const newItem = {
      id: Date.now(),
      verse,
      analysis,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('svaramap_archives', JSON.stringify([newItem, ...archives]))
    setIsSaved(true)
  }

  const dominantPada = analysis?.padas?.reduce(
    (max, p) => (p.intensity > max.intensity ? p : max),
    analysis?.padas?.[0] ?? { intensity: 0, rasa: 'shanta' }
  )
  const dominantRasa = dominantPada ? getRasaData(dominantPada.rasa) : null

  return (
    <div className="animate-fade-up">
      {phase === 'input' && (
        <div className="animate-fade-up">
          {error && (
            <div
              className="surface-card mb-5 p-4 font-label animate-fade-up"
              style={{ borderLeft: '3px solid #ffb4ab', color: '#ffb4ab', fontSize: '0.78rem', letterSpacing: '0.05em' }}
            >
              ॥ {error} ॥
            </div>
          )}

          <div className="mb-8">
            <h1
              className="font-headline"
              style={{
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                color: '#ede0d5',
                fontWeight: 400,
                lineHeight: 1.3,
                maxWidth: 580,
              }}
            >
              The Unheard Vibration
            </h1>
            <p
              className="font-body mt-3"
              style={{
                color: 'rgba(237,224,213,0.55)',
                fontSize: '0.95rem',
                lineHeight: 1.85,
                fontStyle: 'italic',
                maxWidth: 520,
                borderLeft: '2px solid rgba(212,160,23,0.25)',
                paddingLeft: '1rem',
              }}
            >
              "In the resonance of the first syllable, the cartography of the soul begins.
              Every raga is a landscape; every swara, a landmark of the infinite."
            </p>
          </div>

          <div className="frieze-divider" />

          <div className="folio p-6 mt-8">
            <p
              className="font-label mb-4"
              style={{
                color: 'rgba(212,160,23,0.5)',
                fontSize: '0.62rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              श्लोकम् प्रविशत — Enter the Verse
            </p>

            <textarea
              id="verse-input"
              className="verse-textarea"
              rows={5}
              value={verse}
              onChange={e => setVerse(e.target.value)}
              placeholder="यहाँ संस्कृत श्लोक लिखें…"
              spellCheck={false}
              aria-label="Sanskrit verse input"
            />

            <p
              className="font-label mt-2"
              style={{ color: 'rgba(237,224,213,0.2)', fontSize: '0.6rem', letterSpacing: '0.08em' }}
            >
              ।। Paste any Sanskrit verse in Devanagari script ।।
            </p>

            <div className="flex justify-center mt-7">
              <button
                id="analyze-btn"
                className="btn-primary"
                onClick={handleAnalyze}
                disabled={!verse.trim()}
                aria-label="Reveal Emotional Terrain"
              >
                <span className="material-symbols-outlined align-middle mr-2" style={{ fontSize: 16 }}>
                  travel_explore
                </span>
                Reveal Emotional Terrain
              </button>
            </div>
          </div>

          <FriezeDivider label="नवरस — The Eight Rasas of Natyashastra" />
          <RasaLegend />
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="animate-fade-up flex flex-col items-center pt-16">
          <DharmaLoader />
        </div>
      )}

      {phase === 'results' && analysis && (
        <div>
          <div className="flex justify-between items-center mb-8">
            <button className="btn-secondary" onClick={handleReset}>
              <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: 14 }}>
                arrow_back
              </span>
              New Verse
            </button>
            
            <button 
              className={`btn-secondary ${isSaved ? 'opacity-50 cursor-default' : ''}`} 
              onClick={handleSaveToArchives}
              disabled={isSaved}
            >
              <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: 14, fontVariationSettings: isSaved ? "'FILL' 1" : "''" }}>
                auto_stories
              </span>
              {isSaved ? 'Inscribed' : 'Inscribe in Archives'}
            </button>
          </div>

          <div className="folio p-5 mb-8 animate-fade-up">
            <p
              className="font-label mb-2 carved-label inline-block px-2"
              style={{ color: 'rgba(212,160,23,0.5)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              मूलश्लोकः — Source Verse
            </p>
            <p
              className="font-body"
              style={{ color: '#ede0d5', fontSize: '1.2rem', lineHeight: 2.1, whiteSpace: 'pre-line' }}
            >
              {verse}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 animate-fade-up delay-100">
            <div className="folio p-4 flex items-center gap-3">
              <span className="material-symbols-outlined" style={{ color: '#D4A017', fontSize: 18, opacity: 0.7 }}>
                music_note
              </span>
              <span className="font-label carved-label px-2" style={{ color: 'rgba(212,160,23,0.45)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Chanda</span>
              <span className="font-headline" style={{ color: '#ede0d5', fontSize: '1.05rem', fontStyle: 'italic' }}>{analysis.meter}</span>
            </div>
            <div className="folio p-4 flex flex-wrap items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: '#D4A017', fontSize: 18, opacity: 0.7 }}>
                piano
              </span>
              <span className="font-label carved-label px-2" style={{ color: 'rgba(212,160,23,0.45)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Rāgas</span>
              {(analysis.ragas || []).map(r => (
                <span key={r} className="stone-tag">{r}</span>
              ))}
            </div>
          </div>

          <FriezeDivider label="Bhāva-Bhūmi — Emotional Terrain" />
          <TerrainGraph padas={analysis.padas || []} progress={currentProgress} />

          <FriezeDivider label="Pāda Viśleṣaṇa — Line-by-Line Analysis" />
          <div className="grid gap-4">
            {(analysis.padas || []).map((pada, i) => (
              <PadaCard 
                key={i} 
                pada={pada} 
                index={i} 
                totalCount={analysis.padas.length} 
                isActive={currentProgress > (i / analysis.padas.length) && currentProgress <= ((i + 1) / analysis.padas.length)}
              />
            ))}
          </div>

          {dominantRasa && (
            <>
              <FriezeDivider label="Pradhāna Rasa — Dominant Essence" />
              <div
                className="folio p-8 text-center animate-fade-up delay-500"
                style={{ borderTop: `2px solid ${dominantRasa.color}` }}
              >
                <div style={{ fontSize: '3rem', color: dominantRasa.color, marginBottom: '0.5rem', filter: `drop-shadow(0 0 16px ${dominantRasa.color}50)` }}>
                  {dominantRasa.glyph}
                </div>
                <h3 className="font-body" style={{ color: dominantRasa.color, fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>
                  {dominantRasa.sanskrit}
                </h3>
                <p className="font-headline mt-1" style={{ color: 'rgba(237,224,213,0.6)', fontSize: '1rem', fontStyle: 'italic' }}>
                  {dominantRasa.name}
                </p>
                <p className="font-body mt-3" style={{ color: 'rgba(237,224,213,0.7)', fontSize: '0.9rem', maxWidth: 380, margin: '0.75rem auto 0' }}>
                  {dominantRasa.meaning}
                </p>
                <p className="font-label mt-2" style={{ color: 'rgba(212,160,23,0.35)', fontSize: '0.62rem', letterSpacing: '0.15em' }}>
                  देवता: {dominantRasa.deity}
                </p>
                <div className="intensity-bar mt-6" style={{ maxWidth: 280, margin: '1.5rem auto 0' }}>
                  <div className="intensity-fill" style={{ width: `${dominantPada.intensity * 100}%`, background: `linear-gradient(to right, ${dominantRasa.color}60, ${dominantRasa.color})` }} />
                </div>
                <p className="font-label mt-1" style={{ color: 'rgba(237,224,213,0.25)', fontSize: '0.58rem', letterSpacing: '0.1em' }}>
                  PEAK INTENSITY {(dominantPada.intensity * 100).toFixed(0)}%
                </p>
              </div>
            </>
          )}

          <FriezeDivider label="Svara Saṃśleṣaṇa — Audio Synthesis" />
          <AudioPlayer 
            analysis={analysis} 
            onProgress={setCurrentProgress}
          />
        </div>
      )}
    </div>
  )
}
