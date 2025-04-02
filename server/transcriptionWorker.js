// server/transcriptionWorker.js
import axios from 'axios';
import logger from './logger.js';
import Analysis from './models/Analysis.js';

export async function transcribeAudioWorker({ fileUrl, analysisId }) {
  try {
    // Construct the endpoint with the file URL as a query parameter
    const deepgramEndpoint = `https://api.deepgram.com/v1/listen?punctuate=true&url=${encodeURIComponent(fileUrl)}`;

    // Use GET since we're transcribing via a URL
    const response = await axios.get(deepgramEndpoint, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
      timeout: 30000,
    });

    logger.info('Deepgram transcription successful');

    // Extract the transcript from the Deepgram response (adjust this based on Deepgram's response structure)
    const transcript = response.data.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    // Update the Analysis record with the transcript
    await Analysis.findByIdAndUpdate(analysisId, { transcript });

    return transcript;
  } catch (error) {
    logger.error('Error in transcription worker:', error);
    throw new Error('Transcription failed.');
  }
}
