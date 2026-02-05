-- RODE ISSO NO SQL EDITOR DO SUPABASE
-- Isso vai criar a coluna que está faltando para o código de verificação

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_code TEXT;

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT TRUE;

-- Garante que o usuário do backend pode editar essa coluna
GRANT UPDATE ON TABLE public.profiles TO service_role;
