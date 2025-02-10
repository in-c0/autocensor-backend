// server/routes/fileRoutes.js
import express from 'express';
import { generatePresignedUrl } from '../s3.js';
import jwtAuthMiddleware from '../middleware/auth.js';
import logger from '../logger.js';

const router = express.Router();

router.post('/generate-presigned-url', jwtAuthMiddleware, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) return res.status(400).json({ error: 'fileName and fileType required.' });
    const { url, key } = await generatePresignedUrl(fileName, fileType);
    res.json({ url, key });
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate URL.' });
  }
});

export default router;
