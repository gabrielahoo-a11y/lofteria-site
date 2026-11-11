import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 75 é o padrão; 85 é usado nas fotos grandes (capas, galerias e fotos de fundo)
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
