-- Drop all tables in reverse order (to handle foreign key dependencies)
-- WARNING: This will delete ALL data!

DROP TABLE IF EXISTS public.recurring_expenses CASCADE;
DROP TABLE IF EXISTS public.overall_budgets CASCADE;
DROP TABLE IF EXISTS public.budgets CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Now you can run supabase-schema.sql to recreate tables
