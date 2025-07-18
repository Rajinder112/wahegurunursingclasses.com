const express = require('express');
const path = require('path');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// Redirect non-www to www in production
app.use((req, res, next) => {
  const host = req.hostname;
  console.log('Incoming host:', host);

  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (isProduction && !isLocalhost && host === 'wahegurunursingclasses.com') {
    const fullUrl = 'https://www.wahegurunursingclasses.com' + req.originalUrl;
    console.log('Redirecting to www...');
    return res.redirect(301, fullUrl);
  }

  next();
});

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Serve homepage (index.html) on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Handle unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
