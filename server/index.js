// server/index.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';

// Import Passport configuration (which sets up Google OAuth)
import './passportConfig.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';

const app = express();

// Enable CORS (adjust the origin as needed)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Configure sessions (required for OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state from the session.
app.use(passport.initialize());
app.use(passport.session());

// Mount routes
app.use('/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/analyze', analysisRoutes);
app.use('/api/stripe', stripeRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));