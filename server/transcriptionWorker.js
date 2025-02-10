// server/transcriptionWorker.js
import axios from 'axios';
import logger from './logger.js';

/**
 * transcribeAudioWorker
 * @param {object} data - The job data, containing at least: { fileUrl: string }
 * @returns {object} - Deepgram transcription result
 */
export async function transcribeAudioWorker({ fileUrl }) {
  try {
    const deepgramEndpoint = 'https://api.deepgram.com/v1/listen?punctuate=true';
    const response = await axios.post(
      deepgramEndpoint,
      fileUrl,
      {
        headers: {
          'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000, // 30 seconds timeout
      }
    );
    logger.info('Deepgram transcription successful');
    return response.data;
  } catch (error) {
    logger.error('Deepgram transcription error in worker:', error);
    throw new Error('Transcription failed');
  }
}
