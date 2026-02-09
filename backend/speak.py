import sys
import io

def synthesize_speech(text, language_code='en-US', voice_name='en-US-Neural2-D'):
    """
    Synthesizes speech from text using gTTS (Google Text-to-Speech)
    Returns audio content as bytes
    """
    try:
        from gtts import gTTS

        # Map language codes to gTTS format
        lang_map = {
            'hi-IN': 'hi',
            'hi': 'hi',
            'en-US': 'en',
            'en': 'en',
            'es-ES': 'es',
            'es': 'es',
            'fr-FR': 'fr',
            'fr': 'fr',
            'de-DE': 'de',
            'de': 'de',
            'it-IT': 'it',
            'it': 'it',
            'pt-BR': 'pt',
            'pt': 'pt',
            'ja-JP': 'ja',
            'ja': 'ja',
            'ko-KR': 'ko',
            'ko': 'ko',
            'zh-CN': 'zh-cn',
            'zh': 'zh-cn',
            'gu-IN': 'gu',
            'gu': 'gu'
        }

        # Get the language code for gTTS
        gtts_lang = lang_map.get(language_code, 'en')

        # Create gTTS instance
        tts = gTTS(text=text, lang=gtts_lang, slow=False)

        # Save to BytesIO buffer
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)

        return audio_buffer.getvalue()

    except Exception as e:
        print(f"Error in gTTS: {e}", file=sys.stderr)
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python speak.py \"text\" [language_code] [voice_name]")
        sys.exit(1)

    text = sys.argv[1]
    language_code = sys.argv[2] if len(sys.argv) > 2 else 'en-US'
    voice_name = sys.argv[3] if len(sys.argv) > 3 else 'en-US-Neural2-D'

    # Map common language codes to Google TTS format
    lang_mapping = {
        'hi': 'hi-IN',
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'it': 'it-IT',
        'pt': 'pt-BR',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'zh': 'zh-CN',
        'gu': 'gu-IN'
    }

    if language_code in lang_mapping:
        language_code = lang_mapping[language_code]

    # Voice name mapping for different languages
    voice_mapping = {
        'hi-IN': 'hi-IN-Neural2-A',
        'en-US': 'en-US-Neural2-D',
        'es-ES': 'es-ES-Neural2-F',
        'fr-FR': 'fr-FR-Neural2-D',
        'de-DE': 'de-DE-Neural2-D',
        'it-IT': 'it-IT-Neural2-C',
        'pt-BR': 'pt-BR-Neural2-B',
        'ja-JP': 'ja-JP-Neural2-B',
        'ko-KR': 'ko-KR-Neural2-A',
        'zh-CN': 'zh-CN-Neural2-C',
        'gu-IN': 'gu-IN-Neural2-A'
    }

    if language_code in voice_mapping:
        voice_name = voice_mapping[language_code]

    audio_content = synthesize_speech(text, language_code, voice_name)

    if audio_content:
        # Write to stdout as binary data
        sys.stdout.buffer.write(audio_content)
        sys.stdout.buffer.flush()
    else:
        print("Failed to generate speech", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
