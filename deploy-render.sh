#!/bin/bash

# Render Deployment Script for Waheguru Nursing Classes
# This script helps prepare your project for Render deployment

echo "🚀 Preparing Waheguru Nursing Classes for Render deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please ensure the Render configuration is set up."
    exit 1
fi

# Check if .render-buildpacks.json exists
if [ ! -f ".render-buildpacks.json" ]; then
    echo "❌ Error: .render-buildpacks.json not found. Please ensure the buildpack configuration is set up."
    exit 1
fi

echo "✅ Configuration files found"

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check if all dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if server directory exists
if [ ! -d "server" ]; then
    echo "❌ Error: server directory not found"
    exit 1
fi

# Check if public directory exists
if [ ! -d "public" ]; then
    echo "❌ Error: public directory not found"
    exit 1
fi

echo "✅ Project structure verified"

# Test the build process
echo "🔨 Testing build process..."
npm install

# Test the start command
echo "🚀 Testing start command..."
echo "Note: This will start the server locally. Press Ctrl+C to stop after testing."
echo "Starting server on port 10000 (Render's default port)..."
echo ""

# Set environment variables for testing
export PORT=10000
export NODE_ENV=production

# Start the server in background
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:10000 > /dev/null; then
    echo "✅ Server is running successfully on port 10000"
    echo "🌐 You can test your application at: http://localhost:10000"
    echo ""
    echo "Press Ctrl+C to stop the server and continue with deployment..."
    
    # Wait for user to stop the server
    wait $SERVER_PID
else
    echo "❌ Server failed to start. Check the logs above for errors."
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Your project is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://dashboard.render.com"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Configure environment variables"
echo "6. Deploy!"
echo ""
echo "📖 For detailed instructions, see: render-deploy.md"
echo ""
echo "🔧 Required environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - MONGODB_URI=your_mongodb_connection_string"
echo "   - SESSION_SECRET=your_session_secret"
echo "   - COOKIE_SECRET=your_cookie_secret"
echo "   - JWT_SECRET=your_jwt_secret"
echo ""
echo "🌐 Your app will be available at: https://waheguru-nursing-classes.onrender.com" 