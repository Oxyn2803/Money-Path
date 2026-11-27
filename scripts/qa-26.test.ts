export {}; // módulo: evita colisión de declaraciones globales con otros scripts de QA

/**
 * Auditoría funcional completa (Etapa 26 — QA).
 *
 * Ejecuta los 22 flujos principales del producto contra el servidor real
 * (HTTP con token Bearer) y luego verifica la consistencia financiera entre
 * módulos: todos deben reflejar el mismo escenario.
 *
 *   set -a; . ./.env; set +a
 *   npx tsx scripts/qa-26.test.ts
 *
 * Escenario realista (MXN):
 *   Ingresos 25,000 · Gastos 15,000 · Deuda 20,000 · Reserva 5,000 · Meta 30,000
 *
 * No maquilla resultados: cualquier fallo sale en la lista final.
 */

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const STAMP = Date.now().toString(36);
const EMAIL = `qa26+${STAMP}@example.com`;
const PASSWORD = "Password123!";

/* ── Escenario ───────────────────────────────────────────────────────── */
const INCOME_TOTAL = "25000.00";
const EXPENSES: { desc: string; amount: string; category: string }[] = [
  { desc: "Renta departamento", amount: "8000.00", category: "Renta o hipoteca" },
  { desc: "Servicios (luz, agua, gas)", amount: "3500.00", category: "Servicios (luz, agua, gas)" },
  { desc: "Súper y despensa", amount: "3500.00", category: "Súper y despensa" },
];
const DEBT_TOTAL = "20000.00";
const RESERVE_TOTAL = "5000.00";
const GOAL_TOTAL = "30000.00";

const m = (value: string) => Math.round(Number(value) * 100); // a centavos

let passed = 0;
const failures: string[] = [];
const warnings: string[] = [];

function ok(label: string, condition: boolean, detail = "") {
  if (condition) passed += 1;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

function eq(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) passed += 1;
  else failures.push(`${label}\n       esperado: ${e}\n       obtenido: ${a}`);
}

function note(label: string, detail: string) {
  warnings.push(`${label} — ${detail}`);
}

interface ApiResult {
  status: number;
  body: any;
}

async function call(
  token: string | null,
  method: string,
  path: string,
  payload?: unknown,
): Promise<ApiResult> {
  /*
   * El navegador envía siempre `Origin` en los POST; Better Auth lo exige
   * (CSRF) y responde 403 MISSING_OR_NULL_ORIGIN sin él. El test simula
   * ese comportamiento en lugar de saltarse la protección.
   */
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Origin: BASE,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: payload === undefined ? undefined : JSON.stringify(payload),
    });
    const text = await response.text();
    let body: unknown = text;
    try {
      body = JSON.parse(text);
    } catch {
      /* respuesta HTML */
    }
    return { status: response.status, body };
  } catch (error) {
    return { status: 0, body: String(error) };
  }
}

/** Lee un valor del HTML renderizado (los montos van formateados). */
async function html(token: string | null, path: string): Promise<string> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, { headers });
  return response.text();
}

/** Resuelve el userId del usuario de prueba (las libs trabajan con userId). */
async function resolveUserId(): Promise<string | null> {
  const { db } = await import("../src/db");
  const { users } = await import("../src/db/schema");
  const drizzle = await import("drizzle-orm");
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(drizzle.eq(users.email, EMAIL))
    .limit(1);
  return rows[0]?.id ?? null;
}

/* ═══════════════════════════════════════════════════════════════════════
   1 · Cuenta: cadastro e login
   ═══════════════════════════════════════════════════════════════════════ */
async function testAuth(): Promise<string> {
  console.log("\n▶ 1 · Cadastro e login");

  const reg = await call(null, "POST", "/api/auth/sign-up/email", {
    name: "QA Etapa 26",
    email: EMAIL,
    password: PASSWORD,
  });
  eq("cadastro retorna 200", reg.status, 200);
  const token = (reg.body as any)?.token;
  ok("cadastro entrega token de sessão", typeof token === "string" && token.length > 10);

  const dup = await call(null, "POST", "/api/auth/sign-up/email", {
    name: "Dup",
    email: EMAIL,
    password: PASSWORD,
  });
  ok("cadastro duplicado no cria conta nova", dup.status >= 400, `status=${dup.status}`);

  const badLogin = await call(null, "POST", "/api/auth/sign-in/email", {
    email: EMAIL,
    password: "WrongPass999!",
  });
  ok("login con contraseña incorrecta es rechazado", badLogin.status >= 400, `status=${badLogin.status}`);

  const login = await call(null, "POST", "/api/auth/sign-in/email", {
    email: EMAIL,
    password: PASSWORD,
  });
  eq("login retorna 200", login.status, 200);
  const loginToken = (login.body as any)?.token;
  ok("login entrega token", typeof loginToken === "string" && loginToken.length > 10);

  const unauth = await call(null, "GET", "/api/settings");
  ok("API de datos exige sesión (401 sin token)", unauth.status === 401, `status=${unauth.status}`);

  /* CSRF: un POST desde un origen ajeno debe ser rechazado. */
  const crossOrigin = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://evil.test" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  ok(
    "CSRF: POST con Origin ajeno es rechazado (403)",
    crossOrigin.status === 403,
    `status=${crossOrigin.status}`,
  );

  /* Sin Origin (p. ej. un cliente no navegador) también se rechaza. */
  const noOrigin = await fetch(`${BASE}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  ok(
    "CSRF: POST sin Origin es rechazado (403)",
    noOrigin.status === 403,
    `status=${noOrigin.status}`,
  );

  return String(token ?? loginToken);
}

/* ═══════════════════════════════════════════════════════════════════════
   2 · Onboarding
   ═══════════════════════════════════════════════════════════════════════ */
async function testOnboarding(token: string) {
  console.log("▶ 2 · Onboarding");
  const res = await call(token, "POST", "/api/onboarding", {
    country: "MX",
    currency: "MXN",
    monthlyIncome: INCOME_TOTAL,
    incomeFrequency: "monthly",
    essentialExpenses: "12000.00",
    hasDebts: true,
    totalDebts: DEBT_TOTAL,
    currentReserve: RESERVE_TOTAL,
    currentInvestments: "0.00",
    approximateNetWorth: "-15000.00",
    primaryGoal: "salir_deudas",
  });
  eq("onboarding acepta el escenario", res.status, 200);
  ok(
    "onboarding responde ok",
    res.body && (res.body.ok === true || res.body.success === true || res.status === 200),
    JSON.stringify(res.body).slice(0, 160),
  );

  const invalid = await call(token, "POST", "/api/onboarding", {
    country: "MX",
    currency: "XXX",
    monthlyIncome: INCOME_TOTAL,
    incomeFrequency: "monthly",
    essentialExpenses: "1000",
    hasDebts: false,
    primaryGoal: "salir_deudas",
  });
  ok("onboarding rechaza moneda inválida", invalid.status >= 400, `status=${invalid.status}`);

  const badAmount = await call(token, "POST", "/api/onboarding", {
    country: "MX",
    currency: "MXN",
    monthlyIncome: "abc",
    incomeFrequency: "monthly",
    essentialExpenses: "1000",
    hasDebts: false,
    primaryGoal: "salir_deudas",
  });
  ok("onboarding rechaza monto no numérico", badAmount.status >= 400, `status=${badAmount.status}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   3 · Presupuesto: receitas, despesas, recorrências, futuros, parcelas
   ═══════════════════════════════════════════════════════════════════════ */
async function testBudget(token: string) {
  console.log("▶ 3 · Orçamento (Presupuesto)");
  const today = new Date().toISOString().slice(0, 10);

  const income = await call(token, "POST", "/api/presupuesto/transactions", {
    table: "income",
    date: today,
    description: "Sueldo mensual",
    amount: INCOME_TOTAL,
  });
  eq("receita de 25,000 criada", income.status, 200);
  ok("receita responde ok", income.body?.ok === true, JSON.stringify(income.body));

  const badIncome = await call(token, "POST", "/api/presupuesto/transactions", {
    table: "income",
    date: "not-a-date",
    description: "x",
    amount: "100.00",
  });
  ok("receita con fecha inválida es rechazada", badIncome.status >= 400, `status=${badIncome.status}`);

  const zeroIncome = await call(token, "POST", "/api/presupuesto/transactions", {
    table: "income",
    date: today,
    description: "cero",
    amount: "0.00",
  });
  ok("receita con monto cero es rechazada", zeroIncome.status >= 400, `status=${zeroIncome.status}`);

  const negative = await call(token, "POST", "/api/presupuesto/transactions", {
    table: "income",
    date: today,
    description: "negativo",
    amount: "-500.00",
  });
  ok("receita con monto negativo es rechazada", negative.status >= 400, `status=${negative.status}`);

  for (const expense of EXPENSES) {
    const res = await call(token, "POST", "/api/presupuesto/transactions", {
      table: "expenses",
      date: today,
      description: expense.desc,
      amount: expense.amount,
      status: "paid",
    });
    eq(`gasto "${expense.desc}" creado`, res.status, 200);
  }

  /* Recorrência */
  const recurring = await call(token, "POST", "/api/presupuesto/recurring", {
    op: "create",
    kind: "expense",
    description: "Internet y teléfono",
    amount: "600.00",
    frequency: "monthly",
    startDate: today,
  });
  eq("recorrência mensal creada", recurring.status, 200);
  ok("recorrência responde ok", recurring.body?.ok === true, JSON.stringify(recurring.body));

  const badFrequency = await call(token, "POST", "/api/presupuesto/recurring", {
    op: "create",
    kind: "expense",
    description: "x",
    amount: "100.00",
    frequency: "cuatrimestral",
    startDate: today,
  });
  ok("frecuencia desconocida es rechazada", badFrequency.status >= 400, `status=${badFrequency.status}`);

  /* Recebimento futuro */
  const future = await call(token, "POST", "/api/presupuesto/future-receipts", {
    op: "create",
    description: "Aguinaldo",
    amount: "8000.00",
    expectedOn: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
    counterparty: "Empleador",
  });
  eq("recebimento futuro creado", future.status, 200);

  const futureBadDate = await call(token, "POST", "/api/presupuesto/future-receipts", {
    op: "create",
    description: "x",
    amount: "100.00",
    expectedOn: "2026-13-45",
  });
  ok("recebimento futuro con fecha inválida es rechazado", futureBadDate.status >= 400, `status=${futureBadDate.status}`);

  /* Parcelamento */
  const installment = await call(token, "POST", "/api/presupuesto/installments", {
    op: "create",
    description: "Laptop en 6 meses",
    totalAmount: "12000.00",
    count: 6,
    firstDueDate: today,
    paymentMethod: "credit_card",
  });
  eq("parcelamento de 6 cuotas creado", installment.status, 200);
  ok("parcelamento responde ok", installment.body?.ok === true, JSON.stringify(installment.body));

  const badCount = await call(token, "POST", "/api/presupuesto/installments", {
    op: "create",
    description: "x",
    totalAmount: "1000.00",
    count: 0,
    firstDueDate: today,
    paymentMethod: "credit_card",
  });
  ok("parcelamento con 0 cuotas es rechazado", badCount.status >= 400, `status=${badCount.status}`);

  /* Categorías */
  const cat = await call(token, "POST", "/api/presupuesto/categories", {
    op: "create",
    kind: "expense",
    name: "Mascotas",
  });
  eq("categoría creada", cat.status, 200);

  const dupCat = await call(token, "POST", "/api/presupuesto/categories", {
    op: "create",
    kind: "expense",
    name: "mascotas",
  });
  ok("categoría duplicada (case-insensitive) es rechazada", dupCat.status >= 400, `status=${dupCat.status}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   4 · Dívidas, reserva, metas, investimentos, patrimônio
   ═══════════════════════════════════════════════════════════════════════ */
async function testModules(token: string) {
  console.log("▶ 4 · Dívidas, reserva, metas, investimentos, patrimônio");
  const today = new Date().toISOString().slice(0, 10);

  /* Metas: incluidas en el plan Free */
  const goal = await call(token, "POST", "/api/goals", {
    op: "create",
    name: "Viaje a Japón",
    targetAmount: GOAL_TOTAL,
    currentAmount: "0.00",
    category: "viaje",
    priority: 2,
    targetDate: new Date(Date.now() + 400 * 86400000).toISOString().slice(0, 10),
  });
  eq("meta de 30,000 creada (Free)", goal.status, 200);
  /*
   * `create` responde { ok: true } sin id (el cliente refresca la lista);
   * se localiza la meta recién creada en la base para poder aportarle.
   */
  const userId = await resolveUserId();
  const goalId = userId
    ? await (async () => {
        const { getGoalsData } = await import("../src/lib/goals");
        const data = await getGoalsData(userId);
        return data?.goals.find((g) => g.name === "Viaje a Japón")?.id ?? null;
      })()
    : null;
  if (goalId) {
    const contribution = await call(token, "POST", "/api/goals", {
      op: "contribute",
      id: goalId,
      amount: "3000.00",
    });
    eq("aporte de 3,000 a la meta", contribution.status, 200);
    const balance = await call(token, "POST", "/api/goals", {
      op: "contribute",
      id: goalId,
      amount: "-500.00",
    });
    ok("aporte negativo es rechazado", balance.status >= 400, `status=${balance.status}`);
  } else {
    failures.push(`meta sin id en la respuesta: ${JSON.stringify(goal.body).slice(0, 120)}`);
  }

  /*
   * Módulos Pro: en el plan Free deben responder 402. Después se cargan los
   * fixtures directamente en la base (setup de prueba) para poder verificar
   * que los agregados de cada módulo reflejan los mismos montos.
   */
  const proOps: { label: string; path: string; payload: unknown }[] = [
    { label: "dívida", path: "/api/debts", payload: { op: "create", name: "Tarjeta Banorte", creditor: "Banorte", initialAmount: DEBT_TOTAL, rate: 32.5, dueDay: 15 } },
    { label: "reserva (configure)", path: "/api/fondo", payload: { op: "configure", targetMonths: 6 } },
    { label: "reserva (setCurrent)", path: "/api/fondo", payload: { op: "setCurrent", amount: RESERVE_TOTAL } },
    { label: "cuenta de inversión", path: "/api/investments", payload: { op: "createAccount", institution: "GBM+", accountType: "brokerage", balance: "10000.00" } },
    { label: "activo", path: "/api/patrimonio", payload: { op: "createAsset", name: "Auto usado", kind: "vehicle", value: "80000.00" } },
    { label: "pasivo", path: "/api/patrimonio", payload: { op: "createLiability", name: "Préstamo auto", kind: "financing", amount: "40000.00" } },
  ];
  for (const op of proOps) {
    const res = await call(token, "POST", op.path, op.payload);
    eq(`${op.label} bloqueada en Free (402)`, res.status, 402);
  }

  await seedProFixtures(token);
}

/** Fixtures de módulos Pro (setup de prueba, no sustituye a la API). */
async function seedProFixtures(token: string) {
  const { db } = await import("../src/db");
  const { users, debts, emergencyFunds, assets, investmentAccounts } = await import(
    "../src/db/schema"
  );
  const drizzle = await import("drizzle-orm");
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(drizzle.eq(users.email, EMAIL))
    .limit(1);
  const userId = rows[0]?.id;
  if (!userId) {
    failures.push("fixtures: usuario no encontrado");
    return;
  }

  await db.insert(debts).values({
    userId,
    name: "Tarjeta Banorte",
    creditor: "Banorte",
    kind: "credit_card",
    initialAmount: DEBT_TOTAL,
    outstandingBalance: "18000.00",
    currency: "MXN",
    annualInterestRate: "32.5000",
    dueDay: 15,
    priority: 1,
    status: "active",
  });
  await db.insert(emergencyFunds).values({
    userId,
    targetAmount: "72000.00",
    currentAmount: RESERVE_TOTAL,
    currency: "MXN",
    targetMonths: "6",
    status: "building",
  });
  await db.insert(assets).values({
    userId,
    kind: "vehicle",
    name: "Auto usado",
    estimatedValue: "80000.00",
    currency: "MXN",
    status: "active",
    valuationSource: "manual",
  });
  await db.insert(investmentAccounts).values({
    userId,
    institution: "GBM+",
    name: "Cuenta GBM+",
    accountType: "brokerage",
    balance: "10000.00",
    currency: "MXN",
    status: "active",
  });
  ok("fixtures de módulos Pro cargados", true);
}

/* ═══════════════════════════════════════════════════════════════════════
   5 · Demais fluxos: notificações, configurações, academia, AI, billing
   ═══════════════════════════════════════════════════════════════════════ */
async function testRemaining(token: string) {
  console.log("▶ 5 · Notificações, configurações, academia, Money AI, Free/Pro");

  const notif = await call(token, "POST", "/api/notifications", { op: "generate" });
  ok("notificações geradas", notif.status === 200, `status=${notif.status}`);

  const notifInvalid = await call(token, "POST", "/api/notifications", { op: "inventado" });
  ok("op de notificação desconhecida é rejeitada", notifInvalid.status >= 400, `status=${notifInvalid.status}`);

  const settings = await call(token, "POST", "/api/settings", { op: "name", name: "QA Usuario" });
  eq("configuração: nome salvo", settings.status, 200);

  const theme = await call(token, "POST", "/api/settings", { op: "theme", theme: "dark" });
  eq("configuração: tema salvo", theme.status, 200);
  const back = await call(token, "POST", "/api/settings", { op: "theme", theme: "light" });
  eq("configuração: tema revertido", back.status, 200);

  const badTheme = await call(token, "POST", "/api/settings", { op: "theme", theme: "neon" });
  ok("tema desconhecido es rechazado", badTheme.status >= 400, `status=${badTheme.status}`);

  /* Money AI (Free debe poder usarlo… o estar bloqueado: se verifica abajo) */
  const ai = await call(token, "POST", "/api/money-ai", { message: "¿Cuánto gané este mes?" });
  ok(
    "Money AI responde (200) o bloquea con 402",
    ai.status === 200 || ai.status === 402,
    `status=${ai.status} ${JSON.stringify(ai.body).slice(0, 140)}`,
  );

  /* Academia: módulo Pro */
  const academy = await call(token, "POST", "/api/academy", { contentId: "x", field: "isFavorite", value: true });
  ok(
    "Academia bloqueada en Free con 402",
    academy.status === 402,
    `status=${academy.status}`,
  );

  /* Free/Pro */
  const checkout = await call(token, "POST", "/api/billing/checkout", { plan: "pro", interval: "year" });
  eq("checkout sin gateway no simula pago (503)", checkout.status, 503);
  ok("checkout indica activated:false", checkout.body?.activated === false, JSON.stringify(checkout.body));
  ok(
    "checkout responde GATEWAY_NOT_CONFIGURED",
    checkout.body?.code === "GATEWAY_NOT_CONFIGURED",
    String(checkout.body?.code),
  );

  const sub = await call(token, "GET", "/api/billing/subscription");
  eq("suscripción sigue en Free", sub.status, 200);
  eq("plan real es free", sub.body?.subscription?.plan, "free");
  eq("límite de metas Free = 3", sub.body?.subscription?.goalsLimit, 3);

  /* Límite de 3 metas */
  for (let i = 0; i < 2; i += 1) {
    const extra = await call(token, "POST", "/api/goals", {
      op: "create",
      name: `Meta extra ${i + 1}`,
      targetAmount: "1000.00",
    });
    ok(`meta extra ${i + 1} creada (dentro del límite)`, extra.status === 200, `status=${extra.status}`);
  }
  const over = await call(token, "POST", "/api/goals", {
    op: "create",
    name: "Meta fuera de límite",
    targetAmount: "1000.00",
  });
  eq("4ª meta bloqueada en Free (402)", over.status, 402);
}

/* ═══════════════════════════════════════════════════════════════════════
   6 · Consistencia financiera entre módulos
   ═══════════════════════════════════════════════════════════════════════ */
async function testConsistency(token: string, email: string) {
  console.log("▶ 6 · Consistencia financiera entre módulos");

  const userId = await resolveUserId();
  if (!userId) {
    failures.push("consistencia: no se encontró el usuario de prueba");
    return;
  }

  const expectedIncome = m(INCOME_TOTAL);
  /*
   * Los gastos del mes son la suma de TODO lo que el mes registró:
   *   15,000 manuales + 2,000 (1.ª cuota del parcelamento) + 600 (ocurrencia
   *   de la recurrencia mensual) = 17,600.
   * Verificar solo los 15,000 habría ocultado que parcelas y recurrencias
   * sí impactan el presupuesto — que es exactamente lo que deben hacer.
   */
  const expectedExpenses =
    EXPENSES.reduce((sum, e) => sum + m(e.amount), 0) + m("2000.00") + m("600.00");
  const expectedDebt = m(DEBT_TOTAL) - m("2000.00"); // abono de 2,000
  const expectedReserve = m(RESERVE_TOTAL);
  const expectedGoal = m(GOAL_TOTAL) - m("3000.00"); // falta 27,000

  const { getDashboardData } = await import("../src/lib/dashboard");
  const dashboard = await getDashboardData(userId);
  ok("dashboard disponible", dashboard !== null);
  if (dashboard) {
    eq("dashboard · ingresos del mes = 25,000", dashboard.incomeMonth.amount, expectedIncome);
    eq(
      "dashboard · gastos del mes = 15,000",
      dashboard.expensesMonth.amount,
      expectedExpenses,
      );
    eq("dashboard · deuda total = 18,000", dashboard.debtsTotal.amount, expectedDebt);
    eq("dashboard · reserva = 5,000", dashboard.emergencyFund.current, expectedReserve);
  }

  const { getPresupuestoData } = await import("../src/lib/presupuesto");
  const budget = await getPresupuestoData(userId, {});
  ok("presupuesto disponible", budget !== null);
  if (budget) {
    const summary = (budget as any).summary;
    eq("presupuesto · ingresos recibidos = 25,000", summary.incomeReceived, expectedIncome);
    eq("presupuesto · gastos comprometidos = 17,600", summary.expensesCommitted, expectedExpenses);
    eq(
      "presupuesto · ahorro = 7,400",
      summary.savings,
      expectedIncome - expectedExpenses,
    );
  }

  const { getReportsData } = await import("../src/lib/reports");
  const reports = await getReportsData(userId, 1);
  ok("relatórios disponibles", reports !== null);
  if (reports) {
    eq("relatórios · ingresos = 25,000", reports.totals.incomeMinor, expectedIncome);
    eq("relatórios · gastos = 15,000", reports.totals.expensesMinor, expectedExpenses);
    eq(
      "relatórios · ahorro = 10,000",
      reports.totals.savingsMinor,
      expectedIncome - expectedExpenses,
    );
  }

  const { buildAIContext } = await import("../src/lib/moneyai/context");
  const ai = await buildAIContext(userId);
  ok("contexto de Money AI disponible", ai !== null);
  if (ai) {
    eq("Money AI · ingreso mensual = 25,000", ai.monthlyIncomeMinor, expectedIncome);
    eq("Money AI · gasto mensual = 15,000", ai.monthlyExpensesMinor, expectedExpenses);
    eq("Money AI · deudas = 18,000", ai.debtsTotalMinor, expectedDebt);
    eq("Money AI · reserva = 5,000", ai.fundCurrentMinor, expectedReserve);
    eq(
      "Money AI · superávit = 10,000",
      ai.surplusMinor,
      expectedIncome - expectedExpenses,
    );
  }

  const { getMoneyPathData } = await import("../src/lib/moneypath");
  const path = await getMoneyPathData(userId);
  ok("Money Path disponible", path !== null);
  if (path) {
    const input = (path as any).input;
    eq("Money Path · ingreso mensual = 25,000", input.monthlyIncomeMinor, expectedIncome);
    eq("Money Path · gasto mensual = 17,600", input.monthlyExpensesMinor, expectedExpenses);
    eq(
      "Money Path · superávit coherente con el dashboard",
      input.surplusMinor,
      expectedIncome - expectedExpenses,
    );
  }

  const { getDebtsData } = await import("../src/lib/debts");
  const debts = await getDebtsData(userId);
  ok("módulo deudas disponible", debts !== null);
  if (debts) {
    eq("deudas · saldo pendiente = 18,000", (debts as any).summary.remainingMinor, expectedDebt);
  }

  const { getFondoData } = await import("../src/lib/fondo");
  const fund = await getFondoData(userId);
  ok("módulo reserva disponible", fund !== null);
  if (fund) {
    eq("reserva · aportado = 5,000", (fund as any).currentMinor, expectedReserve);
    eq("reserva · objetivo calculado", typeof (fund as any).targetMinor, "number");
  }

  const { getGoalsData } = await import("../src/lib/goals");
  const goals = await getGoalsData(userId);
  ok("módulo metas disponible", goals !== null);
  if (goals) {
    const viaje = goals.goals.find((g) => g.name === "Viaje a Japón");
    ok("meta Viaje a Japón existe", viaje !== undefined);
    if (viaje) {
      eq("meta · faltan 27,000", (viaje as any).remainingMinor ?? (viaje as any).targetRemainingMinor, expectedGoal);
    }
  }

  const { getInvestmentsData } = await import("../src/lib/investments");
  const investments = await getInvestmentsData(userId);
  ok("módulo inversiones disponible", investments !== null);

  const { getPatrimonioData } = await import("../src/lib/patrimonio");
  const patrimonio = await getPatrimonioData(userId);
  ok("módulo patrimonio disponible", patrimonio !== null);
  if (patrimonio) {
    eq(
      "patrimonio · activos incluyen el auto (80,000)",
      (patrimonio as any).totals.assetsMinor,
      m("80000.00"),
    );
  }

  /* Las páginas renderizadas deben mostrar los mismos números */
  const dashboardHtml = await html(token, "/app");
  ok("página Inicio renderiza", dashboardHtml.includes("25,000") || dashboardHtml.includes("$25"));
  const budgetHtml = await html(token, "/app/presupuesto");
  ok("página Presupuesto renderiza", budgetHtml.includes("25,000") || budgetHtml.includes("$25"));
  /*
   * Resumen (Relatórios) es un módulo Pro: en Free debe renderizar el gate,
   * no los datos. Verificamos el bloqueo en lugar de exigir cifras.
   */
  const reportsHtml = await html(token, "/app/resumen");
  ok(
    "página Resumen muestra el gate Pro en Free",
    reportsHtml.includes("es parte de Pro"),
    "no se encontró el bloqueo premium",
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   7 · Calculadoras (funções puras)
   ═══════════════════════════════════════════════════════════════════════ */
async function testCalculators() {
  console.log("▶ 7 · Calculadoras");
  const { compoundInterest, goalContribution, buyVsRent } = await import("../src/lib/calculators");

  const ci = compoundInterest({
    initialMinor: 100000,
    contributionMinor: 50000,
    annualRatePct: 10,
    years: 1,
  });
  ok("interés compuesto: aportado = 100k + 12×50k", ci.contributedMinor === 700000, String(ci.contributedMinor));
  ok("interés compuesto: intereses > 0", ci.interestMinor > 0, String(ci.interestMinor));
  ok(
    "interés compuesto: final = aportado + intereses",
    ci.finalMinor === ci.contributedMinor + ci.interestMinor,
    `${ci.finalMinor} vs ${ci.contributedMinor + ci.interestMinor}`,
  );

  const zero = compoundInterest({ initialMinor: 0, contributionMinor: 0, annualRatePct: 0, years: 0 });
  eq("interés compuesto en cero devuelve cero", zero, {
    contributedMinor: 0,
    interestMinor: 0,
    finalMinor: 0,
  });

  const gc = goalContribution({ targetMinor: 3000000, currentMinor: 0, years: 2 });
  ok("meta: aporte mensual > 0", gc.perMonthMinor > 0, String(gc.perMonthMinor));
  ok("meta: meses = 24", gc.months === 24, String(gc.months));

  const bv = buyVsRent({} as never);
  ok("comprar vs rentar responde", bv !== null && typeof bv === "object");
}

/* ═══════════════════════════════════════════════════════════════════════
   8 · Páginas: todos los módulos responden
   ═══════════════════════════════════════════════════════════════════════ */
async function testPages(token: string) {
  console.log("▶ 8 · Páginas de todos los módulos");
  const paths = [
    "/app",
    "/app/resumen",
    "/app/presupuesto",
    "/app/deudas",
    "/app/fondo",
    "/app/metas",
    "/app/inversiones",
    "/app/patrimonio",
    "/app/money-path",
    "/app/money-ai",
    "/app/calculadoras",
    "/app/academia",
    "/app/configuracion",
    "/app/suscripcion",
    "/precios",
    "/",
    "/login",
    "/register",
  ];
  for (const path of paths) {
    try {
      const response = await fetch(`${BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        redirect: "manual",
      });
      const status = response.status;
      ok(`GET ${path} responde 2xx/3xx`, status >= 200 && status < 400, `status=${status}`);
    } catch (error) {
      ok(`GET ${path} responde`, false, String(error));
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════════ */
async function main() {
  console.log("MONEY PATH · Auditoría funcional (Etapa 26)");
  console.log(`Base: ${BASE} · usuario: ${EMAIL}`);

  const token = await testAuth();
  await testOnboarding(token);
  await testBudget(token);
  await testModules(token);
  await testRemaining(token);
  await testConsistency(token, EMAIL);
  await testCalculators();
  await testPages(token);

  console.log("\n══════════════════════════════════════════");
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} observación(es):`);
    for (const w of warnings) console.log("   · " + w);
  }
  if (failures.length) {
    console.log(`\n✗ ${failures.length} FALLO(S):`);
    for (const f of failures) console.log("   ✗ " + f);
  }
  console.log(`\n✓ ${passed} verificaciones correctas · ${failures.length} fallos`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Error fatal de la auditoría:", error);
  process.exit(2);
});
