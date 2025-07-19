// server/app.js
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Set security-related HTTP headers.
app.use(helmet());

// Redirect HTTP to HTTPS (Render usually handles this, but it's good practice).
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(301, 'https://' + req.hostname + req.originalUrl);
  }
  next();
});

// Redirect bare domain to www.
app.use((req, res, next) => {
  const host = req.hostname;
  if (
    host === 'wahegurunursingclasses-com.onrender.com' ||
    host === 'wahegurunursingclasses.com'
  ) {
    return res.redirect(301, 'https://www.wahegurunursingclasses.com' + req.originalUrl);
  }
  next();
});

// Serve static files from 'public'.
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Catch-all: serve index.html for all other routes (SPA support).
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// Start server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('If deploying to Render, ensure your custom domain is set up: wahegurunursingclasses.com');
}); 