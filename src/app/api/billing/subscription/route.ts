import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  describeSubscription,
  getBillingHistory,
  getEntitlements,
  logBillingEvent,
} from "@/lib/billing";

export const dynamic = "force-dynamic";

/** Estado real de la suscripción del usuario (plan, periodo y bitácora). */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const entitlements = await getEntitlements(userId);
  const history = await getBillingHistory(userId, 20);

  return NextResponse.json({
    subscription: describeSubscription(entitlements),
    history: history.map((event) => ({
      id: event.id,
      type: event.type,
      status: event.status,
      interval: event.interval,
      provider: event.provider,
      createdAt: event.createdAt,
    })),
  });
}

interface SubscriptionAction {
  action?: "cancel" | "resume";
}

/**
 * Acciones sobre la suscripción. Solo operan sobre suscripciones reales
 * confirmadas por el gateway: sin una suscripción de pago no hay nada que
 * cancelar y se responde con un 409 honesto (nunca se simula un cambio).
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: SubscriptionAction;
  try {
    body = (await request.json()) as SubscriptionAction;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const userId = session.user.id;
  const entitlements = await getEntitlements(userId);

  if (!entitlements.subscription) {
    await logBillingEvent({
      userId,
      type: `subscription.${body.action ?? "unknown"}.requested`,
      status: "no_subscription",
      payload: { action: body.action ?? null },
    });
    return NextResponse.json(
      {
        error: "no_subscription",
        message:
          "No existe una suscripción de pago que administrar. Estás en el plan Free y no se ha procesado ningún cobro.",
      },
      { status: 409 },
    );
  }

  await logBillingEvent({
    userId,
    type: `subscription.${body.action ?? "unknown"}.requested`,
    plan: entitlements.plan,
    interval: entitlements.subscription.interval,
    provider: entitlements.subscription.provider,
    status: "requires_gateway",
    payload: { action: body.action ?? null },
  });

  return NextResponse.json(
    {
      error: "gateway_not_configured",
      message:
        "Esta acción requiere el proveedor de pagos conectado. No se realizó ningún cambio en tu suscripción.",
    },
    { status: 409 },
  );
}
