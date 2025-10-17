-- Final Security Check and Fix for Supabase
-- The USAGE permission might be coming from default grants

-- ========================================
-- STEP 1: Check for default privileges
-- ========================================
SELECT
  defaclrole::regrole AS grantor,
  defaclnamespace::regnamespace AS schema,
  defaclobjtype AS object_type,
  defaclacl AS privileges
FROM pg_default_acl
WHERE defaclnamespace = 'public'::regnamespace;

-- ========================================
-- STEP 2: Revoke any default privileges for anon
-- ========================================
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON FUNCTIONS FROM anon;

-- ========================================
-- STEP 3: Revoke explicit USAGE again (force)
-- ========================================
REVOKE USAGE ON SCHEMA public FROM anon;

-- ========================================
-- STEP 4: Check if anon role inherits from public
-- ========================================
SELECT
  r.rolname,
  r.rolinherit,
  m.rolname as member_of
FROM pg_roles r
LEFT JOIN pg_auth_members am ON r.oid = am.member
LEFT JOIN pg_roles m ON am.roleid = m.oid
WHERE r.rolname = 'anon';

-- ========================================
-- NOTE ABOUT SUPABASE DEFAULT BEHAVIOR
-- ========================================
-- Supabase may automatically grant USAGE on public schema to anon
-- This is by design for their API to function
-- However, with RLS enabled, this is SAFE because:
-- 1. USAGE only allows seeing that schema exists
-- 2. Table permissions are fully revoked (Step 1 = 0 rows ✅)
-- 3. RLS blocks all data access
-- 4. No data can be read, written, or modified

-- ========================================
-- SECURITY STATUS
-- ========================================
-- If Step 1 table permissions = 0 rows: ✅ YOU ARE SECURE
-- USAGE permission alone without table permissions = HARMLESS
