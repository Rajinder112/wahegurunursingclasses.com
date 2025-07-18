const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

app.use(helmet());

app.use((req, res, next) => {
  const host = req.hostname;
  console.log('Incoming host:', host);
  if (
    isProduction &&
    host === 'wahegurunursingclasses.com' &&
    host !== 'localhost' &&
    host !== '127.0.0.1'
  ) {
    const fullUrl = 'https://www.wahegurunursingclasses.com' + req.originalUrl;
    console.log('Redirecting to www...');
    return res.redirect(301, fullUrl);
  }
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
