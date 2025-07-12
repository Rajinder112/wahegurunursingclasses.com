const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Test route to check if server starts
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Simple server running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Available environment variables:`, Object.keys(process.env).filter(key => 
    key.includes('MONGODB') || key.includes('JWT') || key.includes('SESSION') || key.includes('COOKIE')
  ));
});

module.exports = app; 