# A6000 + 50mm Photography OS

Progressive Web App for Sony A6000 + 50mm F1.8 OSS

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `a6000-photography-os`
   - Set to Public
   - Click "Create repository"

2. **Upload Files**
   ```bash
   cd a6000-pwa
   git init
   git add .
   git commit -m "Initial PWA release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/a6000-photography-os.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Click Save

4. **Access Your App**
   - URL: `https://YOUR_USERNAME.github.io/a6000-photography-os/`
   - Wait 2-3 minutes for first deployment

### Option 2: Netlify (Alternative)

1. Go to https://app.netlify.com/drop
2. Drag the entire `a6000-pwa` folder
3. Get instant URL like: `https://random-name.netlify.app`

### Option 3: Vercel (Alternative)

1. Go to https://vercel.com/new
2. Import the `a6000-pwa` folder
3. Deploy instantly

## 📱 Install as App

**On Mobile (iOS/Android):**
1. Open the web app in browser
2. Safari (iOS): Tap Share → Add to Home Screen
3. Chrome (Android): Tap ⋮ → Install App

**On Desktop (Chrome/Edge):**
1. Click the install icon (➕) in address bar
2. Or: ⋮ Menu → Install A6000 OS

## 🔄 How to Update

### Method 1: Edit on GitHub

1. Go to your repository on GitHub
2. Navigate to file (e.g., `index.html`)
3. Click ✏️ Edit button
4. Make changes
5. Commit changes
6. GitHub Pages auto-deploys in 1-2 minutes
7. Users get update notification automatically

### Method 2: Local Edit + Push

```bash
cd a6000-pwa
# Edit files locally
git add .
git commit -m "Update: description of changes"
git push
```

### Update Version Number

After making changes, update `version.json`:

```json
{
  "version": "v1.0.1",  // ← Increment this
  "buildDate": "2026-10-07",
  "changelog": [
    "Added new video scenario",
    "Fixed cafe preset"
  ]
}
```

Users will see update notification automatically!

## ✨ Features

- ✅ **Progressive Web App** - Install like native app
- ✅ **Offline Support** - Works without internet
- ✅ **Auto Updates** - Notifications when new version available
- ✅ **Mobile Optimized** - Perfect for field use
- ✅ **Fast Loading** - Cached for instant access
- ✅ **Cross-Platform** - Works on iOS, Android, Desktop

## 📁 Project Structure

```
a6000-pwa/
├── index.html              # Main app (your V13 file)
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline & caching
├── version.json           # Version tracking
├── icon-192.png           # App icon (small)
├── icon-512.png           # App icon (large)
└── README.md              # This file
```

## 🛠 Development

### Test Locally

```bash
# Simple HTTP server
python -m http.server 8000
# Or
npx serve .
```

Visit: `http://localhost:8000`

### Check PWA Status

Chrome DevTools → Application → Manifest, Service Workers

## 📝 Content Updates

### Add New Photo Scenario
Edit `index.html`, find `<!-- Photo Scenarios -->`, add new card

### Add New Video Preset
Find `<!-- Video Presets -->`, duplicate existing preset structure

### Change Colors
Edit CSS variables in `:root` section

### Update Text
Find `data-en` and `data-vi` attributes for bilingual content

## 🌐 Custom Domain (Optional)

### GitHub Pages Custom Domain

1. Buy domain (Namecheap, Google Domains)
2. Add CNAME file to repo:
   ```
   your-custom-domain.com
   ```
3. Configure DNS:
   - Add CNAME record: `www` → `YOUR_USERNAME.github.io`
   - Add A records for apex domain

### Netlify Custom Domain

1. Site settings → Domain management
2. Add custom domain
3. Follow DNS instructions

## 🚨 Troubleshooting

**App not updating?**
- Check version.json was updated
- Hard refresh: Ctrl+Shift+R (desktop) or clear browser cache
- Service worker takes 1-2 minutes to detect updates

**Icons not showing?**
- Ensure icon files are in root directory
- Check manifest.json paths are correct
- Re-deploy if needed

**Not working offline?**
- Service worker must register first (visit online once)
- Check DevTools → Application → Service Workers

## 📊 Analytics (Optional)

Add Google Analytics by inserting before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 📄 License

Personal use project for A6000 + 50mm F1.8 photography

---

**Made with ❤️ for Sony A6000 photographers**
