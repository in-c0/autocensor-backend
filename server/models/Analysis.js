// server/models/Analysis.js
import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileKey:    { type: String, required: true },
  transcript: { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now }
});

export default mongoose.model('Analysis', analysisSchema);
