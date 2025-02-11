// server/routes/fileRoutes.js
import express from 'express';
import { generatePresignedUrl } from '../utils/s3.js';

const router = express.Router();

router.post('/upload-url', async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const { url, key } = await generatePresignedUrl(fileName, fileType);
    res.json({ url, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
