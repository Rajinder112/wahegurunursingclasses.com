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
  const targetHost = 'www.wahegurunursingclasses.com';

  // Skip redirect for localhost or development
  if (host.startsWith('localhost') || process.env.NODE_ENV === 'development') {
    return next();
  }

  const needsHttpsRedirect = proto !== 'https';
  const needsWwwRedirect = host === 'wahegurunursingclasses.com';

  if (needsHttpsRedirect || needsWwwRedirect) {
    let redirectUrl = 'https://';
    redirectUrl += needsWwwRedirect ? targetHost : host;
    redirectUrl += req.originalUrl;
    return res.redirect(301, redirectUrl);
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
