#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating secure environment variables for Render deployment...\n');

// Generate secure secrets
const sessionSecret = crypto.randomBytes(64).toString('hex');
const cookieSecret = crypto.randomBytes(64).toString('hex');
const jwtSecret = crypto.randomBytes(64).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');

console.log('📋 Copy these environment variables to your Render dashboard:\n');

console.log('=== REQUIRED ENVIRONMENT VARIABLES ===');
console.log(`MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/waheguru_nursing_classes`);
console.log(`SESSION_SECRET=${sessionSecret}`);
console.log(`COOKIE_SECRET=${cookieSecret}`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${jwtRefreshSecret}`);

console.log('\n=== OPTIONAL ENVIRONMENT VARIABLES ===');
console.log('NODE_ENV=production');
console.log('PORT=10000');
console.log('RATE_LIMIT_WINDOW_MS=900000');
console.log('RATE_LIMIT_MAX_REQUESTS=100');
console.log('EMAIL_USER=wahegurunursingclasses@gmail.com');
console.log('EMAIL_PASS=your-gmail-app-password');
console.log('LOG_LEVEL=info');

console.log('\n📝 Instructions:');
console.log('1. Go to your Render dashboard');
console.log('2. Select your service');
console.log('3. Go to Environment tab');
console.log('4. Add each variable above');
console.log('5. Replace MONGODB_URI with your actual MongoDB connection string');
console.log('6. Save and redeploy');

console.log('\n⚠️  Important:');
console.log('- Never commit these secrets to your repository');
console.log('- Keep your MongoDB credentials secure');
console.log('- Use different secrets for each environment'); 