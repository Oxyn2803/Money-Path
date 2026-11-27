/**
 * Núcleo monetario de Money Path.
 *
 * Regla de oro: todo monto se representa y calcula en unidades menores
 * enteras (centavos para MXN). Nunca se usa punto flotante para aritmética
 * de dinero. La conversión a decimal ocurre solo en la capa de presentación,
 * vía `Intl.NumberFormat`.
 *
 * En base de datos los montos se guardarán como `numeric(18,2)` y se
 * convertirán a centavos enteros al entrar a la capa de aplicación.
 */

import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  getCurrencyConfig,
  type CurrencyCode,
} from "@/config/locales";

/** Monto expresado en unidades menores enteras (p. ej. centavos). */
export type MinorUnits = number;

/** Redondeo "mitad hacia arriba" con signo (ej. 2.5 → 3, -2.5 → -3). */
export function roundHalfAwayFromZero(value: number): number {
  return value >= 0 ? Math.floor(value + 0.5) : -Math.floor(-value + 0.5);
}

/** Cantidad de decimales de una moneda (MXN → 2). */
export function currencyDecimals(code: CurrencyCode = DEFAULT_CURRENCY): number {
  return getCurrencyConfig(code).decimals;
}

function factorFor(code: CurrencyCode): number {
  return 10 ** currencyDecimals(code);
}

/**
 * Convierte un monto decimal (número o texto escrito por el usuario) a
 * unidades menores enteras.
 *
 * Convenciones de entrada (es-MX):
 * - "$1,250.50" y "1250.5" → 125050
 * - Si solo hay comas y tienen 1-2 dígitos detrás, se tratan como decimal
 *   ("749,75" → 74975); en otro caso son separadores de miles.
 * - Se aceptan montos negativos ("-1,000.00" → -100000).
 *
 * Lanza `Error` si la entrada no es un monto válido.
 */
/**
 * Normaliza un texto escrito por el usuario a una forma canónica
 * (`[enteros][.decimales]`), validando el uso de comas como miles.
 * Lanza `Error` si la forma no es la de un monto.
 */
function canonicalDecimalText(raw: string): string {
  let text = raw.replace(/[$\s]/g, "");
  if (text.length === 0) throw new Error("Monto vacío");

  // Signo: solo al inicio, o entre paréntesis (notación contable).
  let negative = false;
  if (text.startsWith("(") && text.endsWith(")")) {
    negative = true;
    text = text.slice(1, -1);
  } else if (text.startsWith("-")) {
    negative = true;
    text = text.slice(1);
  }
  if (/[+-]/.test(text)) throw new Error(`Monto inválido: "${raw}"`);

  const hasDot = text.includes(".");
  const hasComma = text.includes(",");

  if (hasDot && hasComma) {
    // "1,250.50": la coma debe ser separador de miles.
    if (!/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) {
      throw new Error(`Monto inválido: "${raw}"`);
    }
    text = text.replace(/,/g, "");
  } else if (hasComma) {
    const parts = text.split(",");
    const looksDecimal = parts.length === 2 && parts[1].length >= 1 && parts[1].length <= 2;
    if (looksDecimal) {
      text = `${parts[0]}.${parts[1]}`;
    } else if (/^\d{1,3}(,\d{3})+$/.test(text)) {
      text = text.replace(/,/g, "");
    } else {
      throw new Error(`Monto inválido: "${raw}"`);
    }
  }

  // Se acepta "5." (decimal incompleto al escribir) pero no "." ni "".
  if (!/^\d*(\.\d*)?$/.test(text) || text === "" || text === ".") {
    throw new Error(`Monto inválido: "${raw}"`);
  }
  return negative ? `-${text}` : text;
}

/**
 * Convierte monto decimal → unidades menores enteras con aritmética de
 * **dígitos** (nunca `valor * factor` en punto flotante): el redondeo se
 * decide mirando el primer dígitо descartado, mitad hacia afuera con signo.
 * Verifica además que el resultado sea un entero seguro.
 */
function minorFromCanonical(text: string, factor: number, decimals: number, original: unknown): MinorUnits {
  const negative = text.startsWith("-");
  const body = negative ? text.slice(1) : text;
  const dot = body.indexOf(".");
  const intDigits = dot === -1 ? body : body.slice(0, dot);
  const fracDigits = dot === -1 ? "" : body.slice(dot + 1);

  const intMinor = intDigits.length > 0 ? Number(intDigits) * factor : 0;

  let fracMinor = 0;
  if (fracDigits.length > 0) {
    if (fracDigits.length <= decimals) {
      fracMinor = Number(fracDigits.padEnd(decimals, "0"));
    } else {
      // Redondeo mitad hacia afuera sobre el dígito descartado.
      const keep = fracDigits.slice(0, decimals);
      const nextDigit = fracDigits.charCodeAt(decimals) - 48; // '0' = 48
      fracMinor = (keep.length > 0 ? Number(keep) : 0) + (nextDigit >= 5 ? 1 : 0);
    }
  }

  const total = intMinor + fracMinor;
  const minor = negative && total !== 0 ? -total : total;
  if (!Number.isSafeInteger(minor)) {
    throw new Error(`Monto fuera de rango: ${original}`);
  }
  return minor;
}

export function toMinorUnits(value: number | string, code: CurrencyCode = DEFAULT_CURRENCY): MinorUnits {
  const factor = factorFor(code);
  const decimals = currencyDecimals(code);

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Monto inválido: ${value}`);
    }
    // Más allá de 1e14 el resultado en unidades menores nunca es seguro.
    if (Math.abs(value) >= 1e14) {
      throw new Error(`Monto fuera de rango: ${value}`);
    }
    const text = value.toString();
    if (/e/i.test(text)) {
      // Notación exponencial: o redondea a cero o está fuera de rango.
      if (Math.abs(value) < 1 / factor) return 0;
      throw new Error(`Monto fuera de rango: ${value}`);
    }
    return minorFromCanonical(canonicalDecimalText(text), factor, decimals, value);
  }

  return minorFromCanonical(canonicalDecimalText(value), factor, decimals, value);
}

/** Convierte unidades menores a número decimal. Solo para presentación. */
export function fromMinorUnits(minor: MinorUnits, code: CurrencyCode = DEFAULT_CURRENCY): number {
  return minor / factorFor(code);
}

/** Garantiza que un valor sea una unidad menor entera válida. */
export function assertMinorUnits(minor: MinorUnits): void {
  if (!Number.isSafeInteger(minor)) {
    throw new Error(`El monto no es una unidad menor entera válida: ${minor}`);
  }
}

/** Suma dos montos con precisión exacta. */
export function addMinor(a: MinorUnits, b: MinorUnits): MinorUnits {
  assertMinorUnits(a);
  assertMinorUnits(b);
  const result = a + b;
  assertMinorUnits(result); // dos enteros seguros pueden sumar uno no seguro
  return result;
}

/** Resta dos montos con precisión exacta. */
export function subtractMinor(a: MinorUnits, b: MinorUnits): MinorUnits {
  assertMinorUnits(a);
  assertMinorUnits(b);
  const result = a - b;
  assertMinorUnits(result);
  return result;
}

/** Multiplica un monto por un factor (p. ej. 12 meses), redondeando a centavo. */
export function multiplyMinor(minor: MinorUnits, factor: number): MinorUnits {
  assertMinorUnits(minor);
  if (!Number.isFinite(factor)) {
    throw new Error(`Factor inválido: ${factor}`);
  }
  const result = roundHalfAwayFromZero(minor * factor);
  assertMinorUnits(result);
  return result;
}

/** Suma una lista de montos. */
export function sumMinor(values: readonly MinorUnits[]): MinorUnits {
  return values.reduce((acc, value) => addMinor(acc, value), 0);
}

/** Compara dos montos: -1 si a < b, 0 si iguales, 1 si a > b. */
export function compareMinor(a: MinorUnits, b: MinorUnits): -1 | 0 | 1 {
  assertMinorUnits(a);
  assertMinorUnits(b);
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isZeroMinor(minor: MinorUnits): boolean {
  assertMinorUnits(minor);
  return minor === 0;
}

export interface FormatMoneyOptions {
  currency?: CurrencyCode;
  locale?: string;
  /** Mostrar el código ISO ("2,000.25 MXN") en lugar del símbolo. */
  withCurrencyCode?: boolean;
}

/** Formatea un monto en unidades menores para mostrar al usuario. */
export function formatMoney(minor: MinorUnits, options: FormatMoneyOptions = {}): string {
  assertMinorUnits(minor);
  const currency = options.currency ?? DEFAULT_CURRENCY;
  const locale = options.locale ?? DEFAULT_LOCALE;
  const config = getCurrencyConfig(currency);
  const amount = fromMinorUnits(minor, currency);

  if (options.withCurrencyCode) {
    const numeric = new Intl.NumberFormat(locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    }).format(amount);
    return `${numeric} ${currency}`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);
}
