/**
 * Idiomas disponíveis no Money Path (Etapa 29).
 * Separado de `settings-page.ts` para poder ser importado no cliente
 * sem arrastar dependências de banco de dados (pg, drizzle).
 */
export const ACTIVE_LANGUAGES = ["pt-BR", "es-MX"] as const;
export const FUTURE_LANGUAGES = ["en-US"] as const;

export type ActiveLanguage = (typeof ACTIVE_LANGUAGES)[number];
