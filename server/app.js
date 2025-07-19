const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet());

// Trust Render proxy for correct HTTPS detection
app.set('trust proxy', true);

// Redirect all non-HTTPS or non-www traffic to https://www.wahegurunursingclasses.com
app.use((req, res, next) => {
  const host = req.headers.host;
  const proto = req.protocol;
  const targetHost = 'www.wahegurunursingclasses.com';

  if (proto !== 'https' || host !== targetHost) {
    const redirectUrl = `https://${targetHost}${req.originalUrl}`;
    return res.redirect(301, redirectUrl);
  }

  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🌐 App will be accessed via https://www.wahegurunursingclasses.com`);
});
