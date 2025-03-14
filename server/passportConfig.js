// server/passportConfig.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';// server/index.js
import dotenv from 'dotenv';
dotenv.config();

// Serialize user into the session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Configure Google OAuth strategy.
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Use the email from the Google profile to find the user.
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        // If the user doesn't exist, create a new user.
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          credits: 2  // Start with two free credits
        });
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
