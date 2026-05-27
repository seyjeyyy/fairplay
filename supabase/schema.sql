create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;

alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant execute on functions to anon, authenticated;

create table if not exists public.profiles (
  id text primary key,
  email text,
  full_name text,
  role text default 'participant',
  avatar_url text,
  status text default 'active',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.events (
  id bigint primary key,
  title text not null,
  type text default 'contest',
  organizer_id bigint,
  participants integer default 0,
  max_participants integer,
  metadata jsonb default '{}'::jsonb,
  criteria jsonb default '[]'::jsonb,
  contestants jsonb default '[]'::jsonb,
  judges jsonb default '[]'::jsonb,
  sub_events jsonb default '[]'::jsonb,
  approval_workflow jsonb default '[]'::jsonb,
  external_judge_invites jsonb default '[]'::jsonb,
  audience_attendance integer default 0,
  attendance_tracking boolean default false,
  tournament_format text default 'single',
  status text default 'draft',
  start_date timestamptz,
  end_date timestamptz,
  scheduled_date timestamptz,
  location text,
  enable_certificates boolean default false,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.teams (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  name text not null,
  members jsonb default '[]'::jsonb,
  coach_name text,
  school_name text,
  division text,
  status text default 'active',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.registrations (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  participant_id bigint,
  team_id bigint references public.teams(id) on delete set null,
  participant_name text not null,
  email text,
  category text,
  status text default 'pending',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.scores (
  id text primary key,
  event_id bigint references public.events(id) on delete cascade,
  judge_id bigint,
  participant_id bigint,
  team_id bigint references public.teams(id) on delete set null,
  criteria_scores jsonb default '[]'::jsonb,
  comments jsonb default '{}'::jsonb,
  total_score numeric(10,2) default 0,
  remarks text,
  round_name text,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.audience_scores (
  id text primary key,
  event_id bigint references public.events(id) on delete cascade,
  contestant_id text not null,
  contestant_name text,
  voter_key text not null,
  score numeric(10,2) not null check (score >= 1 and score <= 10),
  created_at timestamptz default timezone('utc', now()),
  unique(event_id, contestant_id, voter_key)
);

create table if not exists public.judges (
  id bigint primary key,
  name text not null,
  email text,
  role text default 'judge',
  specialty text,
  status text default 'active',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.judge_assignments (
  id text primary key,
  judge_id bigint references public.judges(id) on delete cascade,
  event_id bigint references public.events(id) on delete cascade,
  sub_event_id text,
  assigned_at timestamptz default timezone('utc', now()),
  status text default 'assigned',
  notes text
);

create table if not exists public.attendance (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  participant_id bigint,
  participant_name text not null,
  qr_code text,
  checked_in_at timestamptz default timezone('utc', now()),
  status text default 'present'
);

create table if not exists public.certificates (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  participant_id bigint,
  participant_name text not null,
  certificate_type text default 'participation',
  file_url text,
  metadata jsonb default '{}'::jsonb,
  issued_at timestamptz default timezone('utc', now())
);

create table if not exists public.notifications (
  id text primary key,
  title text not null,
  message text not null,
  type text default 'info',
  category text default 'system',
  target_roles text[] default '{}',
  target_user_ids text[] default '{}',
  target_emails text[] default '{}',
  source_key text,
  entity_type text,
  entity_id text,
  action_url text,
  is_read boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now())
);

create table if not exists public.tournaments (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  name text not null,
  format text default 'single',
  bracket jsonb default '{}'::jsonb,
  standings jsonb default '[]'::jsonb,
  status text default 'draft',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.event_categories (
  id bigint primary key,
  name text not null,
  description text,
  metadata jsonb default '{}'::jsonb,
  status text default 'active',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.event_locations (
  id bigint primary key,
  name text not null,
  address text,
  venue text,
  metadata jsonb default '{}'::jsonb,
  status text default 'active',
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.team_members (
  id bigint primary key,
  team_id bigint references public.teams(id) on delete cascade,
  name text not null,
  email text,
  role text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.solo_participants (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  status text default 'active',
  category text default 'solo',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.brackets (
  id bigint primary key,
  event_id bigint references public.events(id) on delete cascade,
  name text not null,
  description text,
  format text default 'single',
  status text default 'draft',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.matches (
  id bigint primary key,
  bracket_id bigint references public.brackets(id) on delete cascade,
  round_number integer default 1,
  match_order integer default 0,
  participant_a_id text,
  participant_b_id text,
  participant_a_name text,
  participant_b_name text,
  winner_id text,
  score_a numeric(10,2) default 0,
  score_b numeric(10,2) default 0,
  status text default 'pending',
  scheduled_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.match_participants (
  id bigint primary key,
  match_id bigint references public.matches(id) on delete cascade,
  participant_id text,
  team_id bigint references public.teams(id) on delete set null,
  participant_name text,
  score numeric(10,2) default 0,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.judge_status_logs (
  id bigint primary key,
  judge_id bigint references public.judges(id) on delete cascade,
  event_id bigint references public.events(id) on delete set null,
  status text default 'active',
  notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create table if not exists public.ai_detections (
  id text primary key,
  target_type text not null default 'system',
  target_id text,
  target_name text,
  actor_id text,
  actor_name text,
  risk_level text not null default 'low',
  status text not null default 'open',
  reason text not null,
  metadata jsonb default '{}'::jsonb,
  detected_at timestamptz default timezone('utc', now()),
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

alter table public.events add column if not exists description text;
alter table public.events add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.events add column if not exists audience_impact_enabled boolean default false;
alter table public.events add column if not exists audience_impact_weight numeric(5,2) default 10;
alter table public.events add column if not exists audience_voting_open boolean default false;
alter table public.events add column if not exists audience_qr_token text;

alter table public.teams add column if not exists players jsonb default '[]'::jsonb;
alter table public.teams add column if not exists stats jsonb default '{}'::jsonb;
alter table public.team_members add column if not exists school_year text;

alter table public.registrations add column if not exists registration_type text default 'individual';
alter table public.registrations add column if not exists team_name text;
alter table public.registrations add column if not exists roster jsonb default '[]'::jsonb;
alter table public.registrations add column if not exists individual_details jsonb default '{}'::jsonb;

alter table public.scores alter column id type text using id::text;
alter table public.scores alter column judge_id type text using judge_id::text;
alter table public.scores add column if not exists contestant_id text;
alter table public.scores add column if not exists contestant_name text;
alter table public.scores add column if not exists event_title text;
alter table public.scores add column if not exists judge_name text;
alter table public.scores add column if not exists comments jsonb default '{}'::jsonb;
alter table public.scores add column if not exists locked boolean default false;
alter table public.scores add column if not exists locked_at timestamptz;

alter table public.judges add column if not exists score_count integer default 0;

alter table public.attendance alter column id type text using id::text;
alter table public.attendance add column if not exists sub_event_id text;
alter table public.attendance add column if not exists attendee_id text;
alter table public.attendance add column if not exists attendee_name text;
alter table public.attendance add column if not exists attendee_type text default 'participant';
alter table public.attendance add column if not exists role text default 'participant';
alter table public.attendance add column if not exists qr_token text;
alter table public.attendance add column if not exists scanner_id text;
alter table public.attendance add column if not exists source text default 'manual';
alter table public.attendance add column if not exists notes text;
alter table public.attendance add column if not exists check_in_status text default 'checked-in';
alter table public.attendance add column if not exists metadata jsonb default '{}'::jsonb;
update public.attendance
set
  attendee_id = coalesce(attendee_id, participant_id::text),
  attendee_name = coalesce(attendee_name, participant_name),
  attendee_type = coalesce(attendee_type, 'participant'),
  role = coalesce(role, 'participant'),
  check_in_status = coalesce(check_in_status, 'checked-in')
where attendee_name is null or attendee_id is null;

alter table public.certificates alter column id type text using id::text;
alter table public.certificates add column if not exists event_title text;
alter table public.certificates add column if not exists recipient_id text;
alter table public.certificates add column if not exists recipient_name text;
alter table public.certificates add column if not exists category text default 'participant';
alter table public.certificates add column if not exists placement integer;
alter table public.certificates add column if not exists score numeric(10,2);
alter table public.certificates add column if not exists status text default 'generated';
alter table public.certificates add column if not exists template jsonb default '{}'::jsonb;
alter table public.certificates add column if not exists notes text;
alter table public.certificates add column if not exists verification_code text;
alter table public.certificates add column if not exists verification_url text;
alter table public.certificates add column if not exists qr_value text;
alter table public.certificates add column if not exists updated_at timestamptz default timezone('utc', now());
update public.certificates
set
  recipient_id = coalesce(recipient_id, participant_id::text),
  recipient_name = coalesce(recipient_name, participant_name),
  category = coalesce(category, 'participant'),
  status = coalesce(status, 'generated')
where recipient_name is null or recipient_id is null;

alter table public.tournaments add column if not exists title text;
alter table public.tournaments alter column name drop not null;
alter table public.tournaments alter column name set default 'Tournament';
alter table public.tournaments add column if not exists bracket_type text default 'single';
alter table public.tournaments add column if not exists teams jsonb default '[]'::jsonb;
alter table public.tournaments add column if not exists matches jsonb default '[]'::jsonb;
alter table public.tournaments add column if not exists rounds jsonb default '[]'::jsonb;
alter table public.tournaments add column if not exists history_log jsonb default '[]'::jsonb;
alter table public.tournaments add column if not exists entrant_snapshot jsonb default '[]'::jsonb;
alter table public.tournaments add column if not exists current_round integer default 0;
alter table public.tournaments add column if not exists total_rounds integer default 0;
alter table public.tournaments add column if not exists total_slots integer default 0;
alter table public.tournaments add column if not exists byes integer default 0;
alter table public.tournaments add column if not exists live_status text default 'waiting';
alter table public.tournaments add column if not exists champion jsonb default '{}'::jsonb;
alter table public.tournaments add column if not exists is_locked boolean default false;
alter table public.tournaments add column if not exists is_published boolean default false;
alter table public.tournaments add column if not exists published_at timestamptz;
alter table public.tournaments add column if not exists last_synced_at timestamptz default timezone('utc', now());
alter table public.tournaments add column if not exists stream_title text;
alter table public.tournaments add column if not exists stream_message text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists role text default 'participant';
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists status text default 'active';
alter table public.profiles add column if not exists metadata jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists created_at timestamptz default timezone('utc', now());
alter table public.profiles add column if not exists updated_at timestamptz default timezone('utc', now());
update public.tournaments
set
  title = coalesce(title, name),
  name = coalesce(name, title, 'Tournament'),
  bracket_type = coalesce(bracket_type, format, 'single'),
  history_log = coalesce(history_log, '[]'::jsonb),
  entrant_snapshot = coalesce(entrant_snapshot, teams, '[]'::jsonb)
where title is null or bracket_type is null or name is null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_teams_updated_at on public.teams;
create trigger set_teams_updated_at
before update on public.teams
for each row execute function public.set_updated_at();

drop trigger if exists set_registrations_updated_at on public.registrations;
create trigger set_registrations_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

drop trigger if exists set_scores_updated_at on public.scores;
create trigger set_scores_updated_at
before update on public.scores
for each row execute function public.set_updated_at();

drop trigger if exists set_judges_updated_at on public.judges;
create trigger set_judges_updated_at
before update on public.judges
for each row execute function public.set_updated_at();

drop trigger if exists set_tournaments_updated_at on public.tournaments;
create trigger set_tournaments_updated_at
before update on public.tournaments
for each row execute function public.set_updated_at();

drop trigger if exists set_event_categories_updated_at on public.event_categories;
create trigger set_event_categories_updated_at
before update on public.event_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_event_locations_updated_at on public.event_locations;
create trigger set_event_locations_updated_at
before update on public.event_locations
for each row execute function public.set_updated_at();

drop trigger if exists set_team_members_updated_at on public.team_members;
create trigger set_team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

drop trigger if exists set_solo_participants_updated_at on public.solo_participants;
create trigger set_solo_participants_updated_at
before update on public.solo_participants
for each row execute function public.set_updated_at();

drop trigger if exists set_brackets_updated_at on public.brackets;
create trigger set_brackets_updated_at
before update on public.brackets
for each row execute function public.set_updated_at();

drop trigger if exists set_matches_updated_at on public.matches;
create trigger set_matches_updated_at
before update on public.matches
for each row execute function public.set_updated_at();

drop trigger if exists set_match_participants_updated_at on public.match_participants;
create trigger set_match_participants_updated_at
before update on public.match_participants
for each row execute function public.set_updated_at();

drop trigger if exists set_judge_status_logs_updated_at on public.judge_status_logs;
create trigger set_judge_status_logs_updated_at
before update on public.judge_status_logs
for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.teams enable row level security;
alter table public.registrations enable row level security;
alter table public.scores enable row level security;
alter table public.audience_scores enable row level security;
alter table public.judges enable row level security;
alter table public.judge_assignments enable row level security;
alter table public.attendance enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;
alter table public.tournaments enable row level security;
alter table public.event_categories enable row level security;
alter table public.event_locations enable row level security;
alter table public.team_members enable row level security;
alter table public.solo_participants enable row level security;
alter table public.brackets enable row level security;
alter table public.matches enable row level security;
alter table public.match_participants enable row level security;
alter table public.judge_status_logs enable row level security;
alter table public.ai_detections enable row level security;

drop policy if exists "Profiles can read their own record" on public.profiles;
create policy "Profiles can read their own record"
on public.profiles for select
to anon, authenticated
using (auth.uid() = id);

drop policy if exists "Profiles can insert their own record" on public.profiles;
create policy "Profiles can insert their own record"
on public.profiles for insert
to anon, authenticated
with check (auth.uid() = id);

drop policy if exists "Allow organizer signup requests" on public.profiles;
create policy "Allow organizer signup requests"
on public.profiles for insert
to anon, authenticated
with check (role = 'organizer' and status = 'active');

drop policy if exists "Allow organizer signup request updates" on public.profiles;
create policy "Allow organizer signup request updates"
on public.profiles for update
to anon, authenticated
using (role = 'organizer')
with check (role = 'organizer' and status = 'active');

drop policy if exists "Profiles can update their own record" on public.profiles;
create policy "Profiles can update their own record"
on public.profiles for update
to anon, authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Allow profile list for demo dashboards" on public.profiles;
create policy "Allow profile list for demo dashboards"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Allow profile management for demo dashboards" on public.profiles;
create policy "Allow profile management for demo dashboards"
on public.profiles for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to events" on public.events;
create policy "Allow anon full access to events"
on public.events for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to teams" on public.teams;
create policy "Allow anon full access to teams"
on public.teams for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to registrations" on public.registrations;
create policy "Allow anon full access to registrations"
on public.registrations for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to scores" on public.scores;
create policy "Allow anon full access to scores"
on public.scores for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to audience scores" on public.audience_scores;
create policy "Allow anon full access to audience scores"
on public.audience_scores for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to notifications" on public.notifications;
create policy "Allow anon full access to notifications"
on public.notifications for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to judges" on public.judges;
create policy "Allow anon full access to judges"
on public.judges for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to judge_assignments" on public.judge_assignments;
create policy "Allow anon full access to judge_assignments"
on public.judge_assignments for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to attendance" on public.attendance;
create policy "Allow anon full access to attendance"
on public.attendance for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to certificates" on public.certificates;
create policy "Allow anon full access to certificates"
on public.certificates for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to tournaments" on public.tournaments;
create policy "Allow anon full access to tournaments"
on public.tournaments for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to event_categories" on public.event_categories;
create policy "Allow anon full access to event_categories"
on public.event_categories for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to event_locations" on public.event_locations;
create policy "Allow anon full access to event_locations"
on public.event_locations for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to team_members" on public.team_members;
create policy "Allow anon full access to team_members"
on public.team_members for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to solo_participants" on public.solo_participants;
create policy "Allow anon full access to solo_participants"
on public.solo_participants for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to brackets" on public.brackets;
create policy "Allow anon full access to brackets"
on public.brackets for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to matches" on public.matches;
create policy "Allow anon full access to matches"
on public.matches for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to match_participants" on public.match_participants;
create policy "Allow anon full access to match_participants"
on public.match_participants for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Allow anon full access to judge_status_logs" on public.judge_status_logs;
create policy "Allow anon full access to judge_status_logs"
on public.judge_status_logs for all
to anon, authenticated
using (true)
with check (true);

drop trigger if exists set_ai_detections_updated_at on public.ai_detections;
create trigger set_ai_detections_updated_at
before update on public.ai_detections
for each row execute function public.set_updated_at();

drop policy if exists "Allow anon full access to ai_detections" on public.ai_detections;
create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()::text
      and profiles.role = 'admin'
  );
$$;

drop policy if exists "Admins can manage ai_detections" on public.ai_detections;
create policy "Admins can manage ai_detections"
on public.ai_detections for all
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());
