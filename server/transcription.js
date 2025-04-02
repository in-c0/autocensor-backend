// server/transcription.js
import { transcriptionQueue } from './queue.js';
import logger from './logger.js';

/**
 * addTranscriptionJob – Enqueues a transcription job.
 * @param {object} args - { fileUrl: string }
 * @returns {object} - { jobId: string }
 */
export async function addTranscriptionJob({ fileUrl, analysisId }) {
  if (!fileUrl) {
    throw new Error('fileUrl is required');
  }
  try {
    // Include analysisId in the job data
    const job = await transcriptionQueue.add({ fileUrl, analysisId });
    logger.info(`Enqueued transcription job ${job.id}`);
    return { jobId: job.id };
  } catch (error) {
    logger.error('Failed to add transcription job', error);
    throw new Error('Could not queue transcription job');
  }
}
/**
 * getTranscriptionJobStatus – Retrieves the status of a transcription job.
 * @param {object} args - { jobId: string }
 * @returns {object} - { id, status, result }
 */
export async function getTranscriptionJobStatus({ jobId }) {
  if (!jobId) {
    throw new Error('jobId is required');
  }
  try {
    const job = await transcriptionQueue.getJob(jobId);
    if (!job) throw new Error('Job not found');
    // Determine status based on job properties.
    let status = 'queued';
    if (job.processedOn && !job.finishedOn) status = 'processing';
    if (job.finishedOn) status = 'completed';
    return {
      id: job.id,
      status,
      result: job.returnvalue || null,
    };
  } catch (error) {
    logger.error('Failed to get transcription job status', error);
    throw new Error('Could not retrieve job status');
  }
}
