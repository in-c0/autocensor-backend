// server/index.js
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import logger from './logger.js';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100,
  })
);

// Mount API routes.
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api', analysisRoutes);
app.use('/api/stripe', stripeRoutes);

// Global error handler.
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

export default app;
