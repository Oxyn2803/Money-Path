/**
 * Capa de internacionalización de Money Path (Etapa 29 — pt-BR).
 *
 * Arquitetura:
 * - **Servidor**: `await getDictionary()` resolve o locale via cookie → Accept-Language → base.
 * - **Cliente**: re-exporta do arquivo `client.tsx` que contém o `createContext`.
 *   Assim o servidor nunca importa APIs de React que só existem no cliente.
 */

import type { LocaleCode } from "@/config/locales";
import {
  DEFAULT_LOCALE,
  isLocaleCode,
  localeFromAcceptLanguage,
} from "@/config/locales";
import { esMX } from "./dictionaries/es-MX";
import { ptBR } from "./dictionaries/pt-BR";

/**
 * Forma do dicionário: recursiva, com as folhas como `string`.
 * Exige estrutura idêntica mas admite textos distintos entre locales.
 */
type DeepDictionary<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepDictionary<U>[]
    : T extends object
      ? { readonly [K in keyof T]: DeepDictionary<T[K]> }
      : T;

export type Dictionary = DeepDictionary<typeof esMX>;
export { billingDictionary } from "./dictionaries/billing";

/** Cookie usada como fuente de verdad del render. */
export const LOCALE_COOKIE = "mp_locale";

/** Re-exporta primitivas de cliente (LocaleProvider, useDictionary, useLocale) */
export { LocaleProvider, useDictionary, useLocale } from "./client";

const dictionaries: Record<LocaleCode, Dictionary> = {
  "es-MX": esMX,
  "pt-BR": ptBR,
};

/* ── Resolução no servidor ──────────────────────────────────────────── */

export async function resolveLocale(): Promise<LocaleCode> {
  try {
    const { cookies, headers } = await import("next/headers");
    const jar = await cookies();
    const fromCookie = jar.get(LOCALE_COOKIE)?.value;
    if (fromCookie && isLocaleCode(fromCookie)) return fromCookie;

    const requestHeaders = await headers();
    const fromHeader = localeFromAcceptLanguage(requestHeaders.get("accept-language"));
    if (fromHeader) return fromHeader;
  } catch {
    // Fora de um request (scripts, tests): locale base.
  }
  return DEFAULT_LOCALE;
}

export async function getDictionary(locale?: string | null): Promise<Dictionary> {
  const code = locale ?? (await resolveLocale());
  return dictionaries[isLocaleCode(code) ? code : DEFAULT_LOCALE];
}

export async function setLocaleCookie(locale: LocaleCode): Promise<void> {
  try {
    const { cookies } = await import("next/headers");
    const jar = await cookies();
    jar.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  } catch {
    // Contexto sem cookies: a preferência fica em `profiles.locale`.
  }
}

export function translate(dict: Dictionary, path: string): string {
  let node: unknown = dict;
  for (const part of path.split(".")) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return path;
    }
  }
  return typeof node === "string" ? node : path;
}
