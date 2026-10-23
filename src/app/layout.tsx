import type { Metadata } from "next";
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

const DESCRICAO =
  "Projetamos, executamos e entregamos apartamentos completos, prontos para render em short-stay, locação anual ou venda.";

export const metadata: Metadata = {
  title: "Lofteria · Seu imóvel pronto para performar",
  description: DESCRICAO,
  openGraph: {
    title: "Lofteria · Seu imóvel pronto para performar",
    description: DESCRICAO,
    siteName: "Lofteria",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${exo2.variable} antialiased`}>
      <body>
        <SmoothScroll />
        {children}
        <Rodape />
      </body>
    </html>
  );
}
