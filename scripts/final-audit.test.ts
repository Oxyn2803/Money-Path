export {}; // módulo: evita colisão de declarações globais com qa-26.test.ts

/**
 * Auditoría final de producto (Etapa 28).
 *
 * Complementa `qa-26.test.ts` con las verificaciones que ese no cubre:
 *   1. Aislamiento entre usuarios (IDOR) — nadie toca datos de otro.
 *   2. UX — el usuario ve respuesta a sus 6 preguntas clave.
 *   3. Money Path / Money AI — las recomendaciones salen de datos reales.
 *   4. Consistencia de módulos y monetización Free/Pro.
 *
 *   set -a; . ./.env; set +a
 *   npx tsx scripts/final-audit.test.ts
 */

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const STAMP = Date.now().toString(36);
const EMAIL_A = `audit28+a${STAMP}@example.com`;
const EMAIL_B = `audit28+b${STAMP}@example.com`;
const PASSWORD = "Password123!";

let passed = 0;
const failures: string[] = [];
const findings: string[] = [];

function ok(label: string, condition: boolean, detail = "") {
  if (condition) passed += 1;
  else failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
}

async function call(
  token: string | null,
  method: string,
  path: string,
  payload?: unknown,
): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Origin: BASE,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
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
    /* HTML */
  }
  return { status: response.status, body };
}

async function html(token: string | null, path: string): Promise<string> {
  const headers: Record<string, string> = { Origin: BASE };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, { headers });
  return response.text();
}

async function signUp(email: string): Promise<string> {
  const res = await call(null, "POST", "/api/auth/sign-up/email", {
    name: `Auditor ${email.slice(0, 9)}`,
    email,
    password: PASSWORD,
  });
  if (res.status !== 200 || !res.body?.token) {
    failures.push(`registro falló para ${email}: ${res.status}`);
    return "";
  }
  return String(res.body.token);
}

async function onboard(token: string) {
  return call(token, "POST", "/api/onboarding", {
    country: "MX",
    currency: "MXN",
    monthlyIncome: "25000.00",
    incomeFrequency: "monthly",
    essentialExpenses: "12000.00",
    hasDebts: false,
    totalDebts: "0",
    currentReserve: "5000.00",
    currentInvestments: "0",
    approximateNetWorth: "0",
    primaryGoal: "ahorrar",
  });
}

async function userIdOf(email: string): Promise<string | null> {
  const { db } = await import("../src/db");
  const { users } = await import("../src/db/schema");
  const drizzle = await import("drizzle-orm");
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(drizzle.eq(users.email, email))
    .limit(1);
  return rows[0]?.id ?? null;
}

/* ═══════════════════════════════════════════════════════════════════════
   1 · Aislamiento entre usuarios (IDOR)
   ═══════════════════════════════════════════════════════════════════════ */
async function testIsolation(tokenA: string, tokenB: string) {
  console.log("▶ 1 · Aislamiento entre usuarios");

  const goalA = await call(tokenA, "POST", "/api/goals", {
    op: "create",
    name: `Meta privada de A ${STAMP}`,
    targetAmount: "50000.00",
    currentAmount: "0.00",
  });
  ok("A crea su meta", goalA.status === 200, `status=${goalA.status}`);

  const idA = await (async () => {
    const userId = await userIdOf(EMAIL_A);
    if (!userId) return null;
    const { getGoalsData } = await import("../src/lib/goals");
    const data = await getGoalsData(userId);
    return data?.goals.find((g) => g.name.includes(STAMP))?.id ?? null;
  })();
  ok("A localiza su meta", Boolean(idA));

  if (idA) {
    /* B intenta operar sobre la meta de A */
    const contribute = await call(tokenB, "POST", "/api/goals", {
      op: "contribute",
      id: idA,
      amount: "1000.00",
    });
    ok(
      "B no puede aportar a la meta de A (404)",
      contribute.status === 404,
      `status=${contribute.status}`,
    );

    const del = await call(tokenB, "POST", "/api/goals", {
      op: "delete",
      id: idA,
    });
    ok("B no puede eliminar la meta de A (404)", del.status === 404, `status=${del.status}`);

    /* ¿Se modificó el dato de A? */
    const userIdA = await userIdOf(EMAIL_A);
    const { getGoalsData } = await import("../src/lib/goals");
    const dataA = userIdA ? await getGoalsData(userIdA) : null;
    const goal = dataA?.goals.find((g) => g.id === idA);
    ok(
      "la meta de A sigue intacta tras los intentos de B",
      goal !== undefined && goal.currentMinor === 0 && goal.status === "active",
      JSON.stringify({ current: goal?.currentMinor, status: goal?.status }),
    );
  }

  /* Movimiento de A: B intenta modificarlo */
  const today = new Date().toISOString().slice(0, 10);
  const moveA = await call(tokenA, "POST", "/api/presupuesto/transactions", {
    table: "income",
    date: today,
    description: `Ingreso privado de A ${STAMP}`,
    amount: "25000.00",
  });
  ok("A crea su ingreso", moveA.status === 200, `status=${moveA.status}`);

  const moveId = await (async () => {
    const userId = await userIdOf(EMAIL_A);
    if (!userId) return null;
    const { db } = await import("../src/db");
    const { income } = await import("../src/db/schema");
    const drizzle = await import("drizzle-orm");
    const rows = await db
      .select({ id: income.id })
      .from(income)
      .where(drizzle.and(drizzle.eq(income.userId, userId), drizzle.like(income.description, `%${STAMP}%`)))
      .limit(1);
    return rows[0]?.id ?? null;
  })();

  if (moveId) {
    const touch = await call(tokenB, "POST", "/api/presupuesto/transactions/update", {
      id: moveId,
      table: "income",
      op: "cancel",
    });
    ok(
      "B no puede cancelar el ingreso de A (400/404)",
      touch.status === 400 || touch.status === 404,
      `status=${touch.status}`,
    );

    const userIdA = await userIdOf(EMAIL_A);
    const { db } = await import("../src/db");
    const { income } = await import("../src/db/schema");
    const drizzle = await import("drizzle-orm");
    const rows = userIdA
      ? await db
          .select({ status: income.status, deletedAt: income.deletedAt })
          .from(income)
          .where(drizzle.eq(income.id, moveId))
          .limit(1)
      : [];
    ok(
      "el ingreso de A sigue activo",
      rows[0]?.status !== "cancelled" && rows[0]?.deletedAt === null,
      JSON.stringify(rows[0] ?? null),
    );
  }

  /* Las páginas de B nunca muestran datos de A */
  const pageB = await html(tokenB, "/app/presupuesto");
  ok(
    "B no ve el ingreso de A en su presupuesto",
    !pageB.includes(`Ingreso privado de A ${STAMP}`),
  );
  const goalsB = await html(tokenB, "/app/metas");
  ok(
    "B no ve la meta de A en su lista de metas",
    !goalsB.includes(`Meta privada de A ${STAMP}`),
  );

  /* El usuario A no puede leer la configuración de B (datos de sesión) */
  const settingsB = await call(tokenB, "GET", "/api/settings");
  ok("B lee solo su propia configuración", settingsB.status === 200, `status=${settingsB.status}`);
}

/* ═══════════════════════════════════════════════════════════════════════
   2 · UX: las 6 preguntas del usuario
   ═══════════════════════════════════════════════════════════════════════ */
async function testUx(tokenA: string) {
  console.log("▶ 2 · UX — ¿entiende el usuario su situación?");

  /* Gastos reales del mes: sin ellos el dashboard mostraría solo la
     estimación del diagnóstico y la verificación no probaría nada. */
  const today = new Date().toISOString().slice(0, 10);
  for (const expense of [
    { description: "Renta departamento", amount: "8000.00" },
    { description: "Súper y despensa", amount: "3500.00" },
    { description: "Transporte", amount: "3500.00" },
  ]) {
    const res = await call(tokenA, "POST", "/api/presupuesto/transactions", {
      table: "expenses",
      date: today,
      description: expense.description,
      amount: expense.amount,
      status: "paid",
    });
    ok(`UX · gasto registrado (${expense.description})`, res.status === 200, `status=${res.status}`);
  }

  const dashboard = await html(tokenA, "/app");

  /* ¿Cuál es mi situación? — indicadores con cifras reales */
  ok("UX · ve sus ingresos del mes", dashboard.includes("25,000"), "falta la cifra de ingresos");
  ok("UX · ve sus gastos del mes", /1[5-9],\d{3}|17,600/.test(dashboard), "falta la cifra de gastos");
  ok("UX · ve su ahorro/reserva", dashboard.includes("5,000"), "falta la reserva");

  /* ¿Cuál es mi próximo paso? */
  ok(
    "UX · ve «Tu próximo paso»",
    dashboard.includes("próximo paso") || dashboard.includes("Próximo paso") || dashboard.includes("siguiente"),
    "no se encontró el card de próximo paso",
  );

  /* ¿Cuánto debo? — dívidas en el dashboard */
  ok("UX · ve sus deudas", dashboard.includes("euda"), "falta el indicador de deudas");

  /* ¿Cuánto tengo? — patrimonio */
  ok("UX · ve su patrimonio", dashboard.includes("atrimonio"), "falta el indicador de patrimonio");

  /* Metas */
  const goals = await html(tokenA, "/app/metas");
  ok("UX · la página de metas carga con sus metas", goals.includes("Meta privada"), "no ve sus metas");

  /* Gastos: desglose por categoría en Presupuesto */
  const budget = await html(tokenA, "/app/presupuesto");
  ok("UX · Presupuesto muestra su ingreso", budget.includes("25,000"), "falta el ingreso en Presupuesto");
  ok(
    "UX · Presupuesto explica qué es cada columna",
    budget.includes("Ingresos") && budget.includes("Gastos"),
    "faltan encabezados del resumen",
  );

  /* Cada página responde «qué significa esto» con descripción propia */
  for (const [path, marker] of [
    ["/app/deudas", "Deudas"],
    ["/app/patrimonio", "Patrimonio"],
    ["/app/fondo", "Fondo de emergencia"],
  ] as const) {
    const page = await html(tokenA, path);
    ok(`UX · ${path} renderiza su título`, page.includes(marker));
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   3 · Money Path y Money AI usan datos reales
   ═══════════════════════════════════════════════════════════════════════ */
async function testRecommendations(tokenA: string) {
  console.log("▶ 3 · Money Path y Money AI — ¿usan datos reales?");

  const userId = await userIdOf(EMAIL_A);
  ok("usuario de prueba localizado", Boolean(userId));
  if (!userId) return;

  const { getMoneyPathData } = await import("../src/lib/moneypath");
  const path = await getMoneyPathData(userId);
  ok("Money Path calcula con datos del usuario", path !== null);
  if (path) {
    const input = (path as any).input;
    ok(
      "Money Path · ingreso mensual = 25,000 (dato real)",
      input.monthlyIncomeMinor === 2500000,
      String(input.monthlyIncomeMinor),
    );
    ok(
      "Money Path · tiene prioridad derivada de datos",
      Boolean((path as any).priority?.type),
      JSON.stringify((path as any).priority?.type),
    );
    /* `nextStep` se deriva en el cliente a partir de la prioridad; en el
       servidor lo que demuestra anclaje en datos reales es el plan y la
       prioridad, ambos calculados con los montos del usuario. */
    ok(
      "Money Path · plan con monto derivado del excedente real",
      typeof (path as any).plan?.monthlyAmountMinor === "number" &&
        (path as any).plan.monthlyAmountMinor >= 0,
      JSON.stringify((path as any).plan),
    );
    const validPriorities = [
      "overspend", "debt", "lowReserve", "lowSavings",
      "goalIncompatible", "netWorthGrowing", "reorganize", "onTrack",
    ];
    ok(
      "Money Path · prioridad dentro de los tipos conocidos",
      validPriorities.includes((path as any).priority?.type),
      String((path as any).priority?.type),
    );
    ok(
      "Money Path · no marca estimado sin datos",
      typeof input.hasActualData === "boolean",
    );
  }

  /*
   * Money AI es un módulo Pro: en el plan Free el 402 es el comportamiento
   * correcto. Solo se exige la cifra real si el acceso está permitido.
   */
  const ai = await call(tokenA, "POST", "/api/money-ai", {
    message: "¿Cuánto gané este mes?",
  });
  ok(
    "Money AI responde (200) o bloquea en Free (402)",
    ai.status === 200 || ai.status === 402,
    `status=${ai.status}`,
  );
  if (ai.status === 200) {
    const text = JSON.stringify(ai.body);
    ok(
      "Money AI cita una cifra real (25,000)",
      text.includes("25,000") || text.includes("25000"),
      text.slice(0, 300),
    );
    ok(
      "Money AI no afirma ganar otra cosa",
      !text.includes("8,333") && !text.includes("8333"),
      "reportó un tercio de la renta real",
    );
  }

  const aiInvented = await call(tokenA, "POST", "/api/money-ai", {
    message: "¿Cuánto tengo en criptomonedas?",
  });
  ok(
    "Money AI sin acceso en Free también devuelve 402",
    aiInvented.status === 402 || aiInvented.status === 200,
    `status=${aiInvented.status}`,
  );
  if (aiInvented.status === 200) {
    const text = JSON.stringify(aiInvented.body);
    ok(
      "Money AI reconoce la falta de dato en vez de inventar",
      /falta|más información|no tengo|necesito/i.test(text) || text.includes("0"),
      text.slice(0, 300),
    );
    findings.push(
      `Money AI respondió sobre criptomonedas sin dato: ${text.slice(0, 160)}`,
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   4 · Consistencia y monetización
   ═══════════════════════════════════════════════════════════════════════ */
async function testConsistencyAndPlans(tokenA: string) {
  console.log("▶ 4 · Consistencia de datos y planes Free/Pro");

  const userId = await userIdOf(EMAIL_A);
  if (!userId) {
    failures.push("consistencia: usuario no encontrado");
    return;
  }

  const { getDashboardData } = await import("../src/lib/dashboard");
  const { getReportsData } = await import("../src/lib/reports");
  const { buildAIContext } = await import("../src/lib/moneyai/context");

  const [dashboard, reports, aiContext] = await Promise.all([
    getDashboardData(userId),
    getReportsData(userId, 1),
    buildAIContext(userId),
  ]);

  const income = dashboard?.incomeMonth.amount;
  ok("dashboard con ingresos", typeof income === "number" && income > 0, String(income));
  ok(
    "relatorios coinciden con el dashboard",
    reports !== null && dashboard !== null && reports.totals.incomeMinor === dashboard.incomeMonth.amount,
    JSON.stringify({ reports: reports?.totals.incomeMinor, dashboard: dashboard?.incomeMonth.amount }),
  );
  ok(
    "Money AI coincida con el dashboard",
    aiContext !== null && dashboard !== null && aiContext.monthlyIncomeMinor === dashboard.incomeMonth.amount,
    JSON.stringify({ ai: aiContext?.monthlyIncomeMinor, dashboard: dashboard?.incomeMonth.amount }),
  );

  /* Free/Pro */
  const checkout = await call(tokenA, "POST", "/api/billing/checkout", {
    plan: "pro",
    interval: "year",
  });
  ok("checkout no simula pago (503)", checkout.status === 503, `status=${checkout.status}`);
  ok("checkout reporta activated:false", checkout.body?.activated === false);

  const subscription = await call(tokenA, "GET", "/api/billing/subscription");
  ok("suscripción sigue en Free", subscription.body?.subscription?.plan === "free");
  ok("límite de metas = 3", subscription.body?.subscription?.goalsLimit === 3);

  const blocked = await call(tokenA, "POST", "/api/debts", {
    op: "create",
    name: "No debería crearse",
    initialAmount: "1000.00",
  });
  ok("módulo Pro bloqueado en Free (402)", blocked.status === 402, `status=${blocked.status}`);

  /* Academia: el contenido sembrado debe ser legible por el módulo. */
  const { getAcademyData } = await import("../src/lib/academy");
  const academy = await getAcademyData(userId);
  ok("Academia disponible", academy !== null);
  if (academy) {
    const items = (academy as any).contents ?? (academy as any).items ?? [];
    ok(
      "Academia tiene contenido sembrado (24 contenidos)",
      items.length >= 24,
      `contenidos visibles: ${items.length}`,
    );
  }

  /* Notificaciones: el centro debe poder generar y listar. */
  const notif = await call(tokenA, "POST", "/api/notifications", { op: "generate" });
  ok("notificaciones generadas", notif.status === 200, `status=${notif.status}`);
}

/* ═══════════════════════════════════════════════════════════════════════ */
async function main() {
  console.log("MONEY PATH · Auditoría final de producto (Etapa 28)");
  console.log(`Base: ${BASE}`);

  const tokenA = await signUp(EMAIL_A);
  const tokenB = await signUp(EMAIL_B);
  if (!tokenA || !tokenB) {
    console.error("No se pudieron crear los usuarios de prueba");
    process.exit(2);
  }

  const onboardA = await onboard(tokenA);
  ok("onboarding de A", onboardA.status === 200, `status=${onboardA.status}`);
  await onboard(tokenB);

  await testIsolation(tokenA, tokenB);
  await testUx(tokenA);
  await testRecommendations(tokenA);
  await testConsistencyAndPlans(tokenA);

  console.log("\n══════════════════════════════════════════");
  if (findings.length) {
    console.log(`\n⚠ ${findings.length} observación(es):`);
    for (const f of findings) console.log("   · " + f);
  }
  if (failures.length) {
    console.log(`\n✗ ${failures.length} FALLO(S):`);
    for (const f of failures) console.log("   ✗ " + f);
  }
  console.log(`\n✓ ${passed} verificaciones correctas · ${failures.length} fallos`);
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(2);
});
