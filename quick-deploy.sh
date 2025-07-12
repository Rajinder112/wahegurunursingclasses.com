#!/bin/bash

# Quick Deployment Script for Waheguru Nursing Classes
# This script helps you quickly set up your project for deployment

echo "🚀 Quick Deployment Setup for Waheguru Nursing Classes"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "Prerequisites check passed!"

# Initialize Git repository if not already done
if [ ! -d ".git" ]; then
    print_warning "Initializing Git repository..."
    git init
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Install dependencies
print_warning "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from template..."
    cp env.example .env
    print_success ".env file created"
    print_warning "Please edit .env file with your production settings"
else
    print_success ".env file already exists"
fi

# Generate security secrets
print_warning "Generating security secrets..."
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
COOKIE_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo ""
print_success "Security secrets generated:"
echo "SESSION_SECRET: $SESSION_SECRET"
echo "COOKIE_SECRET: $COOKIE_SECRET"
echo "JWT_SECRET: $JWT_SECRET"
echo ""

# Create logs directory
mkdir -p logs
print_success "Logs directory created"

# Make deploy script executable
chmod +x deploy.sh
print_success "Deploy script made executable"

echo ""
print_success "Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your production settings"
echo "2. Create a GitHub repository"
echo "3. Push your code to GitHub"
echo "4. Choose a hosting platform (Railway/Render/DigitalOcean)"
echo "5. Configure your GoDaddy domain DNS"
echo ""
echo "For detailed instructions, see: deployment-guide.md"
echo "" 