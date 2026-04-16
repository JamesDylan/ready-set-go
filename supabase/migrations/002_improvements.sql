-- Migration 002: Improvements
-- Fixes avatar_type comment, adds missing index, adds app_version column, adds streak_history table

-- Fix avatar_type comment (axolotl -> dragon)
comment on column children.avatar_type is '''car'' | ''unicorn'' | ''dragon''';

-- Add missing composite index for the common query: completions by child and date
create index if not exists task_completions_child_date_idx
  on task_completions (child_id, completed_on);

-- Add app_version column to families for forward-compatible migrations
alter table families
  add column if not exists app_version text not null default '1.0';

-- Streak history table: records each time a child achieves a full-phase streak
-- Supports future leaderboard / achievement history feature
create table if not exists streak_history (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null,
  phase text not null check (phase in ('morning', 'evening')),
  streak_count integer not null,          -- streak length at time of achievement
  achieved_on date not null default current_date,
  recorded_at timestamptz default now()
);

-- Enable RLS on streak_history
alter table streak_history enable row level security;

-- RLS: same ownership chain as task_completions (child -> family -> owner)
create policy "streak_history_family_owner" on streak_history
  using (child_id in (
    select c.id from children c
    join families f on f.id = c.family_id
    where f.owner_id = auth.uid()
  ))
  with check (child_id in (
    select c.id from children c
    join families f on f.id = c.family_id
    where f.owner_id = auth.uid()
  ));

-- Index to support per-child history lookups and leaderboard queries
create index if not exists streak_history_child_date_idx
  on streak_history (child_id, achieved_on desc);
