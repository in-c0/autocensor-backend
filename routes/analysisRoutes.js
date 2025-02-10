// server/routes/analysisRoutes.js
import express from 'express';
import jwtAuthMiddleware from '../middleware/auth.js';
import User from '../server/models/User.js';
import { transcriptionQueue } from '../queue.js';
import logger from '../logger.js';

const router = express.Router();

// POST /api/analyze
router.post('/analyze', jwtAuthMiddleware, async (req, res) => {
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl) return res.status(400).json({ error: 'fileKey and fileUrl required.' });
    
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    
    // Reset freeAnalysisCount if day has changed.
    const today = new Date().toISOString().slice(0, 10);
    if (user.freeAnalysisDate !== today) {
      user.freeAnalysisCount = 0;
      user.freeAnalysisDate = today;
    }
    
    let isFree = false;
    if (user.freeAnalysisCount < 2) {
      isFree = true;
      user.freeAnalysisCount += 1;
    } else if (user.credits > 0) {
      user.credits -= 1;
    } else {
      return res.status(402).json({ error: 'Insufficient credits. Please purchase more credits.' });
    }
    await user.save();
    
    // Enqueue job with details; the worker will process the file.
    const job = await transcriptionQueue.add({ fileUrl, fileKey, userId, isFree });
    res.status(202).json({ jobId: job.id, message: 'Analysis job enqueued.' });
  } catch (error) {
    logger.error('Error enqueuing analysis job:', error);
    res.status(500).json({ error: 'Failed to enqueue analysis job.' });
  }
});

// POST /api/reanalyze/:analysisId - re-analysis without credit deduction (if within 24 hours)
router.post('/reanalyze/:analysisId', jwtAuthMiddleware, async (req, res) => {
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl) return res.status(400).json({ error: 'fileKey and fileUrl required.' });
    const job = await transcriptionQueue.add({ fileUrl, fileKey, userId: req.user.id, isFree: true });
    res.status(202).json({ jobId: job.id, message: 'Reanalysis job enqueued.' });
  } catch (error) {
    logger.error('Error enqueuing reanalysis job:', error);
    res.status(500).json({ error: 'Failed to enqueue reanalysis job.' });
  }
});

export default router;
