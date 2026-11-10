import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PAGINAS: { caminho: string; prioridade: number }[] = [
  { caminho: "", prioridade: 1 },
  { caminho: "/investidor", prioridade: 0.9 },
  { caminho: "/morador", prioridade: 0.8 },
  { caminho: "/construtoras", prioridade: 0.8 },
  { caminho: "/projetos", prioridade: 0.7 },
  { caminho: "/sobre", prioridade: 0.6 },
  { caminho: "/contato", prioridade: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGINAS.map((p) => ({
    url: `${SITE_URL}${p.caminho}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: p.prioridade,
  }));
}
