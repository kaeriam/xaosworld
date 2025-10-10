require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to allow your media files
}));

// Parse JSON bodies
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 86400000 // 24 hours
  }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.redirect('/');
  }
};

// POST /api/login - Handle login
app.post('/api/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  if (password === process.env.PASSWORD) {
    req.session.authenticated = true;
    console.log('Successful login attempt');
    return res.json({ success: true });
  } else {
    console.log('Failed login attempt');
    return res.json({
      success: false,
      message: 'Incorrect password'
    });
  }
});

// POST /api/logout - Handle logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({ success: true });
  });
});

// GET / - Root route
app.get('/', (req, res) => {
  if (req.session.authenticated) {
    return res.redirect('/player');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// GET /player - Player page (protected)
app.get('/player', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'player.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
});
