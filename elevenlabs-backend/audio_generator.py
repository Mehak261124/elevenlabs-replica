"""
Script to generate sample audio files using Text-to-Speech
Run this script to create the sample audio files for testing
"""

import os
import requests
from pathlib import Path

def create_static_directory():
    """Create static directory if it doesn't exist"""
    static_dir = Path("static")
    static_dir.mkdir(exist_ok=True)
    return static_dir

def generate_audio_with_gtts():
    """Generate audio files using Google Text-to-Speech (gTTS)"""
    try:
        from gtts import gTTS
        import io
        
        static_dir = create_static_directory()
        
        # English audio - matching the text in main.py
        english_text = "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the burn it all down kind but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed."
        tts_en = gTTS(text=english_text, lang='en', slow=False)
        tts_en.save(static_dir / "english_sample.mp3")
        print("✅ Generated english_sample.mp3")
        
        # Arabic audio - matching the text in main.py
        arabic_text = "في أرض إلدوريا القديمة، حيث كانت السماء تتلألأ والغابات تهمس بالأسرار للريح، عاش تنين يُدعى زيفيروس. ليس من نوع يحرق كل شيء لكنه كان لطيفًا وحكيمًا، وعيناه تشبهان النجوم القديمة. حتى الطيور كانت تصمت عندما يمر."
        tts_ar = gTTS(text=arabic_text, lang='ar', slow=False)
        tts_ar.save(static_dir / "arabic_sample.mp3")
        print("✅ Generated arabic_sample.mp3")
        
        print("✅ Audio files generated successfully using gTTS!")
        
    except ImportError:
        print("❌ gTTS not installed. Install it with: pip install gtts")
        return False
    except Exception as e:
        print(f"❌ Error generating audio files: {e}")
        return False
    
    return True

def generate_audio_with_edge_tts():
    """Generate audio files using Edge TTS (better quality, supports more emotions)"""
    try:
        import edge_tts
        import asyncio
        
        static_dir = create_static_directory()
        
        async def generate_audio():
            # English audio with natural voice
            english_text = "In the ancient land of Eldoria, where skies shimmered and forests, whispered secrets to the wind, lived a dragon named Zephyros. Not the burn it all down kind but he was gentle, wise, with eyes like old stars. Even the birds fell silent when he passed."
            
            communicate = edge_tts.Communicate(english_text, "en-US-JennyNeural")
            await communicate.save(static_dir / "english_sample.mp3")
            print("✅ Generated english_sample.mp3 with Edge TTS")
            
            # Arabic audio with Arabic voice
            arabic_text = "في أرض إلدوريا القديمة، حيث كانت السماء تتلألأ والغابات تهمس بالأسرار للريح، عاش تنين يُدعى زيفيروس. ليس من نوع يحرق كل شيء لكنه كان لطيفًا وحكيمًا، وعيناه تشبهان النجوم القديمة. حتى الطيور كانت تصمت عندما يمر."
            
            communicate = edge_tts.Communicate(arabic_text, "ar-SA-ZariyahNeural")
            await communicate.save(static_dir / "arabic_sample.mp3")
            print("✅ Generated arabic_sample.mp3 with Edge TTS")
        
        asyncio.run(generate_audio())
        print("✅ Audio files generated successfully using Edge TTS!")
        return True
        
    except ImportError:
        print("❌ Edge TTS not installed. Install it with: pip install edge-tts")
        return False
    except Exception as e:
        print(f"❌ Error generating audio files with Edge TTS: {e}")
        return False

def create_placeholder_files():
    """Create placeholder audio files for testing"""
    static_dir = create_static_directory()
    
    # Create empty MP3 files as placeholders
    placeholder_files = ["english_sample.mp3", "arabic_sample.mp3"]
    
    for filename in placeholder_files:
        filepath = static_dir / filename
        if not filepath.exists():
            # Create a minimal MP3 file (just headers)
            with open(filepath, 'wb') as f:
                # Minimal MP3 header
                f.write(b'\xff\xe0')  # Basic MP3 sync word
            print(f"✅ Created placeholder file: {filename}")

def check_existing_files():
    """Check if audio files already exist"""
    static_dir = Path("static")
    required_files = ["english_sample.mp3", "arabic_sample.mp3"]
    
    if not static_dir.exists():
        return False
    
    existing_files = [f.name for f in static_dir.iterdir() if f.is_file()]
    return all(file in existing_files for file in required_files)

if __name__ == "__main__":
    print("🎵 Setting up sample audio files...")
    
    # Check if files already exist
    if check_existing_files():
        print("✅ Audio files already exist!")
        static_dir = Path("static")
        print("\n📁 Files in static directory:")
        for file in static_dir.iterdir():
            if file.is_file():
                size = file.stat().st_size
                print(f"  - {file.name} ({size} bytes)")
    else:
        print("Generating new audio files...")
        
        # Try Edge TTS first (better quality), then gTTS, then placeholders
        if not generate_audio_with_edge_tts():
            print("Trying gTTS...")
            if not generate_audio_with_gtts():
                print("Creating placeholder files...")
                create_placeholder_files()
        
        print("\n📁 Files in static directory:")
        static_dir = Path("static")
        if static_dir.exists():
            for file in static_dir.iterdir():
                if file.is_file():
                    size = file.stat().st_size
                    print(f"  - {file.name} ({size} bytes)")
    
    print("\n🚀 You can now start your FastAPI server!")
    print("Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000")