# Security Hardening Guide - Monetly

## Overview
This document outlines security improvements implemented based on the security audit from the instructions PDF.

---

## ✅ Completed Security Fixes

### 1. **RLS Anonymous Access Vulnerability** (FIXED)
**Date:** October 16, 2025
**Priority:** CRITICAL
**Status:** ✅ FIXED

#### Issue
The original database schema granted `SELECT` permission to anonymous (non-authenticated) users:
```sql
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
```

#### Risk
- Anonymous users could potentially read financial data if RLS policies had gaps
- Defense-in-depth principle violated (relying solely on RLS)
- Unnecessary attack surface for a Google OAuth-only app

#### Fix
Revoked all anonymous access:
```sql
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE USAGE ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE USAGE ON SCHEMA public FROM anon;
```

#### How to Apply
1. Open Supabase Dashboard → SQL Editor
2. Run `supabase-security-fix.sql`
3. Verify with query:
```sql
SELECT grantee, table_schema, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public';
```
Should return **0 rows**.

#### Files Modified
- `supabase-schema.sql` (lines 223-230)
- `supabase-security-fix.sql` (new file)

---

## 🟡 Pending Security Enhancements

### 2. **Rate Limiting** (IN PROGRESS)
**Priority:** HIGH
**Status:** 🟡 PENDING IMPLEMENTATION

#### Risk
Without rate limiting, attackers can:
- Spam expense creation → Supabase bill spikes
- Overload database → Denial of Service
- Abuse API endpoints → Unexpected costs

#### Solution Options

**Option A: Supabase Dashboard Rate Limits (Quick Win)**
1. Go to Supabase Dashboard → Settings → API
2. Configure rate limits:
   - Anonymous requests: 0/hour (since we removed anon access)
   - Authenticated requests: 1000/hour per user
   - Realtime connections: 60/minute

**Option B: Client-Side Throttling (Temporary)**
- Add debouncing to API calls
- Prevent rapid-fire submissions
- Files: `contexts/ExpenseContext.tsx`
- **Caveat:** Can be bypassed, not a security control

**Option C: Supabase Edge Functions (Robust)**
- Create API middleware with rate limiting
- Use Deno KV for rate limit counters
- **Effort:** 4-6 hours
- **Best for:** Production at scale

#### Recommendation
Start with **Option A** (5 minutes), add **Option B** (1-2 hours) as UX improvement.

---

### 3. **RLS Policy Testing** (TODO)
**Priority:** HIGH
**Status:** ❌ NOT DONE

#### What to Test
1. **Data Isolation:** User A cannot access User B's expenses
2. **CRUD Operations:** Each user can only modify their own data
3. **Bypass Attempts:** Direct API calls with manipulated user_id

#### Test Cases to Create
```typescript
// Test 1: User isolation
test('User cannot read another user expenses', async () => {
  // Create two users
  // User 1 creates expense
  // User 2 tries to read User 1's expense
  // Should fail or return empty
});

// Test 2: Malicious user_id injection
test('Cannot insert expense with different user_id', async () => {
  // Try to insert with user_id !== auth.uid()
  // Should be rejected by RLS WITH CHECK policy
});
```

#### Files to Create
- `tests/security/rls.test.ts`
- Requires test framework setup (Vitest + Supabase test client)

---

### 4. **Privacy & Security Section** (TODO)
**Priority:** MEDIUM
**Status:** ❌ NOT DONE

#### Requirements
Add a "Data & Security" section in Settings tab with:

1. **Data Encryption Badge**
   - "Your data is encrypted at rest and in transit"
   - SSL/TLS icon

2. **Privacy Assurance**
   - "We never share or sell your financial data"
   - Link to Privacy Policy

3. **Backup Status**
   - "Securely backed up via Supabase"
   - Last backup timestamp

4. **Account Security**
   - Connected Google account
   - "Sign out" button
   - Optional: "Delete all data" button

#### Files to Create/Modify
- `components/SecuritySettings.tsx` (new)
- `app/page.tsx` (add Settings tab)

---

## 🔒 Security Checklist

| Item | Status | Priority | Action Required |
|------|--------|----------|-----------------|
| ✅ Google OAuth | Done | - | None |
| ✅ Input Sanitization | Done | - | None |
| ✅ CSP Headers | Done | - | None |
| ✅ XSS Prevention | Done | - | None |
| ✅ Secure ID Generation | Done | - | None |
| ✅ RLS Policies Enabled | Done | - | None |
| ✅ Anonymous Access Removed | Done | - | Run `supabase-security-fix.sql` |
| 🟡 Rate Limiting | Pending | HIGH | Configure in Supabase Dashboard |
| ❌ RLS Testing | Not Done | HIGH | Create test suite |
| ❌ Privacy Section | Not Done | MEDIUM | Build UI component |
| ❌ Dependency Monitoring | Not Done | MEDIUM | Enable Dependabot |

---

## 📚 References

1. **Supabase RLS Guide:** https://supabase.com/docs/guides/auth/row-level-security
2. **OWASP Top 10:** https://owasp.org/www-project-top-ten/
3. **Supabase Rate Limiting:** https://supabase.com/docs/guides/platform/going-into-prod#rate-limiting

---

## 🚨 Emergency Procedures

### If Data Breach Suspected
1. Immediately revoke Supabase API keys
2. Rotate Google OAuth credentials
3. Audit RLS policies with Supabase Dashboard
4. Check Supabase logs for suspicious activity
5. Force logout all users (reset auth sessions)

### If Billing Spike Detected
1. Check Supabase Dashboard → Usage
2. Enable rate limiting immediately
3. Review recent database operations
4. Block suspicious IP addresses (if identifiable)

---

**Last Updated:** October 16, 2025
**Next Review:** November 2025
