# Fix Google OAuth Branding - Show "Monetly" Instead of Project ID

**Issue:** OAuth consent screen shows "Continue to netothdiyhjeiyvxwqbx.supabase.co"
**Goal:** Show "Continue to Monetly" or "Monetly wants to access your Google Account"

---

## 🔧 **SOLUTION: Configure Google Cloud Console**

### Step 1: Access Google Cloud Console (2 minutes)

1. **Go to:** https://console.cloud.google.com/
2. **Sign in** with the Google account you used to set up Supabase OAuth
3. **Select your project** (the one linked to your Supabase OAuth)

---

### Step 2: Navigate to OAuth Consent Screen (1 minute)

1. **Left sidebar:** Click **"APIs & Services"**
2. Click **"OAuth consent screen"**
3. You should see your current configuration

---

### Step 3: Edit OAuth Consent Screen (3 minutes)

#### Application Information Section:

**1. App name:**
```
Monetly
```
✅ This is what users will see instead of the project ID

**2. User support email:**
```
[Your email address]
```
✅ Users can contact you for support

**3. App logo (Optional but Recommended):**
- Upload your Monetly logo (PNG/JPG, max 1 MB)
- Recommended size: 120x120 pixels
- Shows your branding in OAuth screen

**4. Application home page:**
```
https://monetly.vercel.app
```
(Or your custom domain if you have one)

**5. Application privacy policy link:**
```
https://monetly.vercel.app/privacy
```
(You'll need to create this page - see below)

**6. Application terms of service link:**
```
https://monetly.vercel.app/terms
```
(You'll need to create this page - see below)

#### Authorized Domains Section:

Make sure these are listed:
```
monetly.vercel.app
vercel.app
supabase.co
```

---

### Step 4: Update Scopes (1 minute)

1. Click **"Add or Remove Scopes"**
2. Ensure these are selected:
   - `userinfo.email` (See your email address)
   - `userinfo.profile` (See your personal info)
3. Click **"Update"**

---

### Step 5: Save Changes (1 minute)

1. Scroll to bottom
2. Click **"Save and Continue"**
3. Click through any remaining steps
4. Verify status is **"In Production"** or **"Testing"**

---

## 🎯 **RESULT AFTER FIX**

### Before:
```
🔐 Continue to netothdiyhjeiyvxwqbx.supabase.co

netothdiyhjeiyvxwqbx.supabase.co wants to access your Google Account
```

### After:
```
🔐 Continue to Monetly

Monetly wants to access your Google Account
```

Much better! ✨

---

## 📄 **BONUS: Create Privacy & Terms Pages**

While not strictly required for testing, they're needed for production OAuth.

### Quick Option: Create Simple Pages

Create these files in your app:

**File:** `app/privacy/page.tsx`
```typescript
export default function Privacy() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy - Monetly</h1>
      <p className="mb-4">Last updated: October 16, 2025</p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Data Collection</h2>
      <p className="mb-4">
        Monetly collects and stores your expense data to provide our service.
        We use Google OAuth for authentication.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Data Usage</h2>
      <p className="mb-4">
        Your data is used solely to provide expense tracking functionality.
        We never share or sell your data to third parties.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Data Security</h2>
      <p className="mb-4">
        Your data is encrypted and stored securely via Supabase.
        We implement industry-standard security practices.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Contact</h2>
      <p className="mb-4">
        Questions? Email us at support@monetly.app
      </p>
    </div>
  );
}
```

**File:** `app/terms/page.tsx`
```typescript
export default function Terms() {
  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Terms of Service - Monetly</h1>
      <p className="mb-4">Last updated: October 16, 2025</p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Acceptance of Terms</h2>
      <p className="mb-4">
        By using Monetly, you agree to these terms of service.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Service Description</h2>
      <p className="mb-4">
        Monetly provides expense tracking and budgeting tools.
        We strive for accuracy but cannot guarantee error-free service.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">User Responsibilities</h2>
      <p className="mb-4">
        You are responsible for maintaining the security of your account.
        You agree not to misuse the service.
      </p>

      <h2 className="text-2xl font-bold mt-6 mb-3">Limitation of Liability</h2>
      <p className="mb-4">
        Monetly is provided "as is" without warranties.
        We are not liable for any financial decisions made using our service.
      </p>
    </div>
  );
}
```

Then deploy these to your app and update the OAuth screen links.

---

## 🚀 **TESTING THE FIX**

### After updating Google Cloud Console:

1. **Clear browser cookies** for your app
2. **Sign out** of Monetly (if signed in)
3. **Visit** your app's login page
4. **Click** "Sign in with Google"
5. **Verify** the consent screen now shows "Monetly" ✅

---

## ⏰ **HOW LONG DOES IT TAKE?**

- **OAuth screen changes:** Immediate (refreshes in 1-5 minutes)
- **No redeployment needed** for OAuth changes
- **Creating privacy/terms pages:** Optional for now, needed before public launch

---

## 📞 **TROUBLESHOOTING**

**Still seeing project ID?**
1. Clear browser cache completely
2. Use incognito/private window
3. Wait 5-10 minutes for Google to propagate changes
4. Verify you saved changes in Google Cloud Console

**Can't find OAuth consent screen?**
1. Make sure you're in the correct Google Cloud project
2. Check that OAuth credentials exist under "Credentials" tab
3. You may need to enable Google+ API first

---

## ✅ **CHECKLIST**

- [ ] Access Google Cloud Console
- [ ] Navigate to OAuth consent screen
- [ ] Update app name to "Monetly"
- [ ] Add support email
- [ ] Add application home page URL
- [ ] Save changes
- [ ] Test with fresh browser session
- [ ] (Optional) Create privacy/terms pages
- [ ] (Optional) Upload app logo

---

**After this fix, your OAuth screen will look professional and show "Monetly" instead of the Supabase project ID!** ✨
