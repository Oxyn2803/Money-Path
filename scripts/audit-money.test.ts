/**
 * Suíte de auditoría financiera (Etapa 23).
 *
 * Cubre los casos exigidos por el brief: cero, negativos, valores muy altos,
 * decimales, fechas y monedas (incluidas las de 0 decimales: COP/CLP).
 *
 * Ejecutar: `npx tsx scripts/audit-money.test.ts`
 * Sale con código != 0 si alguna verificación falla.
 */
import {
  addMinor,
  compareMinor,
  formatMoney,
  fromMinorUnits,
  isZeroMinor,
  multiplyMinor,
  subtractMinor,
  sumMinor,
  toMinorUnits,
} from "../src/lib/money";
import {
  installmentAmountFor,
  installmentAmounts,
  installmentDueDate,
  isValidIsoDate,
  minorOf,
  decimal,
} from "../src/lib/installments";
import { computeGoalPlan, forecastAtCurrentPace, monthsUntil, weeksUntil } from "../src/lib/goals-shared";

let passed = 0;
const failures: string[] = [];

function check(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) passed += 1;
  else failures.push(`${label}\n     esperado: ${e}\n     obtenido: ${a}`);
}

function checkThrows(label: string, fn: () => unknown) {
  try {
    const value = fn();
    failures.push(`${label}\n     se esperaba Error y se obtuvo: ${JSON.stringify(value)}`);
  } catch {
    passed += 1;
  }
}

function attempt(fn: () => unknown): string {
  try {
    fn();
    return "no-lanza";
  } catch {
    return "lanza";
  }
}

/* ── 1. Cero ─────────────────────────────────────────────────────────── */
check("cero string", toMinorUnits("0"), 0);
check("cero decimal", toMinorUnits("0.00"), 0);
check("cero número", toMinorUnits(0), 0);
check("cero negativo textual", toMinorUnits("-0.00"), 0);
check("suma de ceros", addMinor(0, 0), 0);
check("resta de ceros", subtractMinor(0, 0), 0);
check("es cero", isZeroMinor(0), true);
check("no es cero", isZeroMinor(1), false);
check("comparación con cero", compareMinor(0, 1), -1);

/* ── 2. Negativos ────────────────────────────────────────────────────── */
check("negativo con signo", toMinorUnits("-1000.00"), -100000);
check("negativo con paréntesis contable", toMinorUnits("(1,000)"), -100000);
check("negativo decimal", toMinorUnits("-0.29"), -29);
check("negativo desde número", toMinorUnits(-12.34), -1234);
check("mitad de centavo negativa", toMinorUnits("-0.005"), -1);
check("mitad de centavo positiva", toMinorUnits("0.005"), 1);
check("mitad de centavo desde número", toMinorUnits(0.005), 1);
check("un centavo y medio", toMinorUnits("0.015"), 2);
check("medio centavo con COP (0 decimales)", toMinorUnits("1500.5", "COP"), 1501);
check("comparación negativa", compareMinor(-5, 5), -1);
check("suma que cancela", sumMinor([-100000, 100000]), 0);
check("resta que cruza cero", subtractMinor(100, 200), -100);

/* ── 3. Decimales y redondeo ─────────────────────────────────────────── */
check("dos decimales exactos", toMinorUnits("0.29"), 29);
check("dos decimales exactos 2", toMinorUnits("8.17"), 817);
check("miles con punto y coma", toMinorUnits("1,250.50"), 125050);
check("coma decimal (es-MX)", toMinorUnits("749,75"), 74975);
check("coma de miles", toMinorUnits("1,250"), 125000);
check("un solo decimal", toMinorUnits("12.5"), 1250);
check("sin entero (.5)", toMinorUnits(".5"), 50);
check("sin decimal (5.)", toMinorUnits("5."), 500);
check("símbolo de moneda", toMinorUnits("$1,250.50"), 125050);
check("espacios como miles", toMinorUnits("1 250.50"), 125050);
check("tercer decimal en .5", toMinorUnits("1.005"), 101);
check("tercer decimal arriba", toMinorUnits("1.006"), 101);
check("tercer decimal abajo", toMinorUnits("1.004"), 100);
check("mitad negativa", toMinorUnits("-1.005"), -101);
check("hífen en medio es rechazado", attempt(() => toMinorUnits("12-34")), "lanza");
check("comas mal formadas son rechazadas", attempt(() => toMinorUnits("1,2,3")), "lanza");
check("letras rechazadas", attempt(() => toMinorUnits("abc")), "lanza");
check("vacío rechazado", attempt(() => toMinorUnits("   ")), "lanza");
check("Infinity rechazado", attempt(() => toMinorUnits(Infinity)), "lanza");
check("NaN rechazado", attempt(() => toMinorUnits(NaN)), "lanza");
check("round-trip", fromMinorUnits(toMinorUnits("1234.56")), 1234.56);

/* ── 4. Valores muy altos ────────────────────────────────────────────── */
check("máximo entero seguro", toMinorUnits("90071992547409.91"), Number.MAX_SAFE_INTEGER);
check("un billón en pesos", toMinorUnits("1000000000000"), 100000000000000);
checkThrows("1 billón excede el rango seguro", () => toMinorUnits("999999999999999.99"));
checkThrows("excede entero seguro (texto)", () => toMinorUnits("99999999999999999999"));
checkThrows("excede entero seguro (número)", () => toMinorUnits(1e21));
checkThrows("suma que desborda", () => addMinor(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
checkThrows("resta que desborda", () => subtractMinor(-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER));
checkThrows("multiplicación que desborda", () => multiplyMinor(Number.MAX_SAFE_INTEGER, 2));
checkThrows("suma de lista que desborda", () => sumMinor([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]));
check("suma grande válida", addMinor(9007199254740990, 1), 9007199254740991);
check("multiplicar 12 meses", multiplyMinor(2990, 12), 35880);
check("multiplicar redondea mitad", multiplyMinor(1, 0.5), 1);

/* ── 5. Fechas ───────────────────────────────────────────────────────── */
check("fecha válida", isValidIsoDate("2026-02-28"), true);
check("fecha bisiesto", isValidIsoDate("2028-02-29"), true);
check("30 de febrero inválido", isValidIsoDate("2026-02-30"), false);
check("31 de abril inválido", isValidIsoDate("2026-04-31"), false);
check("mes 13 inválido", isValidIsoDate("2026-13-01"), false);
check("texto no es fecha", isValidIsoDate("hoy"), false);
check("cuota 1 (1-indexada)", installmentDueDate("2026-01-15", 1), "2026-01-15");
check("cuota 2", installmentDueDate("2026-01-15", 2), "2026-02-15");
check("crusa año con fin de mes", installmentDueDate("2026-11-30", 4), "2027-02-28");
check("meses hasta fecha pasada", monthsUntil("2020-01-01", new Date("2026-01-01")), 0);
check("meses sin fecha", monthsUntil(null), null);
check("semanas hasta", weeksUntil("2026-01-29", new Date("2026-01-01")), 4);
check("pronóstico sin ritmo", forecastAtCurrentPace(100000, 0), { months: null, estimatedIso: null });
check("pronóstico sin saldo", forecastAtCurrentPace(0, 5000), {
  months: 0,
  estimatedIso: new Date().toISOString().slice(0, 10),
});

/* ── 5b. Distribución de cuotas en centavos (sin flotantes) ──────────── */
const d3 = installmentAmounts(100000, 3);
check("distribución 1000.00 / 3", d3, { base: 33333, remainder: 1, first: 33334 });
check(
  "suma de cuotas == total",
  sumMinor([1, 2, 3].map((k) => installmentAmountFor(100000, 3, k))),
  100000,
);
check("cuota impar reparte resto", sumMinor([1, 2, 3].map((k) => installmentAmountFor(100001, 3, k))), 100001);
check("7 cuotas exactas", installmentAmountFor(70000, 7, 7), 10000);
check("una sola cuota", installmentAmounts(123456, 1), { base: 123456, remainder: 0, first: 123456 });
checkThrows("cuotas en cero", () => installmentAmounts(100000, 0));
checkThrows("cuotas negativas", () => installmentAmounts(100000, -2));
checkThrows("total negativo", () => installmentAmounts(-100000, 3));
checkThrows("total en cero", () => installmentAmounts(0, 3));
check("decimal/minor round-trip", minorOf(decimal(123456)), 123456);
check("minor de null", minorOf(null), 0);

/* ── 6. Monedas ──────────────────────────────────────────────────────── */
check("COP sin decimales", toMinorUnits("1500", "COP"), 1500);
check("COP redondea decimales", toMinorUnits("1500.5", "COP"), 1501);
check("CLP sin decimales", toMinorUnits("999999", "CLP"), 999999);
check("COP round-trip", fromMinorUnits(toMinorUnits("1500", "COP"), "COP"), 1500);
check("USD dos decimales", toMinorUnits("10.99", "USD"), 1099);
check("BRL dos decimales", toMinorUnits("10.99", "BRL"), 1099);
check("PEN dos decimales", toMinorUnits("10.99", "PEN"), 1099);
check("ARS dos decimales", toMinorUnits("10.99", "ARS"), 1099);
check("MXN dos decimales", toMinorUnits("10.99", "MXN"), 1099);
check("COP sin centavos en formato", formatMoney(1500, { currency: "COP" }).includes(",00"), false);
check("formato MXN no lanza", formatMoney(10000, { currency: "MXN" }).length > 0, true);
check("formato negativo no lanza", formatMoney(-10000, { currency: "MXN" }).includes("-"), true);

/* ── 7. Plan de metas (cálculo puro) ─────────────────────────────────── */
const targetIso = "2030-06-30";
const plan = computeGoalPlan(100000, 25000, targetIso);
check("plan: falta por aportar", plan.remainingMinor, 75000);
check("plan: progreso", plan.percent, 25);
check(
  "plan: por mes es techo exacto",
  plan.perMonthMinor === null || plan.perMonthMinor >= Math.ceil(plan.remainingMinor / (plan.monthsRemaining ?? 1)),
  true,
);
check("plan: por mes es entero", Number.isInteger(plan.perMonthMinor ?? 0), true);
check("plan sin plazo", computeGoalPlan(100000, 0, null).perMonthMinor, null);
check("plan con saldo mayor que meta", computeGoalPlan(50000, 90000, targetIso).remainingMinor, 0);
check("plan con meta cero", computeGoalPlan(0, 0, targetIso).percent, 0);

/* ── Reporte ─────────────────────────────────────────────────────────── */
if (failures.length > 0) {
  console.error(`\n✗ ${failures.length} verificación(es) fallaron:\n`);
  for (const f of failures) console.error("  - " + f);
}
console.log(`\n✓ ${passed} verificaciones correctas · ${failures.length} fallos`);
process.exit(failures.length > 0 ? 1 : 0);
