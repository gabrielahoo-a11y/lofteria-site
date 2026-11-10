import type { Metadata } from "next";
import { REDES } from "@/lib/navegacao";

// Endereço público do site. Defina NEXT_PUBLIC_SITE_URL com o domínio final (ex.: https://lofteria.com).
// Sem ela, usa o domínio de produção que a Vercel informa no build.
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? (vercel ? `https://${vercel}` : "http://localhost:3000")).replace(/\/$/, "");

// Enquanto o domínio final não estiver definido, o site (em *.vercel.app) não é indexado,
// para não competir com o site atual nem gerar conteúdo duplicado no Google.
export const INDEXAVEL = Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export const NOME = "Lofteria";
export const CAPA = {
  url: "/og-capa.jpg",
  width: 1200,
  height: 630,
  alt: "Lofteria: apartamento decorado em corte isométrico e o texto “Seu imóvel decorado e pronto para performar”",
};

export const DESCRICAO =
  "Projetamos, executamos e entregamos apartamentos completos em Florianópolis, prontos para render em short-stay, locação anual ou venda.";

// Metadados de cada página: título (o layout acrescenta "· Lofteria"), descrição,
// endereço canônico e os mesmos dados para o compartilhamento (Open Graph).
// A imagem de compartilhamento (1200 × 630) fica em public/og-capa.jpg.
export function metadados({ titulo, descricao, caminho }: { titulo?: string; descricao: string; caminho: string }): Metadata {
  const tituloCompleto = titulo ? `${titulo} · ${NOME}` : `${NOME} · Seu imóvel pronto para performar`;
  return {
    ...(titulo ? { title: titulo } : {}),
    description: descricao,
    alternates: { canonical: caminho },
    openGraph: {
      title: tituloCompleto,
      description: descricao,
      url: caminho,
      siteName: NOME,
      locale: "pt_BR",
      type: "website",
      images: [CAPA],
    },
    twitter: { card: "summary_large_image", title: tituloCompleto, description: descricao, images: [CAPA.url] },
  };
}

// Dados estruturados (schema.org) da empresa, para o Google entender quem é a Lofteria
export const DADOS_ESTRUTURADOS = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#empresa`,
  name: NOME,
  url: SITE_URL,
  logo: `${SITE_URL}/marca/logo-escura.svg`,
  image: `${SITE_URL}${CAPA.url}`,
  description: DESCRICAO,
  email: "marketing@lofteria.com",
  address: { "@type": "PostalAddress", addressLocality: "Florianópolis", addressRegion: "SC", addressCountry: "BR" },
  areaServed: [
    { "@type": "City", name: "Florianópolis" },
    { "@type": "State", name: "Santa Catarina" },
  ],
  sameAs: REDES.map((r) => r.href),
  knowsAbout: ["Design de interiores", "Short-stay", "Locação por temporada", "Reforma de apartamentos", "Automação residencial"],
};
