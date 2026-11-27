import { NextResponse } from "next/server";
import { PLAN_CATALOG, type BillingInterval } from "@/config/plans";
import { getSession } from "@/lib/auth";
import { getEntitlements, logBillingEvent } from "@/lib/billing";
import { createCheckoutSession, getGatewayConfig } from "@/lib/billing-gateway";

export const dynamic = "force-dynamic";

interface CheckoutBody {
  plan?: string;
  interval?: string;
}

/**
 * Checkout (Etapa 22 — Monetización).
 *
 * Flujo real, sin atajos de demostración:
 * 1. Valida sesión y periodicidad (mensual o anual, según el catálogo).
 * 2. Delega en la capa de gateway, que responde con un código honesto.
 * 3. Registra el intento en `billing_events`.
 * 4. **No** modifica la suscripción: sin pago verificado no hay Pro.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED", message: "Sesión requerida." },
      { status: 401 },
    );
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json(
      { ok: false, code: "INVALID_BODY", message: "Cuerpo inválido." },
      { status: 400 },
    );
  }

  const interval = body.interval as BillingInterval | undefined;
  if (interval !== "month" && interval !== "year") {
    return NextResponse.json(
      { ok: false, code: "INVALID_INTERVAL", message: "Periodicidad no soportada." },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const entitlements = await getEntitlements(userId);
  if (entitlements.pro) {
    return NextResponse.json({
      ok: true,
      code: "ALREADY_PRO",
      message: "Ya tienes el plan Pro activo.",
      plan: "pro",
      interval,
      activated: false,
    });
  }

  const plan = PLAN_CATALOG.pro;
  const price = plan.prices[interval];
  const gateway = getGatewayConfig();

  const attempt = await createCheckoutSession({
    userId,
    plan: "pro",
    interval,
    priceMinor: price.minor ?? 0,
    currency: price.currency,
  });

  await logBillingEvent({
    userId,
    type: "checkout.requested",
    plan: "pro",
    interval,
    provider: attempt.provider,
    status: attempt.code,
    payload: {
      priceMinor: price.minor,
      currency: price.currency,
      gatewayConfigured: gateway.configured,
      gatewayImplemented: gateway.implemented,
      activated: false,
    },
  });

  return NextResponse.json(
    {
      ok: attempt.ok,
      code: attempt.code,
      message: attempt.message,
      provider: attempt.provider,
      plan: "pro",
      interval,
      priceMinor: price.minor,
      currency: price.currency,
      // Siempre explícito: nunca se afirma que el pago se completó.
      activated: false,
    },
    { status: attempt.ok ? 200 : 503 },
  );
}
