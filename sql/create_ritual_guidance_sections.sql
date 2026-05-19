-- Create ritual guidance sections for public manual and admin editor
create table if not exists public.ritual_guidance_sections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  section_group text not null,
  body text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ritual_guidance_group_check check (
    section_group in (
      'general',
      'before_departure',
      'madinah',
      'makkah',
      'umrah',
      'hajj',
      'hajj_days',
      'ihram',
      'duas',
      'videos',
      'maps'
    )
  )
);

create index if not exists ritual_guidance_group_idx on public.ritual_guidance_sections (section_group);
create index if not exists ritual_guidance_sort_idx on public.ritual_guidance_sections (sort_order);

alter table public.ritual_guidance_sections enable row level security;

-- Public can view only published sections
create policy "Public can view published ritual guidance"
  on public.ritual_guidance_sections
  for select
  using (is_published = true);

-- Admins can manage all sections
create policy "Admins manage ritual guidance"
  on public.ritual_guidance_sections
  for all
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
