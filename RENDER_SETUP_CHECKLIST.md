# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code is pushed to GitHub
- [ ] Repository is public or connected to Render
- [ ] All files are committed

### 2. Configuration Files (Already Created)
- [x] `render.yaml` - Render configuration
- [x] `.render-buildpacks.json` - Buildpack specification
- [x] `package.json` - Dependencies and scripts
- [x] `server/app.js` - Main application file

### 3. Environment Variables (Set in Render Dashboard)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `MONGODB_URI=your_mongodb_connection_string`
- [ ] `SESSION_SECRET=your_session_secret`
- [ ] `COOKIE_SECRET=your_cookie_secret`
- [ ] `JWT_SECRET=your_jwt_secret`

### 4. Database Setup
- [ ] MongoDB Atlas account created
- [ ] Database cluster created
- [ ] Database user created
- [ ] Connection string obtained
- [ ] IP whitelist configured (0.0.0.0/0 for testing)

### 5. Render Dashboard Setup
- [ ] Logged into Render dashboard
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Configured build settings
- [ ] Added environment variables
- [ ] Deployed application

## 🔧 Quick Commands

### Test Locally (Windows)
```cmd
set NODE_ENV=production
set PORT=10000
npm start
```

### Test Locally (Mac/Linux)
```bash
NODE_ENV=production PORT=10000 npm start
```

### Run Setup Script (Windows)
```cmd
deploy-render.bat
```

## 📋 Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Name: `waheguru-nursing-classes`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - In Render dashboard, go to your service
   - Click "Environment" tab
   - Add all required variables

4. **Deploy**
   - Click "Create Web Service"
   - Monitor build logs
   - Wait for deployment to complete

## 🌐 URLs

- **Render URL**: https://waheguru-nursing-classes.onrender.com
- **Custom Domain**: https://wahegurunursingclasses.com (after setup)

## 🔍 Troubleshooting

### Build Fails
- Check if all dependencies are in `package.json`
- Verify Node.js version (>=18.0.0)
- Check build logs in Render dashboard

### Database Connection Fails
- Verify MongoDB connection string
- Check if database is accessible
- Ensure IP whitelist includes Render's IPs

### App Not Starting
- Check if port is set to 10000
- Verify all environment variables are set
- Check application logs in Render dashboard

## 📞 Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Project Issues**: Check GitHub repository

## 🎯 Next Steps After Deployment

1. Test all website functionality
2. Set up custom domain
3. Configure SSL certificate
4. Set up monitoring and alerts
5. Plan for scaling

---

**Status**: ✅ Ready for deployment
**Last Updated**: $(Get-Date) 