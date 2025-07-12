# ✅ Render + GoDaddy Deployment Checklist

## Phase 1: Preparation
- [ ] **Code pushed to GitHub**
- [ ] **MongoDB Atlas account created**
- [ ] **Database cluster created**
- [ ] **Database user created**
- [ ] **Connection string obtained**

## Phase 2: Render Deployment
- [ ] **Render account created**
- [ ] **New Web Service created**
- [ ] **GitHub repository connected**
- [ ] **Environment variables added:**
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] MONGODB_URI=your_connection_string
  - [ ] SESSION_SECRET=your_secret
  - [ ] COOKIE_SECRET=your_secret
  - [ ] JWT_SECRET=your_secret
- [ ] **Web service deployed successfully**
- [ ] **Test Render URL: https://waheguru-nursing-classes.onrender.com**

## Phase 3: GoDaddy Domain Setup
- [ ] **Custom domain added in Render dashboard**
- [ ] **DNS records obtained from Render**
- [ ] **GoDaddy DNS management accessed**
- [ ] **CNAME records added:**
  - [ ] @ → waheguru-nursing-classes.onrender.com
  - [ ] www → waheguru-nursing-classes.onrender.com
- [ ] **Conflicting records removed**
- [ ] **DNS propagation waited (1-24 hours)**

## Phase 4: Testing & Verification
- [ ] **Custom domain working: https://wahegurunursingclasses.com**
- [ ] **WWW subdomain working: https://www.wahegurunursingclasses.com**
- [ ] **SSL certificate active (HTTPS)**
- [ ] **All pages tested:**
  - [ ] Home page
  - [ ] Classes page
  - [ ] Gallery page
  - [ ] Contact page
  - [ ] Enroll page
- [ ] **Contact form working**
- [ ] **API endpoints responding**
- [ ] **Database connection verified**

## Phase 5: Final Setup
- [ ] **Monitoring alerts configured**
- [ ] **Backup strategy planned**
- [ ] **Analytics setup (optional)**
- [ ] **Documentation updated**

---

## 🎯 Quick Status Check

**Current Status**: ⏳ Ready to start deployment

**Next Action**: Push code to GitHub

**Estimated Time**: 2-3 hours total

**Difficulty Level**: 🟢 Easy (step-by-step guide provided)

---

## 📞 Support Contacts

- **Render**: https://render.com/docs/help
- **GoDaddy**: https://www.godaddy.com/help
- **MongoDB**: https://docs.atlas.mongodb.com/support

---

## 🚀 Your URLs After Deployment

- **Main Site**: https://wahegurunursingclasses.com
- **WWW Version**: https://www.wahegurunursingclasses.com
- **Render URL**: https://waheguru-nursing-classes.onrender.com

---

**Last Updated**: Ready for deployment
**Guide**: See RENDER_GODADDY_SETUP.md for detailed steps 