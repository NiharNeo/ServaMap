# SvaraMap — स्वरमानचित्र

> **An AI-powered emotional terrain mapper for Sanskrit verses.**
> Chanda · Rasa · Rāga · Svara

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Google Gemini API key
- `ffmpeg` installed (required by pydub for audio processing)
  - macOS: `brew install ffmpeg`
  - Ubuntu: `sudo apt install ffmpeg`

---

### Backend

```bash
cd svaramap/backend

# Create a .env file with your API key
echo "GEMINI_API_KEY=..." > .env

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

---

### Frontend

```bash
cd svaramap/frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Architecture

```
svaramap/
├── backend/
│   ├── main.py          # FastAPI app — /analyze + /synthesize endpoints
│   ├── analyzer.py      # Gemini API integration, JSON parsing + validation
│   ├── synthesizer.py   # gTTS → pydub tempo + pitch-contour synthesis
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Three-phase UI orchestrator
│   │   ├── index.css                  # Living Manuscript design system
│   │   └── components/
│   │       ├── DharmaLoader.jsx       # 24-spoked dharma chakra SVG loader
│   │       ├── RasaLegend.jsx         # 8 rasas with Sanskrit names + colors
│   │       ├── TerrainGraph.jsx       # Bezier SVG emotional terrain curve
│   │       ├── PadaCard.jsx           # Manuscript folio-style pada card
│   │       └── AudioPlayer.jsx        # Synthesized audio player
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

### Data Flow

```
User Input (Devanagari verse)
        ↓
POST /analyze → Gemini API
        ↓
Structured JSON: { meter, ragas, padas[] }
        ↓
Frontend renders:
  ├── TerrainGraph (bezier SVG)
  ├── PadaCard × N (expandable folios)
  └── Dominant Rasa Panel
        ↓
POST /synthesize → Audio Pipeline:
  gTTS (per pada) → pydub tempo → syllable-sliced pitch contour (solfege + raga) → MP3
```

---

## API Reference

### `POST /analyze`
**Request:** `{ "verse": "string" }`

**Response:**
```json
{
  "meter": "Anuṣṭubh",
  "ragas": ["Bhairavi", "Yaman"],
  "padas": [
    {
      "text": "यदा यदा हि धर्मस्य",
      "rasa": "vira",
      "intensity": 0.82,
      "explanation": "Two-sentence poetic explanation.",
      "pitch": "Sa Re Ga Ma Pa",
      "tempo": "Madhya",
      "syllable_durations": [0.3, 0.25, 0.4]
    }
  ]
}
```

### `POST /synthesize`
**Request:** Full analysis JSON from `/analyze`

**Response:** `audio/mpeg` — generated Sanskrit speech MP3, pitch-shifted and tempo-controlled per pāda.

---

## How It Works

### Chandas — Sanskrit Meters

Sanskrit poetry is built on strict metrical patterns called **Chandas** (छन्दः). Unlike Western meter which counts stresses, Chandas counts **syllable weight** — each syllable is either *guru* (heavy, ◡–) or *laghu* (light, ◡). The most common meter is **Anuṣṭubh** (अनुष्टुभ्) — 8 syllables × 4 pādas — the meter of the Bhagavad Gita, Rāmāyana, and Mahābhārata.

Other notable meters:
| Meter | Syllables/Pāda | Character |
|-------|---------------|-----------|
| Anuṣṭubh | 8 | Narrative, expansive |
| Mandākrāntā | 17 | Slow, melancholic |
| Vasantatilakā | 14 | Elegant, literary |
| Śārdūlavikrīḍita | 19 | Dramatic, heroic |

SvaraMap uses Gemini to identify these patterns from the verse's syllable structure and context.

---

### Rasa Theory — Natyashastra

The **Rasa** system (रस, lit. "essence" or "juice") was codified by Bharata Muni in the **Nāṭyaśāstra** (~200 BCE–200 CE) — one of the world's earliest treatises on aesthetics. Rasa is the emotional essence that a work of art produces in the *sahṛdaya* (the sensitive, prepared listener).

The eight primary rasas:

| Rasa | Sanskrit | Deity | Color | Essence |
|------|----------|-------|-------|---------|
| Śṛṅgāra | शृङ्गार | Vishnu | Green | Love, beauty |
| Vīra | वीर | Indra | Saffron | Heroism, valor |
| Karuṇa | करुण | Yama | Dove gray | Compassion, grief |
| Adbhuta | अद्भुत | Brahma | Yellow | Wonder, marvel |
| Śānta | शान्त | Vishnu | White | Peace, tranquility |
| Raudra | रौद्र | Rudra | Red | Fury, wrath |
| Hāsya | हास्य | Śiva | White | Mirth, comedy |
| Bhayānaka | भयानक | Kāla | Black | Terror, fear |

Each rasa has associated *vibhāva* (causes), *anubhāva* (effects), and *vyabhicāri bhāva* (transitory states). SvaraMap maps each pāda to its dominant rasa using Gemini's deep knowledge of Sanskrit poetics.

---

### Melodic Mapping — Rāga and Svara

In Indian classical music, a **rāga** is not merely a scale — it is a melodic personality with specific ascending (āroha) and descending (avaroha) patterns, characteristic phrases, and emotional associations. SvaraMap maps rasas to compatible rāgas:

| Rāga | Emotional Character | Semitone Offset |
|------|-------------------|----------------|
| Bhairavi | Pathos, surrender | −2 |
| Darbari Kanada | Royal gravity, dignity | −4 |
| Yaman | Romantic longing | +2 |
| Bhairav | Austere dawn, devotion | −1 |
| Kafi | Yearning, folk warmth | 0 |
| Todi | Intense longing, sadness | −3 |

The **svara** (note) system — Sa Re Ga Ma Pa Dha Ni — maps to Western solfège (Do Re Mi Fa Sol La Ti), but with microtonal inflections called **śruti** that give each rāga its unique emotional texture.

**Tempo** (laya) is mapped as:
- **Vilambita** (विलम्बित) — very slow, contemplative — 0.7×
- **Madhya** (मध्य) — medium tempo — 1.0×
- **Druta** (द्रुत) — fast, energetic — 1.4×

---

### Audio Synthesis Pipeline

```
Sanskrit pāda text
        ↓
gTTS (lang='hi') → MP3 bytes in memory
        ↓
pydub AudioSegment — frame rate manipulation for tempo
        ↓
Pitch contour:
  split by `syllable_durations` (meter) → apply solfege+`ragas` pitch per slice
        ↓
AudioSegment × N — concatenated with 300ms silence
        ↓
export to MP3 → returned as audio/mpeg
```

---

## Design Philosophy

The visual design follows the **"Living Manuscript"** aesthetic — everything should feel like it was carved from stone, written on palm leaf, or scribed in ancient ink. Key principles:

- **No electric neons** — palette drawn from natural pigments: soot, turmeric, vermillion, indigo
- **No clean modern borders** — double-line manuscript rules, tonal layering for depth
- **Weighted transitions** — 0.8s ease, like stone moving
- **Devanagari typography first** — Tiro Devanagari Sanskrit, Noto Serif Devanagari
- **Sanskrit as decoration** — ॥, ।, ॐ used throughout as structural punctuation

---

## Hackathon Submission

**SvaraMap** was built as an exploration of the intersection between Sanskrit poetics, Indian classical music theory, and modern AI. It demonstrates:

1. **Multimodal AI reasoning** — Gemini interprets metrical patterns, aesthetic theory, and musical frameworks simultaneously
2. **Culturally-grounded generation** — outputs grounded in 2000-year-old classical traditions (Nāṭyaśāstra, Chandas-śāstra)
3. **Audio-visual synthesis** — emotional data visualized as bezier terrain and sonified as pitch-shifted Sanskrit speech
4. **No database required** — fully stateless, runs entirely in-memory per request

---

*॥ यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः। तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥*

*"Where there is Krishna, the Lord of Yoga, and where there is Arjuna, the archer — there will be prosperity, victory, happiness, and righteousness."*
