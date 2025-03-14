// server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  credits:  { type: Number, default: 2 }  // Two free analyses on signup
});

export default mongoose.model('User', userSchema);
