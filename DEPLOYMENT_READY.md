# TripWeaver - Quick Deployment Guide

## ✅ Your Project is Ready for Deployment!

The production build has been created in the `dist` folder.

---

## 🚀 Deployment Options

### Option 1: Deploy to Vercel (Recommended - Easiest)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project or create new
   - It will auto-detect the Vite framework
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project → Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL = your-supabase-url
     VITE_SUPABASE_ANON_KEY = your-anon-key
     ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

**Your app will be live at:** `https://your-project.vercel.app`

---

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set Environment Variables**
   - Go to Netlify Dashboard → Site settings → Environment variables
   - Add the same variables as Vercel

**Your app will be live at:** `https://your-site.netlify.app`

---

### Option 3: Deploy via GitHub (No CLI needed)

#### Vercel:
1. Go to https://vercel.com/new
2. Import your GitHub repository: `Sanjay2011eec88/travel_itinerary`
3. Framework: Vite
4. Add environment variables
5. Click "Deploy"

#### Netlify:
1. Go to https://app.netlify.com/start
2. Connect to GitHub and select `travel_itinerary`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Click "Deploy"

---

### Option 4: Manual Deployment (Any Static Host)

Your production files are in the `dist` folder. Upload this folder to:
- GitHub Pages
- AWS S3 + CloudFront
- Cloudflare Pages
- Firebase Hosting
- Any static hosting service

**GitHub Pages Example:**
```bash
npm install -g gh-pages
npm run build
npx gh-pages -d dist
```

---

## 🔧 Environment Variables Needed

For **Frontend Deployment** (Vercel/Netlify/etc):
```
VITE_SUPABASE_URL=https://ymmzjpvfbpeodmzcsfed.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

For **Supabase Edge Functions**:
```
OPENAI_API_KEY=your-openai-key-here
LOVABLE_API_KEY=your-lovable-key-here (optional)
```

---

## 📋 Pre-Deployment Checklist

- [x] Production build created (`dist` folder)
- [x] `.gitignore` configured to exclude sensitive data
- [x] `.env.example` created for reference
- [x] Deployment configs created (`vercel.json`, `netlify.toml`)
- [ ] Push code to GitHub
- [ ] Deploy edge function to Supabase
- [ ] Run database migration in Supabase
- [ ] Deploy frontend to Vercel/Netlify
- [ ] Test the live application

---

## 🎯 Next Steps

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "build: Prepare project for deployment with configs"
   git push origin main
   ```

2. **Deploy Edge Function to Supabase:**
   - Go to Supabase Dashboard → Edge Functions
   - Create function: `generate-itinerary`
   - Copy code from `supabase/functions/generate-itinerary/index.ts`
   - Add secrets: `OPENAI_API_KEY`

3. **Run Database Migration:**
   - Go to Supabase SQL Editor
   - Run the migration: `supabase/migrations/20251208171946_1a8da521-d27a-48b8-ad60-05b497c2d6a5.sql`

4. **Deploy Frontend:**
   - Choose Vercel or Netlify
   - Follow the steps above
   - Add environment variables

5. **Test Everything:**
   - Landing page loads
   - Sign up/login works
   - Create a trip
   - Generate itinerary
   - Dark mode toggle
   - Explore destinations

---

## 🆘 Troubleshooting

**Build Warnings:**
- "chunks are larger than 500 kB" - This is normal, the app works fine
- You can optimize later with code splitting if needed

**Deployment Fails:**
- Ensure Node.js version is 18+ in deployment settings
- Check build logs for errors
- Verify environment variables are set

**App Loads but Features Don't Work:**
- Check browser console for errors
- Verify Supabase URL and keys are correct
- Ensure edge function is deployed
- Check database migration ran successfully

---

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify all environment variables
3. Test locally with `npm run build && npm run preview`
4. Check Supabase Edge Function logs

Good luck with your hackathon! 🚀✨
