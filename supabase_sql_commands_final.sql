-- Supabase full reset and setup script (final)
-- Safe to run multiple times; uses IF EXISTS/IF NOT EXISTS and upserts
-- Includes: schema, RLS, triggers, indexes, and seed data

-- ==========================
-- 0) Extensions
-- ==========================
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ==========================
-- 1) Drop existing objects (order matters due to FKs)
-- ==========================
-- NOTE: This will remove your data. Comment these lines if you want to keep data.

drop table if exists public.team_translations cascade;
drop table if exists public.team_members cascade;
drop table if exists public.project_translations cascade;
drop table if exists public.projects cascade;
drop table if exists public.translations cascade;
drop table if exists public.homepage_config cascade;
drop table if exists public.users cascade;

drop function if exists public.set_updated_at_timestamp cascade;

-- ==========================
-- 2) Tables
-- ==========================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  is_published boolean not null default false,
  is_homepage boolean not null default false,
  cover_image text,
  content_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- translation_type examples: 'title' | 'description' | 'content'
-- language examples: 'en' | 'ru' | 'kz'
create table if not exists public.project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  translation_type text not null,
  language text not null,
  value jsonb not null,
  unique(project_id, translation_type, language)
);

-- general key/value translations (UI labels, nav, etc.)
create table if not exists public.translations (
  key text not null,
  language text not null,
  value jsonb not null,
  primary key (key, language)
);

-- singleton config row (id = 1)
create table if not exists public.homepage_config (
  id int primary key default 1,
  hero_image text,
  mobile_menu_bg text,
  footer_bg text,
  about_paragraphs jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  constraint homepage_singleton check (id = 1)
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  photo_url text,
  position_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_translations (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members(id) on delete cascade,
  language text not null,
  name jsonb not null,
  position jsonb,
  description jsonb,
  unique(team_member_id, language)
);

-- ==========================
-- 3) Updated_at trigger
-- ==========================
create or replace function public.set_updated_at_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Attach trigger to tables having updated_at
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at_timestamp();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at_timestamp();

create trigger set_team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at_timestamp();

create trigger set_homepage_config_updated_at
before update on public.homepage_config
for each row execute function public.set_updated_at_timestamp();

-- ==========================
-- 4) Indexes
-- ==========================
create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_published on public.projects (is_published);
create index if not exists idx_projects_homepage on public.projects (is_homepage);

create index if not exists idx_proj_tx_project on public.project_translations (project_id);
create index if not exists idx_proj_tx_lang_type on public.project_translations (language, translation_type);

create index if not exists idx_translations_key_lang on public.translations (key, language);

create index if not exists idx_team_members_order on public.team_members (position_order);
create index if not exists idx_team_tx_member on public.team_translations (team_member_id);

-- ==========================
-- 5) RLS & grants
-- ==========================
-- Enable RLS
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.translations enable row level security;
alter table public.homepage_config enable row level security;
alter table public.team_members enable row level security;
alter table public.team_translations enable row level security;

-- Revoke broad defaults (optional hardening)
revoke all on schema public from public;
grant usage on schema public to postgres, anon, authenticated, service_role;

-- Base table grants (RLS still applies)
grant select on table public.projects to anon, authenticated;
grant select on table public.project_translations to anon, authenticated;
grant select on table public.translations to anon, authenticated;
grant select on table public.homepage_config to anon, authenticated;
grant select on table public.team_members to anon, authenticated;
grant select on table public.team_translations to anon, authenticated;

-- Users table: allow SELECT for reading in client auth; updates via Service Role only (API route)
grant select on table public.users to anon, authenticated;

-- Full control to service role
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- RLS policies
-- Public read policies for content
drop policy if exists "projects_read" on public.projects;
create policy "projects_read" on public.projects
for select using (true);

drop policy if exists "project_translations_read" on public.project_translations;
create policy "project_translations_read" on public.project_translations
for select using (true);

drop policy if exists "translations_read" on public.translations;
create policy "translations_read" on public.translations
for select using (true);

drop policy if exists "homepage_config_read" on public.homepage_config;
create policy "homepage_config_read" on public.homepage_config
for select using (true);

drop policy if exists "team_members_read" on public.team_members;
create policy "team_members_read" on public.team_members
for select using (true);

drop policy if exists "team_translations_read" on public.team_translations;
create policy "team_translations_read" on public.team_translations
for select using (true);

drop policy if exists "users_read" on public.users;
create policy "users_read" on public.users
for select using (true);

-- No insert/update/delete policies for anon/authenticated on any table; service_role bypasses RLS.

-- ==========================
-- 6) Seed data (idempotent)
-- ==========================
-- Admin user (default credentials: admin/admin). Change immediately in production.
insert into public.users (username, password_hash, email, role)
values ('admin', 'admin', 'admin@example.com', 'admin')
on conflict (username) do update set
  password_hash = excluded.password_hash,
  email = excluded.email,
  role = excluded.role,
  updated_at = now();

-- Homepage config singleton with default images
insert into public.homepage_config (id, hero_image, mobile_menu_bg, footer_bg)
values (1, '/hero-bg.jpg', '/hero-bg.jpg', '/hero-bg.jpg')
on conflict (id) do update set
  hero_image = excluded.hero_image,
  mobile_menu_bg = excluded.mobile_menu_bg,
  footer_bg = excluded.footer_bg,
  updated_at = now();

-- UI translations (navigation)
insert into public.translations (key, language, value) values
('navHome','en', '"Home"'::jsonb),
('navHome','ru', '"Главная"'::jsonb),
('navHome','kz', '"Басты бет"'::jsonb),
('navAbout','en', '"About Us"'::jsonb),
('navAbout','ru', '"О компании"'::jsonb),
('navAbout','kz', '"Біз туралы"'::jsonb),
('navPortfolio','en', '"Portfolio"'::jsonb),
('navPortfolio','ru', '"Портфолио"'::jsonb),
('navPortfolio','kz', '"Портфолио"'::jsonb)
on conflict (key, language) do update set value = excluded.value;

-- Sample projects
insert into public.projects (slug, is_published, is_homepage, cover_image, content_image)
values
('p1', true, true, '/hero-bg.jpg', '/hero-bg.jpg'),
('p2', true, false, '/hero-bg.jpg', '/hero-bg.jpg'),
('p3', true, false, '/hero-bg.jpg', '/hero-bg.jpg'),
('p4', true, false, '/hero-bg.jpg', '/hero-bg.jpg'),
('p5', true, false, '/hero-bg.jpg', '/hero-bg.jpg'),
('p6', true, false, '/hero-bg.jpg', '/hero-bg.jpg')
on conflict (slug) do update set
  is_published = excluded.is_published,
  is_homepage = excluded.is_homepage,
  cover_image = excluded.cover_image,
  content_image = excluded.content_image,
  updated_at = now();

-- Project translations: titles (use slug lookup to get stable ids)
insert into public.project_translations (project_id, translation_type, language, value)
select p.id, t.translation_type, t.language, t.value
from (
  values
  ('p1'::text, 'title'::text, 'ru'::text, '"Алсад Казахстан ТОО"'::jsonb),
  ('p1'::text, 'title'::text, 'kz'::text, '"Alsad Kazakhstan ЖШС"'::jsonb),
  ('p2'::text, 'title'::text, 'ru'::text, '"Караганда Энергоцентр ТОО"'::jsonb),
  ('p2'::text, 'title'::text, 'kz'::text, '"Қарағанды Энергоцентр ЖШС"'::jsonb),
  ('p3'::text, 'title'::text, 'ru'::text, '"Проект 3"'::jsonb),
  ('p3'::text, 'title'::text, 'kz'::text, '"Жоба 3"'::jsonb),
  ('p4'::text, 'title'::text, 'ru'::text, '"Проект 4"'::jsonb),
  ('p4'::text, 'title'::text, 'kz'::text, '"Жоба 4"'::jsonb),
  ('p5'::text, 'title'::text, 'ru'::text, '"Проект 5"'::jsonb),
  ('p5'::text, 'title'::text, 'kz'::text, '"Жоба 5"'::jsonb),
  ('p6'::text, 'title'::text, 'ru'::text, '"Проект 6"'::jsonb),
  ('p6'::text, 'title'::text, 'kz'::text, '"Жоба 6"'::jsonb)
) as t(slug, translation_type, language, value)
join public.projects p on p.slug = t.slug
on conflict (project_id, translation_type, language) do update set value = excluded.value;

-- Optional placeholders for team (empty seed)
-- You can insert team members here if desired

-- ==========================
-- 7) Helpful views (optional)
-- ==========================
-- Public view combining projects with their localized titles (ru example)
create or replace view public.published_projects_ru as
select
  p.id,
  p.slug,
  p.cover_image,
  p.content_image,
  p.is_homepage,
  p.created_at,
  (select value from public.project_translations pt
     where pt.project_id = p.id and pt.translation_type = 'title' and pt.language = 'ru') as title
from public.projects p
where p.is_published = true;

-- Grant select on the view
grant select on public.published_projects_ru to anon, authenticated;

-- ==========================
-- 8) Done
-- ==========================
-- Run this entire file in the Supabase SQL Editor.
-- After running, your app should be able to:
--  - Read public data via anon key
--  - Update sensitive data (like password) via your server API using service_role
--  - Avoid jsonb polymorphic type errors by using '"string"'::jsonb for strings
