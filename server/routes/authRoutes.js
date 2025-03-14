// server/routes/authRoutes.js
import express from 'express';
import passport from 'passport';

const router = express.Router();

// Initiate Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to your frontend.
    res.redirect(process.env.FRONTEND_URL);
  }
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect(process.env.FRONTEND_URL);
  });
});

export default router;
