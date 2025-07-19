const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Security headers
app.use(helmet());

// Trust Render proxy for correct HTTPS detection
app.set('trust proxy', true);

app.use((req, res, next) => {
  const host = req.headers.host;
  const proto = req.protocol;

  const isHttps = proto === 'https';
  const isWww = host === 'www.wahegurunursingclasses.com';

  if (!isHttps || !isWww) {
    const redirectUrl = `https://www.wahegurunursingclasses.com${req.originalUrl}`;
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
