# 🚀 Waheguru Nursing Classes - Render Deployment

Your website is now ready for deployment on Render! Here's everything you need to know.

## 📁 Files Created for Render

- `render.yaml` - Render configuration file
- `.render-buildpacks.json` - Buildpack specification
- `render-deploy.md` - Detailed deployment guide
- `deploy-render.bat` - Windows deployment script
- `RENDER_SETUP_CHECKLIST.md` - Quick checklist
- `README-RENDER.md` - This file

## 🎯 Quick Start

1. **Push your code to GitHub**
2. **Go to [Render Dashboard](https://dashboard.render.com)**
3. **Create a new Web Service**
4. **Connect your GitHub repository**
5. **Configure environment variables**
6. **Deploy!**

## 🔧 Required Environment Variables

Set these in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
COOKIE_SECRET=your_cookie_secret
JWT_SECRET=your_jwt_secret
```

## 🌐 Your URLs

- **Render URL**: `https://waheguru-nursing-classes.onrender.com`
- **Custom Domain**: `https://wahegurunursingclasses.com` (after setup)

## 📋 What's Already Configured

✅ **Security Features**
- Helmet.js for security headers
- Rate limiting and throttling
- CORS protection
- XSS protection
- NoSQL injection protection
- Session security

✅ **Performance Features**
- Compression enabled
- Static file caching
- Optimized for production

✅ **Render-Specific Configuration**
- Port configuration (10000)
- Build commands
- Health checks
- Auto-deployment

## 🗄️ Database Setup

You'll need a MongoDB database. We recommend MongoDB Atlas:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Add it to `MONGODB_URI` environment variable

## 🚀 Deployment Steps

### Step 1: Prepare Your Code
```bash
# Add all files
git add .

# Commit changes
git commit -m "Prepare for Render deployment"

# Push to GitHub
git push origin main
```

### Step 2: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure settings:
   - **Name**: `waheguru-nursing-classes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (free)

### Step 3: Add Environment Variables
In your Render service dashboard:
1. Go to "Environment" tab
2. Add all required variables (see above)
3. Save changes

### Step 4: Deploy
1. Click "Create Web Service"
2. Monitor build logs
3. Wait for deployment to complete
4. Your app will be live!

## 🔍 Testing Your Deployment

### Test Locally First
```cmd
# Windows
set NODE_ENV=production
set PORT=10000
npm start

# Mac/Linux
NODE_ENV=production PORT=10000 npm start
```

### Test on Render
- Visit your Render URL
- Test all pages: Home, Classes, Gallery, Contact, Enroll
- Test contact form functionality
- Check API endpoints

## 🛠️ Troubleshooting

### Common Issues

**Build Fails**
- Check if all dependencies are in `package.json`
- Verify Node.js version (>=18.0.0)
- Check build logs in Render dashboard

**Database Connection Fails**
- Verify MongoDB connection string
- Check if database is accessible
- Ensure IP whitelist includes Render's IPs (0.0.0.0/0 for testing)

**App Not Starting**
- Check if port is set to 10000
- Verify all environment variables are set
- Check application logs in Render dashboard

### Getting Help
- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com

## 🎯 Next Steps

After successful deployment:

1. **Test Everything**
   - All pages load correctly
   - Contact form works
   - API endpoints respond
   - Database connections work

2. **Set Up Custom Domain**
   - Add your domain in Render dashboard
   - Update DNS settings
   - Configure SSL certificate

3. **Monitor & Optimize**
   - Set up monitoring alerts
   - Monitor performance
   - Plan for scaling

4. **Security Review**
   - Review security headers
   - Test rate limiting
   - Verify HTTPS is working

## 📞 Support

- **Render Support**: https://render.com/docs/help
- **MongoDB Support**: https://docs.atlas.mongodb.com/support
- **Project Issues**: Check your GitHub repository

---

## 🎉 You're Ready!

Your Waheguru Nursing Classes website is now configured for Render deployment. Follow the checklist in `RENDER_SETUP_CHECKLIST.md` and you'll be live in no time!

**Good luck with your deployment! 🚀** 