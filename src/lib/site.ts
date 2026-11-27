/**
 * Identidad del sitio para SEO y metadatos (Etapa 27 — producción).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moneypath.mx"
).replace(/\/+$/, "");

export const siteName = "Money Path";
export const siteTitle = "Money Path — Tu dinero. Tu plan. Tu patrimonio.";
export const siteDescription =
  "No te mostramos solamente dónde está tu dinero. Te mostramos qué hacer con él. Planificación financiera personal para México.";

export interface SeoCopy {
  title: string;
  description: string;
  keywords: string[];
}

export const SEO_BY_LOCALE: Record<string, SeoCopy> = {
  "pt-BR": {
    title: "Money Path — Controle financeiro, dívidas e patrimônio pessoal",
    description:
      "Organize receitas, despesas e orçamento, saia das dívidas, monte sua reserva de emergência e acompanhe seu patrimônio. Planejamento financeiro pessoal com plano de ação.",
    keywords: [
      "organização financeira pessoal",
      "controle financeiro",
      "planejamento financeiro",
      "controle de gastos",
      "gestão de dívidas",
      "metas financeiras",
      "reserva de emergência",
      "patrimônio pessoal",
      "orçamento doméstico",
      "app de finanças",
    ],
  },
  "es-MX": {
    title: siteTitle,
    description: siteDescription,
    keywords: [
      "organización financiera personal",
      "control de gastos",
      "planificación financiera",
      "presupuesto",
      "deudas",
      "metas financieras",
      "fondo de emergencia",
      "patrimonio personal",
    ],
  },
};
