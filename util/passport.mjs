import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user is new, create a user
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        const token = jwt.sign(
          { userId: user._id, role: user.role, isAdmin: user.isAdmin },
          process.env.JWT_SECRET_KEY,
          { expiresIn: '3h' }
        );


        done(null, { token, user,expiresIn:3600 *3});
      } catch (error) {
        done(error, false);
      }
    }
  )
);

export default passport;
