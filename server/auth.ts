import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { MongoStorage } from './mongodb';

const mongoStorage = new MongoStorage();

// Debug environment variables
console.log('Environment variables check:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await mongoStorage.getUserByGoogleId(profile.id);
    
    if (user) {
      return done(null, user);
    }

    // Check if user exists with this email
    user = await mongoStorage.getUserByEmail(profile.emails![0].value);
    
    if (user) {
      // Link Google account to existing user
      await mongoStorage.updateUser(user._id.toString(), {
        googleId: profile.id,
        profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl
      });
      return done(null, user);
    }

    // Create new user
    const newUser = await mongoStorage.createUser({
      googleId: profile.id,
      email: profile.emails![0].value,
      username: profile.displayName || profile.emails![0].value.split('@')[0],
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profileImageUrl: profile.photos?.[0]?.value,
      subscriptionTier: 'explorer',
      profile: {
        favoriteGenres: [],
        watchlist: [],
        followers: [],
        following: []
      }
    });

    return done(null, newUser);
  } catch (error) {
    return done(error, false);
  }
}));
} else {
  console.log('⚠️  Google OAuth not configured - missing CLIENT_ID or CLIENT_SECRET');
}

// Local Strategy for email/password
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await mongoStorage.getUserByEmail(email);
    
    if (!user) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    if (!user.password) {
      return done(null, false, { message: 'Please sign in with Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return done(null, false, { message: 'Invalid email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await mongoStorage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export { passport };