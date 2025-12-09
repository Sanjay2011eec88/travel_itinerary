# Deployment Guide for TripWeaver

## 1. Deploy Edge Function to Supabase

### Option A: Manual Deployment (No CLI Required)

1. **Go to Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project: `ymmzjpvfbpeodmzcsfed`

2. **Navigate to Edge Functions**
   - Click "Edge Functions" in the left sidebar
   - Click "Create a new function" button

3. **Create the Function**
   - Function name: `generate-itinerary`
   - Copy the entire content from `supabase/functions/generate-itinerary/index.ts`
   - Paste it into the code editor
   - Click "Deploy"

4. **Add Environment Secrets**
   - In Edge Functions settings, click "Manage secrets"
   - Add: `OPENAI_API_KEY` = `your-openai-api-key`
   - Add: `LOVABLE_API_KEY` = `your-lovable-api-key` (optional)

### Option B: Using Supabase CLI (Recommended)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref ymmzjpvfbpeodmzcsfed
   ```

4. **Deploy the Function**
   ```bash
   supabase functions deploy generate-itinerary
   ```

5. **Set Secrets**
   ```bash
   supabase secrets set OPENAI_API_KEY=your-openai-api-key
   supabase secrets set LOVABLE_API_KEY=your-lovable-api-key
   ```

## 2. Run Database Migration

1. **Go to Supabase SQL Editor**
   - In your Supabase Dashboard
   - Click "SQL Editor" in the left sidebar

2. **Run Migration**
   - Copy the entire content from `supabase/migrations/20251208171946_1a8da521-d27a-48b8-ad60-05b497c2d6a5.sql`
   - Paste it into the SQL Editor
   - Click "Run"

## 3. Deploy Frontend (Vite App)

### Deploy to Vercel (Recommended)

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
   - Follow the prompts
   - Choose "yes" to link to existing project or create new
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Add Environment Variables**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key

5. **Production Deployment**
   ```bash
   vercel --prod
   ```

### Deploy to Netlify

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

4. **Add Environment Variables**
   - In Netlify Dashboard → Site settings → Environment variables
   - Add the same environment variables as above

### Build for Manual Deployment

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Test Locally**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder**
   - Upload to any static hosting (GitHub Pages, AWS S3, Cloudflare Pages, etc.)

## 4. Post-Deployment Checklist

- [ ] Edge function deployed to Supabase
- [ ] Secrets (OPENAI_API_KEY) added to Supabase
- [ ] Database migration executed successfully
- [ ] Frontend environment variables configured
- [ ] Frontend deployed and accessible
- [ ] Test trip creation end-to-end
- [ ] Verify dark mode works
- [ ] Check landing page → auth → dashboard flow
- [ ] Test itinerary generation with OpenAI

## 5. Environment Variables Reference

### Local Development (.env)
```
VITE_SUPABASE_URL=https://ymmzjpvfbpeodmzcsfed.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
LOVABLE_API_KEY=your-lovable-key
```

### Supabase Edge Function Secrets
```
OPENAI_API_KEY=your-openai-key
LOVABLE_API_KEY=your-lovable-key
```

### Vercel/Netlify Environment Variables
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Edge Function Not Working
- Check Supabase Edge Functions logs
- Verify secrets are set correctly
- Ensure CORS is enabled (already in code)

### Frontend Not Connecting to Supabase
- Verify environment variables are set
- Check Supabase URL and keys
- Ensure RLS policies are correct

### Itinerary Generation Fails
- Check OpenAI API key is valid
- Verify you have credits in OpenAI account
- Check Edge Function logs for errors
