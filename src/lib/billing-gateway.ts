/**
 * Adaptador de gateway de pagos (Etapa 22 — Monetización).
 *
 * **Regla de oro: no se finge ningún pago.** Esta capa únicamente responde si
 * hay un proveedor configurado y si su adaptador está implementado. Mientras
 * no exista una integración real, el checkout responde con un código honesto
 * y el plan del usuario sigue en Free.
 *
 * Para conectar un proveedor real (Stripe, dLocal, Mercado Pago, …):
 * 1. Definir `PAYMENTS_PROVIDER` y sus credenciales en `.env`.
 * 2. Implementar el adaptador en `createCheckoutSession` / `verifyWebhook`.
 * 3. El webhook (firmado) es el único camino que activa el plan Pro.
 */

export interface GatewayConfig {
  /** Identificador del proveedor (p. ej. `stripe`), si está definido. */
  provider: string | null;
  /** ¿Tiene credenciales completas en el entorno? */
  configured: boolean;
  /** ¿Existe un adaptador implementado en este repositorio? */
  implemented: boolean;
}

export interface CheckoutAttemptResult {
  ok: boolean;
  code:
    | "GATEWAY_NOT_CONFIGURED"
    | "GATEWAY_ADAPTER_MISSING"
    | "CHECKOUT_CREATED";
  provider: string | null;
  message: string;
  /** URL de pago real, solo cuando `code === "CHECKOUT_CREATED"`. */
  checkoutUrl?: string;
}

const REQUIRED_KEYS: Record<string, string[]> = {
  stripe: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
};

/** Lee la configuración del entorno (nunca en el bundle del navegador). */
export function getGatewayConfig(): GatewayConfig {
  const provider = process.env.PAYMENTS_PROVIDER?.trim() || null;
  if (!provider) return { provider: null, configured: false, implemented: false };

  const keys = REQUIRED_KEYS[provider] ?? ["PAYMENTS_API_KEY"];
  const configured = keys.every((key) => Boolean(process.env[key]?.trim()));
  // Sin adaptador registrado, nunca afirmamos que podemos cobrar.
  const implemented = false;
  return { provider, configured, implemented };
}

/**
 * Intento de creación de checkout. Hoy siempre termina en un estado honesto:
 * no hay adaptador implementado, por lo que no se genera ninguna sesión de pago
 * ni se modifica la suscripción del usuario.
 */
export async function createCheckoutSession(_params: {
  userId: string;
  plan: "pro";
  interval: "month" | "year";
  priceMinor: number;
  currency: string;
}): Promise<CheckoutAttemptResult> {
  const config = getGatewayConfig();

  if (!config.configured) {
    return {
      ok: false,
      code: "GATEWAY_NOT_CONFIGURED",
      provider: config.provider,
      message:
        "No hay un proveedor de pagos configurado en este entorno. No se procesó ningún pago y tu plan sigue en Free.",
    };
  }

  if (!config.implemented) {
    return {
      ok: false,
      code: "GATEWAY_ADAPTER_MISSING",
      provider: config.provider,
      message: `El proveedor «${config.provider}» está declarado pero su adaptador aún no está implementado. No se procesó ningún pago.`,
    };
  }

  return {
    ok: false,
    code: "GATEWAY_ADAPTER_MISSING",
    provider: config.provider,
    message: "No fue posible iniciar el pago en este momento.",
  };
}

/**
 * Verificación de firma de webhook. Solo un evento firmado y verificado puede
 * alterar una suscripción. Sin secreto configurado no se acepta nada.
 */
export function verifyWebhookSignature(_payload: string, signature: string | null): boolean {
  const config = getGatewayConfig();
  if (!config.configured || !signature) return false;
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  // Firma verificada con HMAC-SHA256 (implementación del adaptador real).
  return false;
}
