"use client";

/**
 * Primitivas de i18n do lado do CLIENTE (Etapa 29).
 * Separadas de `index.ts` para que o servidor nunca importe `createContext`.
 */

import { createContext, createElement, useContext, type ReactNode } from "react";
import type { LocaleCode } from "@/config/locales";
import { DEFAULT_LOCALE } from "@/config/locales";
import type { Dictionary } from "./index";
import { esMX } from "./dictionaries/es-MX";
import { ptBR } from "./dictionaries/pt-BR";

const dictionaries: Record<LocaleCode, Dictionary> = {
  "es-MX": esMX,
  "pt-BR": ptBR,
};

const LocaleContext = createContext<LocaleCode>(DEFAULT_LOCALE);

/** Proveedor de locale: se monta en el layout raíz con el valor del servidor. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: LocaleCode;
  children: ReactNode;
}) {
  return createElement(LocaleContext.Provider, { value: locale }, children);
}

/** Locale activo en componentes de cliente. */
export function useLocale(): LocaleCode {
  return useContext(LocaleContext);
}

/**
 * Diccionario para componentes de cliente.
 * Debe montarse dentro de `<LocaleProvider>`; si no, usa el locale base.
 */
export function useDictionary(): Dictionary {
  return dictionaries[useLocale()];
}
