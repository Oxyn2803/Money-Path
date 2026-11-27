/**
 * Textos de monetização em português brasileiro (Etapa 29).
 *
 * Espelha `billing.ts` (es-MX) com exactamente a mesma forma: `Dictionary`
 * exige a mesma estrutura, e o TypeScript acusa qualquer chave em falta.
 * Os nomes comerciais `Free`, `Pro`, `Money Path™` e `Money AI` mantêm-se.
 */
export const billingDictionaryPtBr = {
  billing: {
    nav: {
      suscripcion: "Planos e assinatura",
      site: "Planos",
    },
    common: {
      free: "Free",
      pro: "Pro",
      currentPlan: "Seu plano atual",
      monthly: "Mensal",
      annual: "Anual",
      perMonth: "/ mês",
      perYear: "/ ano",
      upgrade: "Fazer upgrade para o Pro",
      viewPlans: "Ver planos",
      viewSubscription: "Ver minha assinatura",
      included: "Incluído",
      notIncluded: "Não incluído",
      unlimited: "Ilimitado",
      saveLabel: "Você economiza {amount} por ano ({percent}%)",
      equivalent: "equivalente a {amount} / mês",
      mostPopular: "Mais escolhido",
      currency: "USD",
    },
    pricing: {
      eyebrow: "Planos",
      title: "Duas maneiras de usar o Money Path.",
      lead:
        "O Free organiza o seu dinheiro no dia a dia. O Pro abre o sistema completo: dívidas, reserva, investimentos, a sua rota e os relatórios.",
      tableCaption: "Comparação de funcionalidades",
      groupEssentials: "O essencial, grátis",
      groupAdvanced: "O sistema completo",
      featureColumn: "Funcionalidade",
      freeColumn: "Free",
      proColumn: "Pro",
      freeCta: "Começar grátis",
      proCta: "Fazer upgrade para o Pro",
      priceFree: "US$ 0.00",
      priceProYear: "US$ 29.90",
      priceProMonth: "US$ 3.90",
      billingToggle: "Periodicidade",
      note:
        "Os preços estão em USD. O Free não exige cartão. A cobrança só é processada quando há um provedor de pagamentos configurado.",
      noPaymentYet: "Nenhum pagamento foi processado nesta demonstração.",
      includesTitle: "O que cada plano inclui",
      faqTitle: "Perguntas honestas",
      faq: [
        {
          q: "Posso pagar hoje?",
          a: "Ainda não. O checkout está construído, mas o gateway de pagamentos não está conectado neste ambiente: não simulamos pagos nem ativamos o Pro sem uma cobrança real verificada.",
        },
        {
          q: "O que acontece com os meus dados se eu passar do Free para o Pro?",
          a: "Nada muda de lugar. O Pro desbloqueia funcionalidades sobre os mesmos dados; se a assinatura terminar, você volta ao Free sem perder registros.",
        },
        {
          q: "O plano Free expira?",
          a: "Não. O Free inclui receitas, despesas, orçamento, painel financeiro, até 3 metas e patrimônio básico de forma permanente.",
        },
      ],
    },
    gate: {
      badge: "Pro",
      title: "{feature} faz parte do Pro",
      lead:
        "Você está no plano Free. Desbloqueie esta funcionalidade e todo o sistema avançado do Money Path.",
      bullets: [
        "Metas ilimitadas, dívidas, reserva de emergência e investimentos",
        "Patrimônio completo, Money Path™ e Money AI",
        "Relatórios, calculadoras e Academia completa",
      ],
      cta: "Ver planos",
      secondary: "Minha assinatura",
      honestNote:
        "O Free continua disponível: nada é cobrado até que haja um pagamento real.",
    },
    upgrade: {
      title: "Fazer upgrade para o Pro",
      subtitle:
        "Escolha a periodicidade. A cobrança é processada quando o gateway estiver conectado.",
      chooseInterval: "Periodicidade",
      payNow: "Continuar para o pagamento",
      processing: "Preparando…",
      close: "Fechar",
      summary: "Resumo",
      dueNow: "Total a pagar hoje",
      dueOnBilling: "Cobrado no início de cada período",
      noGatewayTitle: "Gateway de pagamentos não configurado",
      noGatewayBody:
        "Nenhum pagamento foi processado. O seu plano continua no Free e nenhuma cobrança foi registrada. Quando um provedor real for conectado, este mesmo fluxo redireciona para o checkout e a ativação acontece por webhook verificado.",
      adapterPendingTitle: "Adaptador pendente de implementação",
      adapterPendingBody:
        "O provedor está declarado, mas o adaptador ainda não está neste repositório. Nenhuma cobrança foi realizada.",
      errorCode: "Código: {code}",
      keepFree: "Continuar no Free",
    },
    subscription: {
      title: "Sua assinatura",
      description: "Plano, estado real, período e histórico de cobranças.",
      statusTitle: "Estado da assinatura",
      emptyStatus: "Sem assinatura ativa",
      emptyBody:
        "Você está no plano Free. Nenhuma assinatura foi contratada nem cobrada até agora.",
      rows: {
        plan: "Plano",
        status: "Estado",
        interval: "Periodicidade",
        price: "Preço",
        periodStart: "Início do período",
        periodEnd: "Fim do período",
        nextBilling: "Próxima cobrança",
        provider: "Provedor",
        reference: "Referência",
        goalsLimit: "Limite de metas",
      },
      statusLabels: {
        none: "Sem assinatura",
        pending: "Pendente de confirmação",
        incomplete: "Pagamento incompleto",
        active: "Ativa",
        trialing: "Em teste",
        past_due: "Pagamento vencido",
        canceled: "Cancelada",
        expired: "Expirada",
      },
      historyTitle: "Histórico de cobranças",
      historyEmpty: "Ainda não há eventos de cobrança.",
      historyHint:
        "Cada tentativa de checkout, resposta do gateway e webhook fica registrada aqui.",
      gatewayTitle: "Gateway de pagamentos",
      gatewayNotConfigured:
        "Não há provedor de pagamentos configurado. Nenhuma cobrança é processada neste ambiente e o plano não pode mudar sem um pagamento verificado.",
      gatewayConfigured:
        "Provedor declarado: {provider}. Adaptador de cobrança: pendente de implementar.",
      upgradeCta: "Fazer upgrade para o Pro",
      cancelCta: "Cancelar assinatura",
      cancelUnavailable:
        "Cancelar só está disponível com uma assinatura real ativa.",
      freeNotice:
        "O seu plano não muda até que um webhook assinado confirme um pagamento. Não existem atalhos de demonstração.",
    },
    goals: {
      limitTitle: "Você chegou ao limite de metas do plano Free",
      limitBody:
        "O plano Free inclui {limit} metas ativas. Arquive ou exclua uma meta, ou faça upgrade para o Pro e tenha metas ilimitadas.",
      limitCta: "Ver planos",
      usage: "{used} de {limit} metas usadas",
    },
  },
} as const;
