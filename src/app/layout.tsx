import type { Metadata, Viewport } from "next";
import { DADOS_ESTRUTURADOS, DESCRICAO, INDEXAVEL, metadados, NOME, SITE_URL } from "@/lib/seo";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import Rodape from "@/components/Rodape";
import "./globals.css";

// Exo 2 é a fonte da nova identidade (manual Rebranding 2025)
const exo2 = localFont({
  variable: "--font-exo",
  src: "./fonts/exo2-variavel.woff2",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${NOME} · Seu imóvel pronto para performar`, template: `%s · ${NOME}` },
  description: DESCRICAO,
  applicationName: NOME,
  keywords: [
    "Lofteria",
    "apartamento decorado",
    "design de interiores Florianópolis",
    "short-stay",
    "Airbnb Florianópolis",
    "locação por temporada",
    "reforma de apartamento",
    "decorado para construtoras",
  ],
  authors: [{ name: NOME }],
  creator: NOME,
  formatDetection: { telephone: false },
  robots: INDEXAVEL ? { index: true, follow: true } : { index: false, follow: false },
  ...metadados({ descricao: DESCRICAO, caminho: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${exo2.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DADOS_ESTRUTURADOS).replace(/</g, "\\u003c") }}
        />
        <SmoothScroll />
        {children}
        <Rodape />
      </body>
    </html>
  );
}
