# 🚀 Complete Render + GoDaddy Setup Guide

## Step-by-Step Guide to Deploy Your Website on Render with GoDaddy Domain

### Prerequisites ✅
- Render account (already created)
- GoDaddy domain: `wahegurunursingclasses.com`
- GitHub repository with your code
- MongoDB Atlas database (free tier)

---

## 📋 Step 1: Prepare Your Code for GitHub

### 1.1 Push Your Code to GitHub
```bash
# In your project directory
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

**Make sure your repository is public or connected to Render.**

---

## 🌐 Step 2: Set Up MongoDB Atlas Database

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Create account or sign in

### 2.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider (AWS/Google Cloud/Azure)
4. Choose region closest to you
5. Click "Create"

### 2.3 Create Database User
1. In Security → Database Access
2. Click "Add New Database User"
3. Username: `waheguru_admin`
4. Password: Create a strong password
5. Role: "Atlas admin"
6. Click "Add User"

### 2.4 Configure Network Access
1. In Security → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String
1. In Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `waheguru_nursing_classes`

**Example:**
```
mongodb+srv://waheguru_admin:yourpassword@cluster0.xxxxx.mongodb.net/waheguru_nursing_classes?retryWrites=true&w=majority
```

---

## 🚀 Step 3: Deploy on Render

### 3.1 Create Render Account
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Sign up with GitHub (recommended)

### 3.2 Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Click "Connect account" next to GitHub
4. Authorize Render to access your repositories

### 3.3 Configure Web Service
Fill in these details:

**Basic Settings:**
- **Name**: `waheguru-nursing-classes`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: Leave empty

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Starter` (free tier)

### 3.4 Add Environment Variables
Click "Advanced" and add these environment variables:

**Required Variables:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://waheguru_admin:yourpassword@cluster0.xxxxx.mongodb.net/waheguru_nursing_classes?retryWrites=true&w=majority
SESSION_SECRET=your-super-secret-session-key-here-make-it-long-and-random
COOKIE_SECRET=your-super-secret-cookie-key-here-make-it-long-and-random
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

**Optional Variables:**
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EMAIL_USER=wahegurunursingclasses@gmail.com
EMAIL_PASS=your-gmail-app-password
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

### 3.5 Deploy
1. Click "Create Web Service"
2. Wait for build to complete (5-10 minutes)
3. Your app will be live at: `https://waheguru-nursing-classes.onrender.com`

---

## 🌍 Step 4: Connect GoDaddy Domain

### 4.1 Add Custom Domain in Render
1. In your Render dashboard, go to your web service
2. Click "Settings" tab
3. Scroll to "Custom Domains"
4. Click "Add Domain"
5. Enter: `wahegurunursingclasses.com`
6. Click "Add Domain"

### 4.2 Get DNS Records from Render
After adding the domain, Render will show you DNS records to add:

**You'll see something like:**
```
Type: CNAME
Name: wahegurunursingclasses.com
Value: waheguru-nursing-classes.onrender.com
```

**And:**
```
Type: CNAME
Name: www
Value: waheguru-nursing-classes.onrender.com
```

### 4.3 Configure DNS in GoDaddy

#### 4.3.1 Access GoDaddy DNS Settings
1. Log in to [GoDaddy](https://godaddy.com)
2. Go to "My Products"
3. Find your domain `wahegurunursingclasses.com`
4. Click "DNS" or "Manage DNS"

#### 4.3.2 Add CNAME Records
1. In DNS Management, find "DNS Records"
2. Click "Add" or "+"
3. Add these records:

**Record 1:**
- **Type**: CNAME
- **Name**: `@` (or leave empty)
- **Value**: `waheguru-nursing-classes.onrender.com`
- **TTL**: 600 (or default)

**Record 2:**
- **Type**: CNAME
- **Name**: `www`
- **Value**: `waheguru-nursing-classes.onrender.com`
- **TTL**: 600 (or default)

#### 4.3.3 Remove Conflicting Records
- Delete any existing A records for `@`
- Delete any existing CNAME records for `www`
- Keep any email records (MX, TXT for email)

### 4.4 Wait for DNS Propagation
- DNS changes can take 24-48 hours to propagate
- Usually works within 1-2 hours
- You can check propagation at: https://www.whatsmydns.net

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Your Website
1. Visit `https://wahegurunursingclasses.com`
2. Test all pages:
   - Home page
   - Classes page
   - Gallery page
   - Contact page
   - Enroll page

### 5.2 Test Contact Form
1. Go to Contact page
2. Fill out and submit the contact form
3. Check if email is received

### 5.3 Test API Endpoints
Visit these URLs to test:
- `https://wahegurunursingclasses.com/api/contact`
- `https://wahegurunursingclasses.com/api/courses`

---

## 🔧 Step 6: SSL Certificate Setup

### 6.1 Render SSL (Automatic)
- Render automatically provides SSL certificates
- Your site will be accessible via HTTPS
- No additional setup needed

### 6.2 Force HTTPS (Optional)
Add this environment variable in Render:
```
FORCE_HTTPS=true
```

---

## 📊 Step 7: Monitor Your Deployment

### 7.1 Check Render Dashboard
- Monitor logs in real-time
- Check deployment status
- View performance metrics

### 7.2 Set Up Alerts (Optional)
1. In Render dashboard, go to your service
2. Click "Alerts" tab
3. Set up email notifications for:
   - Failed deployments
   - High error rates
   - Service downtime

---

## 🛠️ Troubleshooting

### Common Issues:

**1. Build Fails**
- Check build logs in Render dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is >=18.0.0

**2. Database Connection Fails**
- Verify MongoDB connection string
- Check if database user password is correct
- Ensure IP whitelist includes 0.0.0.0/0

**3. Domain Not Working**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check domain status in GoDaddy

**4. SSL Certificate Issues**
- Wait for automatic SSL setup (can take 1-2 hours)
- Check if domain is properly configured
- Verify DNS propagation is complete

### Getting Help:
- **Render Support**: https://render.com/docs/help
- **GoDaddy Support**: https://www.godaddy.com/help
- **MongoDB Support**: https://docs.atlas.mongodb.com/support

---

## 🎯 Final Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas database created
- [ ] Render web service deployed
- [ ] Environment variables configured
- [ ] Custom domain added in Render
- [ ] DNS records configured in GoDaddy
- [ ] Website accessible via custom domain
- [ ] SSL certificate working
- [ ] All pages tested
- [ ] Contact form working
- [ ] API endpoints responding

---

## 🎉 Congratulations!

Your website is now live at:
**https://wahegurunursingclasses.com**

### Your Setup:
- **Platform**: Render (free tier)
- **Domain**: GoDaddy (wahegurunursingclasses.com)
- **Database**: MongoDB Atlas (free tier)
- **SSL**: Automatic (HTTPS enabled)

### Next Steps:
1. Set up monitoring and alerts
2. Configure backup strategies
3. Plan for scaling as you grow
4. Set up analytics (Google Analytics)
5. Regular security updates

---

**Need Help?** Check the troubleshooting section above or contact support for the respective platforms. 