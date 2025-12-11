VOICE FEATURES - v0.2.6+ ROADMAP (LOCAL PLANNING ONLY)

User Requested Addition:
- Voice-to-text (user input): User speaks → transcribed to text → sent to LLM
- Text-to-speech (AI output): LLM response → synthesized to audio → played to user

Possible Implementation Approaches (NO external API deps):

1. VOICE-TO-TEXT (Input):
   - Use system TTS (Windows: SAPI5, Linux: espeak via subprocess)
   - Lightweight: SpeechRecognition library (optional, MIT licensed)
   - Or: ffmpeg + FLAC if zero-dependency preferred

2. TEXT-TO-SPEECH (Output):
   - Use pyttsx3 (offline, MIT license) - pure Python
   - Or: system TTS (Windows SAPI, Linux espeak)
   - Or: Keep lightweight, just CLI flag "--tts=espeak" for optional use

3. PLUGIN APPROACH (PREFERRED):
   - Create "voice-io" plugin
   - Optional feature, doesn't bloat core LMAPP
   - Users install if they want voice features
   - Aligns with plugin-first philosophy

4. CLI INTEGRATION:
   - `lmapp chat --voice` (input + output)
   - `lmapp chat --voice-in` (input only)
   - `lmapp chat --voice-out` (output only)
   - `lmapp chat --voice-rate 1.2` (speed control)

TIMELINE:
- v0.2.5: Plugin ecosystem stable (now)
- v0.2.6: Voice plugin created
- v0.3.0: Audio streaming, multi-language voices

KEEP THIS LOCAL - Do not commit to GitHub.
