-- Seed script: creates admin user for local development
-- Run automatically by `supabase db reset` or manually with `supabase db seed`
--
-- IMPORTANT: This script is for LOCAL DEVELOPMENT ONLY.
-- For production: create the admin user via Supabase Dashboard > Authentication > Users
-- then set raw_app_meta_data to {"role": "admin"} in the user record.
--
-- Requires pgcrypto extension (enabled in the initial_schema migration).

insert into auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) values (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@jonathansantos.dev',
  crypt('change-me-in-production', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
  '{}'::jsonb,
  'authenticated',
  'authenticated',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict do nothing;
