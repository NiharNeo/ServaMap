import React from 'react'
import { getRasaData, RASA_DATA } from './RasaLegend.jsx'

/**
 * Emotional Terrain Graph
 * SVG bezier curve: X = pada index, Y = intensity (inverted — high intensity = top)
 * Each control point is colored by its rasa.
 * Faint mandala ring pattern as background grid.
 * Curve draws itself on load via stroke-dasharray animation.
 */
export default function TerrainGraph({ padas, progress = 0 }) {
  const W = 800
  const H = 260
  const PAD_X = 60
  const PAD_Y = 36

  const n = padas.length
  if (n === 0) return null

  // Map each pada to an (x, y) coordinate
  const points = padas.map((p, i) => {
    const x = PAD_X + (i / Math.max(n - 1, 1)) * (W - PAD_X * 2)
    const yRange = H - PAD_Y * 2
    const y = PAD_Y + yRange * (1 - p.intensity)
    return { x, y, pada: p, rasa: getRasaData(p.rasa) }
  })

  // Build cubic bezier path through all points
  const buildPath = pts => {
    if (pts.length === 1) {
      return `M ${pts[0].x} ${pts[0].y}`
    }
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const cur = pts[i]
      const next = pts[i + 1]
      const cpX = (cur.x + next.x) / 2
      d += ` C ${cpX} ${cur.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`
    }
    return d
  }

  const pathD = buildPath(points)

  // Gradient area fill — use the color of dominant rasa
  const dominantIdx = padas.reduce(
    (max, p, i) => (p.intensity > padas[max].intensity ? i : max),
    0
  )
  const dominantRasa = getRasaData(padas[dominantIdx].rasa)

  // Area path (close below)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD_Y}
    L ${points[0].x} ${H - PAD_Y} Z`

  // Mandala rings as background grid
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]

  return (
    <div
      className="terrain-container animate-fade-up"
      style={{ animationDelay: '0.2s' }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Area gradient */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={dominantRasa.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={dominantRasa.color} stopOpacity="0.02" />
          </linearGradient>

          {/* Glow filter for the curve */}
          <filter id="curveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path */}
          <clipPath id="graphClip">
            <rect x="0" y="0" width={W} height={H} />
          </clipPath>
        </defs>

        {/* Mandala concentric rings as grid */}
        {rings.map((r, i) => (
          <ellipse
            key={i}
            cx={W / 2}
            cy={H / 2}
            rx={(W / 2) * r}
            ry={(H / 2) * r}
            fill="none"
            stroke="rgba(212,160,23,0.06)"
            strokeWidth="1"
            strokeDasharray={i % 2 === 0 ? '4 6' : '1 8'}
          />
        ))}

        {/* Cross-hair lines */}
        <line x1={W / 2} y1={PAD_Y} x2={W / 2} y2={H - PAD_Y} stroke="rgba(212,160,23,0.05)" strokeWidth="1" />
        <line x1={PAD_X} y1={H / 2} x2={W - PAD_X} y2={H / 2} stroke="rgba(212,160,23,0.05)" strokeWidth="1" />

        {/* Intensity axis labels */}
        {['1.0', '0.5', '0.0'].map((label, i) => (
          <text
            key={i}
            x={PAD_X - 10}
            y={PAD_Y + (i * (H - PAD_Y * 2)) / 2 + 4}
            textAnchor="end"
            fontFamily="Courier Prime, monospace"
            fontSize="9"
            fill="rgba(242,232,201,0.25)"
          >
            {label}
          </text>
        ))}

        {/* Axis label — intensity */}
        <text
          x={12}
          y={H / 2}
          transform={`rotate(-90, 12, ${H / 2})`}
          textAnchor="middle"
          fontFamily="Courier Prime, monospace"
          fontSize="8"
          fill="rgba(212,160,23,0.3)"
          letterSpacing="2"
        >
          INTENSITY
        </text>

        {/* Area fill */}
        <path d={areaD} fill="url(#areaGrad)" clipPath="url(#graphClip)" />

        {/* Main bezier curve — animated draw */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(212,160,23,0.6)"
          strokeWidth="1.5"
          filter="url(#curveGlow)"
          className="path-animate"
        />

        {/* Colored rasa segments overlaid */}
        {points.slice(0, -1).map((pt, i) => {
          const next = points[i + 1]
          const cpX = (pt.x + next.x) / 2
          const segD = `M ${pt.x} ${pt.y} C ${cpX} ${pt.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`
          return (
            <path
              key={i}
              d={segD}
              fill="none"
              stroke={pt.rasa.color}
              strokeWidth="2.5"
              opacity="0.7"
              className="path-animate"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            />
          )
        })}

        {/* Data points — glowing dots per pada */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Outer glow ring */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="10"
              fill={pt.rasa.color}
              opacity="0.08"
            />
            {/* Mid ring */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="6"
              fill="none"
              stroke={pt.rasa.color}
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Core dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill={pt.rasa.color}
              opacity="0.85"
            />

            {/* Pada label below */}
            <text
              x={pt.x}
              y={H - PAD_Y + 16}
              textAnchor="middle"
              fontFamily="Courier Prime, monospace"
              fontSize="8"
              fill={pt.rasa.color}
              opacity="0.7"
              letterSpacing="1"
            >
              {`पाद ${['I', 'II', 'III', 'IV', 'V', 'VI'][i] || i + 1}`}
            </text>

            {/* Rasa label above dot */}
            <text
              x={pt.x}
              y={pt.y - 14}
              textAnchor="middle"
              fontFamily="Noto Serif Devanagari, serif"
              fontSize="9"
              fill={pt.rasa.color}
              opacity="0.8"
            >
              {pt.rasa.sanskrit}
            </text>
          </g>
        ))}

        {/* Bottom baseline */}
        <line
          x1={PAD_X}
          y1={H - PAD_Y}
          x2={W - PAD_X}
          y2={H - PAD_Y}
          stroke="rgba(212,160,23,0.15)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        {/* Progress Marker */}
        {progress > 0 && (() => {
          const totalPoints = points.length - 1
          const exactIdx = progress * totalPoints
          const i1 = Math.floor(exactIdx)
          const i2 = Math.min(i1 + 1, totalPoints)
          const t = exactIdx - i1
          
          const p1 = points[i1]
          const p2 = points[i2]
          
          if (!p1 || !p2) return null
          
          const curX = p1.x + (p2.x - p1.x) * t
          const curY = p1.y + (p2.y - p1.y) * t
          
          return (
            <g className="progress-marker">
              <circle
                cx={curX}
                cy={curY}
                r="6"
                fill="#D4A017"
                style={{ filter: 'drop-shadow(0 0 8px #D4A017)' }}
              />
              <circle
                cx={curX}
                cy={curY}
                r="12"
                fill="none"
                stroke="#D4A017"
                strokeWidth="1"
                opacity="0.3"
                className="animate-pulse"
              />
            </g>
          )
        })()}
      </svg>

      {/* Rasa color legend row */}
      <div className="flex flex-wrap gap-3 px-6 pb-4 pt-1">
        {RASA_DATA.filter(r => padas.some(p => p.rasa === r.key)).map(r => (
          <span
            key={r.key}
            className="font-courier flex items-center gap-1.5"
            style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: r.color, textTransform: 'uppercase' }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, display: 'inline-block' }} />
            {r.name}
          </span>
        ))}
      </div>
    </div>
  )
}
