const express = require('express');
const path = require('path');

const app = express();

// Redirect non-www to www in production
app.use((req, res, next) => {
  const host = req.headers.host;
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalhost = host && (host.startsWith('localhost') || host.startsWith('127.0.0.1'));
  if (
    isProduction &&
    !isLocalhost &&
    host === 'wahegurunursingclasses.com'
  ) {
    const fullUrl = 'https://www.wahegurunursingclasses.com' + req.originalUrl;
    return res.redirect(301, fullUrl);
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
