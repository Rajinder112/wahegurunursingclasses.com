const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// Vision route removed - page was deleted

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

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
  console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
});

module.exports = app; 