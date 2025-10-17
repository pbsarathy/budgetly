-- Monetly Security Fix: Remove ALL Anonymous Access
-- Run this in Supabase SQL Editor to fix the security vulnerability
--
-- ISSUE: Anonymous users have INSERT, UPDATE, DELETE, TRUNCATE, and more permissions
-- RISK: Critical - Anonymous users could attempt to modify/delete data
-- FIX: Revoke ALL permissions from anonymous role

-- ========================================
-- REVOKE ALL TABLE PERMISSIONS
-- ========================================

-- Revoke ALL privileges on all tables (covers SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER)
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;

-- Revoke ALL privileges on all sequences
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- Revoke ALL privileges on all functions
REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- Revoke schema usage entirely
REVOKE USAGE ON SCHEMA public FROM anon;

-- Revoke CREATE permission on schema
REVOKE CREATE ON SCHEMA public FROM anon;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- After running above, verify with these queries:

-- Query 1: Should return 0 rows (no table permissions)
-- SELECT grantee, table_name, privilege_type
-- FROM information_schema.role_table_grants
-- WHERE grantee = 'anon' AND table_schema = 'public';

-- Query 2: Should return 0 rows (no schema permissions)
-- SELECT grantee, schema_name, privilege_type
-- FROM information_schema.schema_privileges
-- WHERE grantee = 'anon' AND schema_name = 'public';

-- ========================================
-- EXPECTED RESULT
-- ========================================
-- All REVOKE commands should show: "REVOKE"
-- Both verification queries should return: 0 rows

-- ========================================
-- NOTES
-- ========================================
-- - RLS policies are still your primary defense (working correctly)
-- - This removes permissions as defense-in-depth
-- - Your app requires Google OAuth, so anonymous access is not needed
-- - This is SAFE - authenticated users retain all necessary permissions
