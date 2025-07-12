# GoDaddy DNS Setup Guide

This guide will help you configure your GoDaddy domain to point to your deployed application.

## Prerequisites

- ✅ GoDaddy domain purchased
- ✅ Application deployed to a hosting platform
- ✅ Your app URL (e.g., `https://your-app.railway.app`)

## Step 1: Get Your App URL

After deploying your application, you'll get a URL like:
- **Railway**: `https://your-app-name.railway.app`
- **Render**: `https://your-app-name.onrender.com`
- **DigitalOcean**: `https://your-app-name.ondigitalocean.app`

**Note this URL down** - you'll need it for DNS configuration.

## Step 2: Access GoDaddy DNS Settings

1. **Log into GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Click "Sign In" in the top right
   - Enter your GoDaddy account credentials

2. **Navigate to Domain Management**
   - Click "My Products" in the top menu
   - Find "Domains" section
   - Click "Manage" next to your domain name

3. **Access DNS Settings**
   - In the domain management page, look for "DNS" tab
   - Click on "DNS" to open DNS management

## Step 3: Configure DNS Records

### Option A: Using CNAME Records (Recommended)

This method works for most hosting platforms:

#### For Root Domain (yourdomain.com):
```
Type: CNAME
Name: @
Value: your-app-name.railway.app
TTL: 600 (or 1 hour)
```

#### For www Subdomain (www.yourdomain.com):
```
Type: CNAME
Name: www
Value: your-app-name.railway.app
TTL: 600 (or 1 hour)
```

### Option B: Using A Records (If CNAME doesn't work)

If your hosting platform provides an IP address:

#### For Root Domain:
```
Type: A
Name: @
Value: [Your hosting platform's IP address]
TTL: 600
```

#### For www Subdomain:
```
Type: CNAME
Name: www
Value: yourdomain.com
TTL: 600
```

## Step 4: Add DNS Records in GoDaddy

1. **In the DNS management page:**
   - Scroll down to "DNS Records" section
   - Click "Add" or "Add Record"

2. **Add Root Domain Record:**
   - **Record Type**: CNAME
   - **Name**: @ (or leave blank)
   - **Value**: your-app-name.railway.app
   - **TTL**: 600
   - Click "Save"

3. **Add www Subdomain Record:**
   - **Record Type**: CNAME
   - **Name**: www
   - **Value**: your-app-name.railway.app
   - **TTL**: 600
   - Click "Save"

## Step 5: Verify DNS Configuration

### Check DNS Propagation:
1. Go to [whatsmydns.net](https://whatsmydns.net)
2. Enter your domain name
3. Select "CNAME" record type
4. Check if the records are propagated globally

### Test Your Domain:
1. Wait 10-30 minutes for initial propagation
2. Try accessing: `http://yourdomain.com`
3. Try accessing: `http://www.yourdomain.com`

## Step 6: Set Up Custom Domain in Hosting Platform

Most hosting platforms require you to add your custom domain:

### Railway:
1. Go to your Railway project dashboard
2. Click "Settings" → "Domains"
3. Add your domain: `yourdomain.com`
4. Railway will provide additional DNS records if needed

### Render:
1. Go to your Render service dashboard
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Follow Render's DNS instructions

### DigitalOcean:
1. Go to your DigitalOcean App dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS as instructed

## Step 7: Enable HTTPS/SSL

### Automatic SSL (Recommended):
Most hosting platforms provide automatic SSL certificates:
- Railway: Automatic
- Render: Automatic
- DigitalOcean: Automatic

### Manual SSL (If needed):
If you need to set up SSL manually:
1. Use Let's Encrypt for free SSL certificates
2. Configure your hosting platform to use the certificate
3. Set up automatic renewal

## Troubleshooting

### Issue: Domain not working after 24 hours
**Solutions:**
1. Check DNS records are correct
2. Verify hosting platform custom domain is configured
3. Contact GoDaddy support if DNS records aren't updating

### Issue: www subdomain not working
**Solutions:**
1. Ensure both @ and www CNAME records are set
2. Check if hosting platform supports www subdomain
3. Consider redirecting www to root domain

### Issue: SSL certificate errors
**Solutions:**
1. Wait for automatic SSL to provision (can take 24 hours)
2. Check if hosting platform supports your domain
3. Verify DNS propagation is complete

## DNS Record Examples

### For Railway:
```
Type: CNAME
Name: @
Value: your-app.railway.app
TTL: 600

Type: CNAME
Name: www
Value: your-app.railway.app
TTL: 600
```

### For Render:
```
Type: CNAME
Name: @
Value: your-app.onrender.com
TTL: 600

Type: CNAME
Name: www
Value: your-app.onrender.com
TTL: 600
```

### For DigitalOcean:
```
Type: CNAME
Name: @
Value: your-app.ondigitalocean.app
TTL: 600

Type: CNAME
Name: www
Value: your-app.ondigitalocean.app
TTL: 600
```

## Important Notes

1. **DNS Propagation Time**: Changes can take 24-48 hours to propagate globally
2. **TTL Values**: Lower TTL (like 600 seconds) means faster updates
3. **Backup**: Keep a record of your original DNS settings
4. **Testing**: Always test both `yourdomain.com` and `www.yourdomain.com`

## Support Resources

- [GoDaddy DNS Help](https://www.godaddy.com/help)
- [GoDaddy Community](https://community.godaddy.com)
- [DNS Checker](https://dnschecker.org)
- [What's My DNS](https://whatsmydns.net)

---

**After completing these steps, your domain should point to your deployed application!** 🎉 