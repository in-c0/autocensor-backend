// server/index.js
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './logger.js';
import { addTranscriptionJob, getTranscriptionJobStatus } from './transcription.js';

const app = express();

// Parse JSON payloads.
app.use(express.json());

// Secure your app with Helmet.
app.use(helmet());

// Rate limiting: restrict each IP to 60 requests per minute.
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per minute
});
app.use(limiter);

// Sample endpoint to enqueue a transcription job.
// POST /api/TranscribeAudio
app.post('/api/TranscribeAudio', async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ error: 'fileUrl is required' });
    }
    const jobInfo = await addTranscriptionJob({ fileUrl });
    // Return HTTP 202 Accepted.
    res.status(202).json(jobInfo);
  } catch (error) {
    logger.error('Error in /api/TranscribeAudio', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to check the status of a transcription job.
// GET /api/TranscriptionStatus/:jobId
app.get('/api/TranscriptionStatus/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const status = await getTranscriptionJobStatus({ jobId });
    res.json(status);
  } catch (error) {
    logger.error('Error in /api/TranscriptionStatus', error);
    res.status(500).json({ error: error.message });
  }
});

// Export the app for use by Wasp or as a standalone server.
export default app;
