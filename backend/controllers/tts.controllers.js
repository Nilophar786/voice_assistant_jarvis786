import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const speakText = async (req, res) => {
  try {
    const { text, language = 'hi' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for speech synthesis'
      });
    }

    console.log(`Generating speech for text: "${text}" in language: ${language}`);

    // Path to the Python script
    const scriptPath = path.join(__dirname, '..', 'speak.py');

    // Spawn Python process
    const pythonProcess = spawn('python', [scriptPath, text, language], {
      cwd: path.dirname(scriptPath)
    });

    let audioData = Buffer.alloc(0);
    let errorOutput = '';

    // Collect stdout (audio data)
    pythonProcess.stdout.on('data', (data) => {
      audioData = Buffer.concat([audioData, data]);
    });

    // Collect stderr (error messages)
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Handle process completion
    pythonProcess.on('close', (code) => {
      if (code === 0 && audioData.length > 0) {
        console.log(`Speech synthesis successful, audio size: ${audioData.length} bytes`);

        // Send audio data as response
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioData.length,
          'Cache-Control': 'no-cache'
        });

        res.send(audioData);
      } else {
        console.error(`Speech synthesis failed with code ${code}: ${errorOutput}`);

        res.status(500).json({
          success: false,
          message: 'Speech synthesis failed',
          error: errorOutput || 'Unknown error'
        });
      }
    });

    // Handle process errors
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to start speech synthesis process',
        error: error.message
      });
    });

  } catch (error) {
    console.error('TTS controller error:', error);

    res.status(500).json({
      success: false,
      message: 'Internal server error during speech synthesis',
      error: error.message
    });
  }
};

export { speakText };
