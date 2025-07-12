const express = require('express');
const path = require('path');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Bulletproof server is running successfully',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'API is available',
    timestamp: new Date().toISOString(),
    message: 'Server is running in static mode'
  });
});

// Serve static HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/enroll-now', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/enroll-now.html'));
});

app.get('/classes', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/classes.html'));
});

app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/gallery.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'));
});

// Simple error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Bulletproof server running on http://${HOST}:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Server started successfully!`);
});

module.exports = app; 