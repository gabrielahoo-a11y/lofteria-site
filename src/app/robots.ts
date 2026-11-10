import type { MetadataRoute } from "next";
import { INDEXAVEL, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXAVEL) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
