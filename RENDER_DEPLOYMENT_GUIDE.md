# Render Deployment Guide for Waheguru Nursing Classes

## Quick Fix for Current Deployment Issue

Your deployment is failing because of missing environment variables. Here's how to fix it:

### 1. Set Required Environment Variables in Render

Go to your Render dashboard → Your Service → Environment → Add Environment Variable

Add these **required** environment variables:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/waheguru_nursing_classes
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
COOKIE_SECRET=your-super-secret-cookie-key-here-make-it-long-and-random
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here-make-it-long-and-random
```

### 2. Optional Environment Variables

```
NODE_ENV=production
PORT=10000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMAIL_USER=wahegurunursingclasses@gmail.com
EMAIL_PASS=your-gmail-app-password
LOG_LEVEL=info
```

### 3. MongoDB Setup

You need a MongoDB database. Options:
- **MongoDB Atlas** (recommended): Free tier available
- **Render MongoDB**: Built-in MongoDB service

#### MongoDB Atlas Setup:
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account
3. Create new cluster
4. Create database user
5. Get connection string
6. Replace `your-username`, `your-password`, and `your-cluster` in the MONGODB_URI

## Deployment Steps

### 1. Update Your Render Service

1. Go to your Render dashboard
2. Select your service
3. Go to **Environment** tab
4. Add all the environment variables listed above
5. Click **Save Changes**
6. Go to **Manual Deploy** tab
7. Click **Deploy latest commit**

### 2. Alternative: Use Simple Server

If you want to deploy without database first, you can temporarily change the start command:

1. Go to your Render service settings
2. Change **Start Command** from `node server/app.js` to `node server/simple-server.js`
3. Deploy

This will serve your static files without requiring a database.

## Troubleshooting

### Check Deployment Logs

1. Go to your Render service
2. Click on the latest deployment
3. Check the logs for specific error messages

### Common Issues

1. **Missing Environment Variables**: The app will now show which variables are missing
2. **MongoDB Connection**: Make sure your MongoDB URI is correct
3. **Port Issues**: Render automatically sets PORT environment variable
4. **Memory Issues**: Free tier has memory limits

### Testing Your Deployment

Once deployed, test these endpoints:

- `https://your-app.onrender.com/` - Home page
- `https://your-app.onrender.com/health` - Health check
- `https://your-app.onrender.com/contact` - Contact page

## Security Notes

1. **Never commit environment variables** to your repository
2. **Use strong, random secrets** for SESSION_SECRET, COOKIE_SECRET, and JWT_SECRET
3. **Keep your MongoDB credentials secure**
4. **Use HTTPS in production** (Render provides this automatically)

## Environment Variable Generator

You can generate secure secrets using this command:

```bash
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
node -e "console.log('COOKIE_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(64).toString('hex'));"
```

## Next Steps

1. Set up environment variables
2. Deploy
3. Test the application
4. Set up your domain (if needed)
5. Configure email service for contact form

## Support

If you continue to have issues:
1. Check the deployment logs in Render
2. Verify all environment variables are set
3. Test locally with the same environment variables
4. Check MongoDB connection string format 