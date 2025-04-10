
create table if not exists todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table todos enable row level security;

create policy "Users can view their own todos" on todos
  for select using (auth.uid() = user_id);

create policy "Users can create their own todos" on todos
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own todos" on todos
  for update using (auth.uid() = user_id);

create policy "Users can delete their own todos" on todos
  for delete using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger todos_updated_at
  before update on todos
  for each row
  execute procedure handle_updated_at();