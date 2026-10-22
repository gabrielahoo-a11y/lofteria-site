-- Tabela de leads do site (simulador e formulário de contato).
-- O site grava com a chave publicável: a política só permite INSERT,
-- então ninguém consegue ler os leads pelo site. A leitura é pelo painel do Supabase.

create table if not exists public.leads (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  mensagem text,
  origem text not null default 'site',
  simulacao jsonb
);

alter table public.leads enable row level security;

create policy "site pode inserir leads"
  on public.leads for insert
  to anon
  with check (true);
