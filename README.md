# Lofteria · site institucional

Novo site da Lofteria com a identidade do Rebranding 2025: Exo 2, salmão `#E46F6B`, grafite `#323C44`, azul petróleo `#0F6073`.

- **Next.js 16** (App Router) + **Tailwind 4**
- **GSAP** (ScrollTrigger + SplitText) para as animações e **Lenis** para a rolagem suave
- **Supabase** para guardar os leads do simulador e do formulário de contato

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Páginas

| Rota | Conteúdo |
|---|---|
| `/` | Home: abertura com o isométrico, quem somos, solução + estilos, portfólio, números, depoimentos, parceiros |
| `/investidor` | Pilares, comparativo com/sem Lofteria, **simulador**, números, depoimentos |
| `/morador` | O que cuidamos, etapas, estilos, depoimentos |
| `/construtoras` | Tecnologia/design/processos, etapas, números, estilos |
| `/projetos` | Lista do "Onde atuamos" com filtro por tipologia + projetos em destaque |
| `/sobre` | Estrutura da página About da Avenlo: título + galeria curva, quem somos, cartões de prova, jornada fixa, o que fazemos, valores em carrossel, depoimentos, chamada final |
| `/contato` | Estrutura da página de contato da Avenlo: título, cartão com os dados + formulário (com assunto), chamada final |
| `/orcamento` | Ferramenta de orçamento: o cliente envia a planta, a IA lê os cômodos e ele recebe o orçamento para mobiliar, com PDF |

O menu e o rodapé leem as páginas de `src/lib/navegacao.ts`.

## Estrutura da home

| Seção | Arquivo |
|---|---|
| Menu (topo + pílula flutuante) | `src/components/Menu.tsx` |
| Abertura + foto que expande | `src/components/Abertura.tsx` |
| Manifesto (texto que acende na rolagem) | `src/components/Manifesto.tsx` |
| Solução (etapas numeradas) | `src/components/Solucao.tsx` |
| Números | `src/components/Numeros.tsx` |
| Simulador de investimento | `src/components/Calculadora.tsx` |
| Projetos (cartões empilhados) | `src/components/Projetos.tsx` |
| Estilos Urban / Eco / Slim | `src/components/Estilos.tsx` |
| Depoimentos | `src/components/Depoimentos.tsx` |
| Contato + rodapé | `src/components/Contato.tsx` |

As animações respeitam `prefers-reduced-motion`: quem pede menos movimento vê o site estático.

## Simulador: trocar os números ANTES de publicar

Todos os parâmetros ficam em `src/lib/calculadora.ts`, e **hoje são provisórios**:

- `ESTILOS[].custoM2`: custo da montagem por m² em cada estilo
- `REGIOES[]`: fator de diária e ocupação média de cada região
- `TIPOLOGIAS[]`: área padrão e diária base de cada tipologia
- `PARAMETROS`: taxas de gestão e de plataforma, custo fixo, aluguel anual, valorização e prazos

## Leads (Supabase)

1. Rode `supabase/leads.sql` no SQL Editor do projeto Supabase. Ele cria a tabela `leads`, e a política só permite inserir.
2. Configure as variáveis de ambiente (na Vercel e em `.env.local`):

```
SUPABASE_URL=https://<projeto>.supabase.co
SUPABASE_PUBLISHABLE_KEY=<chave publicável>
```

Sem essas variáveis, `/api/leads` responde 503 e os formulários mostram uma mensagem de erro.

## Fotos

As fotos em `public/img` vieram do site atual (lofteria.com.br). Algumas (`swami-beach`, `lago-di-garda`, `vila-algarve`, `eco-jantar`, `jantar-pendente`) estão em 768 px e precisam ser trocadas pelas originais em alta resolução.

## Orçamento pela planta (`/orcamento`)

Código em `src/components/orcamento/` e `src/lib/orcamento/`. Três rotas no servidor:

| Rota | O que faz | Precisa de |
|---|---|---|
| `/api/orcamento-base` | Entrega o orçamento-base de uma tipologia | `SUPABASE_URL` + `SUPABASE_SECRET_KEY` |
| `/api/ler-planta` | Lê a planta com o Claude (limite de 10 leituras por hora por IP) | `ANTHROPIC_API_KEY` |
| `/api/leads` | Grava o pedido na tabela `leads`, com `origem = 'orcamento'` e o resumo em `simulacao` | já configurado acima |

**Os valores dos orçamentos-base não ficam neste repositório** (ele é público). Para ligar:

1. Rode `supabase/orcamento_base.sql` no SQL Editor do Supabase (cria a tabela, sem acesso público).
2. Rode o arquivo de carga com os valores, que a equipe guarda fora do GitHub.
3. Configure `SUPABASE_SECRET_KEY` (chave secreta do Supabase) e `ANTHROPIC_API_KEY` na Vercel.

Sem a tabela, a página abre, mas o resultado mostra "Não conseguimos calcular agora". Sem a chave do Claude, a leitura
automática fica fora do ar e o cliente pode usar a planta de exemplo. Em desenvolvimento, sem Supabase, a rota lê
`dados-privados/orcamento-base.json` (pasta ignorada pelo git).
