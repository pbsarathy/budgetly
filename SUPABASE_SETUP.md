# Supabase Setup Guide for Monetly

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Sign in with GitHub (recommended) or email
3. Click **"New Project"**
4. Fill in:
   - **Name:** `monetly-prod`
   - **Database Password:** Generate strong password (SAVE THIS!)
   - **Region:** Choose closest to your users (e.g., `us-east-1` for US, `ap-south-1` for India)
5. Click **"Create new project"**
6. Wait ~2 minutes for project to initialize

## Step 2: Get API Credentials

Once project is ready:

1. Go to **Settings** > **API** in left sidebar
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon Public Key:** `eyJhbGc...` (long string)
   - **Service Role Key:** `eyJhbGc...` (save but DON'T expose in frontend)

## Step 3: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy entire contents of `supabase-schema.sql` file
4. Paste into SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. Verify success: You should see "Success. No rows returned"

## Step 4: Configure Google OAuth

### 4.1 Create Google OAuth App

1. Go to https://console.cloud.google.com/
2. Create new project or select existing one
3. Go to **APIs & Services** > **Credentials**
4. Click **"Create Credentials"** > **"OAuth 2.0 Client ID"**
5. Configure OAuth consent screen (if not done):
   - User Type: **External**
   - App name: **Monetly**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `email` and `profile`
   - Save and continue
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Monetly Production**
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local dev)
     - `https://monetly.vercel.app` (your production domain)
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://monetly.vercel.app/auth/callback`
     - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Click **"Create"**
7. Copy **Client ID** and **Client Secret**

### 4.2 Enable Google Auth in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** in the list
3. Click to expand
4. Enable **"Google Enabled"** toggle
5. Paste:
   - **Client ID** from Google Console
   - **Client Secret** from Google Console
6. Click **"Save"**

## Step 5: Configure Email Redirects (Optional)

1. Go to **Authentication** > **URL Configuration**
2. Add your production URL:
   - **Site URL:** `https://monetly.vercel.app`
   - **Redirect URLs:** Add `https://monetly.vercel.app/**`

## Step 6: Set Environment Variables

Create `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...

# Optional: Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
```

**IMPORTANT:**
- Never commit `.env.local` to git (already in .gitignore)
- Add same variables to Vercel dashboard for production

## Step 7: Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your **Monetly** project
3. Go to **Settings** > **Environment Variables**
4. Add each variable:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
5. Select environments: **Production**, **Preview**, **Development**
6. Click **"Save"**

## Step 8: Test Database Connection

After setting up environment variables, run:

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm run dev
```

Open http://localhost:3000 - authentication should now work!

## Verification Checklist

- [ ] Supabase project created
- [ ] API credentials copied
- [ ] Database schema executed successfully
- [ ] Google OAuth app created
- [ ] Google auth enabled in Supabase
- [ ] `.env.local` file created with correct values
- [ ] Environment variables added to Vercel
- [ ] Supabase client libraries installed

## Troubleshooting

### "Invalid API Key" Error
- Double-check `.env.local` has correct values
- Restart dev server after adding env vars

### "Auth callback URL mismatch"
- Verify redirect URIs in Google Console match Supabase callback
- Check Supabase URL Configuration has correct redirect URLs

### "Row Level Security" Error
- Schema was run correctly
- User is logged in (RLS requires authenticated user)

### Google Login Popup Closes Immediately
- Check Google OAuth consent screen is configured
- Verify redirect URIs are correct

## Next Steps

Once setup is complete:
1. Test Google login flow
2. Migrate existing localStorage data
3. Test CRUD operations
4. Deploy to Vercel

## Support

- Supabase Docs: https://supabase.com/docs
- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
