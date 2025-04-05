import express from 'express';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import dotenv from 'dotenv';
// import { urlencoded } from 'express'; 
import cors from 'cors';
import { PrismaClient } from "@prisma/client";
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const prisma = new PrismaClient

import groupRoute from './routes/group';

// Import route modules
import budgetRoutes from './routes/budget';
import suggestionRouter from './routes/suggestions';
import usersRoute from './routes/users';
import mapsRoute from './routes/maps';
import chatsRoute from './routes/chats';
import itineraryRoute from './routes/itinerary';
import activityRouter from './routes/activities';

dotenv.config();

const app = express();
app.use(express.json());

const port = 8000;
app.use(cors({
  origin: 'http://localhost:8000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // 
  credentials: true, // missing so cookies werent sent which breaks session based auth
}));
app.options('*', cors());
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(session({ secret: 'cats', resave:false, saveUninitialized: true }));

// Initialize Passport for google
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => { 
    try {
        let user = await prisma.user.findUnique({ 
          where: { googleId: profile.id },
         });
        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true, 
              phoneNum: '',
              isNotified: false,
              groupId: null,
              image: profile.image,
              // post: undefined,
              reminder: undefined,
              suggestion: undefined, 
              vote: undefined
            }
          });   
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    // Fetch the user from the database by ID
    const user = await prisma.user.findUnique({
      where: { id },
    });
    // Pass the user object back to the session
    done(null, user);
  } catch (error) {
    done(error, null); // Pass error to the callback if something goes wrong
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req: any, res: any, next: Function) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
};

// Get the current user's profile
app.get('/users', isAuthenticated, async (req: any, res: any) => {
    try {
      const user = await prisma.user.findUnique({ 
        where: { googleId: req.googleId }
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// **Google Auth Routes**
app.get('/auth/google', (req, res, next) => {
    console.log("Google OAuth request initiated"); // ✅ Debugging Log
    next();
}, passport.authenticate('google', { 
    scope: ['profile', 'email']  // ✅ Fixed: Scope is explicitly set
}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

// Check auth
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated(), user: req.user });
});

// Logout Route
app.post('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      req.session.destroy((error) => {
          if (error) {
              return res.status(500).json({ message: 'Error destroying session' });
          }
          res.status(200).json({ message: 'Logged out successfully' });
      });
    });
});

app.use('/api/users/', usersRoute);
app.use('/api/chats/', chatsRoute);
app.use('/api/maps/', mapsRoute);
app.use('/api/suggestions', suggestionRouter);


app.use('/api/itinerary', itineraryRoute)
app.use('/api/budget', budgetRoutes);
app.use('/api/activity', activityRouter);

app.use('/api/group', groupRoute);

app.get('/login', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

// Catch-all route to handle all other paths and return the front-end app
app.get('*', (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});