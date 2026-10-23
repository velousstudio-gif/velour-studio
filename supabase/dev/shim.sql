-- SOLO DESARROLLO Y PRUEBAS (PGlite). Imita lo que Supabase ya trae: roles, esquema auth y privilegios por defecto.
-- Nunca se ejecuta en Supabase real.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  encrypted_password text,
  created_at timestamptz not null default now()
);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub', '')::uuid
$$;

grant usage on schema public, auth to anon, authenticated, service_role;
-- Supabase concede todo por defecto en `public`; la migración debe revocar lo que no corresponde.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
grant select on auth.users to service_role;
