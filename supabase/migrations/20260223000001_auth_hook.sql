-- Custom Access Token Hook: injects role:'admin' into JWT app_metadata
-- when the user has raw_app_meta_data->>'role' = 'admin' in auth.users.
--
-- IMPORTANT: After applying this migration you MUST enable the hook in:
-- Supabase Dashboard > Authentication > Hooks > Custom Access Token
-- Select function: public.custom_access_token_hook
-- This step cannot be automated via SQL migration.

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
stable
as $$
  declare
    claims jsonb;
    is_admin boolean;
  begin
    claims := event->'claims';

    select
      coalesce((raw_app_meta_data->>'role') = 'admin', false)
    into is_admin
    from auth.users
    where id = (event->>'user_id')::uuid;

    if is_admin then
      claims := jsonb_set(
        claims,
        '{app_metadata}',
        coalesce(claims->'app_metadata', '{}'::jsonb) || '{"role":"admin"}'::jsonb
      );
    end if;

    return jsonb_set(event, '{claims}', claims);
  end;
$$;

-- Required grants for the hook to execute
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;
