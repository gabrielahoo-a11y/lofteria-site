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
