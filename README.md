# KAE WEBWORLD - Password-Protected Music Player

A secure, session-based authentication system for your music player built with Express.js, ready for Railway deployment.

## Setup Instructions

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:
   - `PASSWORD`: Your login password
   - `SESSION_SECRET`: A long random string (use a password generator)
   - `NODE_ENV`: Set to `development` for local, `production` for Railway

3. **Create the public folder structure:**
   ```bash
   mkdir public
   ```

   Move your existing files:
   - `login.html` → `public/login.html`
   - `player.html` → `public/player.html`
   - Any CSS, JS, or other assets → `public/`

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Server will start at `http://localhost:3000`

### Railway Deployment

1. **Push your code to GitHub** (make sure `.env` is in `.gitignore`)

2. **Create a new project on Railway:**
   - Connect your GitHub repository
   - Railway will auto-detect the Node.js project

3. **Set environment variables in Railway dashboard:**
   - `PASSWORD`: Your secure password
   - `SESSION_SECRET`: Long random string (minimum 32 characters)
   - `NODE_ENV`: `production`
   - `PORT`: Railway sets this automatically

4. **Deploy:**
   - Railway will automatically run `npm install` and `npm start`
   - Your app will be live at the generated Railway URL

## Project Structure

```
KAE WEBWORLD/
├── server.js           # Express server with authentication
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .env               # Your actual environment variables (not in git)
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── public/            # Static files served by Express
    ├── login.html     # Login page
    ├── player.html    # Music player (protected)
    └── ...            # Your other frontend assets
```

## API Endpoints

### POST /api/login
Authenticate user with password
- **Body:** `{ "password": "your_password" }`
- **Response:** `{ "success": true }` or `{ "success": false, "message": "..." }`

### POST /api/logout
Destroy user session
- **Response:** `{ "success": true }`

### GET /
- Authenticated users → redirect to `/player`
- Unauthenticated users → serve `login.html`

### GET /player
- Protected route, requires authentication
- Serves `player.html`

## Security Features

- Session-based authentication (not localStorage)
- HTTP-only cookies
- Secure cookies in production
- Helmet.js security headers
- CSRF protection via sameSite cookies
- 24-hour session expiration
- Server-side password validation

## Frontend Integration

Your `login.html` needs to send a POST request to `/api/login`:

```javascript
// Example login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = '/player';
  } else {
    alert(data.message || 'Login failed');
  }
});
```

For logout functionality in `player.html`:

```javascript
// Example logout button
async function logout() {
  const response = await fetch('/api/logout', {
    method: 'POST'
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = '/';
  }
}
```

## Troubleshooting

- **Session not persisting:** Check that `SESSION_SECRET` is set and cookies are enabled
- **Can't access /player:** Ensure you're logged in and session is active
- **Railway deployment fails:** Verify all environment variables are set correctly
- **CORS errors:** The backend serves your frontend, so CORS shouldn't be an issue

## Notes

- Music files are stored locally on the user's device (not on the server)
- The server only handles authentication and serves static HTML files
- Sessions expire after 24 hours of inactivity
- Never commit `.env` to version control
