"use client";

import type { Comodo } from "@/lib/orcamento/modelo";
import type { TipoComodo } from "@/lib/orcamento/leitura";

/** Cor de cada tipo de cômodo na planta remontada. */
const COR: Record<TipoComodo, string> = {
  living: "#dcecef",
  cozinha: "#e9f2f4",
  integrado: "#dcecef",
  estudio: "#dcecef",
  dormitorio: "#fbe4e3",
  suite: "#fbe4e3",
  banheiro: "#d5e6ea",
  lavabo: "#d5e6ea",
  lavanderia: "#e3edf0",
  sacada: "#f4efe6",
  circulacao: "#eef1f3",
  outro: "#eef1f3",
};

const fmtArea = (c: Comodo) => `${c.areaEstimada ? "≈ " : ""}${c.area.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m²`;

/** Altura extra (em unidades do desenho) da faixa de cômodos adicionados à mão, que não têm posição na planta. */
const faixaExtras = (comodos: Comodo[], W: number, H: number) => (comodos.some((c) => !c.ret) ? Math.max(W, H) * 0.24 : 0);

/** Proporção do desenho completo (planta + faixa de cômodos adicionados), para o contêiner da página. */
export function proporcaoDoDesenho(comodos: Comodo[], proporcao: number) {
  const W = 1000;
  const H = Math.round(W / proporcao);
  return W / (H + faixaExtras(comodos, W, H));
}

/**
  Planta simplificada, remontada a partir da leitura: cada cômodo é um retângulo
  na mesma posição da planta original. Tocar num cômodo inclui ou tira do orçamento.
*/
export function PlantaInterativa({
  comodos,
  proporcao = 4 / 3,
  onAlternar,
}: {
  comodos: Comodo[];
  proporcao?: number;
  onAlternar: (id: string) => void;
}) {
  const W = 1000;
  const H = Math.round(W / proporcao);
  const pad = 14;
  const desenhaveis = comodos.filter((c) => c.ret);
  const extras = comodos.filter((c) => !c.ret);
  const HF = faixaExtras(comodos, W, H);
  const k = Math.max(W, H) / 1000;
  // Cômodos adicionados: retângulos lado a lado numa faixa abaixo da planta
  const faixa = extras.map((c, i) => {
    const gap = 16 * k;
    const larg = Math.min(W * 0.32, (W - gap * (extras.length - 1)) / extras.length);
    return { ...c, ret: { x: (i * (larg + gap)) / W, y: (H + 56 * k) / H, w: larg / W, h: (HF - 64 * k) / H } };
  });

  return (
    <svg viewBox={`${-pad} ${-pad} ${W + 2 * pad} ${H + HF + 2 * pad}`} className="h-full w-full" role="img" aria-label="Planta remontada">
      <defs>
        <pattern id="hachura-sacada" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="14" height="14" fill="#f4efe6" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#e3d9c6" strokeWidth="5" />
        </pattern>
      </defs>
      {extras.length > 0 && (
        <text x={0} y={H + 40 * k} fontSize={22 * k} fontWeight={600} fill="var(--grafite-suave)">
          Adicionados por você · fora do desenho
        </text>
      )}
      {[...desenhaveis, ...faixa].map((c) => {
        const r = c.ret!;
        const x = r.x * W, y = r.y * H, w = r.w * W, h = r.h * H;
        const menor = Math.min(w, h);
        const adicionado = !comodos.find((o) => o.id === c.id)?.ret;
        const fs = Math.max(13 * k, Math.min(28 * k, menor / 5.5, (w / Math.max(c.nome.length, 4)) * 1.7));
        const mostraArea = h > fs * 3 && w > fs * 3.5;
        const fill = !c.mobiliar ? "#ffffff" : c.tipo === "sacada" ? "url(#hachura-sacada)" : COR[c.tipo];
        return (
          <g
            key={c.id}
            onClick={() => onAlternar(c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAlternar(c.id);
              }
            }}
            tabIndex={0}
            className="cursor-pointer outline-none focus-visible:[&>rect]:stroke-[var(--salmao)]"
            role="button"
            aria-pressed={c.mobiliar}
            aria-label={`${c.nome}, ${fmtArea(c)}${c.mobiliar ? ", incluído" : ", fora do orçamento"}`}
          >
            <rect
              x={x + 3}
              y={y + 3}
              width={Math.max(w - 6, 4)}
              height={Math.max(h - 6, 4)}
              rx={8}
              fill={fill}
              stroke={c.mobiliar ? "var(--grafite)" : "var(--grafite-suave)"}
              strokeWidth={(c.mobiliar ? 4 : 2.5) * Math.max(1, H / W)}
              strokeDasharray={!c.mobiliar ? "12 9" : adicionado ? "4 6" : undefined}
              className="transition-opacity hover:opacity-80"
            />
            <text
              x={x + w / 2}
              y={y + h / 2 + (mostraArea ? -fs * 0.2 : fs * 0.35)}
              textAnchor="middle"
              fontSize={fs}
              fontWeight={600}
              fill={c.mobiliar ? "var(--grafite)" : "var(--grafite-suave)"}
              style={{ pointerEvents: "none" }}
            >
              {c.nome}
            </text>
            {mostraArea && (
              <text x={x + w / 2} y={y + h / 2 + fs * 1.05} textAnchor="middle" fontSize={fs * 0.82} fill="var(--grafite-suave)" style={{ pointerEvents: "none" }}>
                {fmtArea(c)}
              </text>
            )}
          </g>
        );
      })}
      <rect x={0} y={0} width={W} height={H} rx={10} fill="none" stroke="var(--grafite)" strokeWidth={7} pointerEvents="none" />
    </svg>
  );
}
