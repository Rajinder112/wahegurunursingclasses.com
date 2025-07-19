const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Middleware: Security headers
app.use(helmet());

// Redirect HTTP to HTTPS and non-www to www
app.use((req, res, next) => {
  const host = req.headers.host;
  const proto = req.headers['x-forwarded-proto'];

  if (proto !== 'https') {
    return res.redirect(301, 'https://' + host + req.originalUrl);
  }

  if (host === 'wahegurunursingclasses.com') {
    return res.redirect(301, 'https://www.wahegurunursingclasses.com' + req.originalUrl);
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
