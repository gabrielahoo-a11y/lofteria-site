-- Orçamentos-base da ferramenta de orçamento (/orcamento), um registro por tipologia.
-- Os VALORES não ficam no repositório (ele é público). Depois de criar a tabela, rode o
-- arquivo de carga com os valores, que a equipe guarda fora do GitHub.
--
-- Sem nenhuma política de acesso: com RLS ligado, só a chave secreta (SUPABASE_SECRET_KEY,
-- usada pela rota /api/orcamento-base no servidor) consegue ler. A chave publicável não lê.

create table if not exists public.orcamento_base (
  tipologia text primary key check (tipologia in ('Spot', 'Studio', 'Loft', '1D', '2D', '3D', '4D')),
  area_ref numeric not null,          -- área de referência do orçamento-base, em m²
  categorias jsonb not null,          -- {"Móveis Planejados": {"Basic": 0, "Essential": 0, "Design": 0}, ...}
  ambientes jsonb not null,           -- {"Cozinha": {"Basic": 0, ...}, "Geral": {...}, ...}
  atualizado_em timestamptz not null default now()
);

alter table public.orcamento_base enable row level security;
