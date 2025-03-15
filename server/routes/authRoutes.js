// server/routes/authRoutes.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : 'http://localhost:3000';

// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to your frontend.
    res.redirect(FRONTEND_URL);
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect(FRONTEND_URL);
  });
});

export default router;
