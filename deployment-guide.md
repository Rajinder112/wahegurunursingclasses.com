# Complete Deployment Guide for Waheguru Nursing Classes

This guide will walk you through deploying your application to make it live on the internet using your GoDaddy domain.

## Prerequisites Checklist

- ✅ GitHub account created
- ✅ GoDaddy domain purchased
- ✅ Node.js project ready
- ✅ MongoDB database (local or cloud)

## Step 1: Push Your Code to GitHub

### 1.1 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `waheguru-nursing-classes`
4. Make it **Public** (for free hosting options)
5. Don't initialize with README (you already have one)
6. Click "Create repository"

### 1.3 Push Your Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/waheguru-nursing-classes.git
git branch -M main
git push -u origin main
```

## Step 2: Choose Your Hosting Platform

### Option A: Railway (Recommended for Beginners) ⭐

**Pros**: Free tier, automatic deployments, easy setup
**Cons**: Limited free tier, requires credit card

#### Setup Steps:
1. Go to [Railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `waheguru-nursing-classes` repository
5. Railway will automatically detect it's a Node.js app
6. Add environment variables (see Step 3)
7. Deploy!

### Option B: Render (Free Alternative)

**Pros**: Free tier, automatic deployments, no credit card required
**Cons**: Sleeps after 15 minutes of inactivity

#### Setup Steps:
1. Go to [Render.com](https://render.com)
2. Sign up with your GitHub account
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `waheguru-nursing-classes`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy!

### Option C: DigitalOcean App Platform

**Pros**: Reliable, good performance, reasonable pricing
**Cons**: No free tier, requires payment

#### Setup Steps:
1. Go to [DigitalOcean.com](https://digitalocean.com)
2. Create account and add payment method
3. Go to "Apps" → "Create App"
4. Connect your GitHub repository
5. Configure build settings
6. Add environment variables
7. Deploy!

## Step 3: Set Up Environment Variables

You'll need to configure these environment variables in your hosting platform:

### Required Variables:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
SESSION_SECRET=your-super-secret-session-key
COOKIE_SECRET=your-super-secret-cookie-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### How to Get These Values:

#### 1. MongoDB Database
- **Option A**: Use [MongoDB Atlas](https://mongodb.com/atlas) (free tier available)
- **Option B**: Use Railway/Render's MongoDB add-on
- **Option C**: Use your own MongoDB server

#### 2. Email Configuration
- Use Gmail with App Password:
  1. Enable 2-factor authentication on your Gmail
  2. Generate an App Password
  3. Use that password in `EMAIL_PASS`

#### 3. Security Secrets
Generate random strings for:
- `SESSION_SECRET`
- `COOKIE_SECRET`
- `JWT_SECRET`

You can use this command to generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Configure Your GoDaddy Domain

### 4.1 Get Your App URL
After deployment, your hosting platform will give you a URL like:
- Railway: `https://your-app-name.railway.app`
- Render: `https://your-app-name.onrender.com`
- DigitalOcean: `https://your-app-name.ondigitalocean.app`

### 4.2 Configure DNS in GoDaddy
1. Log into your GoDaddy account
2. Go to "My Products" → "Domains"
3. Click "Manage" next to your domain
4. Go to "DNS" tab
5. Add these records:

#### For Root Domain (example.com):
```
Type: CNAME
Name: @
Value: your-app-name.railway.app (or your hosting URL)
TTL: 600
```

#### For www Subdomain:
```
Type: CNAME
Name: www
Value: your-app-name.railway.app (or your hosting URL)
TTL: 600
```

### 4.3 Wait for DNS Propagation
DNS changes can take 24-48 hours to propagate globally.

## Step 5: Set Up Custom Domain (Optional)

Most hosting platforms allow you to add your custom domain:

### Railway:
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your domain: `yourdomain.com`
4. Update DNS records as instructed

### Render:
1. Go to your service dashboard
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records

## Step 6: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test all pages:
   - Home page
   - Contact form
   - Enrollment form
   - All navigation links

3. Check for errors in your hosting platform's logs

## Step 7: Set Up Monitoring (Optional)

### Basic Monitoring:
- Set up uptime monitoring with [UptimeRobot](https://uptimerobot.com)
- Configure email alerts for downtime

### Advanced Monitoring:
- Set up [Sentry](https://sentry.io) for error tracking
- Use [Google Analytics](https://analytics.google.com) for traffic

## Troubleshooting Common Issues

### Issue: App won't start
**Solution**: Check your environment variables and logs

### Issue: Database connection fails
**Solution**: Verify your MongoDB URI and network access

### Issue: Domain not working
**Solution**: Wait for DNS propagation and check DNS records

### Issue: Email not sending
**Solution**: Verify Gmail app password and email settings

## Security Checklist

- ✅ Environment variables are set (not hardcoded)
- ✅ HTTPS is enabled
- ✅ Security headers are configured
- ✅ Rate limiting is active
- ✅ Input validation is working
- ✅ Database is secured

## Maintenance

### Regular Tasks:
1. Monitor application logs
2. Update dependencies monthly
3. Backup database regularly
4. Monitor uptime and performance

### Updates:
1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Hosting platform will auto-deploy

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [DigitalOcean Documentation](https://docs.digitalocean.com)
- [GoDaddy DNS Help](https://www.godaddy.com/help)

---

**Congratulations!** 🎉 Your Waheguru Nursing Classes website is now live on the internet!

Your domain: `https://yourdomain.com` 