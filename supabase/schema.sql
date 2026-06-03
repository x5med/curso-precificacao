-- Tabela de leads do formulario de inscricao da landing (Trilha X5 Med).
-- Rode este SQL no SQL Editor do seu projeto Supabase.

create table if not exists public.inscricoes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  phone       text not null,
  email       text not null,
  source      text default 'landing-trilha-x5med'
);

-- RLS habilitado e SEM politicas publicas de proposito:
-- a gravacao acontece pela Server Action usando a service role key,
-- que roda apenas no servidor e ignora o RLS. Assim o cliente (navegador)
-- nunca tem acesso direto a esta tabela.
alter table public.inscricoes enable row level security;
