import { boolean, char, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./common";
import { users } from "./identity";

/**
 * Suscripciones Money Path (Etapa 22 — Monetización).
 *
 * Principios:
 * - **Nunca se simula un pago.** Una fila en `subscriptions` representa una
 *   suscripción real creada/confirmada por el gateway. Un intento de checkout
 *   sin gateway configurado NO crea ni altera esta tabla; solo deja rastro en
 *   `billing_events`.
 * - **Un usuario, una suscripción** (índice/unicidad por `user_id`). El plan
 *   `free` es implícito: no existe fila hasta que hay una suscripción real.
 * - **Mensual y anual desde el día uno:** `interval` es parte del modelo, no
 *   una idea futura.
 */
export const userSubscriptions = pgTable(
  "user_subscriptions",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    plan: text("plan", { enum: ["free", "pro"] })
      .notNull()
      .default("free"),
    /**
     * `pending` = creado por el gateway y a la espera de confirmación.
     * `incomplete` = flujo de pago iniciado sin completar.
     * Solo `active`/`trialing` otorgan el plan Pro.
     */
    status: text("status", {
      enum: [
        "pending",
        "incomplete",
        "active",
        "trialing",
        "past_due",
        "canceled",
        "expired",
      ],
    })
      .notNull()
      .default("pending"),
    /** Periodicidad de la suscripción: mensual o anual. */
    interval: text("interval", { enum: ["month", "year"] }),
    /** Precio acordado en centavos (mínima unidad) al momento de contratar. */
    priceMinor: integer("price_minor"),
    currency: char("currency", { length: 3 })
      .notNull()
      .default("USD"),
    /** Proveedor de pago real (p. ej. `stripe`), cuando esté conectado. */
    provider: text("provider"),
    providerCustomerId: text("provider_customer_id"),
    providerSubscriptionId: text("provider_subscription_id"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end")
      .notNull()
      .default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("user_subscriptions_user_idx").on(t.userId)],
);

/**
 * Bitácora de facturación (Etapa 22).
 * Cada evento real deja registro: solicitudes de checkout, respuestas del
 * gateway, webhooks recibidos, activaciones y cancelaciones. Es la fuente
 * de verdad auditable de "qué pasó" — nunca se inventa un pago aquí.
 */
export const billingEvents = pgTable(
  "billing_events",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** p. ej. `checkout.requested`, `webhook.received`, `subscription.activated`. */
    type: text("type").notNull(),
    plan: text("plan", { enum: ["free", "pro"] }),
    interval: text("interval", { enum: ["month", "year"] }),
    provider: text("provider"),
    /** Resultado del evento: `ok`, `gateway_not_configured`, `rejected`, … */
    status: text("status").notNull().default("ok"),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("billing_events_user_idx").on(t.userId),
    index("billing_events_type_idx").on(t.type),
  ],
);
