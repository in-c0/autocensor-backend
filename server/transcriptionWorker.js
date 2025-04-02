// server/transcriptionWorker.js
import axios from 'axios';
import logger from './logger.js';
import Analysis from './models/Analysis.js';

export async function transcribeAudioWorker({ fileUrl, analysisId }) {
  try {
    // Fetch the file data from the presigned URL as binary data.
    const fileResponse = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const fileData = fileResponse.data;
    
    // Define the Deepgram endpoint for POSTing raw audio data.
    const deepgramEndpoint = 'https://api.deepgram.com/v1/listen?punctuate=true';
    
    // POST the raw file data to Deepgram.
    const response = await axios.post(deepgramEndpoint, fileData, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'application/octet-stream'
      },
      timeout: 30000,
    });
    
    logger.info('Deepgram transcription successful');
    
    // Extract the transcript (adjust based on Deepgram's actual response format)
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
    if (error.response) {
      logger.error('Deepgram response error:', error.response.data);
    } else {
      logger.error('Error in transcription worker:', error);
    }
    throw new Error('Transcription failed.');
  }
}
