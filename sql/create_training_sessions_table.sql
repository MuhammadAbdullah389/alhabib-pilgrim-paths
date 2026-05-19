-- Create training sessions table for public Hajj training page
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date date,
  start_time time,
  end_time time,
  location text,
  session_type text not null default 'upcoming',
  status text not null default 'draft',
  cover_image_url text,
  photo_urls text[],
  download_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint training_sessions_status_check check (status in ('draft', 'published')),
  constraint training_sessions_type_check check (session_type in ('upcoming', 'completed'))
);

create index if not exists training_sessions_status_idx on public.training_sessions (status);
create index if not exists training_sessions_event_date_idx on public.training_sessions (event_date);

alter table public.training_sessions enable row level security;

-- Public can view only published sessions
create policy "Public can view published training sessions"
  on public.training_sessions
  for select
  using (status = 'published');

-- Admins can manage sessions
create policy "Admins manage training sessions"
  on public.training_sessions
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
