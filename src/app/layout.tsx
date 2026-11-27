import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { SEO_BY_LOCALE, siteName, siteUrl } from "@/lib/site";
import { DEFAULT_LOCALE } from "@/config/locales";
import { LocaleProvider, resolveLocale } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/*
 * Metadatos globales (Etapa 27 — producción).
 *
 * - `metadataBase` hace absolutas las URLs de OG/Twitter/sinónimos; sin él,
 *   los rastreadores reciben rutas relativas y no muestran la preview.
 * - `openGraph`/`twitter` alimentan la vista previa al compartir en WhatsApp,
 *   Slack y redes; la imagen se genera en `opengraph-image.tsx`.
 * - `robots` + `sitemap` se sirven desde `src/app/robots.ts` y `sitemap.ts`.
 * - Las rutas autenticadas añaden `robots: { index: false }` en su propio
 *   layout (no se indexa contenido privado).
 */
export async function generateMetadata(): Promise<Metadata> {
  /*
   * Etapa 29: título, descrição y keywords salen del locale activo (cookie →
   * Accept-Language → base). El SEO de Brasil no es una traducción literal
   * del mexicano: usa el vocabulário de busca local.
   */
  const locale = await resolveLocale();
  const seo = SEO_BY_LOCALE[locale] ?? SEO_BY_LOCALE[DEFAULT_LOCALE];

  return {
    metadataBase: new URL(siteUrl),
    title: seo.title,
    description: seo.description,
    applicationName: siteName,
    keywords: seo.keywords,
    authors: [{ name: siteName }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: locale === "pt-BR" ? "pt_BR" : "es_MX",
      url: siteUrl,
      siteName,
      title: seo.title,
      description: seo.description,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    robots: { index: true, follow: true },
    icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
  };
}

/*
 * Viewport (Etapa 24 — auditoría de responsividad).
 *
 * **BUG CRÍTICO corregido:** la aplicación no declaraba ningún meta viewport,
 * por lo que iPhone/Android renderizaban a ~980 px lógicos y escalaban la
 * página hacia abajo. Todo el CSS mobile-first (bottom nav, columnas apiladas)
 * nunca llegaba a activarse: el usuario veía una versión encogida del sitio
 * de escritorio y con texto ilegible.
 *
 * - `viewport-fit=cover` es lo que hace que `env(safe-area-inset-*)` devuelva
 *   valores reales en iPhone con notch/Dynamic Island; sin él, la barra
 *   inferior y los bottom-sheets quedan tapados por el indicador de inicio.
 * - No se fija `maximum-scale`: impedir el zoom sería una barrera de
 *   accesibilidad (WCAG 1.4.4).
 * - `themeColor` pinta el área del navegador del mismo color que la superficie.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /* dark mode — fundo #101210 conforme referência */
  themeColor: "#101210",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  /*
   * Etapa 29: el locale se resuelve una vez en el servidor (cookie de
   * render → Accept-Language → base) y se entrega a los componentes de
   * cliente vía `LocaleProvider`, para que SSR e hidratación hablen el
   * mismo idioma. `html lang` queda en el idioma correcto (accesibilidad
   * y SEO).
   */
  const locale = await resolveLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          <ToastProvider>{children}</ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
