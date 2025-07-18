const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Apply security headers
app.use(helmet());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Redirect non-www traffic to www.wahegurunursingclasses.com
app.use((req, res, next) => {
  const host = req.headers.host;
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1') || host.includes('.onrender.com');
  const isWww = host.startsWith('www.');
  if (!isLocal && !isWww && host === 'wahegurunursingclasses.com') {
    return res.redirect(301, `https://www.wahegurunursingclasses.com${req.originalUrl}`);
  }
  next();
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 