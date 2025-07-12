# Free Deployment to Netlify - Get Live in 10 Minutes!

## Step 1: Prepare Your Files

1. **Create a `netlify.toml` file** in your project root:
```toml
[build]
  publish = "public"
  command = "npm install"

[[redirects]]
  from = "/api/*"
  to = "/api-fallback.html"
  status = 404

[[redirects]]
  from = "/*"
  to = "/home.html"
  status = 200
```

2. **Create `api-fallback.html`** in your public folder:
```html
<!DOCTYPE html>
<html>
<head>
    <title>API Not Available</title>
</head>
<body>
    <h1>API features not available in static hosting</h1>
    <p>Contact form and other dynamic features require a server.</p>
    <a href="/">Go back home</a>
</body>
</html>
```

## Step 2: Deploy to Netlify

### Method 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Sign up for free account
3. Drag your entire project folder to the deploy area
4. Wait for deployment
5. Get your free URL (like `https://your-site-123.netlify.app`)

### Method 2: GitHub (Recommended)
1. Upload your project to GitHub
2. Connect Netlify to your GitHub account
3. Select your repository
4. Set build settings:
   - Build command: `npm install`
   - Publish directory: `public`
5. Deploy!

## Step 3: Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `wahegurunursingclasses.com`
3. Update DNS in GoDaddy to point to Netlify's servers

## What You'll Get:
- ✅ Free hosting
- ✅ HTTPS automatically
- ✅ Custom domain support
- ✅ Fast CDN
- ✅ Automatic deployments

## Limitations:
- ❌ No server-side features (contact form, database)
- ❌ Static files only
- ❌ No Node.js backend

## Next Steps:
1. Deploy to Netlify for immediate live site
2. Later upgrade to full hosting for all features 