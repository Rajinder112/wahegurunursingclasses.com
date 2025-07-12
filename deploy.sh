#!/bin/bash

# Waheguru Nursing Classes Deployment Script
# This script helps you deploy your application to production

echo "🚀 Starting deployment process for Waheguru Nursing Classes..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file based on env.example"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if MongoDB is configured
if ! grep -q "MONGODB_URI" .env; then
    echo "⚠️  Warning: MONGODB_URI not found in .env file"
    echo "Please configure your MongoDB connection string"
fi

# Check if email is configured
if ! grep -q "EMAIL_USER" .env; then
    echo "⚠️  Warning: EMAIL_USER not found in .env file"
    echo "Please configure your email settings"
fi

# Set NODE_ENV to production
export NODE_ENV=production

# Start the application
echo "🌐 Starting the application..."
npm start

echo "✅ Deployment completed!"
echo "Your application should now be running on the configured port" 