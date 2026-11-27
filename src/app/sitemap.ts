import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * sitemap.xml (Etapa 27 — producción).
 * Solo rutas públicas y con contenido real; nada de rutas autenticadas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/precios`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/legal/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/legal/terminos`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
