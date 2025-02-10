// server/transcription.js
import axios from 'axios';

/**
 * transcribeAudio – Calls Deepgram’s API to transcribe an audio file.
 *
 * @param {object} args - An object with:
 *   - fileUrl: A URL or binary data representing the audio.
 * @returns {object} - The Deepgram transcription response.
 */
export async function transcribeAudio({ fileUrl }) {
  try {
    const deepgramEndpoint = 'https://api.deepgram.com/v1/listen?punctuate=true';
    const response = await axios.post(
      deepgramEndpoint,
      fileUrl,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/octet-stream'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error('Deepgram transcription error:', error.message);
    throw new Error('Transcription failed. Please try again later.');
  }
}
