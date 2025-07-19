// server/app.js
// This file sets up an Express.js server to serve a static website,
// handle HTTP to HTTPS and non-www to www redirects, and provide a health check endpoint.

// Import necessary modules
const express = require('express'); // Express.js for building web applications
const helmet = require('helmet');   // Helmet for setting various HTTP headers for security
const path = require('path');       // Path module for working with file and directory paths

// Initialize the Express application
const app = express();

// --- Security Middleware ---
// Use Helmet to secure your app by setting various HTTP headers.
// This helps protect against common web vulnerabilities.
app.use(helmet());

// --- Redirect Middleware ---
// This middleware handles two types of redirects:
// 1. HTTP to HTTPS: Ensures all traffic uses a secure connection.
// 2. Non-www to www: Ensures a consistent canonical URL (e.g., example.com -> www.example.com).
// Render (the hosting platform) often handles HTTP to HTTPS automatically,
// but this provides a robust fallback and handles the www redirection.
app.use((req, res, next) => {
  const host = req.hostname; // Get the hostname from the request (e.g., 'wahegurunursingclasses.com', 'www.wahegurunursingclasses.com')
  const originalUrl = req.originalUrl; // Get the full original URL path (e.g., '/', '/about')
  // Check if the request is HTTPS. 'x-forwarded-proto' is a common header set by proxies/load balancers (like Render's).
  const isHttps = req.headers['x-forwarded-proto'] === 'https';

  // Define the target canonical URL for your website
  const targetHost = 'www.wahegurunursingclasses.com';
  const targetProtocol = 'https://';

  // Condition 1: If the request is NOT HTTPS AND the host is the target www domain.
  // This handles cases where Render's automatic HTTPS might not have kicked in yet,
  // or if direct HTTP access somehow bypasses it (less common on Render).
  // If the request is HTTP and it's already trying to reach the www domain,
  // we redirect it to HTTPS.
  if (!isHttps && host === targetHost) {
    console.log(`Redirecting HTTP to HTTPS for: ${host}${originalUrl}`);
    return res.redirect(301, targetProtocol + targetHost + originalUrl);
  }

  // Condition 2: If the request IS HTTPS AND the host is not the target www domain.
  // This handles redirection from bare domain (wahegurunursingclasses.com) or
  // Render's default subdomain (wahegurunursingclasses-com.onrender.com) to the www domain.
  // We only do this if the connection is already secure (HTTPS) to avoid redirect loops
  // with Render's own HTTPS enforcement.
  if (isHttps && host !== targetHost && host !== 'localhost') { // 'localhost' is excluded for local development
    if (host === 'wahegurunursingclasses.com' || host === 'wahegurunursingclasses-com.onrender.com') {
      console.log(`Redirecting non-www to www for: ${host}${originalUrl}`);
      return res.redirect(301, targetProtocol + targetHost + originalUrl);
    }
  }

  // If no redirect is needed, pass the request to the next middleware
  next();
});

// --- Static Files Serving ---
// Serve static files (like HTML, CSS, JavaScript, images) from the 'public' directory.
// The 'path.join(__dirname, '../public')' correctly resolves the path to the 'public'
// directory, assuming 'app.js' is in 'server/' and 'public/' is a sibling directory.
app.use(express.static(path.join(__dirname, '../public')));

// --- Health Check Endpoint ---
// This endpoint is used by hosting platforms (like Render) to check if the application
// is running and responsive. It's crucial for deployment stability.
app.get('/health', (req, res) => {
  // Respond with a 200 OK status and a JSON object indicating the status.
  res.status(200).json({ status: 'OK', message: 'Service is healthy' });
});

// --- SPA Fallback (Catch-all Route) ---
// For Single Page Applications (SPAs), this route ensures that all unhandled requests
// (i.e., requests that don't match any of the above routes like static files or /health)
// are served the 'index.html' file. This allows client-side routing to take over.
app.get('*', (req, res) => {
  // Resolve the path to index.html within the 'public' directory.
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

// --- Server Start ---
// Define the port the server will listen on.
// It uses process.env.PORT (provided by Render) or defaults to 3000 for local development.
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming requests on the specified port.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT} (for local development)`);
  console.log('For Render deployment, ensure your custom domain is set up correctly.');
});

// Basic error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack to the console
  res.status(500).send('Something broke!'); // Send a generic error response
}); 