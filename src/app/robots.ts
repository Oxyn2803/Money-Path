import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * robots.txt (Etapa 27 — producción).
 *
 * - El sitio público (`/`, `/precios`, `/legal/*`) es indexable.
 * - El aplicativo (`/app/*`), el design system y las APIs quedan fuera del
 *   rastreo: son rutas autenticadas o internas, no contenido público.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/api/", "/design", "/login", "/register", "/onboarding", "/reset-password", "/forgot-password"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
