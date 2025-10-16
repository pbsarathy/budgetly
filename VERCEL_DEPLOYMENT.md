# Vercel Deployment Guide

## Step 1: Add Environment Variables to Vercel

Your production site needs the Supabase credentials to work. Here's how to add them:

### Add to Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Click on your **Monetly** project
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. Add these **THREE** environment variables:

#### Variable 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://netothdiyhjeiyvxwqbx.supabase.co`
- **Environments:** Check all three: ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ldG90aGRpeWhqZWl5dnh3cWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjYzNzEsImV4cCI6MjA3NjA0MjM3MX0.oNZ-US3vQ2G84XjrbOwqtn8Z8aznw39EzIFOENDumaU`
- **Environments:** Check all three: ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### Variable 3 (Optional but recommended):
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Get this from Supabase Dashboard > Settings > API > Service Role Key
- **Environments:** ✅ Production only (keep secret!)
- Click **Save**

## Step 2: Update Google OAuth Redirect URLs

You need to add your production URL to Google OAuth:

1. Go to https://console.cloud.google.com/
2. Go to **APIs & Services** > **Credentials**
3. Click on your **Monetly** OAuth client
4. Under **Authorized redirect URIs**, add:
   - `https://monetly.vercel.app/auth/callback` (or your custom domain)
   - `https://YOUR_PROJECT.vercel.app/auth/callback`
5. Click **Save**

## Step 3: Update Supabase Redirect URLs

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your **Monetly** project
3. Go to **Authentication** > **URL Configuration**
4. Update **Site URL**: `https://monetly.vercel.app` (your production URL)
5. Add to **Redirect URLs**:
   - `https://monetly.vercel.app/**`
   - `https://YOUR_PROJECT.vercel.app/**`
6. Click **Save**

## Step 4: Redeploy

After adding environment variables, you MUST redeploy:

### Option A: Redeploy from Vercel Dashboard
1. Go to your project in Vercel
2. Click **Deployments** tab
3. Click the **⋯** (three dots) on the latest deployment
4. Click **Redeploy**
5. ✅ Check "Use existing Build Cache"
6. Click **Redeploy**

### Option B: Git Push (Recommended)
```bash
git add .
git commit -m "Add Supabase authentication"
git push
```

Vercel will automatically deploy with the new environment variables!

## Step 5: Test Production

1. Go to your production URL: https://monetly.vercel.app
2. You should see the **login page**
3. Click **"Continue with Google"**
4. Sign in with Google
5. You should be redirected back and see the dashboard!

## Troubleshooting

### Login Page Not Showing?
- **Check**: Are environment variables added in Vercel?
- **Fix**: Go to Vercel Settings > Environment Variables and verify they exist
- **Redeploy** after adding them

### "Redirect URI Mismatch" Error?
- **Check**: Did you add production URL to Google OAuth?
- **Fix**: Add `https://monetly.vercel.app/auth/callback` to Google Console

### "Invalid API Key" Error?
- **Check**: Did you copy the Supabase keys correctly?
- **Fix**: Double-check the keys in Vercel match your `.env.local`

### Stuck in Loading Loop?
- **Check**: Browser console for errors (F12)
- **Fix**: Clear browser cache (Ctrl+Shift+R) or try incognito

### Database Schema Not Applied?
- **Check**: Did you run `supabase-schema.sql` in Supabase SQL Editor?
- **Fix**: Go to Supabase > SQL Editor > Run the schema file

## Cache Clearing

**Good news**: Vercel handles cache automatically!

- ✅ New deployments get new build hashes
- ✅ CDN cache is invalidated automatically
- ✅ Users get updates on next page load
- ❌ No manual cache clearing needed!

**However**, users with the page open may need to **refresh** (F5) to see updates.

## Production Checklist

- [ ] Environment variables added to Vercel
- [ ] Google OAuth redirect URLs updated
- [ ] Supabase redirect URLs updated
- [ ] Database schema executed in Supabase
- [ ] Redeployed from Vercel or Git
- [ ] Tested login on production site
- [ ] Confirmed data saves to Supabase

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Verify all URLs match (no http vs https)
4. Test in incognito to rule out cache issues
