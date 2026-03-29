import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from analyzer import analyze_verse
from synthesizer import synthesize_audio

app = FastAPI(
    title="SvaraMap API",
    description="AI-powered emotional terrain mapper for Sanskrit verses",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VerseRequest(BaseModel):
    verse: str


@app.get("/")
async def root():
    return {
        "service": "SvaraMap API",
        "status": "running",
        "endpoints": ["/analyze", "/synthesize"],
    }


@app.post("/analyze")
async def analyze(request: VerseRequest):
    """
    Accept a Sanskrit verse and return structured emotional/melodic analysis.
    """
    verse = request.verse.strip()
    if not verse:
        raise HTTPException(status_code=400, detail="Verse cannot be empty.")

    try:
        result = await analyze_verse(verse)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

    return result


@app.post("/synthesize")
async def synthesize(analysis: dict):
    """
    Accept the full analysis JSON and return an MP3 audio file.
    """
    if not analysis.get("padas"):
        raise HTTPException(
            status_code=400, detail="Analysis must contain at least one pāda."
        )

    try:
        audio_bytes = synthesize_audio(analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio synthesis failed: {e}")

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": 'attachment; filename="svaramap.mp3"',
            "Cache-Control": "no-cache",
        },
    )
