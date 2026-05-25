-- Creative Factory — initial database schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)

-- =====================================================
-- Extensions
-- =====================================================
create extension if not exists "pgcrypto";

-- =====================================================
-- Profiles (mirrors auth.users)
-- =====================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  banned boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles(email);

-- Auto-create profile on signup; promote master1key555@gmail.com to admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'),
    case when lower(new.email) = 'master1key555@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================
-- Posts
-- =====================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft','published')),
  author_id uuid references public.profiles(id) on delete set null,
  author_name text,
  seo_title text,
  seo_description text,
  og_image_url text,
  view_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_idx on public.posts(status, published_at desc);
create index if not exists posts_slug_idx on public.posts(slug);

-- =====================================================
-- Pages (about, privacy, terms, custom)
-- =====================================================
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

-- =====================================================
-- Subscribers
-- =====================================================
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  confirmed boolean not null default true,
  created_at timestamptz not null default now()
);

-- =====================================================
-- Contact submissions
-- =====================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================
-- Comments
-- =====================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  author_avatar text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_idx on public.comments(post_id, created_at desc);

-- =====================================================
-- Likes
-- =====================================================
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- =====================================================
-- Site settings (singleton row)
-- =====================================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'Creative Factory',
  tagline text default 'Where ideas become iconic.',
  logo_url text,
  default_og_image text,
  footer_text text default '© Creative Factory. All rights reserved.',
  instagram_url text default '#',
  telegram_url text default '#',
  facebook_url text default '#',
  twitter_url text default '#',
  pinterest_url text default '#',
  primary_color text default '#c9a961',
  secondary_color text default '#6b1f2a',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (site_name)
select 'Creative Factory'
where not exists (select 1 from public.site_settings);

-- =====================================================
-- RLS policies
-- =====================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.pages enable row level security;
alter table public.subscribers enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.site_settings enable row level security;

-- Helper: is current user admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and banned = false
  );
$$;

-- profiles
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- posts
drop policy if exists "posts_read_published" on public.posts;
create policy "posts_read_published" on public.posts
  for select using (status = 'published' or public.is_admin());

drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- pages
drop policy if exists "pages_read_all" on public.pages;
create policy "pages_read_all" on public.pages
  for select using (true);

drop policy if exists "pages_admin_all" on public.pages;
create policy "pages_admin_all" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- subscribers
drop policy if exists "subscribers_insert_any" on public.subscribers;
create policy "subscribers_insert_any" on public.subscribers
  for insert with check (true);

drop policy if exists "subscribers_admin_read" on public.subscribers;
create policy "subscribers_admin_read" on public.subscribers
  for select using (public.is_admin());

drop policy if exists "subscribers_admin_delete" on public.subscribers;
create policy "subscribers_admin_delete" on public.subscribers
  for delete using (public.is_admin());

-- contact submissions
drop policy if exists "contacts_insert_any" on public.contact_submissions;
create policy "contacts_insert_any" on public.contact_submissions
  for insert with check (true);

drop policy if exists "contacts_admin_all" on public.contact_submissions;
create policy "contacts_admin_all" on public.contact_submissions
  for all using (public.is_admin()) with check (public.is_admin());

-- comments
drop policy if exists "comments_read_all" on public.comments;
create policy "comments_read_all" on public.comments
  for select using (true);

drop policy if exists "comments_user_insert" on public.comments;
create policy "comments_user_insert" on public.comments
  for insert with check (auth.uid() = author_id);

drop policy if exists "comments_user_delete" on public.comments;
create policy "comments_user_delete" on public.comments
  for delete using (auth.uid() = author_id or public.is_admin());

-- likes
drop policy if exists "likes_read_all" on public.likes;
create policy "likes_read_all" on public.likes
  for select using (true);

drop policy if exists "likes_user_insert" on public.likes;
create policy "likes_user_insert" on public.likes
  for insert with check (auth.uid() = user_id);

drop policy if exists "likes_user_delete" on public.likes;
create policy "likes_user_delete" on public.likes
  for delete using (auth.uid() = user_id);

-- settings
drop policy if exists "settings_read_all" on public.site_settings;
create policy "settings_read_all" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_update" on public.site_settings;
create policy "settings_admin_update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- =====================================================
-- View counter (security definer so anonymous can increment)
-- =====================================================
create or replace function public.increment_post_views(post_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.posts set view_count = view_count + 1
  where slug = post_slug and status = 'published';
$$;

grant execute on function public.increment_post_views(text) to anon, authenticated;

-- =====================================================
-- Storage bucket for images (admin-managed)
-- =====================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_read_all" on storage.objects;
create policy "media_read_all" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_write" on storage.objects;
create policy "media_admin_write" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());

-- =====================================================
-- Seed sample data
-- =====================================================
insert into public.pages (slug, title, content) values
  ('about', 'About Creative Factory', '# About Creative Factory

Creative Factory is a studio for ideas that matter. We craft brands, content, and experiences that move people and markets.

## Our Story

Founded with a single belief: that creative work should be both beautiful and useful. We pair editorial taste with rigorous strategy.

## What We Do

- Brand identity
- Content & editorial
- Digital products
- Campaigns

We work with founders, agencies, and forward-looking institutions.'),
  ('privacy', 'Privacy Policy', '# Privacy Policy

_Last updated: today_

Creative Factory respects your privacy. This policy explains what data we collect and how we use it.

## Data we collect

- Account data (email, name) when you register.
- Usage data (pages visited, anonymous analytics) only after you accept analytics cookies.
- Content you submit (comments, contact form messages, newsletter signup).

## How we use it

- To deliver the website and your account.
- To send newsletters (only if you subscribed).
- To improve the site.

## Your rights

You can request deletion of your account and data at any time by contacting us.'),
  ('terms', 'Terms of Service', '# Terms of Service

By using Creative Factory you agree to the following.

## Use of the site

The content is provided as-is. Do not republish without attribution.

## Accounts

You are responsible for keeping your password secure.

## Liability

We are not liable for damages arising from use of the site.')
on conflict (slug) do nothing;

insert into public.posts (slug, title, excerpt, content, status, tags, published_at, author_name)
values
  (
    'welcome-to-creative-factory',
    'Welcome to Creative Factory',
    'A new home for ideas, work, and the people who make them.',
    '# Welcome

This is the inaugural post of Creative Factory — a publication and studio for work that lasts.

We will write about design, craft, business, and the small details that make great work great.

## What to expect

- Long-form essays on craft.
- Studio notes and behind-the-scenes.
- Interviews with makers we admire.

Subscribe to the newsletter at the bottom of the page to follow along.',
    'published',
    array['announcements','editorial'],
    now(),
    'Creative Factory'
  ),
  (
    'the-craft-of-restraint',
    'The Craft of Restraint',
    'Why the most powerful design decisions are the ones you choose not to make.',
    '# The Craft of Restraint

The hardest part of creative work is not adding — it is removing.

A great identity, a great essay, a great product, they share a common discipline: every element earns its place.

## Three rules

1. **Cut the second-best idea.** If two ideas compete, keep the strongest. The other one weakens both.
2. **Default to whitespace.** It is not empty. It is the frame.
3. **Let the work breathe.** Resist the urge to explain.

Restraint is not minimalism. It is precision.',
    'published',
    array['design','craft'],
    now() - interval '2 days',
    'Creative Factory'
  ),
  (
    'building-a-studio-from-scratch',
    'Building a Studio From Scratch',
    'Notes on the first six months of running a creative practice.',
    '# Building a Studio From Scratch

We started Creative Factory with three things: a notebook, a domain name, and a long list of opinions about how the work should be done.

Six months in, here is what we got right and wrong.

## What worked

- **Saying no early.** Every project we declined made the next one stronger.
- **Writing in public.** This blog is the marketing.
- **Slow weeks.** We schedule reflection like we schedule work.

## What we are still figuring out

- Pricing creative work fairly.
- Scaling taste.

If you are starting something, write to us. We answer every email.',
    'published',
    array['studio','business'],
    now() - interval '5 days',
    'Creative Factory'
  )
on conflict (slug) do nothing;
