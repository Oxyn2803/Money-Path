import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { billingEvents, userSubscriptions } from "@/db/schema";
import { verifyWebhookSignature, getGatewayConfig } from "@/lib/billing-gateway";

export const dynamic = "force-dynamic";

/**
 * Webhook de facturación (Etapa 22).
 *
 * Único camino legítimo para activar, actualizar o cancelar el plan Pro:
 * exige firma verificada con el secreto del proveedor. Sin proveedor
 * configurado responde 503 y no altera nada; con firma inválida, 401.
 * Aquí no se acepta ningún "evento" proveniente del navegador.
 */
export async function POST(request: Request) {
  const config = getGatewayConfig();
  if (!config.configured) {
    return NextResponse.json(
      { received: false, reason: "gateway_not_configured" },
      { status: 503 },
    );
  }

  const raw = await request.text();
  const signature =
    request.headers.get("stripe-signature") ?? request.headers.get("x-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ received: false, reason: "invalid_signature" }, { status: 401 });
  }

  let event: {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  try {
    event = JSON.parse(raw) as typeof event;
  } catch {
    return NextResponse.json({ received: false, reason: "invalid_payload" }, { status: 400 });
  }

  const object = event.data?.object ?? {};
  const providerSubscriptionId =
    typeof object.id === "string" ? object.id : null;

  // Auditoría del evento recibido (solo con usuario identificable).
  const customerId =
    typeof object.customer === "string" ? object.customer : null;
  if (customerId) {
    const [existing] = await db
      .select({ userId: userSubscriptions.userId })
      .from(userSubscriptions)
      .where(eq(userSubscriptions.providerCustomerId, customerId))
      .limit(1);

    if (existing) {
      await db.insert(billingEvents).values({
        userId: existing.userId,
        type: `webhook.${event.type ?? "unknown"}`,
        provider: config.provider,
        status: "processed",
        payload: { type: event.type ?? null, providerSubscriptionId },
        processedAt: new Date(),
      });

      // Actualización de periodo/estado cuando el adaptador esté conectado.
      if (event.type === "customer.subscription.deleted") {
        await db
          .update(userSubscriptions)
          .set({ status: "canceled", canceledAt: new Date() })
          .where(
            and(
              eq(userSubscriptions.userId, existing.userId),
              eq(userSubscriptions.providerSubscriptionId, providerSubscriptionId ?? ""),
            ),
          );
      }
    }
  }

  return NextResponse.json({ received: true });
}
