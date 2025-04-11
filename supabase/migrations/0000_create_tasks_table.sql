
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  text text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  position integer not null default 0
);

-- Enable RLS
alter table tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks" on tasks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" on tasks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" on tasks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" on tasks
  for delete using (auth.uid() = user_id);