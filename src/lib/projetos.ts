// Projetos do "Onde atuamos" do site atual (nome, tipologia e foto de cada um).
// As fotos estão em public/img/projetos e vieram do site, com no máximo 1600 px.

export type Projeto = {
  slug: string;
  nome: string;
  tipologia: string;
  tipo: "studio" | "1d" | "2d" | "3d" | "spot";
  local: string;
};

export const PROJETOS: Projeto[] = [
  { slug: "sunset-213", nome: "Sunset 213", tipologia: "Loft", tipo: "studio", local: "Florianópolis · Lagoa da Conceição" },
  { slug: "emanoel-peluso-1101", nome: "Emanoel Peluso 1101", tipologia: "4 dormitórios", tipo: "3d", local: "Florianópolis" },
  { slug: "esquina-copenhagen-206", nome: "Esquina Copenhagen 206", tipologia: "Studio", tipo: "studio", local: "Florianópolis" },
  { slug: "spot-215-301", nome: "Spot 215 · 301", tipologia: "Spot", tipo: "spot", local: "Florianópolis" },
  { slug: "lago-di-garda-201", nome: "Lago di Garda 201", tipologia: "2 dormitórios", tipo: "2d", local: "Florianópolis" },
  { slug: "plenty-sea", nome: "Plenty Sea", tipologia: "2 dormitórios", tipo: "2d", local: "Florianópolis" },
  { slug: "lago-di-garda-07", nome: "Lago di Garda 07", tipologia: "Loft", tipo: "studio", local: "Florianópolis" },
  { slug: "swami-beach-316", nome: "Swami Beach 316", tipologia: "2 dormitórios", tipo: "2d", local: "Florianópolis" },
  { slug: "villa-de-algarve-301", nome: "Villa de Algarve 301", tipologia: "2 dormitórios", tipo: "2d", local: "Florianópolis" },
  { slug: "smart-living-604", nome: "Smart Living 604", tipologia: "2 dormitórios", tipo: "2d", local: "Florianópolis" },
  { slug: "icon-home-design", nome: "Icon Home Design", tipologia: "1 dormitório", tipo: "1d", local: "Florianópolis" },
  { slug: "life-residence-606", nome: "Life Residence 606", tipologia: "Studio", tipo: "studio", local: "Florianópolis" },
  { slug: "penha-spot", nome: "Penha Spot", tipologia: "Spot", tipo: "spot", local: "Penha" },
  { slug: "spot-215-202", nome: "Spot 215 · 202", tipologia: "Spot", tipo: "spot", local: "Florianópolis" },
];

// Os cinco com as fotos mais fortes, para o portfólio grande da home
// (a Esquina Copenhagen fica de fora porque ilustra o estilo Eco na mesma página)
export const DESTAQUES = ["sunset-213", "emanoel-peluso-1101", "spot-215-301", "lago-di-garda-201", "plenty-sea"].map(
  (slug) => PROJETOS.find((p) => p.slug === slug)!,
);

export const foto = (p: Projeto) => `/img/projetos/${p.slug}.jpg`;
