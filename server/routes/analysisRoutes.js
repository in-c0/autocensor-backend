// server/routes/analysisRoutes.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Analysis from '../models/Analysis.js';
import User from '../models/User.js';

// Simple JWT authentication middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fileKey, fileUrl } = req.body;
    if (!fileKey || !fileUrl)
      return res.status(400).json({ error: 'fileKey and fileUrl are required.' });
    
    // Simulate transcription (in a production system, call Deepgram or similar)
    const transcript = "This is a dummy transcript. Flagged words: beep, honk.";
    
    // Deduct one credit from the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    if (user.credits <= 0)
      return res.status(402).json({ error: 'Insufficient credits. Please purchase more.' });
    
    user.credits -= 1;
    await user.save();
    
    // Save the analysis result
    const analysis = new Analysis({
      user: req.user.id,
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
