# Render Deployment Guide for Waheguru Nursing Classes

## Prerequisites
- Render account (already created)
- MongoDB database (MongoDB Atlas recommended)
- Environment variables configured

## Step 1: Connect Your Repository

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your project

## Step 2: Configure the Web Service

### Basic Settings:
- **Name**: `waheguru-nursing-classes`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (root of repository)

### Build & Deploy Settings:
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Starter` (free tier)

## Step 3: Environment Variables

Add these environment variables in Render dashboard:

### Required Variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your-super-secret-session-key-here
COOKIE_SECRET=your-super-secret-cookie-key-here
JWT_SECRET=your-super-secret-jwt-key-here
```

### Optional Variables:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMAIL_USER=wahegurunursingclasses@gmail.com
EMAIL_PASS=your-gmail-app-password
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

## Step 4: MongoDB Setup

1. Create a MongoDB Atlas account (free tier available)
2. Create a new cluster
3. Create a database user
4. Get your connection string
5. Add it to `MONGODB_URI` environment variable

## Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues
4. Your app will be available at: `https://waheguru-nursing-classes.onrender.com`

## Step 6: Custom Domain (Optional)

1. In your Render dashboard, go to your web service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Add your domain: `wahegurunursingclasses.com`
5. Update your DNS settings as instructed by Render

## Step 7: SSL Certificate

Render automatically provides SSL certificates for all web services.

## Step 8: Monitoring

- **Health Checks**: Render automatically checks your app at the root path `/`
- **Logs**: View real-time logs in the Render dashboard
- **Metrics**: Monitor performance and usage

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Ensure Node.js version is compatible (>=18.0.0)

2. **Database Connection Issues**:
   - Verify MongoDB Atlas connection string
   - Check if IP whitelist includes Render's IPs (0.0.0.0/0 for testing)

3. **Environment Variables**:
   - Ensure all required variables are set
   - Check for typos in variable names

4. **Port Issues**:
   - Render uses port 10000 by default
   - Your app should use `process.env.PORT`

### Useful Commands:

```bash
# Check build logs
# View in Render dashboard

# Test locally with production settings
NODE_ENV=production PORT=10000 npm start

# Check environment variables
echo $MONGODB_URI
```

## Performance Optimization

1. **Caching**: Static files are automatically cached
2. **Compression**: Already enabled in the app
3. **CDN**: Render provides global CDN
4. **Auto-scaling**: Available on paid plans

## Security Features

Your app already includes:
- Helmet.js for security headers
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection protection
- Session security

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas: https://docs.atlas.mongodb.com

## Next Steps

1. Set up monitoring and alerts
2. Configure backup strategies
3. Set up CI/CD pipeline
4. Implement logging and analytics
5. Plan for scaling as your user base grows 