 // server/app.js

// Import necessary modules
const express = require('express'); // Express.js for web server
const helmet = require('helmet');   // Helmet for security headers
const path = require('path');       // Path module for directory manipulation

// Initialize the Express application
const app = express();

// Define the port to listen on. Use process.env.PORT for Render, or 3000 for local development.
const PORT = process.env.PORT || 3000;

// --- Security Middleware (Helmet) ---
// Helmet helps secure Express apps by setting various HTTP headers.
// It's a collection of 14 smaller middleware functions.
app.use(helmet());

// --- Redirection Middleware ---

// 1. Force HTTPS: Redirects all HTTP requests to HTTPS.
// This is crucial for security and often handled by proxies like Render.
// 'X-Forwarded-Proto' header is commonly used by load balancers/proxies to indicate the original protocol.
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // Redirect to the same URL but with HTTPS protocol
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    next(); // Continue to the next middleware if already HTTPS
});

// 2. Force WWW subdomain: Redirects non-www requests to www.wahegurunursingclasses.com.
// This ensures a consistent canonical URL for SEO and consistency.
const targetDomain = 'www.wahegurunursingclasses.com';
app.use((req, res, next) => {
    // Check if the host is not the target www domain
    if (req.hostname !== targetDomain) {
        // Construct the full URL with www and HTTPS
        return res.redirect(301, `https://${targetDomain}${req.url}`);
    }
    next(); // Continue to the next middleware if already on www domain
});

// --- Static Files Serving ---
// Serve static files (HTML, CSS, JS, images, etc.) from the 'public' directory.
// The 'path.join' ensures correct path resolution across different operating systems.
app.use(express.static(path.join(__dirname, '../public')));

// --- Route for the root URL ---
// This ensures that when someone accesses the root URL, index.html is served.
// express.static usually handles this by default if index.html exists in the root of the static directory,
// but explicitly defining it can be good for clarity or if you have specific root handling.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// --- Start the server ---
// Listen for incoming requests on the specified port.
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access your website at: https://www.wahegurunursingclasses.com`);
    console.log(`Local development: http://localhost:${PORT}`);
});

