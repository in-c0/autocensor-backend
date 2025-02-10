// server/models/AnalysisResult.js
import mongoose from 'mongoose';

const AnalysisResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: String, required: true },
    transcript: { type: Object, required: true },
    // Array of flagged segments: start time, end time, flagged word/phrase, and selected sound effect.
    flaggedSegments: [
      {
        start: { type: Number, required: true },
        end: { type: Number, required: true },
        word: { type: String, required: true },
        effect: { type: String, enum: ['mute', 'beep', 'quack', 'honk', 'boom', 'trumpet'], required: true },
      },
    ],
  },
  { timestamps: true }
);

const AnalysisResult = mongoose.model('AnalysisResult', AnalysisResultSchema);
export default AnalysisResult;
