# Deployment Troubleshooting Guide

## 🚨 Current Issue: Exit Status 1

Your deployment is failing because the app is trying to load modules that have issues in the production environment.

## 🔧 Quick Fix Options

### Option 1: Use Minimal Server (Recommended for immediate deployment)

1. **In your Render dashboard:**
   - Go to your service settings
   - Change **Start Command** from `node server/app.js` to:
   ```
   node server/minimal-server.js
   ```

2. **Deploy** - This will serve your static files without any complex dependencies

### Option 2: Use Simple Server

1. **In your Render dashboard:**
   - Change **Start Command** to:
   ```
   node server/simple-server.js
   ```

### Option 3: Fix the Main App (For full functionality)

1. **Set environment variables first:**
   ```bash
   npm run generate-env
   ```

2. **Add these to Render Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/waheguru_nursing_classes
   SESSION_SECRET=your-generated-secret
   COOKIE_SECRET=your-generated-secret
   JWT_SECRET=your-generated-secret
   JWT_REFRESH_SECRET=your-generated-secret
   NODE_ENV=production
   ```

3. **Keep the original start command:**
   ```
   node server/app.js
   ```

## 🔍 Root Cause Analysis

The issue is likely caused by:

1. **File system permissions** - Logger trying to create log files in production
2. **Missing environment variables** - App exiting when required vars aren't set
3. **Module loading issues** - Complex dependencies failing to load

## 📋 Step-by-Step Resolution

### Step 1: Immediate Deployment
Use the minimal server to get your site live:

```bash
# In Render dashboard, change start command to:
node server/minimal-server.js
```

### Step 2: Test Your Site
Once deployed, test these URLs:
- `https://your-app.onrender.com/` - Home page
- `https://your-app.onrender.com/health` - Health check
- `https://your-app.onrender.com/contact` - Contact page

### Step 3: Set Up Full Functionality (Optional)
If you want the full app with database:

1. **Generate environment variables:**
   ```bash
   npm run generate-env
   ```

2. **Set up MongoDB:**
   - Create MongoDB Atlas account
   - Get connection string
   - Add to Render environment variables

3. **Switch back to full app:**
   - Change start command back to `node server/app.js`
   - Deploy

## 🛠️ Available Server Options

| Server | Command | Features | Dependencies |
|--------|---------|----------|--------------|
| **Minimal** | `node server/minimal-server.js` | Static files only | Express only |
| **Simple** | `node server/simple-server.js` | Static files + basic logging | Express + dotenv |
| **Full** | `node server/app.js` | Complete app with database | All dependencies |

## 🔧 Environment Variables Reference

### Required for Full App:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
SESSION_SECRET=your-session-secret
COOKIE_SECRET=your-cookie-secret
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

### Optional:
```
NODE_ENV=production
PORT=10000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
LOG_LEVEL=info
```

## 🚀 Recommended Deployment Strategy

1. **Start with Minimal Server** - Get your site live immediately
2. **Test functionality** - Ensure basic pages work
3. **Add environment variables** - Set up database connection
4. **Switch to Full Server** - Enable all features
5. **Monitor logs** - Check for any remaining issues

## 📞 Support

If you continue to have issues:

1. **Check Render logs** - Look for specific error messages
2. **Test locally** - Run `npm run minimal` locally first
3. **Verify environment variables** - Ensure all required vars are set
4. **Check MongoDB connection** - Test database connectivity

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Site loads without errors
- ✅ All static pages are accessible
- ✅ Health check endpoint returns 200
- ✅ No exit status 1 errors in logs 