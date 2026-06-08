-- =====================================================
-- Lead capture: extend subscribers with source / UTM / page metadata
-- so signup_form submissions record where each lead came from.
-- Safe to run multiple times.
-- =====================================================
alter table public.subscribers add column if not exists name text;
alter table public.subscribers add column if not exists tag text;
alter table public.subscribers add column if not exists source text;
alter table public.subscribers add column if not exists page_url text;
alter table public.subscribers add column if not exists utm_source text;
alter table public.subscribers add column if not exists utm_medium text;
alter table public.subscribers add column if not exists utm_campaign text;
