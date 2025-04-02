// server/transcriptionWorker.js
import axios from 'axios';
import logger from './logger.js';
import Analysis from './models/Analysis.js';

export async function transcribeAudioWorker({ fileUrl, analysisId }) {
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
    
    // Extract the transcript from the response.
    // (This depends on Deepgram's response structure; adjust as needed.)
    const transcript =
      response.data.results &&
      response.data.results.channels &&
      response.data.results.channels[0].alternatives[0].transcript
        ? response.data.results.channels[0].alternatives[0].transcript
        : '';

    // Update the Analysis record with the transcript.
    await Analysis.findByIdAndUpdate(analysisId, { transcript });

    return transcript;
  } catch (error) {
    logger.error('Error in transcription worker:', error);
    throw new Error('Transcription failed.');
  }
}
