import express from 'express';
import Analysis from '../models/Analysis.js';
import User from '../models/User.js';
import { addTranscriptionJob, getTranscriptionJobStatus } from '../transcription.js';

const router = express.Router();

// Middleware to ensure the user is authenticated.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'User not authenticated.' });
}

// POST /api/analyze: Enqueue a transcription job
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl)
      return res.status(400).json({ error: 'fileKey and fileUrl are required.' });
    
    // Enqueue transcription job using Deepgram API via transcriptionWorker
    const result = await addTranscriptionJob({ fileUrl });
    
    // Deduct a credit from the user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.credits <= 0)
      return res.status(402).json({ error: 'Insufficient credits. Please purchase more.' });
    user.credits -= 1;
    await user.save();
    
    res.status(202).json({ message: 'Transcription job enqueued.', jobId: result.jobId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analyze/status: Check the status of a transcription job
router.get('/status', isAuthenticated, async (req, res) => {
  try {
    const { jobId } = req.query;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });
    
    const status = await getTranscriptionJobStatus({ jobId });
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
