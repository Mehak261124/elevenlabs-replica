from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from pydantic import BaseModel
from typing import List
import os
from bson import ObjectId
from dotenv import load_dotenv
import certifi

# Load environment variables
load_dotenv()

app = FastAPI(title="ElevenLabs Replica API", version="1.0.0")

# Enable CORS for your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://elevenlabs-replica.vercel.app",  # replace with your deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static audio files
app.mount("/static", StaticFiles(directory="static"), name="static")

# MongoDB connection
MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb+srv://elevenlabs_user:SimplePass123@cluster0.yg2egby.mongodb.net/admin?retryWrites=true&w=majority"
)

def get_mongodb_client():
    try:
        client = MongoClient(
            MONGODB_URL,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        client.server_info()
        print("✅ MongoDB connection successful!")
        return client
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        print("📝 Using in-memory storage for development...")
        return None

client = get_mongodb_client()
if client:
    db = client.elevenlabs_replica
    audio_collection = db.audio_files
else:
    db = None
    audio_collection = None

# Pydantic models
class AudioFile(BaseModel):
    language: str
    text: str
    filename: str

class AudioResponse(BaseModel):
    id: str
    language: str
    text: str
    audio_url: str
    filename: str

class LanguageOption(BaseModel):
    code: str
    name: str
    flag: str

# Sample data with full text
SAMPLE_AUDIO_DATA = [
    {
        "language": "english",
        "text": "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. [sarcastically] Not the “burn it all down” kind... [giggles] but he was gentle, wise, with eyes like old stars. [whispers] Even the birds fell silent when he passed.",
        "filename": "english_sample.mp3"
    },
    {
        "language": "arabic",
        "text": "في أرض إلدوريا القديمة، حيث كانت السماء تتلألأ والغابات تهمس بالأسرار للريح، عاش تنين يُدعى زيفيروس. [sarcastically] ليس من نوع \"يحرق كل شيء\"... [giggles] لكنه كان لطيفًا وحكيمًا، وعيناه تشبهان النجوم القديمة. [whispers] حتى الطيور كانت تصمت عندما يمر.",
        "filename": "arabic_sample.mp3"
    }
]

SUPPORTED_LANGUAGES = [
    {"code": "english", "name": "English", "flag": "🇺🇸"},
    {"code": "arabic", "name": "Arabic", "flag": "🇸🇦"},
    {"code": "spanish", "name": "Spanish", "flag": "🇪🇸"},
    {"code": "french", "name": "French", "flag": "🇫🇷"},
    {"code": "german", "name": "German", "flag": "🇩🇪"},
]

in_memory_audio = []

@app.on_event("startup")
async def startup_event():
    """Initialize database with sample data if empty"""
    global in_memory_audio

    if audio_collection is not None:
        try:
            if audio_collection.count_documents({}) == 0:
                audio_collection.insert_many(SAMPLE_AUDIO_DATA)
                print("📦 Sample audio data inserted into MongoDB")
            else:
                print("📦 MongoDB already has data")
        except Exception as e:
            print(f"❌ Error accessing MongoDB: {e}")
            in_memory_audio = SAMPLE_AUDIO_DATA.copy()
            print("📝 Falling back to in-memory storage...")
    else:
        in_memory_audio = SAMPLE_AUDIO_DATA.copy()
        print("📝 Using in-memory storage - sample data loaded")

@app.get("/")
async def root():
    return {"message": "ElevenLabs Replica API is running"}

@app.get("/api/languages", response_model=List[LanguageOption])
async def get_languages():
    return SUPPORTED_LANGUAGES

@app.get("/api/audio/{language}", response_model=AudioResponse)
async def get_audio_by_language(language: str, request: Request):
    """Get audio file URL for a specific language"""
    audio_doc = None

    if audio_collection is not None:
        try:
            audio_doc = audio_collection.find_one({"language": language.lower()})
        except Exception as e:
            print(f"MongoDB error: {e}")

    if not audio_doc:
        audio_doc = next((doc for doc in in_memory_audio if doc["language"] == language.lower()), None)

    if not audio_doc:
        raise HTTPException(status_code=404, detail=f"Audio for language '{language}' not found")

    # Dynamically generate audio_url
    audio_doc["audio_url"] = str(request.url_for("static", path=audio_doc["filename"]))

    return AudioResponse(
        id=str(audio_doc.get("_id", f"temp_{language}")),
        language=audio_doc["language"],
        text=audio_doc["text"],
        audio_url=audio_doc["audio_url"],
        filename=audio_doc["filename"]
    )

@app.get("/api/audio", response_model=List[AudioResponse])
async def get_all_audio(request: Request):
    """Get all audio files with dynamic URLs"""
    audio_list = []
    if audio_collection is not None:
        try:
            audio_docs = list(audio_collection.find())
        except Exception as e:
            print(f"MongoDB error: {e}")
            audio_docs = in_memory_audio
    else:
        audio_docs = in_memory_audio

    for doc in audio_docs:
        audio_list.append(
            AudioResponse(
                id=str(doc.get("_id", f"temp_{doc['language']}")),
                language=doc["language"],
                text=doc["text"],
                audio_url=str(request.url_for("static", path=doc["filename"])),
                filename=doc["filename"]
            )
        )
    return audio_list

@app.post("/api/audio", response_model=AudioResponse)
async def create_audio(audio: AudioFile, request: Request):
    """Create a new audio file entry"""
    audio_dict = audio.dict()
    if audio_collection is not None:
        try:
            result = audio_collection.insert_one(audio_dict)
            created_doc = audio_collection.find_one({"_id": result.inserted_id})
            created_doc["audio_url"] = str(request.url_for("static", path=created_doc["filename"]))
            return AudioResponse(
                id=str(created_doc["_id"]),
                language=created_doc["language"],
                text=created_doc["text"],
                audio_url=created_doc["audio_url"],
                filename=created_doc["filename"]
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    else:
        audio_dict["audio_url"] = str(request.url_for("static", path=audio.filename))
        return AudioResponse(
            id=f"temp_{audio.language}",
            language=audio.language,
            text=audio.text,
            audio_url=audio_dict["audio_url"],
            filename=audio.filename
        )

@app.delete("/api/audio/{audio_id}")
async def delete_audio(audio_id: str):
    if audio_collection is not None:
        try:
            result = audio_collection.delete_one({"_id": ObjectId(audio_id)})
            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Audio file not found")
            return {"message": "Audio file deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=400, detail="Invalid audio ID")
    else:
        return {"message": "Audio file deleted successfully (in-memory mode)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
