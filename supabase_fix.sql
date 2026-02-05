-- Tenta corrigir as permissões do esquema public para o usuário do dashboard (postgres)
GRANT USAGE, CREATE ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO service_role;

-- Se o usuário do dashboard for diferente (dashboard_user), tenta garantir também
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dashboard_user') THEN
    GRANT ALL ON SCHEMA public TO dashboard_user;
  END IF;
END
$$;

-- 1. Cria a tabela de perfis (profiles) se não existir
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text,
  phone text,
  cpf text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilita segurança (RLS)
alter table public.profiles enable row level security;

-- Remove policies antigas se existirem para evitar erro de duplicidade
drop policy if exists "Perfis públicos são visíveis por todos" on public.profiles;
drop policy if exists "Usuários podem inserir seu próprio perfil" on public.profiles;
drop policy if exists "Usuários podem atualizar seu próprio perfil" on public.profiles;

create policy "Perfis públicos são visíveis por todos" on public.profiles
  for select using (true);

create policy "Usuários podem inserir seu próprio perfil" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Usuários podem atualizar seu próprio perfil" on public.profiles
  for update using (auth.uid() = id);

-- 3. Função para copiar automaticamente novos usuários
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, phone, cpf, is_admin)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'cpf',
    coalesce((new.raw_user_meta_data->>'isAdmin')::boolean, false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- 4. Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Copiar usuários existentes
insert into public.profiles (id, email, username, phone, cpf, is_admin)
select 
  id, 
  email, 
  raw_user_meta_data->>'name', 
  raw_user_meta_data->>'phone', 
  raw_user_meta_data->>'cpf',
  coalesce((raw_user_meta_data->>'isAdmin')::boolean, false)
from auth.users
where id not in (select id from public.profiles);
