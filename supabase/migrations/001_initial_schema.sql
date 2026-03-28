-- families table
create table families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users not null,
  pin_hash text not null default '$2a$10$placeholder', -- bcrypt of '1234' should be set at onboarding
  created_at timestamptz default now()
);

-- children table
create table children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid references families on delete cascade not null,
  name text not null,
  age smallint,
  avatar_type text not null default 'unicorn', -- 'car' | 'unicorn' | 'axolotl'
  colour text not null default 'harriet',
  morning_target time not null default '08:45',
  evening_target time not null default '20:00',
  streak integer not null default 0,
  sort_order smallint not null default 0,
  created_at timestamptz default now()
);

-- tasks table (definitions, not completions)
create table tasks (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references children on delete cascade not null,
  phase text not null check (phase in ('morning', 'evening')),
  label text not null,
  icon text not null default '⭐',
  sort_order smallint not null default 0,
  created_at timestamptz default now()
);

-- task_completions table (one row per task per day when done)
create table task_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks on delete cascade not null,
  child_id uuid references children not null, -- denormalized for easier RLS
  completed_on date not null default current_date,
  completed_at timestamptz default now(),
  unique(task_id, completed_on) -- one completion per task per day
);

-- Enable RLS on all tables
alter table families enable row level security;
alter table children enable row level security;
alter table tasks enable row level security;
alter table task_completions enable row level security;

-- Families: owner can do everything
create policy "families_owner" on families
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Children: only accessible through family ownership
create policy "children_family_owner" on children
  using (family_id in (select id from families where owner_id = auth.uid()))
  with check (family_id in (select id from families where owner_id = auth.uid()));

-- Tasks: only accessible through child → family → owner
create policy "tasks_family_owner" on tasks
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

-- Task completions: same chain
create policy "completions_family_owner" on task_completions
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
