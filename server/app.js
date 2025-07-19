const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Middleware: Security headers
app.use(helmet());

// Combined Redirect for HTTP to HTTPS and non-www to www
app.use((req, res, next) => {
  const host = req.headers.host; // e.g., 'wahegurunursingclasses.com' or 'www.wahegurunursingclasses.com'
  const proto = req.headers['x-forwarded-proto']; // e.g., 'http' or 'https'

  const targetProtocol = 'https';
  const targetHost = 'www.wahegurunursingclasses.com';

  const needsRedirect = (proto !== targetProtocol) || (host !== targetHost);

  if (needsRedirect) {
    const redirectUrl = `${targetProtocol}://${targetHost}${req.originalUrl}`;
    return res.redirect(301, redirectUrl); // Use 301 for permanent redirect
  }

  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Handle all other routes with index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});