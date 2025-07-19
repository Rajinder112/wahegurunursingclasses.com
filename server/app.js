const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Trust Render's proxy to get correct protocol
app.set('trust proxy', true);

// Use Helmet for security headers
app.use(helmet());

// Universal redirect middleware
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const proto = req.protocol;
  const targetHost = 'www.wahegurunursingclasses.com';

  const isHttps = proto === 'https';
  const isWww = host.startsWith('www.');

  if (!isHttps || !isWww) {
    const redirectUrl = `https://${targetHost}${req.originalUrl}`;
    return res.redirect(301, redirectUrl);
  }

  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌐 Expected access: https://www.wahegurunursingclasses.com`);
});
