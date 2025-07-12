# 🔧 GoDaddy DNS Settings Quick Reference

## DNS Records to Add in GoDaddy

### For Render Deployment

**Record 1: Root Domain**
```
Type: CNAME
Name: @ (or leave empty)
Value: waheguru-nursing-classes.onrender.com
TTL: 600
```

**Record 2: WWW Subdomain**
```
Type: CNAME
Name: www
Value: waheguru-nursing-classes.onrender.com
TTL: 600
```

## Step-by-Step GoDaddy DNS Configuration

### 1. Access GoDaddy DNS
1. Log in to GoDaddy.com
2. Go to "My Products"
3. Find `wahegurunursingclasses.com`
4. Click "DNS" or "Manage DNS"

### 2. Add CNAME Records
1. Click "Add" or "+" button
2. Select "CNAME" from Type dropdown
3. Add the two records above
4. Click "Save"

### 3. Remove Conflicting Records
Delete these if they exist:
- A record for `@`
- CNAME record for `www` (if different)

### 4. Keep These Records (Don't Delete)
- MX records (for email)
- TXT records (for email verification)
- Any other email-related records

## DNS Propagation Time
- **Usually**: 1-2 hours
- **Maximum**: 24-48 hours
- **Check**: https://www.whatsmydns.net

## Test Your DNS
```bash
# Check if DNS is propagated
nslookup wahegurunursingclasses.com
nslookup www.wahegurunursingclasses.com
```

## Common Issues

**Domain not working after 24 hours:**
1. Verify DNS records are correct
2. Check for typos in the CNAME value
3. Ensure no conflicting A records
4. Contact GoDaddy support

**WWW subdomain not working:**
1. Verify CNAME record for `www`
2. Check TTL settings
3. Wait for propagation

**SSL certificate issues:**
1. Ensure DNS is fully propagated
2. Wait 1-2 hours after DNS setup
3. Check Render dashboard for SSL status 