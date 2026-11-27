/**
 * Configuración central de regiones, idiomas y monedas de Money Path.
 *
 * El producto se lanza para México (es-MX / MXN), pero toda la estructura
 * está preparada para incorporar otros países de LATAM y sus monedas sin
 * tocar el resto del código: basta con ampliar las uniones de tipos y los
 * registros `LOCALES` / `CURRENCIES`.
 */

/*
 * Idiomas soportados (Etapa 29 — localización pt-BR).
 * `es-MX` sigue siendo el locale base del producto; `pt-BR` es la
 * localización completa para Brasil. Ampliar aquí habilita más idiomas.
 */
export type LocaleCode = "es-MX" | "pt-BR";

/**
 * Moedas soportadas. MXN es la inicial; las demás quedan registradas para
 * la expansión LATAM (el catálogo en base de datos, tabla `currencies`,
 * refleja exactamente esta lista).
 */
export type CurrencyCode = "MXN" | "BRL" | "COP" | "CLP" | "ARS" | "PEN" | "USD";

export interface CurrencyConfig {
  /** Código ISO 4217. */
  code: CurrencyCode;
  /** Cantidad de decimales de la moneda (para MXN: 2 → centavos). */
  decimals: number;
  /** Símbolo monetario para contextos compactos. */
  symbol: string;
  /** Nombre legible de la moneda. */
  label: string;
}

export interface LocaleConfig {
  code: LocaleCode;
  /** Idioma ISO 639-1. */
  language: string;
  /** País ISO 3166-1 alpha-2. */
  country: string;
  /** Nombre legible del locale. */
  label: string;
  /** Moneda base del locale. */
  currency: CurrencyCode;
  /** Indica si es el locale inicial del producto. */
  isDefault: boolean;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  MXN: {
    code: "MXN",
    decimals: 2,
    symbol: "$",
    label: "Peso mexicano",
  },
  BRL: {
    code: "BRL",
    decimals: 2,
    symbol: "R$",
    label: "Real brasileño",
  },
  COP: {
    code: "COP",
    decimals: 0,
    symbol: "$",
    label: "Peso colombiano",
  },
  CLP: {
    code: "CLP",
    decimals: 0,
    symbol: "$",
    label: "Peso chileno",
  },
  ARS: {
    code: "ARS",
    decimals: 2,
    symbol: "$",
    label: "Peso argentino",
  },
  PEN: {
    code: "PEN",
    decimals: 2,
    symbol: "S/",
    label: "Sol peruano",
  },
  USD: {
    code: "USD",
    decimals: 2,
    symbol: "US$",
    label: "Dólar estadounidense",
  },
};

export const LOCALES: Record<LocaleCode, LocaleConfig> = {
  "es-MX": {
    code: "es-MX",
    language: "es",
    country: "MX",
    label: "Español (México)",
    currency: "MXN",
    isDefault: true,
  },
  "pt-BR": {
    code: "pt-BR",
    language: "pt",
    country: "BR",
    label: "Português (Brasil)",
    currency: "BRL",
    isDefault: false,
  },
};

/**
 * Mapeo de cabecera `Accept-Language` → locale del producto.
 * Un visitante brasileiro (o un navegador en portugués) llega a la
 * localización correcta sin tener que cambiar nada a mano.
 */
const ACCEPT_LANGUAGE_MAP: Record<string, LocaleCode> = {
  pt: "pt-BR",
  "pt-br": "pt-BR",
  "pt-pt": "pt-BR",
  es: "es-MX",
  "es-mx": "es-MX",
};

/** Deriva el locale del navegador a partir de `Accept-Language`. */
export function localeFromAcceptLanguage(header: string | null | undefined): LocaleCode | null {
  if (!header) return null;
  for (const part of header.split(",")) {
    const code = part.split(";")[0]?.trim().toLowerCase();
    if (!code) continue;
    const mapped = ACCEPT_LANGUAGE_MAP[code];
    if (mapped) return mapped;
    // "pt-BR" completo o prefijo de idioma ("pt", "es")
    const prefix = code.split("-")[0];
    const byPrefix = ACCEPT_LANGUAGE_MAP[prefix];
    if (byPrefix) return byPrefix;
  }
  return null;
}

/** Locale por defecto del producto (origen de México). */
export const DEFAULT_LOCALE: LocaleCode = "es-MX";

/** País → locale sugerido en el onboarding. */
export function localeForCountry(country: string): LocaleCode {
  return country === "BR" ? "pt-BR" : "es-MX";
}

/** País → moneda sugerida en el onboarding. */
export function currencyForCountry(country: string): CurrencyCode {
  return country === "BR" ? "BRL" : "MXN";
}
export const DEFAULT_CURRENCY: CurrencyCode = "MXN";

export function isLocaleCode(value: string): value is LocaleCode {
  return value in LOCALES;
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}

export function getLocaleConfig(code: LocaleCode = DEFAULT_LOCALE): LocaleConfig {
  return LOCALES[code] ?? LOCALES[DEFAULT_LOCALE];
}

export function getCurrencyConfig(code: CurrencyCode = DEFAULT_CURRENCY): CurrencyConfig {
  return CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
}
