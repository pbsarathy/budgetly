-- Monetly Security Fix: Remove Anonymous Access
-- Run this in Supabase SQL Editor to fix the security vulnerability
--
-- ISSUE: Anonymous (non-authenticated) users had SELECT access to all tables
-- RISK: Potential data leakage if RLS policies are misconfigured
-- FIX: Revoke all anonymous access since app requires Google OAuth

-- Revoke anonymous access to tables
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;

-- Revoke anonymous access to sequences
REVOKE USAGE ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- Revoke anonymous schema usage (keep only for authenticated users)
REVOKE USAGE ON SCHEMA public FROM anon;

-- Verify: This query should return 0 rows for 'anon' role
-- SELECT grantee, table_schema, table_name, privilege_type
-- FROM information_schema.role_table_grants
-- WHERE grantee = 'anon' AND table_schema = 'public';

-- Note: RLS policies still protect data, but defense-in-depth is best practice
-- Anonymous users should have ZERO access to financial data
