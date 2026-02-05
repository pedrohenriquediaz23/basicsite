-- 1. Adiciona a coluna de senha na tabela profiles
-- NOTA: Armazenar senhas em texto puro não é recomendado por segurança, 
-- mas foi adicionado conforme solicitado.
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password text;

-- 2. Atualiza a função para salvar a senha também
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, phone, cpf, is_admin, password)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'cpf',
    coalesce((new.raw_user_meta_data->>'isAdmin')::boolean, false),
    new.raw_user_meta_data->>'password'
  )
  on conflict (id) do update set
    email = excluded.email,
    username = excluded.username,
    phone = excluded.phone,
    cpf = excluded.cpf,
    is_admin = excluded.is_admin,
    password = excluded.password;
  return new;
end;
$$ language plpgsql security definer;

-- 3. Atualiza usuários existentes (se tiverem a senha no metadata)
UPDATE public.profiles
SET password = auth.users.raw_user_meta_data->>'password'
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND auth.users.raw_user_meta_data->>'password' IS NOT NULL;
