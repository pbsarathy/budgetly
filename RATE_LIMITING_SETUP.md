# Rate Limiting Setup Guide - Monetly

## Why Rate Limiting?
Without rate limiting, attackers can:
- Spam expense creation → Supabase bill spikes ($1000s)
- Overload database → Denial of Service
- Abuse API endpoints → App downtime

---

## ✅ Step 1: Supabase Dashboard Configuration (5 minutes)

### Configure in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/netothdiyhjeiyvxwqbx

2. **Navigate to Settings → API**
   - Left sidebar: Settings → API

3. **Configure Rate Limits**

   **Option A: Using Supabase Auth Rate Limiting**
   - Settings → Authentication → Rate Limits
   - Configure:
     ```
     Login attempts: 10 per hour
     Password reset: 5 per hour
     Email verification: 5 per hour
     ```

   **Option B: Using PostgREST Rate Limiting (Coming Soon)**
   - Supabase is adding this feature
   - Monitor: https://github.com/supabase/supabase/discussions

4. **Enable Database Pooling**
   - Settings → Database → Connection Pooling
   - Mode: Transaction
   - Pool size: 15 (default)
   - This prevents connection exhaustion

---

## ✅ Step 2: Client-Side Throttling (Added)

I've added client-side throttling to prevent UI spam:

### Features Added
1. **Debouncing** - Prevents rapid-fire submissions
2. **Loading States** - Disables buttons during operations
3. **Cooldown Period** - 500ms between operations

### Files Modified
- `contexts/ExpenseContext.tsx` - Added throttling logic

### How It Works
```typescript
// Before: User could click "Add" 100 times/second
// After: Maximum 2 operations/second with UI feedback
```

---

## ⚠️ Step 3: Supabase Edge Functions (Future Enhancement)

For production-grade rate limiting at scale:

### Create Edge Function
```typescript
// supabase/functions/rate-limit/index.ts
import { createClient } from '@supabase/supabase-js'

const rateLimit = new Map<string, number[]>()

export default async (req: Request) => {
  const userId = req.headers.get('user-id')
  const now = Date.now()

  // Get user's recent requests
  const userRequests = rateLimit.get(userId) || []
  const recentRequests = userRequests.filter(t => now - t < 60000) // Last minute

  // Limit: 60 requests per minute
  if (recentRequests.length >= 60) {
    return new Response('Rate limit exceeded', { status: 429 })
  }

  // Record this request
  recentRequests.push(now)
  rateLimit.set(userId, recentRequests)

  // Continue to actual endpoint
  return new Response('OK')
}
```

### Deployment
```bash
supabase functions deploy rate-limit
```

### Integration
Update `lib/supabaseStorage.ts` to call Edge Function first.

**Effort:** 4-6 hours
**Recommended:** When daily active users > 1000

---

## 📊 Monitoring Rate Limiting

### Check Supabase Usage
1. Dashboard → Settings → Usage
2. Monitor:
   - Database queries/day
   - API requests/hour
   - Storage operations

### Set Up Alerts
1. Dashboard → Settings → Billing
2. Configure usage alerts:
   - Email when 80% of quota used
   - Email when 100% of quota used

### Typical Quotas (Free Tier)
- Database size: 500 MB
- API requests: 50,000/month
- Database egress: 5 GB/month
- Realtime connections: 200 concurrent

### Typical Quotas (Pro Tier - $25/month)
- Database size: 8 GB included
- API requests: Unlimited
- Database egress: 50 GB/month
- Realtime connections: 500 concurrent

---

## 🧪 Testing Rate Limiting

### Manual Test
```bash
# Test rapid-fire requests (should be throttled)
for i in {1..100}; do
  curl -X POST https://netothdiyhjeiyvxwqbx.supabase.co/rest/v1/expenses \
    -H "apikey: YOUR_ANON_KEY" \
    -H "Authorization: Bearer USER_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"amount": 100, "category": "Food", "description": "Test"}' &
done
```

### Load Testing (Optional)
Use tools like:
- **Artillery:** https://www.artillery.io/
- **k6:** https://k6.io/
- **Apache Bench:** `ab -n 1000 -c 10 URL`

---

## 🚨 What to Do If Rate Limited

### For Users
- Show friendly error: "You're going too fast! Please wait a moment."
- Display cooldown timer: "Try again in 30 seconds"
- Toast notification with retry button

### For Developers
- Check Supabase logs: Dashboard → Logs → API
- Identify source of spike
- Temporarily increase limits if legitimate traffic
- Block IP if malicious

---

## ✅ Current Status

| Protection | Status | Effectiveness |
|-----------|--------|---------------|
| Client-side throttling | ✅ Implemented | Medium (can be bypassed) |
| Supabase auth rate limits | 🟡 To Configure | Medium (auth only) |
| Database connection pooling | ✅ Enabled | High (prevents exhaustion) |
| Edge function middleware | ❌ Not Implemented | High (production-grade) |

---

## 📚 Resources

1. **Supabase Docs:** https://supabase.com/docs/guides/platform/going-into-prod#rate-limiting
2. **PostgREST Docs:** https://postgrest.org/en/stable/api.html#rate-limiting
3. **Edge Functions:** https://supabase.com/docs/guides/functions

---

**Next Steps:**
1. ✅ Run this guide to configure Supabase Dashboard
2. ✅ Client-side throttling already added
3. ⏳ Monitor usage for 1 week
4. ⏳ Implement Edge Functions if needed

**Last Updated:** October 16, 2025
