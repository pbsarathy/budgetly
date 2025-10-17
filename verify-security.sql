-- Security Verification Script for Monetly
-- Run this in Supabase SQL Editor to verify security fixes are applied

-- ========================================
-- 1. CHECK ANONYMOUS ACCESS (Should return 0 rows)
-- ========================================
SELECT
  grantee,
  table_schema,
  table_name,
  privilege_type
FROM information_schema.role_table_grants
WHERE grantee = 'anon' AND table_schema = 'public';

-- Expected: 0 rows (no anonymous access to tables)
-- If you see rows, run supabase-security-fix.sql


-- ========================================
-- 2. VERIFY RLS IS ENABLED (Should return 5 rows with rowsecurity = true)
-- ========================================
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'expenses', 'budgets', 'overall_budgets', 'recurring_expenses');

-- Expected: 5 rows, all with rowsecurity = true
-- If any show false, RLS is not enabled!


-- ========================================
-- 3. LIST ALL RLS POLICIES (Should show ~20 policies)
-- ========================================
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: Multiple policies per table (SELECT, INSERT, UPDATE, DELETE)
-- All should use auth.uid() = user_id pattern


-- ========================================
-- 4. CHECK CONNECTION POOLING SETTINGS
-- ========================================
-- Go to: Supabase Dashboard → Settings → Database → Connection Pooling
-- Verify:
--   - Pool mode: Transaction
--   - Pool size: 15 (or higher)
--   - Status: Active


-- ========================================
-- 5. CHECK RATE LIMITING (AUTH ONLY)
-- ========================================
-- Go to: Supabase Dashboard → Settings → Authentication → Rate Limits
-- Verify these are set:
--   - Email rate limit: 5 per hour (or custom value)
--   - SMS rate limit: 5 per hour (if SMS enabled)


-- ========================================
-- SUMMARY
-- ========================================
-- ✅ Security Fix 1: Anonymous access removed (Query 1 = 0 rows)
-- ✅ Security Fix 2: RLS enabled (Query 2 = all true)
-- ⚠️  Bonus: RLS policies working (Query 3 = ~20 policies)
-- ⚠️  Rate limiting: Manual dashboard check needed

-- If all checks pass: 🎉 SECURITY IS PRODUCTION-READY!
