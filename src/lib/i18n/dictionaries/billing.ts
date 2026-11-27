/**
 * Textos de monetización (Etapa 22 — Planes, upgrade y suscripción).
 *
 * Se mantiene separado de `es-MX.ts` por tamaño, pero se mezcla en el
 * diccionario principal: `Dictionary = typeof esMX`, por lo que el acceso
 * tipado (`dict.billing.*`) funciona igual que el resto de claves.
 */
export const billingDictionary = {
  billing: {
    nav: {
      suscripcion: "Planes y suscripción",
      site: "Planes",
    },
    common: {
      free: "Free",
      pro: "Pro",
      currentPlan: "Tu plan actual",
      monthly: "Mensual",
      annual: "Anual",
      perMonth: "/ mes",
      perYear: "/ año",
      upgrade: "Mejorar a Pro",
      viewPlans: "Ver planes",
      viewSubscription: "Ver mi suscripción",
      included: "Incluido",
      notIncluded: "No incluido",
      unlimited: "Ilimitado",
      saveLabel: "Ahorras {amount} al año ({percent}%)",
      equivalent: "equivalente a {amount} / mes",
      mostPopular: "Más elegido",
      currency: "USD",
    },
    pricing: {
      eyebrow: "Planes",
      title: "Dos maneras de usar Money Path.",
      lead:
        "Free ordena tu dinero día a día. Pro abre el sistema completo: deudas, reserva, inversiones, tu ruta y tus informes.",
      tableCaption: "Comparación de funcionalidades",
      groupEssentials: "Lo esencial, gratis",
      groupAdvanced: "El sistema completo",
      featureColumn: "Funcionalidad",
      freeColumn: "Free",
      proColumn: "Pro",
      freeCta: "Empezar gratis",
      proCta: "Mejorar a Pro",
      priceFree: "US$ 0.00",
      priceProYear: "US$ 29.90",
      priceProMonth: "US$ 3.90",
      billingToggle: "Periodicidad",
      note:
        "Los precios están en USD. Free no requiere tarjeta. El cobro se procesa solo cuando hay un proveedor de pagos configurado.",
      noPaymentYet: "Aún no se ha procesado ningún pago en esta demostración.",
      includesTitle: "Qué incluye cada plan",
      faqTitle: "Preguntas honestas",
      faq: [
        {
          q: "¿Puedo pagar hoy?",
          a: "No todavía. El checkout está construido, pero el gateway de pagos no está conectado en este entorno: no simulamos pagos ni activamos Pro sin un cobro real verificado.",
        },
        {
          q: "¿Qué pasa con mis datos si paso de Free a Pro?",
          a: "Nada cambia de lugar. Pro desbloquea funcionalidades sobre los mismos datos; si la suscripción termina, vuelves a Free sin perder registros.",
        },
        {
          q: "¿El plan Free caduca?",
          a: "No. Free incluye ingresos, gastos, orçamento, dashboard básico, hasta 3 metas y patrimonio básico de forma permanente.",
        },
      ],
    },
    gate: {
      badge: "Pro",
      title: "{feature} es parte de Pro",
      lead: "Estás en el plan Free. Desbloquea esta funcionalidad y todo el sistema avanzado de Money Path.",
      bullets: [
        "Metas ilimitadas, dívidas, fondo de emergencia e inversiones",
        "Patrimonio completo, Money Path™ y Money AI",
        "Relatórios, calculadoras y Academia completa",
      ],
      cta: "Ver planes",
      secondary: "Mi suscripción",
      honestNote: "Free sigue disponible: no se cobra nada hasta que haya un pago real.",
    },
    upgrade: {
      title: "Mejorar a Pro",
      subtitle: "Elige la periodicidad. El pago se procesa cuando el gateway esté conectado.",
      chooseInterval: "Periodicidad",
      payNow: "Continuar al pago",
      processing: "Preparando…",
      close: "Cerrar",
      summary: "Resumen",
      dueNow: "Total a pagar hoy",
      dueOnBilling: "Se cobra al inicio de cada periodo",
      noGatewayTitle: "Gateway de pagos no configurado",
      noGatewayBody:
        "No se procesó ningún pago. Tu plan sigue en Free y no se guardó ningún cargo. Cuando se conecte un proveedor real, este mismo flujo redirige al checkout y la activación ocurre por webhook verificado.",
      adapterPendingTitle: "Adaptador pendiente de implementación",
      adapterPendingBody:
        "El proveedor está declarado pero su adaptador aún no está en este repositorio. No se realizó ningún cobro.",
      errorCode: "Código: {code}",
      keepFree: "Continuar en Free",
    },
    subscription: {
      title: "Tu suscripción",
      description: "Plan, estado real, periodo y bitácora de facturación.",
      statusTitle: "Estado de la suscripción",
      emptyStatus: "Sin suscripción activa",
      emptyBody: "Estás en el plan Free. Aún no se ha contratado ni cobrado ninguna suscripción.",
      rows: {
        plan: "Plan",
        status: "Estado",
        interval: "Periodicidad",
        price: "Precio",
        periodStart: "Inicio del periodo",
        periodEnd: "Fin del periodo",
        nextBilling: "Próximo cobro",
        provider: "Proveedor",
        reference: "Referencia",
        goalsLimit: "Límite de metas",
      },
      statusLabels: {
        none: "Sin suscripción",
        pending: "Pendiente de confirmación",
        incomplete: "Pago incompleto",
        active: "Activa",
        trialing: "En prueba",
        past_due: "Pago vencido",
        canceled: "Cancelada",
        expired: "Expirada",
      },
      historyTitle: "Bitácora de facturación",
      historyEmpty: "Todavía no hay eventos de facturación.",
      historyHint: "Cada intento de checkout, respuesta del gateway y webhook queda registrado aquí.",
      gatewayTitle: "Pasarela de pagos",
      gatewayNotConfigured:
        "No hay proveedor de pagos configurado. Ningún cobro se procesa en este entorno y el plan no puede cambiar sin un pago verificado.",
      gatewayConfigured: "Proveedor declarado: {provider}. Adaptador de cobro: pendiente de implementar.",
      upgradeCta: "Mejorar a Pro",
      cancelCta: "Cancelar suscripción",
      cancelUnavailable: "Cancelar solo está disponible con una suscripción real activa.",
      freeNotice:
        "Tu plan no cambia hasta que un webhook firmado confirme un pago. No existen atajos de demostración.",
    },
    goals: {
      limitTitle: "Llegaste al límite de metas del plan Free",
      limitBody:
        "El plan Free incluye {limit} metas activas. Archiva o elimina una meta, o mejora a Pro para tener metas ilimitadas.",
      limitCta: "Ver planes",
      usage: "{used} de {limit} metas usadas",
    },
  },
} as const;
