-- Add session_type for portfolio vs upcoming sessions
alter table public.training_sessions
  add column if not exists session_type text not null default 'upcoming';

-- Enforce allowed values
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'training_sessions_type_check'
  ) then
    alter table public.training_sessions
      add constraint training_sessions_type_check
      check (session_type in ('upcoming', 'completed'));
  end if;
end $$;
