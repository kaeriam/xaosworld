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

// Authentication middleware for all routes
app.use((req, res, next) => {
  // Allow API routes to pass through
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Allow static assets (CSS, JS, images, audio, fonts) to load
  const allowedAssets = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.mp3', '.wav'];
  if (allowedAssets.some(ext => req.path.toLowerCase().endsWith(ext))) {
    return next();
  }

  // Allow login.html to be accessed
  if (req.path === '/login.html') {
    return next();
  }

  // For root path, handle separately
  if (req.path === '/') {
    if (req.session.authenticated) {
      // Authenticated user accessing root - show index.html
      return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
      // Not authenticated - show login page
      return res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
  }

  // For all HTML pages, check authentication
  if (req.path.toLowerCase().endsWith('.html') || req.path.endsWith('/')) {
    if (!req.session.authenticated) {
      // Store where they wanted to go
      req.session.returnTo = req.path;
      return res.redirect('/');
    }
  }

  next();
});

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

    // Get the page they wanted to visit, default to index.html
    const redirectTo = req.session.returnTo || '/index.html';
    delete req.session.returnTo;

    return res.json({
      success: true,
      redirectTo: redirectTo
    });
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

// Root route is now handled by middleware above, remove this duplicate

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
