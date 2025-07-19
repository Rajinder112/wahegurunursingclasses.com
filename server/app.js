// server/app.js
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Set security-related HTTP headers.
app.use(helmet());

// Combined Redirect: HTTP to HTTPS and non-www/Render subdomain to www.wahegurunursingclasses.com
app.use((req, res, next) => {
  const host = req.hostname;
  const originalUrl = req.originalUrl;
  const isHttps = req.headers['x-forwarded-proto'] === 'https';

  // Target canonical URL
  const targetHost = 'www.wahegurunursingclasses.com';
  const targetProtocol = 'https://';

  // Check for HTTP or incorrect host
  if (!isHttps || (host !== targetHost && host !== 'localhost' && process.env.NODE_ENV === 'production')) {
    // If not HTTPS OR if host is not the target www domain (and not localhost in dev)
    // AND it's either the bare domain OR the Render subdomain OR any other non-www host
    if (host === 'wahegurunursingclasses.com' || host === 'wahegurunursingclasses-com.onrender.com') {
      return res.redirect(301, targetProtocol + targetHost + originalUrl);
    }
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
  console.log('Ensure your custom domain is set up to point to Render: wahegurunursingclasses.com and www.wahegurunursingclasses.com');
}); 