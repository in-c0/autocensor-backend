// server/routes/analysisRoutes.js
import express from 'express';
import Analysis from '../models/Analysis.js';
import User from '../models/User.js';
import { addTranscriptionJob } from '../transcription.js';

const router = express.Router();

// Middleware to ensure the user is authenticated.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'User not authenticated.' });
}

// POST /api/analyze: Enqueue a transcription job
router.post('/', isAuthenticated, async (req, res) => {
  
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl)
      return res.status(400).json({ error: 'fileKey and fileUrl are required.' });

    console.log({
      user: user._id,
      fileKey,
      transcript: '',
    });

    // Create an Analysis record with an empty transcript
    const newAnalysis = await Analysis.create({
      user: user._id,
      fileKey,
      transcript: ''  // Ensure transcript is provided
    });

    // Enqueue the transcription job and pass the analysisId
    const result = await addTranscriptionJob({ fileUrl, analysisId: newAnalysis._id });
        
    res.status(202).json({ 
      message: 'Transcription job enqueued.',
      jobId: result.jobId,
      analysisId: newAnalysis._id,
    });
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
  
    if (user.credits <= 0)
      return res.status(402).json({ error: 'Insufficient credits. Please purchase more.' });
    user.credits -= 1;
    await user.save();

});

router.get('/result', isAuthenticated, async (req, res) => {
  try {
    const { analysisId } = req.query;
    if (!analysisId) return res.status(400).json({ error: 'analysisId is required' });
    
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) return res.status(404).json({ error: 'Analysis not found.' });
    
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;