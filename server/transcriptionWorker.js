// server/transcriptionWorker.js
import axios from 'axios';
import logger from './logger.js';

/**
 * transcribeAudioWorker - Calls Deepgram API to transcribe and then process the file.
 * @param {Object} data - { fileUrl, fileKey, userId, isFree }
 * @returns {Object} - The transcription result.
 */
export async function transcribeAudioWorker({ fileUrl, fileKey, userId, isFree }) {
  try {
    const deepgramEndpoint = 'https://api.deepgram.com/v1/listen?punctuate=true';
    const response = await axios.post(
      deepgramEndpoint,
      fileUrl,
      {
        headers: {
          Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000,
      }
    );
    logger.info('Deepgram transcription successful');
    // Here, parse response.data to extract flagged words with timestamps.
    // Then, trigger video editing (using ffmpeg.wasm on the client) or further processing.
    return response.data;
  } catch (error) {
    logger.error('Error in transcription worker:', error);
    throw new Error('Transcription failed.');
  }
}
