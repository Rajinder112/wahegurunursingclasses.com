# Waheguru Nursing Classes

A Node.js + Express static site for Waheguru Nursing Classes, serving static HTML, CSS, JS, images, and videos with secure HTTP headers and canonical redirects.

## Features
- Serves static files from the `public` directory
- Redirects all traffic to HTTPS and www subdomain
- Uses Helmet for security best practices

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm

### Installation
```sh
npm install
```

### Running Locally
```sh
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment
- The server listens on the port defined by the `PORT` environment variable (required by most cloud hosts).
- Make sure to set up your domain and environment variables as needed on your hosting provider (e.g., Render, Heroku).

## Project Structure
```
public/         # Static files (HTML, CSS, JS, images, videos)
server/app.js   # Express server
package.json    # Project metadata and dependencies
.gitignore      # Ignores node_modules and .env
```

## License
Copyright © 2024 Waheguru Nursing Classes 