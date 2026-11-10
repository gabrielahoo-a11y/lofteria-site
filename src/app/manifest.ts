import type { MetadataRoute } from "next";
import { DESCRICAO, NOME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NOME,
    short_name: NOME,
    description: DESCRICAO,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c2227",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
