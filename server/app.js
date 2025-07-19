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

  const targetHost = 'www.wahegurunursingclasses.com';
  const targetProtocol = 'https://';

  // Only perform redirects if the request is already HTTPS and not the target www host
  if (isHttps && host !== targetHost && host !== 'localhost') {
    // Redirect bare domain or Render subdomain to www
    if (host === 'wahegurunursingclasses.com' || host === 'wahegurunursingclasses-com.onrender.com') {
      return res.redirect(301, targetProtocol + targetHost + originalUrl);
    }
  } else if (!isHttps && host === targetHost) {
      // This case should ideally be handled by Render's automatic HTTPS.
      // If it's not, you might have to check Render's configuration.
      // For now, removing the explicit HTTP to HTTPS redirect in your code
      // and letting Render handle it is usually best.
      // If you *must* handle it, ensure it doesn't conflict with Render.
      // For example:
      // return res.redirect(301, targetProtocol + targetHost + originalUrl);
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