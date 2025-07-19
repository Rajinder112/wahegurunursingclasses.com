// server/app.js
// This file sets up an Express.js server to serve a static website,
// handle non-www to www redirects, and provide a health check endpoint.

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
// This middleware handles redirecting non-www to www for consistent canonical URLs.
// We let Render handle HTTP to HTTPS redirects automatically to avoid conflicts.
app.use((req, res, next) => {
  const host = req.hostname; // Get the hostname from the request
  const originalUrl = req.originalUrl; // Get the full original URL path
  
  // Define the target canonical URL for your website
  const targetHost = 'www.wahegurunursingclasses.com';
  
  // Only redirect if we're not already on the target www domain and not on localhost
  if (host !== targetHost && host !== 'localhost') {
    // Redirect bare domain or Render subdomain to www
    if (host === 'wahegurunursingclasses.com' || host === 'wahegurunursingclasses-com.onrender.com') {
      console.log(`Redirecting ${host}${originalUrl} to ${targetHost}${originalUrl}`);
      return res.redirect(301, `https://${targetHost}${originalUrl}`);
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