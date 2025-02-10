// server/queue.js
import Bull from 'bull';
import logger from './logger.js';
import { transcribeAudioWorker } from './transcriptionWorker.js';

const transcriptionQueue = new Bull('transcriptionQueue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
});

transcriptionQueue.process(async (job) => {
  logger.info(`Processing transcription job ${job.id}`);
  return await transcribeAudioWorker(job.data);
});

transcriptionQueue.on('completed', (job, result) => {
  logger.info(`Job ${job.id} completed.`);
});

transcriptionQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err}`);
});

export { transcriptionQueue };
