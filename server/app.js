const express = require('express');
const path = require('path');

const app = express();

// Redirect non-www to www in production
app.use((req, res, next) => {
  const host = req.headers.host;
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && host === 'wahegurunursingclasses.com') {
    return res.redirect(301, 'https://www.wahegurunursingclasses.com' + req.originalUrl);
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
