// server/routes/analysisRoutes.js
import express from 'express';
import Analysis from '../models/Analysis.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to ensure the user is authenticated.
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: 'User not authenticated.' });
}

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl)
      return res.status(400).json({ error: 'fileKey and fileUrl are required.' });
    
    // Simulate transcription (in production, you’d call an external service)
    const transcript = "Dummy transcript with flagged words: beep, honk.";
    
    // Deduct one credit from the user
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.credits <= 0)
      return res.status(402).json({ error: 'Insufficient credits. Please purchase more.' });
    
    user.credits -= 1;
    await user.save();
    
    // Save analysis result
    const analysis = new Analysis({
      user: req.user._id,
      fileKey,
      transcript
    });
    await analysis.save();
    
    res.status(202).json({ message: 'Analysis complete.', transcript });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
