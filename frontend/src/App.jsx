import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'

// Import Pages
import Home from './pages/Home.jsx'
import Archives from './pages/Archives.jsx'
import Chants from './pages/Chants.jsx'
import Rituals from './pages/Rituals.jsx'
import Manuscripts from './pages/Manuscripts.jsx'
import Shruti from './pages/Shruti.jsx'
import Rasa from './pages/Rasa.jsx'
import Kalpa from './pages/Kalpa.jsx'

// ── Nav Link Component ──────────────────────────────────────
function NavLink({ to, children, icon, desktopOnly = false }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${desktopOnly ? 'hidden md:flex' : ''}`}
      style={{
        color: isActive ? '#C0392B' : 'rgba(212,160,23,0.55)',
        background: isActive ? 'rgba(192,57,43,0.08)' : 'transparent',
        borderLeft: isActive ? '2px solid #C0392B' : '2px solid transparent',
        transition: 'all 0.5s ease',
        fontSize: '0.9rem',
        textDecoration: 'none'
      }}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>}
      <span className="font-yatra" style={{ fontSize: '0.95rem' }}>{children}</span>
    </Link>
  )
}

// ── Header Link Component ────────────────────────────────────
function HeaderLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link 
      to={to} 
      className={`nav-link ${isActive ? 'active' : ''}`}
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}

export default function App() {
  return (
    <div className="dark min-h-screen">

      {/* ═══ STITCH HEADER — exact ॥ श्री ॥ SvaraMap nav ═══ */}
      <header className="stitch-header">
        <div className="flex justify-between items-center px-8 py-5 w-full max-w-none">
          {/* Logo — exact from Stitch */}
          <Link to="/" className="title-yatra text-2xl drop-shadow-sm" id="svaramap-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            ॥ श्री ॥ SvaraMap ॥ श्री ॥
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex space-x-10 items-center">
            <HeaderLink to="/manuscripts">Manuscripts</HeaderLink>
            <HeaderLink to="/shruti">Shruti</HeaderLink>
            <HeaderLink to="/rasa">Rasa</HeaderLink>
            <HeaderLink to="/kalpa">Kalpa</HeaderLink>
          </nav>

          {/* Icon row */}
          <div className="flex items-center space-x-5" style={{ color: '#D4A017' }}>
            <span
              className="material-symbols-outlined cursor-pointer hover:opacity-75"
              style={{ transition: 'opacity 0.5s ease' }}
            >
              settings
            </span>
            <Link to="/archives" style={{ color: 'inherit', textDecoration: 'none' }}>
              <span
                className="material-symbols-outlined cursor-pointer hover:opacity-75"
                style={{ fontVariationSettings: "'FILL' 1", transition: 'opacity 0.5s ease' }}
              >
                library_books
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ LAYOUT: sidebar + main ═══ */}
      <div className="flex min-h-screen">

        {/* ── Stitch sidebar ── */}
        <aside
          className="hidden md:flex flex-col stitch-sidebar"
          style={{
            width: 220,
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            flexShrink: 0,
            padding: '2rem 1.25rem',
            gap: '0.5rem',
          }}
        >
          {/* User badge */}
          <div className="mb-6">
            <div
              className="surface-card-high flex items-center justify-center mb-3"
              style={{ width: 52, height: 52 }}
            >
              <span className="material-symbols-outlined" style={{ color: '#D4A017', opacity: 0.6, fontSize: 28 }}>
                account_circle
              </span>
            </div>
            <p className="font-yatra text-sm" style={{ color: '#D4A017', lineHeight: 1.2 }}>The Librarian</p>
            <p className="font-label" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.6rem', letterSpacing: '0.1em' }}>Custodian of Svara</p>
          </div>

          {/* Sidebar nav */}
          <NavLink to="/" icon="temple_hindu">Home</NavLink>
          <NavLink to="/archives" icon="menu_book">Archives</NavLink>
          <NavLink to="/chants" icon="auto_stories">Chants</NavLink>
          <NavLink to="/rituals" icon="history_edu">Rituals</NavLink>

          {/* Divider */}
          <div className="frieze-divider mt-4" />

          {/* Status note */}
          <div className="mt-3 surface-card p-3">
            <p className="font-label" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Ink &amp; Reed
            </p>
            <p className="font-body mt-1" style={{ color: 'rgba(237,224,213,0.55)', fontSize: '0.72rem', lineHeight: 1.5 }}>
              System status: Manuscript drying.
            </p>
          </div>

          {/* Purushartha bottom */}
          <div className="mt-auto pt-4 border-t border-amber-900/10">
            <div className="frieze-divider mb-3" />
            <Link to="/shruti" className="flex items-center gap-2 py-1.5 cursor-pointer no-underline" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.8rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>brightness_7</span>
              <span className="font-yatra text-sm">Dharma</span>
            </Link>
            <div className="flex items-center gap-2 py-1.5 opacity-30 cursor-not-allowed" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.8rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>payments</span>
              <span className="font-yatra text-sm">Artha</span>
            </div>
            <Link to="/rasa" className="flex items-center gap-2 py-1.5 cursor-pointer no-underline" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.8rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>favorite</span>
              <span className="font-yatra text-sm">Kama</span>
            </Link>
            <Link to="/kalpa" className="flex items-center gap-2 py-1.5 cursor-pointer no-underline" style={{ color: 'rgba(212,160,23,0.4)', fontSize: '0.8rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>wb_sunny</span>
              <span className="font-yatra text-sm">Moksha</span>
            </Link>
          </div>
        </aside>

        {/* ═══ MAIN CONTENT ═══ */}
        <main style={{ flex: 1, padding: '2.5rem 2rem 5rem', maxWidth: 860, margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/archives" element={<Archives />} />
            <Route path="/chants" element={<Chants />} />
            <Route path="/rituals" element={<Rituals />} />
            <Route path="/manuscripts" element={<Manuscripts />} />
            <Route path="/shruti" element={<Shruti />} />
            <Route path="/rasa" element={<Rasa />} />
            <Route path="/kalpa" element={<Kalpa />} />
          </Routes>
          
          {/* Footer (Common for all pages) */}
          <div className="text-center mt-14">
            <div className="frieze-divider mb-3" />
            <p className="font-yatra text-sm" style={{ color: 'rgba(212,160,23,0.25)', letterSpacing: '0.08em' }}>
              ॥ स्वरमानचित्र — The Digital Epigraph ॥
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
