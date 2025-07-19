const express = require('express');
const helmet = require('helmet');
const path = require('path');

const app = express();

// Security headers
app.use(helmet());

// Simple redirect: only redirect bare domain to www
app.use((req, res, next) => {
  const host = req.hostname;
  
  // Only redirect if it's the bare domain (not www, not localhost, not Render subdomain)
  if (host === 'wahegurunursingclasses.com') {
    return res.redirect(301, `https://www.wahegurunursingclasses.com${req.originalUrl}`);
  }
  
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 