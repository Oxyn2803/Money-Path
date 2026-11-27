/**
 * Verificador de localização (Etapa 29).
 *
 *   npx tsx scripts/i18n-check.ts
 *
 * 1. Compara la forma de todos los locales contra `es-MX`: reporta claves
 *    faltantes y sobrantes (evita pantallas parcialmente traducidas).
 * 2. Detecta cadenas en español dentro de `pt-BR` (fuga de idioma).
 * 3. Verifica marcadores de formato ({name}, {n}…) idénticos en ambos.
 */
export {};

import { esMX } from "../src/lib/i18n/dictionaries/es-MX";
import { ptBR } from "../src/lib/i18n/dictionaries/pt-BR";

type AnyDict = Record<string, unknown>;

const missing: string[] = [];
const extra: string[] = [];
const markerMismatch: string[] = [];

function walk(base: unknown, target: unknown, path: string, locale: string) {
  const baseIsObj = base !== null && typeof base === "object" && !Array.isArray(base);
  const tgtIsObj = target !== null && typeof target === "object" && !Array.isArray(target);

  if (Array.isArray(base) && Array.isArray(target)) {
    if (base.length !== target.length) {
      markerMismatch.push(`${locale} ${path}: array ${base.length} ≠ ${target.length}`);
    }
    base.forEach((item, i) => walk(item, target[i], `${path}[${i}]`, locale));
    return;
  }

  if (baseIsObj && tgtIsObj) {
    const baseKeys = Object.keys(base as AnyDict);
    const tgtKeys = Object.keys(target as AnyDict);
    for (const key of baseKeys) {
      if (!(key in (target as AnyDict))) missing.push(`${locale} ${path}${key}`);
      else walk((base as AnyDict)[key], (target as AnyDict)[key], `${path}${key}.`, locale);
    }
    for (const key of tgtKeys) {
      if (!(key in (base as AnyDict))) extra.push(`${locale} ${path}${key}`);
    }
    return;
  }

  if (typeof base === "string" && typeof target === "string") {
    const markers = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");
    if (markers(base) !== markers(target)) {
      markerMismatch.push(`${locale} ${path}  «${base}» ≠ «${target}»`);
    }
  }
}

/* ── 1. Estructura ─────────────────────────────────────────────────── */
walk(esMX as AnyDict, ptBR as AnyDict, "", "pt-BR");

/* ── 2. Fugas de español en pt-BR ──────────────────────────────────── */
const SPANISH_HINTS =
  /\b(el|la|los|las|del|tu|tus|un|una|y|que|para|con|por|estás|tienes|puedes|no pudimos|intentar|guardar|cancelar|eliminar|configuración|notificaciones|suscripción|deudas|gastos|ingresos|patrimonio|metas|fondo|ahorro|estimado|actual|próxima|vencimiento)\b/gi;
const ALLOWED = /^(Free|Pro|Money Path|Money AI|Money Path™)$/;

const leaks: string[] = [];
function scanLeaves(node: unknown, path: string) {
  if (typeof node === "string") {
    if (ALLOWED.test(node.trim())) return;
    // Palabras típicas del español que no existen en portugués brasileño
    const spanishOnly = /\b(estás|tienes|puedes|no pudimos|suscripción|configuración|vencimiento|tus|tú|él|ésta|éste|aún|sí|podrás|hoy|mañana)\b/i;
    const matches = node.match(spanishOnly);
    if (matches) leaks.push(`${path}: «${node.slice(0, 90)}» [${matches[0]}]`);
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => scanLeaves(item, `${path}[${i}]`));
    return;
  }
  if (node !== null && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) scanLeaves(value, `${path}${key}.`);
  }
}
scanLeaves(ptBR as AnyDict, "");

/* ── Reporte ───────────────────────────────────────────────────────── */
const total = (obj: unknown): number => {
  if (typeof obj === "string") return 1;
  if (Array.isArray(obj)) return obj.reduce((n: number, v) => n + total(v), 0);
  if (obj !== null && typeof obj === "object") {
    return Object.values(obj).reduce((n: number, v) => n + total(v), 0);
  }
  return 0;
};

console.log(`\nCadastros: es-MX=${total(esMX)} · pt-BR=${total(ptBR)}`);

if (missing.length) {
  console.log(`\n✗ CLAVES FALTANTES en pt-BR (${missing.length}):`);
  for (const m of missing.slice(0, 40)) console.log("   - " + m);
}
if (extra.length) {
  console.log(`\n✗ CLAVES SOBRANTES en pt-BR (${extra.length}):`);
  for (const m of extra.slice(0, 20)) console.log("   - " + m);
}
if (markerMismatch.length) {
  console.log(`\n✗ MARCADORES DE FORMATO DIFERENTES (${markerMismatch.length}):`);
  for (const m of markerMismatch.slice(0, 20)) console.log("   - " + m);
}
if (leaks.length) {
  console.log(`\n✗ POSIBLES FUGAS DE ESPAÑOL en pt-BR (${leaks.length}):`);
  for (const m of leaks.slice(0, 40)) console.log("   - " + m);
}

const problems = missing.length + extra.length + markerMismatch.length + leaks.length;
if (problems === 0) console.log("\n✓ estructura idéntica, marcadores correctos y sin fugas de idioma");
process.exit(problems > 0 ? 1 : 0);
