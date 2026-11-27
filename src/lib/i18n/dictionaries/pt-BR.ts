/**
 * Dicionário de Português (Brasil) — localização completa do Money Path.
 *
 * Cada locale exporta um objeto com exatamente a mesma forma de `es-MX`
 * (ver `Dictionary` em `src/lib/i18n/index.ts`): o TypeScript acusa qualquer
 * chave que falte, o que impede telas parcialmente traduzidas.
 *
 * Adaptação, não tradução literal: usamos o vocabulário financeiro do
 * Brasil (receitas, despesas, orçamento, dívidas, economias, patrimônio
 * líquido, reserva de emergência, parcelas) e mantemos as marcas
 * `Money Path™` e `Money AI`.
 */
import { billingDictionaryPtBr } from "./billing-pt-BR";

export const ptBR = {
  meta: {
    name: "Money Path",
    tagline: "Seu dinheiro. Seu plano. Seu patrimônio.",
    description:
      "Não mostramos apenas onde está o seu dinheiro. Mostramos o que fazer com ele.",
  },

  topbar: {
    stage: "Etapa 30 · Redesign",
    region: "Região",
    currency: "Moeda",
  },

  hero: {
    kicker: "Planejamento financeiro pessoal · Brasil",
    title:
      "Não mostramos apenas onde está o seu dinheiro. Mostramos o que fazer com ele.",
    intro:
      "O Money Path transforma suas receitas, despesas, dívidas, economias, metas, investimentos e patrimônio em informação clara, interpretação honesta e um plano de ação.",
    fromLabel: "Sua realidade financeira",
    toLabel: "Sua rota de ação",
    from: ["Receitas", "Despesas", "Dívidas", "Economias", "Metas", "Investimentos", "Patrimônio"],
    to: ["Informação", "Interpretação", "Recomendação", "Plano de ação"],
  },

  status: {
    title: "Estado da fundação",
    subtitle: "Verificações reais do sistema a cada carregamento desta página.",
    live: "Ao vivo",
    loading: "Verificando serviços…",
    dbLabel: "Banco de dados",
    dbSub: "PostgreSQL · Drizzle ORM",
    dbOk: "Conectado",
    dbError: "Sem conexão",
    settingsLabel: "Configuração base",
    settingsSub: "Salva na tabela app_settings",
    localeRow: "Região ativa",
    currencyRow: "Moeda padrão",
    sourceDb: "valores salvos no banco de dados",
    sourceFallback: "valores padrão em código (o banco ainda não respondeu)",
    settingsUnavailable: "Indisponível no momento",
    moneyLabel: "Núcleo monetário",
    moneySub: "Cálculo em centavos inteiros, sem ponto flutuante",
    moneyOk: "Precisão verificada",
    moneyError: "Erro de precisão",
    errorTitle: "Não foi possível concluir a verificação",
    errorHint: "Recarregue a página para tentar de novo.",
  },

  modules: {
    title: "Módulos do produto",
    subtitle:
      "Capacidades planejadas do planejador. Cada módulo é construído na sua própria etapa.",
    status: {
      planificado: "Planejado",
      en_desarrollo: "Em desenvolvimento",
      disponible: "Disponível",
    },
    items: {
      presupuesto: {
        name: "Orçamento",
        desc: "Defina limites por categoria e acompanhe em tempo real.",
      },
      ingresos: {
        name: "Receitas",
        desc: "Registre suas entradas de dinheiro e a origem delas.",
      },
      deudas: {
        name: "Dívidas",
        desc: "Saldos, taxas e estratégia de pagamento das suas dívidas.",
      },
      gastos_fijos: {
        name: "Despesas fixas",
        desc: "Compromissos constantes: aluguel, contas, assinaturas.",
      },
      gastos_variables: {
        name: "Despesas variáveis",
        desc: "Compras do dia a dia com controle por categoria.",
      },
      ingresos_recurrentes: {
        name: "Receitas recorrentes",
        desc: "Entradas periódicas: salário, aluguéis, honorários.",
      },
      cobros_futuros: {
        name: "Recebimentos futuros",
        desc: "Dinheiro a receber, com datas estimadas de pagamento.",
      },
      plazos: {
        name: "Pagamentos parcelados",
        desc: "Compras em parcelas com saldo pendente visível.",
      },
      categorias: {
        name: "Categorias",
        desc: "Sua própria estrutura para classificar cada movimento.",
      },
      fondo_emergencia: {
        name: "Reserva de emergência",
        desc: "Colchão para imprevistos, com meta e progresso.",
      },
      metas: {
        name: "Metas financeiras",
        desc: "Objetivos com valor, prazo e plano de aportes.",
      },
      inversiones: {
        name: "Investimentos",
        desc: "Instrumentos, aportes e desempenho da carteira.",
      },
      patrimonio: {
        name: "Patrimônio",
        desc: "Ativos menos dívidas: o quadro completo da sua riqueza.",
      },
      calculadoras: {
        name: "Calculadoras",
        desc: "Ferramentas de juros, dívidas e economias.",
      },
      educacion: {
        name: "Educação financeira",
        desc: "Conteúdo para decidir melhor em cada etapa da sua rota.",
      },
      dashboard: {
        name: "Painel financeiro",
        desc: "Resumo executivo da sua situação e da sua rota.",
      },
    },
  },

  roadmap: {
    title: "Rota de desenvolvimento",
    subtitle: "O produto cresce etapa por etapa, sem atalhos nem funcionalidades adiantadas.",
    stage: "Etapa",
    current: "Etapa atual",
    completed: "Concluída",
    inProgress: "Em andamento",
    planned: "Planejada",
    pending: "A definir",
    stages: {
      s0: {
        title: "Fundação",
        desc: "Base técnica do produto: internacionalização, núcleo monetário com precisão de centavos, configuração em banco de dados, sistema de design e verificações ao vivo.",
      },
      s1: {
        title: "Identidade visual e Design System",
        desc: "Paleta própria, tokens semânticos, componentes acessíveis e padrões visuais financeiros.",
      },
      s2: {
        title: "Arquitetura do aplicativo",
        desc: "Rotas, barra lateral, navegação mobile, páginas base e proteção de acesso.",
      },
      s3: {
        title: "Banco de dados",
        desc: "Modelo completo multimoeda com auditoria, integridad e exclusão lógica.",
      },
      s4: {
        title: "Autenticação",
        desc: "Cadastro, sessão persistente, recuperação de senha e perfil financeiro automático.",
      },
      s5: {
        title: "Onboarding financeiro",
        desc: "Diagnóstico inicial em 10 passos e primeiro estado do Money Path.",
      },
      s6: {
        title: "Painel financeiro",
        desc: "Página Início completa: indicadores personalizáveis, gráficos e o próximo passo da sua rota.",
      },
      s7: {
        title: "Orçamento",
        desc: "Receitas, despesas fixas e variáveis: registro, recorrências, recebimentos futuros, categorias, importação e filtros.",
      },
      s8: {
        title: "Recorrências financeiras",
        desc: "Modelos de receitas e despesas recorrentes com geração consistente de ocorrências, edição por escopo e recebimentos futuros separados.",
      },
      s9: {
        title: "Compras parceladas",
        desc: "Parcelas que dividem o gasto mês a mês, com pagamento por parcela e controle de progresso.",
      },
      s10: {
        title: "Dívidas",
        desc: "Cadastro completo, alertas de vencimento, plano de pagamento por prioridade e comparação de estratégias.",
      },
      s11: {
        title: "Reserva de emergência",
        desc: "Gasto essencial calculado por categorias (sem discrições), meta em meses e visualização do progresso.",
      },
      s12: {
        title: "Metas financeiras",
        desc: "Objetivos com categoria, prazo e prioridade; aportes que atualizam o progresso e a projeção no ritmo atual.",
      },
      s13: {
        title: "Investimentos",
        desc: "Contas e instrumentos com aportes, ganho ou perda e evolução do patrimônio investido.",
      },
      s14: {
        title: "Patrimônio",
        desc: "Ativos, passivos, patrimônio líquido e histórico mensal de evolução.",
      },
      s15: {
        title: "Calculadoras",
        desc: "Juros compostos, metas, primeiro grande objetivo e comprar versus alugar.",
      },
      s16: {
        title: "Money Path™",
        desc: "O motor que transforma seus dados financeiros em uma rota de ação com prioridades e impacto estimado.",
      },
      s17: {
        title: "Money AI",
        desc: "Assistente contextual que responde sobre o seu próprio dinheiro com dados reais, histórico e sugestões.",
      },
      s18: {
        title: "Relatórios e insights",
        desc: "Relatórios por período (1/3/6/12 meses), comparação entre períodos e insights automáticos.",
      },
      s19: {
        title: "Academia",
        desc: "Área educativa com categorias, conteúdos básicos, progresso, concluídos e favoritos.",
      },
      s20: {
        title: "Notificações",
        desc: "Centro de notificações com tipos configuráveis, contador, leitura e preferências.",
      },
      s21: {
        title: "Configurações",
        desc: "Perfil, preferências (tema, moeda, notificações, painel), privacidade e conta.",
      },
      s22: {
        title: "Monetização",
        desc:
          "Planos Free e Pro, tabela comparativa, upgrade com periodicidade mensal ou anual, estado da assinatura e bloqueio elegante dos recursos premium.",
      },
      s23: {
        title: "Auditoria de segurança e finanças",
        desc:
          "Autenticação, autorização, isolamento por usuário, segredos, cabeçalhos, validação de entradas e precisão monetária com suíte automatizada.",
      },
      s24: {
        title: "Experiência responsiva",
        desc:
          "Meta viewport ausente corrigida, modais como bottom-sheet, safe-area, alvos de toque ≥ 44 px, overflow de montos e gráficos, tabelas deslizáveis.",
      },
      s25: {
        title: "Polimento de experiência",
        desc:
          "Hierarquia, contraste, microinterações, feedback de avisos, estados vazio e de carga, banner do Money Path™ e Money AI contextual.",
      },
      s26: {
        title: "Auditoria funcional",
        desc:
          "22 fluxos principais testados com um cenário realista; 4 bugs corrigidos (500 na Reserva, média mensal do Money AI e do Money Path, tema inválido).",
      },
      s27: {
        title: "Preparação para produção",
        desc:
          "Favicon, metadata e Open Graph, robots e sitemap, error boundaries, páginas legais, .env.example e checklist de implantação.",
      },
      s28: {
        title: "Auditoria final do produto",
        desc:
          "265 verificações em verde: módulos, consistência de dados, cálculos, UX, Money Path/AI, mobile, segurança, performance e planos. 3 bugs corrigidos.",
      },
      s29: {
        title: "Localização em português brasileiro",
        desc:
          "Dicionário pt-BR completo, moeda e datas no padrão do Brasil, troca de idioma sem sair da sessão e Money AI respondendo em português.",
      },
      s30: {
        title: "Redesign visual — dark/light mode",
        desc:
          "Paleta verde-lima (#a4f73d), fundo escuro #101210, tipografia Inter, logo Money Path com gradiente, modo claro e escuro no aplicativo.",
      },
    },

    upcomingTitle: "Próximas etapas",
    upcomingDesc:
      "Cada nova etapa é definida e aprovada antes de ser construída. Nada é desenvolvido fora da sua etapa.",
  },

  settings: {
    title: "Configurações",
    subtitle: "Sua conta, suas preferências e seus dados.",
    tabs: {
      profile: "Perfil",
      preferences: "Preferências",
      privacy: "Privacidade",
      account: "Conta",
    },
    common: {
      save: "Salvar alterações",
      saving: "Salvando…",
      saved: "Alterações salvas",
      error: "Não foi possível salvar. Tente de novo.",
      currentData: "Atual",
      optional: "Opcional",
    },
    profile: {
      title: "Perfil",
      desc: "É assim que você se identifica no Money Path.",
      name: "Nome",
      namePlaceholder: "Seu nome",
      email: "E-mail",
      emailDesc: "Trocar o e-mail vale imediatamente e sua sessão continua ativa.",
      newEmail: "Novo e-mail",
      country: "País",
      currency: "Moeda",
      language: "Idioma",
      languageSoon: "Em breve",
      languageActive: "Ativo",
      emailConfirm: "Senha atual",
      changeEmail: "Alterar e-mail",
      emailChanged: "E-mail atualizado",
      emailError: "Não foi possível alterar o e-mail. Verifique a senha atual.",
      nameError: "Digite seu nome.",
    },
    preferences: {
      title: "Preferências",
      theme: {
        name: "Tema",
        desc: "A aparência escura chega com o refinamento do design system.",
        light: "Claro",
        dark: "Escuro",
        soon: "Em breve",
        saved: "Preferência salva",
      },
      currencySection: {
        name: "Moeda padrão",
        desc: "Será usada no seu painel, nos relatórios e nos módulos novos.",
        warningTitle: "Você tem registros em outra moeda",
        warningBody:
          "Trocar a moeda padrão não converte seus registros: cada movimento mantém a sua e os indicadores passam a mostrar apenas a moeda padrão. Confirme explicitamente para continuar.",
        confirmLabel: "Entendi e quero trocar para {currency}",
        blocked: "Falta sua confirmação explícita para trocar de moeda.",
        saved: "Moeda padrão atualizada",
      },
      notificationsSection: {
        name: "Notificações",
        desc: "Escolha quais avisos você quer receber no seu centro.",
        saved: "Preferências de notificação salvas",
      },
      dashboardSection: {
        name: "Painel",
        desc: "Indicadores visíveis no seu Início.",
        saved: "Indicadores do painel salvos",
        minOne: "Deixe pelo menos um indicador visível.",
      },
    },
    privacy: {
      title: "Privacidade",
      desc: "Controles reais sobre os seus dados, conforme a arquitetura permite hoje.",
      localModel: {
        name: "Análise nos seus dados",
        desc:
          "Money AI e Money Path™ usam apenas os dados armazenados neste servidor. Não há LLM externo: nada da sua informação é enviado a serviços de IA de terceiros.",
        badge: "Sem IA externa",
      },
      export: {
        name: "Exportar meus dados",
        desc: "Baixe um arquivo JSON com seu perfil, preferências e registros financeiros.",
        action: "Baixar exportação",
        done: "Exportação pronta",
        error: "Não foi possível gerar a exportação.",
      },
      aiHistory: {
        name: "Histórico do Money AI",
        desc: "Suas conversas ficam salvas para você revisá-las.",
        action: "Apagar histórico de IA",
        confirmTitle: "Apagar seu histórico do Money AI?",
        confirmDesc:
          "Suas conversas e mensagens de IA serão excluídas permanentemente. Os seus dados financeiros NÃO são tocados.",
        confirmLabel: "Apagar histórico",
        done: "Histórico de IA apagado",
      },
      academy: {
        name: "Progresso da Academia",
        desc: "Seus favoritos e conteúdos concluídos.",
        action: "Reiniciar progresso",
        confirmTitle: "Reiniciar seu progresso na Academia?",
        confirmDesc: "Seus concluídos e favoritos serão apagados. O catálogo não muda.",
        confirmLabel: "Reiniciar progresso",
        done: "Progresso reiniciado",
      },
      dangerNote:
        "O Money Path não exclui dados financeiros automaticamente. Qualquer exclusão permanente da conta é tratada como solicitação e exige confirmação explícita; seus dados permanecem intactos até que o processo seja aprovado.",
    },
    account: {
      title: "Conta",
      password: {
        name: "Alterar senha",
        desc: "Use pelo menos 8 caracteres.",
        current: "Senha atual",
        next: "Nova senha",
        confirm: "Repita a nova senha",
        action: "Alterar senha",
        mismatch: "As novas senhas não coincidem.",
        done: "Senha atualizada",
        error: "Não foi possível alterar a senha. Verifique a atual.",
      },
      sessions: {
        name: "Sessão ativa",
        desc: "Sua sessão fica ativa por até 30 dias e é renovada com a sua atividade.",
      },
      logout: {
        name: "Sair da conta",
        action: "Sair",
      },
      deletion: {
        name: "Excluir conta",
        desc:
          "Solicitar a exclusão não apaga nada imediatamente. A solicitação fica registrada e é revisada com confirmação explícita; seus dados financeiros permanecem intactos até que o processo seja aprovado.",
        typeToConfirm: "Digite {word} para confirmar sua solicitação",
        request: "Solicitar exclusão da conta",
        requestedAt: "Solicitação enviada em {date}",
        statusPending: "Pendente",
        cancel: "Cancelar solicitação",
        canceled: "Solicitação cancelada",
        submitted: "Solicitação registrada. Nenhum dado foi excluído.",
        word: "EXCLUIR",
        error: "Não foi possível registrar a solicitação.",
      },
    },
  },

  differentiators: {
    title: "O diferencial do Money Path",
    subtitle: "Duas capacidades próprias que transformam dados em direção.",
    path: {
      name: "Money Path™",
      desc:
        "Transforma sua situação financeira completa em uma rota de ação: o que priorizar, o que ajustar e qual é o próximo passo.",
      note: "A rota é sempre uma orientação: a decisão final é sua.",
    },
    ai: {
      name: "Money AI",
      desc:
        "Converse sobre os seus próprios dados financeiros e receba explicações e recomendações contextualizadas à sua situação.",
      disclaimer:
        "O Money AI oferece orientação geral com base nos seus dados. Não substitui a consultoria financeira profissional nem toma decisões por você.",
    },
  },

  footer: {
    principle:
      "O Money Path nunca toma decisões financeiras reais por você: orienta para que você decida com clareza.",
    builtFor: "Construído para o mercado brasileiro · Preparado para LATAM",
    stageNote: "Etapa 29 · Localização pt-BR",
    privacy: "Política de privacidade",
    terms: "Termos de uso",
  },

  states: {
    loading: "Carregando…",
    error: "Ocorreu um erro.",
    retry: "Tentar de novo",
    empty: "Ainda não há dados.",
    success: "Pronto.",
  },

  nav: {
    more: "Mais",
    menuTitle: "Todas as seções",
    menuDescription: "Navegação completa do Money Path",
    sections: {
      panorama: "Visão geral",
      diaADia: "Dia a dia",
      crecimiento: "Crescimento",
      herramientas: "Ferramentas",
      cuenta: "Conta",
    },
    items: {
      inicio: "Início",
      resumen: "Resumo",
      presupuesto: "Orçamento",
      deudas: "Dívidas",
      fondo: "Reserva de emergência",
      metas: "Metas",
      inversiones: "Investimentos",
      patrimonio: "Patrimônio",
      money_path: "Money Path",
      money_ai: "Money AI",
      calculadoras: "Calculadoras",
      academia: "Academia",
      notificaciones: "Notificações",
      configuracion: "Configurações",
      suscripcion: "Planos e assinatura",
    },
    links: {
      site: "Site",
      design: "Design System",
    },
    stageNote: "Etapa 29 · Localização pt-BR",
  },

  pages: {
    common: {
      structureReady: "Estrutura pronta",
      moduleActive: "Módulo ativo",
      emptyTitle: "Nada por aqui ainda",
      emptyDescription:
        "Este espaço já existe. O módulo é implementado por completo na sua etapa correspondiente.",
      reservedFor: "Espaço reservado para",
      breadcrumbHome: "Início",
    },
    inicio: {
      title: "Início",
      description:
        "Seu ponto de partida: o estado do seu dinheiro e o próximo passo da sua rota.",
      dashboardNote: "O painel de início é construído na sua própria etapa.",
    },
    resumen: {
      title: "Resumo",
      description:
        "Uma visão rápida de receitas, despesas, dívidas e do avance das suas metas.",
    },
    presupuesto: {
      title: "Orçamento",
      description: "Limites por categoria e acompanhamento do seu gasto em tempo real.",
    },
    deudas: {
      title: "Dívidas",
      description: "Saldos, taxas e estratégia de pagamento para sair delas.",
    },
    fondo: {
      title: "Reserva de emergência",
      description: "Sua reserva para imprevistos: meta, progresso e aportes.",
    },
    metas: {
      title: "Metas",
      description: "Objetivos com valor, prazo e plano de aportes.",
    },
    inversiones: {
      title: "Investimentos",
      description: "Seus instrumentos, aportes e desempenho.",
    },
    patrimonio: {
      title: "Patrimônio",
      description: "Ativos menos dívidas: o quadro completo da sua riqueza.",
    },
    money_path: {
      title: "Money Path",
      description: "Sua situação financeira completa transformada em uma rota de ação.",
    },
    money_ai: {
      title: "Money AI",
      description: "Converse sobre os seus dados e receba orientação contextual.",
    },
    calculadoras: {
      title: "Calculadoras",
      description: "Ferramentas de juros, dívidas e economias.",
    },
    academia: {
      title: "Academia",
      description: "Educação financeira para decidir melhor.",
    },
    suscripcion: {
      title: "Planos e assinatura",
      description: "Seu plano atual, o estado real da assinatura e o histórico de cobranças.",
    },
    notificaciones: {
      title: "Notificações",
      description: "Avisos importantes sobre o seu plano e os seus movimentos.",
    },
    configuracion: {
      title: "Configurações",
      description: "Preferências de conta, região e moeda.",
    },
  },

  notFound: {
    code: "404",
    title: "Página não encontrada",
    description: "A rota que você procura não existe ou mudou de endereço.",
    backApp: "Voltar ao aplicativo",
    backHome: "Ir para o início do site",
  },

  loadingScreen: {
    title: "Preparando o seu espaço…",
  },

  auth: {
    backToSite: "Voltar ao site",
    signOut: "Sair",
    session: "Sessão ativa",
    login: {
      title: "Entrar",
      subtitle: "Continue a sua rota financeira.",
      email: "E-mail",
      emailPlaceholder: "voce@email.com.br",
      password: "Senha",
      submit: "Entrar",
      forgot: "Esqueceu a sua senha?",
      noAccount: "Ainda não tem conta?",
      register: "Criar conta",
      invalidCredentials: "E-mail ou senha incorretos.",
    },
    register: {
      title: "Crie a sua conta",
      subtitle: "O seu plano começa com um cadastro de um minuto.",
      name: "Seu nome",
      namePlaceholder: "Como você se chama?",
      email: "E-mail",
      emailPlaceholder: "voce@email.com.br",
      password: "Senha",
      confirm: "Confirmar senha",
      submit: "Criar conta",
      hasAccount: "Já tem uma conta?",
      login: "Entrar",
      emailTaken: "Este e-mail já está cadastrado. Tente entrar.",
      passwordMin: "A senha deve ter pelo menos 8 caracteres.",
      passwordMismatch: "As senhas não coincidem.",
      emailInvalid: "Digite um e-mail válido.",
      nameRequired: "Digite o seu nome.",
      created: "Conta criada. Boas-vindas à sua rota.",
    },
    forgot: {
      title: "Recuperar senha",
      subtitle: "Digite o seu e-mail e enviaremos um link para redefinir a senha.",
      email: "E-mail",
      submit: "Enviar link",
      sent: "Se existir uma conta com esse e-mail, o link já está a caminho.",
      back: "Voltar para o login",
      devTitle: "Ambiente de testes sem serviço de e-mail",
      devDescription: "Use este link para continuar a redefinição:",
    },
    reset: {
      title: "Nova senha",
      subtitle: "Escolha a nova senha da sua conta.",
      newPassword: "Nova senha",
      confirm: "Confirmar senha",
      submit: "Salvar senha",
      success: "Senha atualizada. Você já pode entrar.",
      invalidToken: "O link não é válido ou já expirou. Solicite um novo.",
      goToLogin: "Ir para o login",
    },
    errors: {
      generic: "Não foi possível concluir a operação. Tente de novo.",
    },
  },

  onboarding: {
    title: "Seu ponto de partida",
    subtitle: "Algumas perguntas rápidas para entender a sua situação. Sem dados exatos, sem pressão.",
    progress: "Etapa {step} de {total}",
    back: "Voltar",
    next: "Continuar",
    finish: "Ver meu ponto de partida",
    saving: "Salvando…",
    optional: "Opcional: uma estimativa já serve.",
    required: "Este dado é necessário para continuar.",
    invalidAmount: "Digite um valor válido (por exemplo: 12.500,00).",
    negativeAmount: "O valor não pode ser negativo.",
    alreadyCompleted:
      "Você já concluiu o diagnóstico. Pode atualizar as respostas quando quiser.",
    serverError: "Não foi possível salvar as suas respostas. Tente de novo.",

    steps: {
      country: {
        title: "Onde você mora?",
        desc: "Isso nos ajuda a adaptar o plano ao seu contexto.",
      },
      currency: {
        title: "Em que moeda você organiza o seu dinheiro?",
        desc: "Sugerimos a do seu país; você pode trocar. Todo o plano passará a usar esta moeda.",
      },
      income: {
        title: "Qual é a sua renda mensal aproximada?",
        desc: "Salário, negócio ou outras entradas. Uma estimativa honesta já basta.",
        placeholder: "18.500,00",
      },
      frequency: {
        title: "Com que frequência você recebe a sua renda?",
        desc: "Assim entendemos melhor o seu fluxo de dinheiro.",
      },
      expenses: {
        title: "Quanto você gasta por mês no essencial?",
        desc: "Aluguel, contas, comida, transporte: o indispensável para viver.",
        placeholder: "11.200,00",
      },
      debts: {
        title: "Você tem dívidas?",
        desc: "Cartões, empréstimos ou financiamentos. Só o panorama geral.",
        yes: "Sim, tenho dívidas",
        no: "Não tenho dívidas",
        amountLabel: "Aproximadamente, quanto somam?",
        amountPlaceholder: "9.500,00",
      },
      reserve: {
        title: "Você tem uma reserva para emergências?",
        desc: "Dinheiro separado para imprevistos.",
        placeholder: "5.000,00",
      },
      investments: {
        title: "Você tem investimentos?",
        desc: "Tesouro, fundos, ações ou outros instrumentos.",
        placeholder: "0,00",
      },
      netWorth: {
        title: "Seu patrimônio aproximado",
        desc: "O que você tem (casa, carro, economias) menos o que deve.",
        placeholder: "85.000,00",
      },
      goal: {
        title: "Qual é o seu principal objetivo hoje?",
        desc: "A sua rota é construída a partir daí.",
      },
    },

    countries: {
      MX: "México",
      BR: "Brasil",
      CO: "Colômbia",
      CL: "Chile",
      AR: "Argentina",
      PE: "Peru",
      US: "Estados Unidos",
      OTHER: "Outro país",
    } as Record<string, string>,

    frequencies: {
      monthly: "Mensal",
      biweekly: "Quinzenal",
      weekly: "Semanal",
      other: "Outra",
    } as Record<string, string>,

    goals: {
      salir_deudas: { label: "Sair das dívidas", desc: "Se libertar do que você deve." },
      crear_reserva: { label: "Criar reserva", desc: "Um colchão para imprevistos." },
      ahorrar: { label: "Economizar", desc: "Guardar dinheiro de forma constante." },
      comprar_algo: { label: "Comprar algo", desc: "Um objetivo concreto em mente." },
      viajar: { label: "Viajar", desc: "Financiar uma experiência." },
      invertir: { label: "Investir", desc: "Fazer o dinheiro crescer." },
      patrimonio: { label: "Construir patrimônio", desc: "Riqueza de longo prazo." },
      otro: { label: "Outro", desc: "Você define." },
    },

    result: {
      title: "Já temos uma primeira visão da sua situação financeira.",
      intro:
        "{name}, este é o seu ponto de partida. A partir daqui, o Money Path transforma esses dados em uma rota.",
      incomeLabel: "Renda mensal",
      expensesLabel: "Despesas essenciais",
      balanceLabel: "Saldo mensal",
      debtsLabel: "Dívidas",
      reserveLabel: "Reserva atual",
      investmentsLabel: "Investimentos",
      netWorthLabel: "Patrimônio aproximado",
      goalLabel: "Objetivo principal",
      balancePositive:
        "A sua renda cobre as despesas essenciais: há espaço para avançar.",
      balanceNegative:
        "As suas despesas essenciais superam a renda: a rota começa por aqui.",
      balanceZero: "A sua renda iguala as despesas essenciais: a margem é apertada.",
      disclaimer:
        "Este diagnóstico é orientativo e não substitui consultoria financeira profissional.",
      goToApp: "Ir para a minha rota",
      updateAnswers: "Atualizar respostas",
      firstStateSaved: "Primeiro estado do Money Path criado.",
    },
  },

  dashboard: {
    greeting: "Olá, {name}",
    subtitle: "A sua situação financeira de relance.",
    personalize: "Personalizar",
    estimatedBadge: "Estimado",
    realBadge: "Registrado",
    sourceDiagnostic: "Estimado a partir do seu diagnóstico inicial",
    sourceReal: "Com os seus movimentos registrados",
    currencyNote: "Valores em {currency}",

    customize: {
      title: "Indicadores visíveis",
      desc: "Escolha quais indicadores aparecem no seu Início.",
      save: "Salvar",
      cancel: "Cancelar",
      saved: "Indicadores atualizados",
      saveError: "Não foi possível salvar as suas preferências. Tente de novo.",
      minOne: "Deixe pelo menos um indicador visível.",
    },

    indicators: {
      ingresos: "Receitas do mês",
      gastos: "Despesas do mês",
      saldo: "Saldo do mês",
      ahorro: "Economias e investimentos",
      deudas: "Dívidas",
      fondo: "Reserva de emergência",
      patrimonio: "Patrimônio líquido",
    },

    sections: {
      situation: "Situação atual",
      progress: "O seu progresso",
      nextStep: "Money Path™",
    },

    charts: {
      incomeVsExpenses: "Receitas versus despesas",
      lastMonths: "Últimos 6 meses",
      income: "Receitas",
      expenses: "Despesas",
      emptyMovements:
        "Você ainda não registrou movimentos. Quando registrar, verá aqui a sua evolução mês a mês.",
      distribution: "Distribuição das despesas",
      currentMonth: "Este mês",
      emptyExpenses: "Sem despesas registradas neste mês.",
      netWorth: "Evolução do patrimônio",
      startingPoint: "Ponto de partida",
      netWorthSingle:
        "Este é o seu ponto de partida do diagnóstico. A curva crescerá conforme você atualizar o patrimônio.",
      goals: "Progresso das metas",
      goalsEmpty: "Quando criar as suas metas, verá aqui o avance delas.",
      derivedNote: "Derivada do seu objetivo principal",
      goalNames: {
        "diag-reserva": "Reserva de emergência",
        "diag-deudas": "Sair das dívidas",
        "diag-inversion": "Começar a investir",
      },
    },

    nextStep: {
      title: "Seu próximo passo",
      incomplete: "Complete as suas informações financeiras para criar a sua rota.",
      incompleteCta: "Completar diagnóstico",
      disclaimer: "Uma orientação baseada nos seus dados; não é consultoria financeira.",
      steps: {
        gastos_exceden: {
          title: "Equilibre as suas receitas e despesas",
          desc:
            "Neste mês as suas despesas superam as receitas. Revisar o orçamento é o melhor ponto de partida.",
          cta: "Ir para o Orçamento",
        },
        deudas: {
          title: "Monte o seu plano contra as dívidas",
          desc:
            "Você registra aproximadamente {amount} em dívidas. Organizá-las é o passo que mais libera a sua rota.",
          target: "Comece por {name}: é a sua dívida prioritária.",
          cta: "Ir para Dívidas",
        },
        fondo: {
          title: "Fortaleça a sua reserva de emergência",
          desc:
            "A sua reserva atual está abaixo da meta. Cada aporte te aproxima da tranquilidade.",
          cta: "Ir para a Reserva de emergência",
        },
        invertir: {
          title: "Dê o primeiro passo para investir",
          desc:
            "O seu saldo é positivo e você ainda não registra investimentos. Veja como fazer o dinheiro crescer.",
          cta: "Ir para Investimentos",
        },
        patrimonio: {
          title: "Continue construindo patrimônio",
          desc:
            "A sua situação é estável. Registrar o patrimônio mostra o quanto você cresce ao longo do tempo.",
          cta: "Ir para Patrimônio",
        },
      },
    },
  },

  presupuesto: {
    tabs: {
      ingresos: "Receitas",
      fijos: "Despesas fixas",
      variables: "Despesas variáveis",
    },
    summary: {
      ingresos: "Receitas",
      gastos: "Despesas",
      gastosHint: "Pagas e pendentes",
      ahorro: "Economias / investimento",
      ahorroHint: "Disponível depois das suas despesas",
      saldo: "Saldo",
    },
    periods: {
      this_month: "Este mês",
      last_month: "Mês passado",
      last_3: "Últimos 3 meses",
      last_6: "Últimos 6 meses",
      all: "Tudo",
    },
    filters: {
      period: "Período",
      category: "Categoria",
      type: "Tipo",
      status: "Situação",
      allCategories: "Todas as categorias",
      allTypes: "Todos os tipos",
      allStatuses: "Todas as situações",
      clear: "Limpar filtros",
      results: "{count} movimentos",
    },
    types: {
      fixed: "Fixo",
      variable: "Variável",
    },
    statuses: {
      received: "Recebido",
      pending: "Pendente",
      cancelled: "Cancelado",
      paid: "Pago",
    },
    actions: {
      new: "Novo",
      newIncome: "Nova receita",
      newExpense: "Nova despesa",
      import: "Importar",
      categories: "Categorias",
      markReceived: "Marcar como recebido",
      markPaid: "Marcar como pago",
      cancelMovement: "Cancelar movimento",
      delete: "Excluir",
      received: "Receita marcada como recebida",
      paid: "Despesa marcada como paga",
      cancelled: "Movimento cancelado",
      deleted: "Movimento excluído",
      saved: "Movimento salvo",
      error: "Não foi possível concluir a operação. Tente de novo.",
    },
    list: {
      recurring: "Recorrente",
      future: "Recebimento futuro",
      emptyIngresos: "Você ainda não registrou receitas neste período.",
      emptyGastos: "Você ainda não registrou despesas deste tipo neste período.",
      emptyHint: "Adicione o seu primeiro movimento ou importe o extrato da conta.",
      noCategory: "Sem categoria",
    },
    form: {
      incomeTitle: "Registrar receita",
      expenseTitle: "Registrar despesa",
      date: "Data",
      description: "Descrição",
      descriptionPlaceholder: "Ex.: salário de setembro",
      amount: "Valor",
      category: "Categoria",
      noCategory: "Sem categoria",
      recurrence: "Recorrência",
      recurrenceNone: "Não repete",
      frequencies: {
        weekly: "Semanal",
        biweekly: "Quinzenal",
        monthly: "Mensal",
        quarterly: "Trimestral",
        yearly: "Anual",
      },
      future: "Ainda não recebo (recebimento futuro)",
      futureHint: "É registrado como pendente e você pode marcá-lo quando chegar.",
      type: "Tipo",
      status: "Situação",
      note: "Observação",
      notePlaceholder: "Opcional",
      save: "Salvar",
      saving: "Salvando…",
      cancel: "Cancelar",
      errors: {
        date: "Escolha uma data válida.",
        description: "Digite uma descrição.",
        amount: "Digite um valor válido maior que zero.",
        category: "A categoria não existe ou não é sua.",
        notFound: "Este movimento já não existe.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    import: {
      title: "Importar extrato da conta",
      desc:
        "Cole ou envie um CSV com os seus movimentos. Não duplicamos transações: as que já existem são omitidas.",
      templateLabel: "Formato esperado (com ou sem cabeçalho):",
      template: "data,descricao,valor,tipo,categoria",
      rules:
        "valor negativo = despesa · tipo opcional (receita|despesa) · categoria opcional (é criada se não existir) · máximo de 500 linhas.",
      placeholder:
        "2026-09-01,Salário,18500.50,receita,Salário\n2026-09-03,Mercado,-1250.99,,Mercado e despensa",
      chooseFile: "Escolher arquivo .csv",
      submit: "Importar movimentos",
      submitting: "Importando…",
      resultOk:
        "Importação concluída: {imported} novos · {duplicates} duplicados omitidos · {errors} com erro.",
      resultNone: "Não encontramos movimentos novos para importar.",
      empty: "Cole o conteúdo do CSV ou escolha um arquivo.",
      bankNote:
        "A integração bancária chegará em uma próxima etapa; por enquanto, importe os extratos em CSV.",
    },
    categories: {
      title: "As suas categorias",
      desc: "Crie categorias próprias ou arquive as que não usa mais.",
      incomeSection: "Categorias de receita",
      expenseSection: "Categorias de despesa",
      placeholder: "Nova categoria…",
      create: "Criar",
      creating: "Criando…",
      archive: "Arquivar",
      archived: "Categoria arquivada",
      created: "Categoria criada",
      system: "padrão",
      exists: "Você já tem uma categoria com esse nome.",
      invalid: "Digite um nome para a categoria.",
      typeLabel: "Tipo",
    },
    confirmDelete: {
      title: "Excluir este movimento?",
      desc:
        "Não é apagado de forma permanente: fica arquivado e deixa de contar nos seus indicadores.",
      confirm: "Excluir",
    },
    confirmCancel: {
      title: "Cancelar este movimento?",
      desc: "Deixará de contar no seu resumo. Você pode excluí-lo se foi um engano.",
      confirm: "Cancelar movimento",
    },
  },

  presupuestoAccess: {
    recurring: "Recorrências",
    futureReceipts: "Recebimentos futuros",
    installments: "Compras parceladas",
    debts: "Dívidas",
  },

  recurring: {
    pageTitle: "Recorrências",
    pageDescription:
      "Receitas e despesas que se repetem. As ocorrências futuras são geradas sozinhas, sem duplicatas.",
    back: "Voltar ao Orçamento",
    new: "Nova recorrência",
    empty: "Você ainda não tem recorrências.",
    emptyHint: "Crie o seu primeiro modelo: salário, aluguel, assinaturas…",
    next: "Próxima",
    since: "Desde",
    until: "Até",
    noEnd: "Sem data final",
    occurrences: "ocorrências geradas",
    statuses: {
      active: "Ativa",
      paused: "Pausada",
      completed: "Concluída",
      cancelled: "Cancelada",
    },
    kinds: {
      income: "Receita recorrente",
      expense: "Despesa recorrente",
    },
    form: {
      createTitle: "Nova recorrência",
      editTitle: "Editar recorrência",
      kind: "Tipo de recorrência",
      description: "Descrição",
      descriptionPlaceholder: "Ex.: aluguel do apartamento",
      amount: "Valor por ocorrência",
      category: "Categoria",
      noCategory: "Sem categoria",
      frequency: "Frequência",
      frequencies: {
        monthly: "Mensal",
        biweekly: "Quinzenal",
        weekly: "Semanal",
        bimonthly: "Bimestral",
        quarterly: "Trimestral",
        yearly: "Anual",
      },
      startDate: "Data inicial",
      endDate: "Data final (opcional)",
      scope: "Aplicar alterações em",
      scopes: {
        one: "Somente esta ocorrência",
        following: "Esta e as próximas",
        all: "Toda a série",
      },
      scopeFollowingHint:
        "As ocorrências futuras já geradas são recriadas com os novos valores.",
      refDate: "Ocorrência de referência",
      save: "Salvar",
      saving: "Salvando…",
      cancel: "Cancelar",
      errors: {
        description: "Digite uma descrição.",
        amount: "Digite um valor válido maior que zero.",
        startDate: "Escolha uma data inicial válida.",
        endDate: "A data final deve ser válida e posterior ao início.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    actions: {
      edit: "Editar",
      pause: "Pausar",
      resume: "Retomar",
      delete: "Excluir",
      paused: "Recorrência pausada",
      resumed: "Recorrência retomada",
      deleted: "Recorrência excluída",
      saved: "Alterações salvas",
    },
    confirmDelete: {
      title: "Excluir esta recorrência?",
      desc:
        "Deixará de gerar ocorrências. Os movimentos já criados permanecem no seu histórico.",
      confirm: "Excluir",
    },
    errors: {
      generic: "Não foi possível concluir a operação. Tente de novo.",
      notFound: "A recorrência não existe ou não é sua.",
      occurrenceNotFound: "Não encontramos essa ocorrência. Escolha outra data.",
    },
  },

  futureReceipts: {
    pageTitle: "Recebimentos futuros",
    pageDescription:
      "Dinheiro a receber. Fica separado das receitas já recebidas até você marcá-lo como recebido.",
    back: "Voltar ao Orçamento",
    new: "Novo recebimento futuro",
    pendingSection: "Pendentes",
    receivedSection: "Recebidos recentemente",
    empty: "Você não tem recebimentos futuros pendentes.",
    emptyHint: "Registre dinheiro que espera receber com a data estimada.",
    emptyReceived: "Você ainda não marcou recebimentos como recebidos.",
    expected: "Esperado",
    markReceived: "Marcar como recebido",
    cancel: "Cancelar recebimento",
    received: "Recebimento marcado como recebido",
    cancelled: "Recebimento cancelado",
    form: {
      title: "Novo recebimento futuro",
      description: "Descrição",
      descriptionPlaceholder: "Ex.: pagamento do cliente X",
      counterparty: "Quem paga (opcional)",
      amount: "Valor",
      expectedOn: "Data estimada",
      save: "Salvar",
      errors: {
        description: "Digite uma descrição.",
        amount: "Digite um valor válido maior que zero.",
        date: "Escolha uma data válida.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    confirmCancel: {
      title: "Cancelar este recebimento?",
      desc:
        "Deixará de aparecer nos seus pendentes. Você pode excluir o modelo se foi um engano.",
      confirm: "Cancelar recebimento",
    },
  },

  installments: {
    pageTitle: "Compras parceladas",
    pageDescription:
      "Cada parcela afeta o seu mês correspondente: o orçamento reflete a parcela, nunca o total.",
    back: "Voltar ao Orçamento",
    new: "Nova compra",
    empty: "Você ainda não tem compras parceladas.",
    emptyHint: "Registre a sua primeira compra em parcelas: o total será dividido mês a mês.",
    paidLabel: "pagas",
    next: "Próxima parcela",
    nextNoDate: "Sem parcelas pendentes",
    ends: "Termina",
    paidAmount: "Pago",
    remainingAmount: "Restante",
    perInstallment: "por parcela",
    cuotas: "Parcelas",
    hideCuotas: "Ocultar parcelas",
    markPaid: "Pagar",
    paid: "Paga",
    pending: "Pendente",
    cancelled: "Cancelada",
    paidToast: "Parcela marcada como paga",
    deletedToast: "Compra excluída",
    savedToast: "Compra registrada: as parcelas já dividem o gasto mês a mês.",
    paymentMethods: {
      credit_card: "Cartão de crédito",
      debit_card: "Cartão de débito",
      cash: "Dinheiro",
      bank_transfer: "Transferência",
      other: "Outro",
    },
    form: {
      title: "Nova compra parcelada",
      description: "Descrição",
      descriptionPlaceholder: "Ex.: notebook novo",
      totalAmount: "Valor total",
      count: "Número de parcelas",
      firstDueDate: "Primeira parcela",
      category: "Categoria",
      noCategory: "Sem categoria",
      paymentMethod: "Forma de pagamento",
      save: "Salvar",
      errors: {
        description: "Digite uma descrição.",
        total: "Digite um valor total válido maior que zero.",
        count: "O número de parcelas deve estar entre 2 e 120.",
        firstDate: "Escolha a data da primeira parcela.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    confirmDelete: {
      title: "Excluir esta compra parcelada?",
      desc: "As parcelas não pagas são canceladas; as já pagas permanecem no seu histórico.",
      confirm: "Excluir",
    },
    errors: {
      notFound: "A compra não existe ou não é sua.",
      cuotaNotFound: "Não encontramos essa parcela.",
    },
  },

  debtsModule: {
    tabs: {
      list: "Minhas dívidas",
      plan: "Plano de pagamento",
    },
    summary: {
      total: "Dívida total",
      remaining: "Dívida restante",
      monthPayments: "Pagamentos do mês",
      paymentsCount: "{count} pagamentos",
      progress: "Progresso do pagamento",
    },
    empty: "Você ainda não registrou dívidas.",
    emptyHint:
      "Quando registrar, o Money Path ajuda a organizá-las e a criar um plano de pagamento.",
    noDebts: "Sem dívidas ativas. Bom trabalho.",
    new: "Registrar dívida",
    registerPayment: "Pagar",
    paidOff: "Quitada",
    kindLabels: {
      credit_card: "Cartão de crédito",
      personal_loan: "Empréstimo pessoal",
      mortgage: "Financiamento imobiliário",
      auto_loan: "Financiamento de carro",
      student_loan: "Financiamento educacional",
      other: "Outra",
    },
    priorityLabels: {
      "1": "Alta",
      "2": "Média",
      "3": "Baixa",
    },
    statusLabels: {
      active: "Ativa",
      paid_off: "Quitada",
      defaulted: "Em atraso",
      cancelled: "Cancelada",
    },
    fields: {
      balance: "Saldo atual",
      initial: "Valor original",
      rate: "Taxa anual",
      minimum: "Pagamento mínimo",
      dueDay: "Dia de vencimento",
      dueNext: "Próximo vencimento",
      installments: "Parcelas",
      priority: "Prioridade",
      creditor: "Credor",
    },
    paymentToast: "Pagamento registrado: o seu saldo foi atualizado.",
    deletedToast: "Dívida excluída.",
    savedToast: "Dívida registrada.",
    alerts: {
      title: "Vencimentos próximos",
      today: "vence hoje",
      one: "vence amanhã",
      many: "vence em {days} dias",
    },
    form: {
      title: "Registrar dívida",
      name: "Nome",
      namePlaceholder: "Ex.: cartão de crédito do banco",
      creditor: "Credor (opcional)",
      kind: "Tipo",
      initialAmount: "Valor original",
      balance: "Saldo atual",
      rate: "Taxa anual % (opcional)",
      dueDay: "Dia de vencimento (opcional)",
      minimum: "Pagamento mínimo mensal (opcional)",
      installments: "Número de parcelas (opcional)",
      priority: "Prioridade",
      status: "Situação",
      save: "Salvar",
      errors: {
        name: "Digite um nome.",
        initial: "Digite um valor original válido maior que zero.",
        balance: "O saldo não pode ser maior que o valor original.",
        rate: "A taxa deve estar entre 0 e 300.",
        dueDay: "O dia de vencimento deve estar entre 1 e 31.",
        minimum: "O pagamento mínimo deve ser um valor válido.",
        installments: "As parcelas devem estar entre 1 e 600.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    payForm: {
      title: "Pagar {name}",
      amount: "Valor do pagamento",
      date: "Data",
      note: "Nota (opcional)",
      balanceAfter: "Saldo depois do pagamento",
      save: "Registrar pagamento",
      errors: {
        amount: "Digite um valor válido.",
        exceeds: "O pagamento não pode superar o saldo atual.",
        generic: "Não foi possível concluir a operação. Tente de novo.",
      },
    },
    confirmDelete: {
      title: "Excluir esta dívida?",
      desc:
        "É arquivada com exclusão lógica; os pagamentos registrados permanecem no seu histórico.",
      confirm: "Excluir",
    },
    plan: {
      title: "Plano de pagamento",
      subtitle:
        "O Money Path ordena as suas dívidas por prioridade e compara duas estratégias de quitação. Isto é uma simulação orientativa: você decide e nós nunca executamos pagamentos.",
      priorityTitle: "Ordem de prioridade",
      priorityHint: "As suas dívidas em ordem de prioridade, com saldo e pagamento mínimo.",
      strategyTitle: "Comparar estratégias",
      extraLabel: "Excedente mensal disponível para quitar dívidas",
      extraHint: "Pré-carregado com a sua margem do diagnóstico; ajuste à sua realidade.",
      avalanche: {
        name: "Avalanche",
        desc: "Ataca primeiro a dívida com maior taxa. Minimiza os juros totais.",
      },
      snowball: {
        name: "Bola de neve",
        desc: "Ataca primeiro a dívida menor. Ganha vitórias rápidas.",
      },
      months: "meses",
      interest: "Juros estimados",
      totalPaid: "Total a pagar",
      firstPayoff: "Primeira dívida quitada",
      noConverge: "Os pagamentos não cobrem os juros desta dívida.",
      winner: "Recomendada",
      recommended:
        "Com o seu excedente atual, {strategy} economiza aproximadamente {saved} em juros.",
      noDebts: "Registre as suas dívidas para montar o plano de pagamento.",
      disclaimer:
        "Simulação orientativa com base nos seus dados; não executamos pagamentos nem damos consultoria financeira.",
    },
  },

  fondo: {
    title: "Reserva de emergência",
    subtitle: "O seu colchão para imprevistos, calculado com as despesas essenciais.",
    noTarget: {
      title: "Ainda não podemos calcular a sua meta",
      desc:
        "Marque as suas categorias essenciais (ou ajuste a despesa essencial mensal) e calcularemos quanto você precisa na reserva.",
    },
    summary: {
      target: "Meta total",
      current: "Valor atual",
      remaining: "Valor restante",
      percent: "Progresso",
      monthsProtected: "Meses protegidos",
      monthsUnit: "meses",
      complete: "Reserva completa!",
    },
    progress: {
      title: "Progresso",
      monthsCovered: "{covered} de {target} meses cobertos",
      needPerMonth: "Baseado em {monthly}/mês de despesas essenciais.",
    },
    essential: {
      title: "Despesa essencial mensal",
      calculated: "Calculado pelas suas categorias essenciais",
      manual: "Ajuste manual",
      windowNote: "Média dos últimos {months} meses.",
      perMonth: "/mês",
      explanation:
        "Só contam as categorias que você marca como essenciais. As despesas discricionárias (restaurante, lazer, assinaturas…) ficam de fora por padrão.",
      noEssential:
        "Você ainda não marcou categorias essenciais. Selecione-as abaixo para calcular a despesa essencial.",
      usingManual:
        "Você está usando um ajuste manual. Desative-o para voltar ao cálculo automático.",
    },
    categories: {
      title: "Quais categorias contam como essenciais?",
      hint: "Marque só o indispensável para viver. Isso alimenta o cálculo da reserva.",
      empty: "Você não tem categorias de despesa. Crie-as no Orçamento.",
      monthly: "/mês em média",
    },
    months: {
      title: "Meta em meses",
      hint: "Quantos meses de despesas essenciais você quer cobrir?",
      custom: "Outro",
    },
    config: {
      useManual: "Ajustar a despesa essencial manualmente",
      manualLabel: "Despesa essencial mensal (manual)",
      save: "Salvar configuração",
      saved: "Configuração salva.",
    },
    contribute: {
      title: "Aportar na reserva",
      amount: "Valor do aporte",
      save: "Somar aporte",
      saved: "Aporte somado à sua reserva.",
      setCurrent: "Definir valor atual",
      setCurrentHint: "Se você já tem uma economia acumulada, escreva aqui.",
    },
    empty: {
      title: "Construa o seu colchão",
      desc:
        "Defina a meta e faça o primeiro aporte. O Money Path mostra quantos meses você está protegendo.",
    },
    errors: {
      months: "Escolha uma meta entre 1 e 36 meses.",
      override: "Digite uma despesa essencial válida maior que zero.",
      amount: "Digite um valor válido maior ou igual a zero.",
      category: "A categoria não existe ou não é sua.",
      generic: "Não foi possível concluir a operação. Tente de novo.",
    },
  },

  goalsModule: {
    title: "Metas",
    subtitle: "O que você quer alcançar, com um plano de economias claro.",
    new: "Nova meta",
    summary: {
      active: "Metas ativas",
      target: "Objetivo total",
      saved: "Economizado",
      achieved: "Alcançadas",
    },
    empty: "Você ainda não tem metas.",
    emptyHint: "Crie a sua primeira meta e defina quanto guardar por mês para alcançá-la.",
    categories: {
      viaje: "Viagem",
      auto: "Carro",
      casa: "Casa",
      fondo_emergencia: "Reserva de emergência",
      educacion: "Educação",
      inversion: "Investimento",
      compra_personal: "Compra pessoal",
      otro: "Outra",
    },
    priorityLabels: {
      "1": "Alta",
      "2": "Média",
      "3": "Baixa",
    },
    statusLabels: {
      active: "Ativa",
      achieved: "Alcançada",
      paused: "Pausada",
      abandoned: "Abandonada",
    },
    plan: {
      remaining: "Faltam",
      perMonth: "Você precisa guardar por mês",
      perWeek: "por semana",
      deadline: "Prazo",
      noDeadline: "Sem prazo definido",
      monthsLeft: "{months} meses restantes",
      overdue: "O prazo já passou",
    },
    forecast: {
      onTrack: "No ritmo atual, você alcança a meta aproximadamente em {when}.",
      monthsValue: "{months} meses",
      thisMonth: "menos de um mês",
      noPace: "Faça o primeiro aporte para ver a projeção no ritmo atual.",
      achieved: "Meta alcançada!",
    },
    form: {
      title: "Nova meta",
      name: "Nome",
      namePlaceholder: "Ex.: viagem a Fernando de Noronha",
      category: "Categoria",
      targetAmount: "Valor objetivo",
      currentAmount: "Valor atual (opcional)",
      targetDate: "Prazo (data-alvo)",
      priority: "Prioridade",
      description: "Descrição (opcional)",
      save: "Criar meta",
    },
    contribute: {
      title: "Aportar em {name}",
      amount: "Valor do aporte",
      note: "Nota (opcional)",
      save: "Somar aporte",
      saved: "Aporte registrado: o seu progresso foi atualizado.",
    },
    contributeButton: "Aportar",
    contributionsCount: "{count} aportes",
    confirmDelete: {
      title: "Excluir esta meta?",
      desc: "É arquivada com exclusão lógica; os aportes ficam no seu histórico.",
      confirm: "Excluir",
    },
    errors: {
      name: "Digite um nome.",
      target: "Digite um valor objetivo válido maior que zero.",
      current: "O valor atual deve ser um valor válido.",
      currentExceeds: "O valor atual não pode superar o objetivo.",
      amount: "Digite um valor de aporte válido maior que zero.",
      notFound: "A meta não existe ou não é sua.",
      generic: "Não foi possível concluir a operação. Tente de novo.",
    },
  },

  investmentsModule: {
    title: "Investimentos",
    subtitle: "As suas contas e instrumentos, sem recomendações de compra ou venda.",
    tabs: {
      investments: "Investimentos",
      accounts: "Contas",
    },
    summary: {
      invested: "Total investido",
      current: "Valor atual",
      gain: "Ganho / perda",
      percent: "Rentabilidade",
      contributions: "Aportes",
    },
    evolution: {
      title: "Evolução do patrimônio investido",
      desc: "Soma acumulada dos seus aportes e investimentos.",
      empty: "Registre o seu primeiro investimento para ver a evolução.",
    },
    empty: "Você ainda não tem investimentos.",
    emptyHint: "Registre o seu primeiro investimento ou crie uma conta para começar.",
    emptyAccounts: "Você ainda não tem contas de investimento.",
    emptyAccountsHint:
      "Crie a sua conta (corretora, banco, previdência…) para associar os investimentos.",
    categories: {
      cetes: "Tesouro",
      fund: "Fundo",
      etf: "ETF",
      stock: "Ação",
      bond: "Título",
      crypto: "Cripto",
      other: "Outro",
    },
    accountTypes: {
      brokerage: "Corretora",
      bank: "Banco",
      afore: "Previdência",
      crypto: "Plataforma de cripto",
      other: "Outra",
    },
    fields: {
      quantity: "Quantidade",
      avgPrice: "Preço médio",
      invested: "Investido",
      current: "Valor atual",
      gain: "Ganho",
      since: "Desde",
      balance: "Saldo",
      institution: "Instituição",
    },
    accountForm: {
      title: "Nova conta",
      institution: "Instituição",
      institutionPlaceholder: "Ex.: BTG, Nubank, Tesouro Direto",
      name: "Nome da conta",
      namePlaceholder: "Ex.: conta principal",
      type: "Tipo",
      currency: "Moeda",
      balance: "Saldo atual (opcional)",
      save: "Criar conta",
    },
    investmentForm: {
      title: "Novo investimento",
      name: "Nome",
      namePlaceholder: "Ex.: Tesouro Selic 2029",
      category: "Categoria",
      quantity: "Quantidade (títulos/cotas)",
      avgPrice: "Preço médio por unidade",
      invested: "Valor investido",
      investedHint: "É calculado como quantidade × preço médio; você pode ajustar.",
      current: "Valor atual (opcional)",
      date: "Data",
      account: "Conta (opcional)",
      noAccount: "Sem conta",
      save: "Criar investimento",
    },
    contribute: {
      title: "Aportar em {name}",
      amount: "Valor do aporte",
      note: "Nota (opcional)",
      save: "Somar aporte",
      saved: "Aporte registrado.",
    },
    contributeButton: "Aportar",
    newAccount: "Nova conta",
    newInvestment: "Novo investimento",
    disclaimer:
      "O Money Path não se conecta a corretoras ou bancos e não recomenda comprar ou vender ativos: você apenas registra e acompanha as suas informações.",
    confirmDelete: {
      investment: "Excluir este investimento?",
      account: "Excluir esta conta?",
      desc: "É arquivado com exclusão lógica; os movimentos ficam no seu histórico.",
      confirm: "Excluir",
    },
    errors: {
      institution: "Digite a instituição.",
      accountName: "Digite um nome para a conta.",
      name: "Digite um nome.",
      invested:
        "Digite um valor investido válido maior que zero (ou quantidade × preço médio).",
      quantity: "A quantidade deve ser um número válido.",
      avgPrice: "O preço médio deve ser um valor válido.",
      current: "O valor atual deve ser um valor válido.",
      amount: "Digite um valor de aporte válido maior que zero.",
      notFound: "Não existe ou não é seu.",
      generic: "Não foi possível concluir a operação. Tente de novo.",
    },
  },

  patrimonioModule: {
    title: "Patrimônio",
    subtitle: "Ativos menos passivos: o quadro completo da sua riqueza.",
    tabs: {
      assets: "Ativos",
      liabilities: "Passivos",
    },
    summary: {
      netWorth: "Patrimônio líquido",
      assets: "Total de ativos",
      liabilities: "Total de passivos",
      variation: "Variação",
      noPrevious: "Primeiro registro",
    },
    formula: "Patrimônio líquido = Total de ativos − Total de passivos",
    evolution: {
      title: "Evolução do patrimônio",
      desc: "Histórico mensal do seu patrimônio líquido.",
      empty: "Adicione o primeiro ativo ou passivo para começar o histórico.",
    },
    assetKinds: {
      cash: "Dinheiro",
      investment: "Investimentos",
      real_estate: "Imóveis",
      vehicle: "Veículos",
      other: "Outros ativos",
    },
    liabilityKinds: {
      financing: "Financiamento",
      personal_loan: "Empréstimo",
      credit_card: "Cartão de crédito",
      other: "Outra dívida",
    },
    valuation: {
      manual: "Valor manual",
      external: "Avaliação externa",
      externalSoon:
        "A avaliação automática de fontes externas chega em breve; por enquanto registre o valor manualmente.",
    },
    assetForm: {
      title: "Novo ativo",
      name: "Nome",
      namePlaceholder: "Ex.: Honda Civic 2020",
      kind: "Tipo",
      value: "Valor estimado",
      valueHint: "Para veículos e imóveis, use a sua melhor estimativa.",
      acquiredOn: "Data de aquisição (opcional)",
      note: "Nota (opcional)",
      save: "Adicionar ativo",
    },
    liabilityForm: {
      title: "Novo passivo",
      name: "Nome",
      namePlaceholder: "Ex.: financiamento do carro",
      kind: "Tipo",
      amount: "Saldo pendente",
      monthlyPayment: "Pagamento mensal (opcional)",
      dueDay: "Dia de pagamento (opcional)",
      save: "Adicionar passivo",
    },
    newAsset: "Novo ativo",
    newLiability: "Novo passivo",
    emptyAssets: "Você ainda não registrou ativos.",
    emptyAssetsHint: "Adicione o seu dinheiro, investimentos, imóveis ou veículos.",
    emptyLiabilities: "Você ainda não registrou passivos.",
    emptyLiabilitiesHint: "Adicione os seus financiamentos, empréstimos ou cartões.",
    fields: {
      value: "Valor",
      acquired: "Adquirido",
      balance: "Saldo",
      monthlyPayment: "Pagamento mensal",
    },
    confirmDelete: {
      asset: "Excluir este ativo?",
      liability: "Excluir este passivo?",
      desc: "É arquivado com exclusão lógica e o patrimônio é recalculado.",
      confirm: "Excluir",
    },
    updatedToast: "Patrimônio atualizado.",
    errors: {
      name: "Digite um nome.",
      value: "Digite um valor válido maior que zero.",
      amount: "Digite um saldo válido maior ou igual a zero.",
      monthlyPayment: "O pagamento mensal deve ser um valor válido.",
      dueDay: "O dia de pagamento deve estar entre 1 e 31.",
      notFound: "Não existe ou não é seu.",
      generic: "Não foi possível concluir a operação. Tente de novo.",
    },
  },

  calculators: {
    title: "Calculadoras",
    subtitle: "Simule cenários e tome decisões com mais informação.",
    disclaimer:
      "Os resultados são projeções orientativas com base nos dados que você informa. Não são garantias nem consultoria financeira.",
    tabs: {
      compound: "Juros compostos",
      goal: "Meta financeira",
      firstGoal: "Primeiro grande objetivo",
      buyRent: "Comprar versus alugar",
    },
    actions: {
      calculate: "Calcular",
      reset: "Simular de novo",
    },
    errors: {
      positive: "Digite um valor maior que zero.",
      rate: "A taxa deve estar entre 0 e 200.",
      years: "O período deve estar entre 1 e 100 anos.",
      percent: "O percentual deve estar entre 0 e 100.",
      target: "Digite um valor objetivo maior que zero.",
      generic: "Revise os campos e tente de novo.",
    },
    compound: {
      title: "Juros compostos",
      desc: "Descubra como o dinheiro cresce quando você reinveste os juros.",
      initial: "Investimento inicial",
      initialHint: "O valor com o qual você começa hoje.",
      contribution: "Aporte mensal",
      contributionHint: "Quanto você vai somar a cada mês. Pode ser zero.",
      rate: "Taxa anual (%)",
      rateHint: "Rentabilidade anual estimada, em percentual.",
      years: "Período (anos)",
      yearsHint: "Por quanto tempo você manterá o investimento.",
      results: {
        contributed: "Total aportado",
        interest: "Juros acumulados",
        final: "Valor final",
      },
    },
    goal: {
      title: "Meta financeira",
      desc: "Calcule quanto economizar por mês para chegar à meta no prazo.",
      target: "Valor objetivo",
      targetHint: "Quanto você quer alcançar.",
      current: "Valor atual",
      currentHint: "O que você já tem economizado. Pode ser zero.",
      years: "Prazo (anos)",
      yearsHint: "Em quanto tempo você quer conseguir.",
      results: {
        needed: "Faltam para economizar",
        months: "em {months} meses",
        perMonth: "Aporte mensal necessário",
        reached: "Você já alcançou esta meta com o que tem!",
      },
    },
    firstGoal: {
      title: "Primeiro grande objetivo",
      desc: "Simule como construir o seu patrimônio mês a mês até o objetivo.",
      target: "Valor do objetivo",
      targetHint: "Ex.: a entrada da sua casa ou o primeiro milhão.",
      monthly: "Aporte mensal",
      monthlyHint: "Quanto você destinará a cada mês.",
      rate: "Rentabilidade anual (%)",
      rateHint: "Crescimento anual estimado das suas economias.",
      results: {
        reachIn: "Você alcança o objetivo aproximadamente em",
        yearsMonths: "{years} anos e {months} meses",
        monthsOnly: "{months} meses",
        neverReach:
          "Com esse aporte não se alcança o objetivo em 100 anos. Aumente o aporte ou a rentabilidade.",
        perYear: "Crescimento por ano",
      },
    },
    buyRent: {
      title: "Comprar versus alugar",
      desc: "Compare o custo de comprar um imóvel em relação ao de alugar.",
      years: "Anos para comparar",
      yearsHint: "Horizonte da comparação.",
      buySection: "Se você compra",
      homePrice: "Preço do imóvel",
      homePriceHint: "Valor total do imóvel.",
      downPayment: "Entrada (%)",
      downPaymentHint: "Percentual pago na entrada.",
      mortgageRate: "Taxa do financiamento anual (%)",
      mortgageRateHint: "Taxa de juros do crédito.",
      mortgageYears: "Prazo do financiamento (anos)",
      mortgageYearsHint: "Duração do financiamento.",
      maintenance: "Manutenção mensal",
      maintenanceHint: "IPTU, condomínio, seguros.",
      appreciation: "Valorização anual (%)",
      appreciationHint: "Quanto você estima que o imóvel valoriza por ano.",
      rentSection: "Se você aluga",
      rent: "Aluguel mensal",
      rentHint: "Quanto você paga de aluguel hoje.",
      rentIncrease: "Reajuste anual do aluguel (%)",
      rentIncreaseHint: "Incremento estimado a cada ano.",
      investReturn: "Rentabilidade da entrada investida (%)",
      investReturnHint: "O que a sua entrada rendesse se investida.",
      results: {
        buyCost: "Custo líquido de comprar",
        rentCost: "Custo líquido de alugar",
        monthlyMortgage: "Parcela do financiamento",
        equity: "Patrimônio acumulado",
        winnerBuy: "Comprar sai {amount} mais barato neste cenário.",
        winnerRent: "Alugar sai {amount} mais barato neste cenário.",
        tie: "As duas opções ficam muito parecidas neste cenário.",
      },
    },
  },

  moneyPath: {
    title: "A Sua Rota Financeira",
    subtitle: "O Money Path™ transforma os seus dados em um plano de ação claro.",
    estimateBadge: "Estimado",
    actualBadge: "Com os seus movimentos",
    onboardingOnlyNote:
      "Esta rota se baseia no seu diagnóstico inicial. Registre os movimentos no Orçamento para torná-la mais precisa.",
    disclaimer:
      "O Money Path™ dá orientação com base nos seus dados. Os valores marcados como estimados são projeções, não garantias, e não constituem consultoria financeira profissional.",
    sections: {
      situation: "1 · Situação atual",
      priority: "2 · Prioridade",
      action: "3 · Ação recomendada",
      impact: "4 · Impacto estimado",
      nextStep: "5 · Próximo passo",
    },
    severity: {
      high: "Alta prioridade",
      medium: "Prioridade média",
      positive: "Sinal positivo",
    },
    situation: {
      income: "Renda mensal",
      expenses: "Despesa mensal",
      balance: "Saldo mensal",
      essential: "Despesa essencial",
      debts: "Dívidas",
      fund: "Reserva de emergência",
      fundMonths: "{months} meses cobertos",
      savings: "Economias + investimentos",
      netWorth: "Patrimônio líquido",
    },
    findings: {
      overspend: {
        title: "Você gasta mais do que recebe",
        desc:
          "A sua despesa mensal supera a renda em {amount}. É o ponto mais urgente para equilibrar.",
      },
      debt: {
        title: "Você tem uma dívida relevante",
        desc: "Você deve {amount} no total{debt}. Quitá-la libera capacidade de economia.",
        withHighRate: " — a sua dívida de maior taxa é {name} ({rate}% ao ano)",
      },
      lowReserve: {
        title: "A sua reserva de emergência está baixa",
        desc:
          "A sua reserva cobre {months} meses de despesas essenciais; o recomendado é pelo menos 3.",
      },
      lowSavings: {
        title: "Baixa capacidade de economia",
        desc: "O seu excedente mensal é {amount} ({pct}% da sua renda).",
      },
      goalMismatch: {
        title: "Uma meta não cabe no orçamento atual",
        desc:
          "A sua meta «{goal}» exige {needed} por mês, mas o seu excedente é {surplus}.",
      },
      netWorthGrowing: {
        title: "O seu patrimônio está crescendo",
        desc: "O seu patrimônio aumentou {amount} em relação ao mês anterior. Continue assim.",
      },
      reorganize: {
        title: "Você precisa reorganizar as finanças",
        desc:
          "Você tem vários frentes abertos ao mesmo tempo. Comece pelo prioritário e avance um por vez.",
      },
      onTrack: {
        title: "Você está no caminho certo",
        desc:
          "Não detectamos problemas urgentes. Mantenha os hábitos e acompanhe o seu progresso.",
      },
    },
    actions: {
      overspend:
        "Reduza as despesas não essenciais em {amount} por mês para equilibrar o orçamento.",
      debt:
        "Destine o seu excedente de {surplus} por mês ao pagamento das dívidas, começando pela mais cara.",
      lowReserve:
        "Separe {surplus} por mês para a reserva de emergência até cobrir as despesas essenciais.",
      lowSavings:
        "Registre as despesas para encontrar cortes e criar a sua primeira margem de economia.",
      goalMismatch:
        "Amplie o prazo de «{goal}» ou aumente o seu excedente para poder bancá-la.",
      netWorthGrowing:
        "Mantenha o ritmo de economia e investimento; você está construindo riqueza.",
      reorganize: "Atenda uma prioridade por vez, começando pela mais urgente.",
      onTrack:
        "Destine o seu excedente de {surplus} por mês à reserva, às metas ou aos investimentos.",
    },
    impact: {
      reserve:
        "Se reservar {amount} por mês, alcança a meta de {target} em aproximadamente {months} meses.",
      debt:
        "Se destinar {amount} por mês às dívidas, quita-as em aproximadamente {months} meses.",
      overspend: "Reduzir as despesas em {amount} por mês equilibraria o orçamento.",
      lowSavings:
        "Hoje você pode economizar {amount} por mês ({pct}% da sua renda). Automatize para que cresça.",
      goalMismatch:
        "Para «{goal}» você precisaria de {needed} por mês. Amplie o prazo ou aumente o excedente em {gap}.",
      onTrack:
        "O seu excedente atual é {amount} por mês. Destine-o à reserva, às metas ou aos investimentos.",
      generic:
        "Com a capacidade atual não é possível estimar um prazo. Aumente o excedente para avançar.",
    },
    nextSteps: {
      overspend: {
        text: "Revise o orçamento e corte despesas não essenciais",
        href: "/app/presupuesto",
      },
      debt: { text: "Monte o plano de pagamento das dívidas", href: "/app/deudas" },
      lowReserve: { text: "Fortaleça a reserva de emergência", href: "/app/fondo" },
      lowSavings: { text: "Revise o orçamento para criar margem", href: "/app/presupuesto" },
      goalMismatch: { text: "Ajuste as metas ou o prazo", href: "/app/metas" },
      netWorthGrowing: { text: "Continue construindo patrimônio", href: "/app/patrimonio" },
      reorganize: { text: "Comece organizando o orçamento", href: "/app/presupuesto" },
      onTrack: { text: "Veja como fazer o dinheiro crescer", href: "/app/inversiones" },
    },
    simulation: {
      title: "E se eu reduzir as minhas despesas?",
      desc:
        "Mova o controle para ver o impacto estimado de cortar despesas todos os meses.",
      cutLabel: "Redução mensal das despesas",
      newSurplus: "Novo excedente mensal",
      fundBefore: "Reserva com o seu ritmo atual",
      fundAfter: "Reserva com a redução",
      monthsValue: "{months} meses",
      never: "Não se alcança",
      already: "Você já alcança",
      savedMonths: "Você alcançaria a reserva {months} meses antes.",
      noTarget: "Defina a reserva de emergência para ver o impacto.",
      disclaimer:
        "Projeção estimada com base nos seus dados atuais; não é uma garantia.",
    },
  },

  moneyAI: {
    title: "Money AI",
    subtitle: "O seu assistente financeiro contextual. Pergunte sobre o seu próprio dinheiro.",
    placeholder: "Digite a sua pergunta…",
    send: "Enviar",
    newChat: "Nova conversa",
    history: "Conversas",
    emptyHistory: "Você ainda não tem conversas.",
    thinking: "Analisando os seus dados…",
    quickTitle: "Perguntas rápidas",
    contextTitle: "O seu contexto",
    missingInfo: "Preciso de mais informação para responder com precisão.",
    noDataNote:
      "Você ainda não registrou movimentos, então uso o seu diagnóstico inicial.",
    safetyNote:
      "O Money AI apenas lê os seus dados: não executa compras, transferências nem investimentos, e não substitui a consultoria financeira profissional.",
    structure: {
      summary: "Resumo",
      explanation: "Explicação",
      dataUsed: "Dados utilizados",
      impact: "Impacto",
      nextStep: "Próximo passo",
    },
    contextLabels: {
      income: "Renda mensal",
      expenses: "Despesa mensal",
      balance: "Saldo",
      fund: "Reserva de emergência",
      debts: "Dívidas",
      netWorth: "Patrimônio líquido",
    },
    quick: [
      "Posso comprar isto?",
      "Quanto gastei com comida?",
      "Por que não consigo economizar?",
      "Quanto preciso economizar para a minha meta?",
      "Qual é a minha maior despesa?",
      "Como posso reduzir as minhas despesas?",
      "Quando alcançarei a minha meta?",
    ],
    intents: {
      buyAfford: {
        needsPriceSummary: "Diga quanto custa para eu responder",
        needsPriceExplanation:
          "Para saber se você consegue, preciso do preço. Escreva na pergunta, por exemplo: «Posso comprar algo de R$ 3.000?».",
        canAffordSummary: "Sim, você consegue sem afetar as despesas essenciais",
        canAffordExplanation:
          "O custo de {price} cabe no seu excedente mensal de {surplus}.",
        canAffordImpact:
          "Depois da compra restariam {left} de margem neste mês.",
        useSavingsSummary: "Você pode comprar usando parte das suas economias",
        useSavingsExplanation:
          "O custo de {price} supera o seu excedente mensal ({surplus}), mas você cobre com as economias disponíveis de {savings}. O seu colchão diminuiria.",
        useSavingsImpact: "As suas economias cairiam de {savings} para {left}.",
        cantAffordSummary: "Hoje não é a melhor hora para essa compra",
        cantAffordExplanation:
          "O custo de {price} supera o seu excedente mensal ({surplus}) e as suas economias disponíveis ({savings}).",
        cantAffordImpact:
          "Se separar {perMonth} por mês, junta em cerca de {months} meses.",
      },
      spendCategory: {
        summary: "Neste mês você gastou {amount} em {categories}",
        explanation:
          "Em {month}, essas categorias somam {amount} em {count} movimento(s).",
        noMatchSummary: "Não identifiquei essa categoria nas suas despesas",
        noMatchExplanation:
          "Não encontrei despesas que coincidam com «{query}». As suas categorias com gasto neste mês são: {categories}.",
        noDataSummary: "Você ainda não registrou despesas neste mês",
        noDataExplanation:
          "Não consigo calcular quanto você gastou porque não há despesas registradas neste mês.",
      },
      whyNoSavings: {
        negativeSummary: "As suas despesas superam a renda, por isso não sobra para economizar",
        negativeExplanation:
          "Você recebe {income} por mês e gasta {expenses}; faltam {gap}. A sua maior despesa é {biggest} ({biggestAmount}).",
        lowSummary: "A sua margem de economia é muito pequena",
        lowExplanation:
          "Você recebe {income} e gasta {expenses}; o excedente é apenas {surplus} ({pct}% da sua renda). A sua maior despesa é {biggest} ({biggestAmount}).",
        okSummary: "Você tem capacidade de economia",
        okExplanation:
          "O seu excedente mensal é {surplus} ({pct}% da sua renda). Se não o vê refletido, revise as maiores despesas.",
        impact:
          "Se reduzir a maior despesa, pode liberar até {amount} por mês.",
      },
      goalNeeded: {
        summary: "Para «{goal}» você precisa separar {perMonth} por mês",
        explanation:
          "A sua meta «{goal}» é de {target}, você já tem {current} e faltam {remaining}{deadline}. Para chegar, separe {perMonth} todo mês.",
        noGoalsSummary: "Você ainda não tem metas ativas",
        noGoalsExplanation:
          "Crie uma meta para eu dizer quanto você precisa separar por mês.",
        noDeadline: " (sem prazo definido, uso o seu excedente atual)",
      },
      biggestExpense: {
        summary: "A sua maior despesa é {category}",
        explanation:
          "Neste mês, {category} é a sua maior despesa com {amount}{share}.",
        impact: "É a melhor oportunidade de liberar dinheiro todo mês.",
        noDataSummary: "Você ainda não registrou despesas neste mês",
        noDataExplanation:
          "Não consigo identificar a maior despesa porque não há despesas registradas.",
      },
      reduceExpenses: {
        summary: "Foque nas categorias maiores para reduzir despesas",
        explanation:
          "As suas maiores despesas deste mês são: {top}. Se reduzir em {pct}%, economizaria cerca de {saved} por mês.",
        impact:
          "Essa economia potencial de {saved} por mês pode ir para a sua reserva ou para as suas metas.",
        noDataSummary: "Você ainda não registrou despesas neste mês",
        noDataExplanation:
          "Registre as despesas para eu sugerir cortes específicos.",
      },
      goalWhen: {
        summary: "No ritmo atual, você alcançaria «{goal}» em cerca de {months} meses",
        explanation:
          "A sua meta «{goal}» é de {target}, você já tem {current} e o seu excedente é {surplus} por mês. Nesse ritmo, chega em cerca de {months} meses.",
        cantSummary: "Com o excedente atual não consigo estimar um prazo",
        cantExplanation:
          "O seu excedente mensal é {surplus}, insuficiente para estimar quando você chegaria. Aumente a margem ou ajuste a meta.",
        noGoalsSummary: "Você ainda não tem metas ativas",
        noGoalsExplanation: "Crie uma meta para estimar quando a alcançaria.",
      },
      summaryIntent: {
        summary: "Este é o seu panorama financeiro atual",
        explanation:
          "Você recebe {income} e gasta {expenses} por mês; o seu saldo é {balance}. O seu patrimônio líquido é {netWorth}.",
      },
      fallback: {
        summary: "Preciso de mais informação para responder com precisão",
        explanation:
          "Não tenho dados suficientes ou não entendi a pergunta. Tente uma das sugestões ou registre mais informação nos seus módulos.",
      },
    },
  },

  reports: {
    title: "Relatórios financeiros",
    subtitle: "Analise o seu dinheiro por período e identifique tendências.",
    periods: {
      "1": "Este mês",
      "3": "Últimos 3 meses",
      "6": "Últimos 6 meses",
      "12": "Últimos 12 meses",
    },
    noData:
      "Você ainda não registrou movimentos neste período, então não há dados para o relatório.",
    insights: {
      title: "Insights automáticos",
      empty: "Com mais dados, verá aqui tendências e mudanças importantes.",
      templates: {
        categoryUp: "A sua despesa em {category} aumentou {pct}% em relação ao período anterior.",
        categoryDown: "Você reduziu a despesa em {category} em {pct}%. Bom trabalho!",
        savingsUp: "A sua economia de {amount} foi superior à do período anterior ({prev}).",
        savingsDown: "A sua economia de {amount} foi menor que a do período anterior ({prev}).",
        netWorthUp: "O seu patrimônio aumentou {amount}.",
        netWorthDown: "O seu patrimônio diminuiu {amount}.",
        debtPaid: "Você pagou {amount} das suas dívidas neste período.",
        investmentGain: "Os seus investimentos geraram {amount} de ganho.",
        incomeUp: "As suas receitas aumentaram {pct}% em relação ao período anterior.",
        incomeDown: "As suas receitas caíram {pct}% em relação ao período anterior.",
      },
    },
    sections: {
      evolution: "Evolução de receitas e despesas",
      categories: "Despesas por categoria",
      savings: "Capacidade de economia",
      debts: "Dívidas",
      investments: "Investimentos",
      netWorth: "Patrimônio",
    },
    evolution: {
      income: "Receitas",
      expenses: "Despesas",
      empty: "Sem movimentos neste período.",
    },
    categories: {
      current: "Este período",
      vsPrev: "vs. anterior",
      empty: "Sem despesas registradas neste período.",
    },
    savings: {
      rate: "Taxa de economia",
      avg: "Economia média mensal",
      thisPeriod: "Economia do período",
    },
    debts: {
      total: "Dívida total",
      active: "dívidas ativas",
      paid: "Pago no período",
    },
    investments: {
      invested: "Investido",
      current: "Valor atual",
      gain: "Ganho",
    },
    netWorth: {
      latest: "Patrimônio atual",
      change: "Variação na janela",
      empty: "Sem registros de patrimônio neste período.",
    },
    comparison: {
      title: "Comparação com o período anterior",
      current: "Período atual",
      previous: "Período anterior",
      income: "Receitas",
      expenses: "Despesas",
      savings: "Economia",
    },
  },

  academia: {
    title: "Academia",
    subtitle: "Aprenda conceitos financeiros básicos no seu ritmo.",
    filters: {
      all: "Tudo",
      favorites: "Favoritos",
      completed: "Concluídos",
    },
    progress: {
      title: "O seu progresso",
      completed: "{done} de {total} conteúdos concluídos",
      percent: "{pct}% concluído",
    },
    kinds: {
      article: "Artigo",
      video: "Aula",
      lesson: "Lição",
      guide: "Guia",
      tip: "Dica",
    },
    levels: {
      beginner: "Básico",
      intermediate: "Intermediário",
      advanced: "Avançado",
    },
    actions: {
      read: "Ler",
      markDone: "Marcar como concluído",
      markPending: "Marcar como pendente",
      favorite: "Salvar",
      unfavorite: "Remover dos favoritos",
      close: "Fechar",
    },
    filtersLabel: "Filtrar conteúdos",
    empty: "Não há conteúdos nesta categoria.",
    emptyFavorites: "Você ainda não tem favoritos.",
    emptyCompleted: "Você ainda não concluiu conteúdos.",
    done: "Concluído",
    minutes: "{n} min",
    contentNote:
      "Conteúdo educativo geral. Não é consultoria financeira nem substitui fontes oficiais.",
    disclaimer:
      "O Money Path não oferece recomendações específicas de investimento nesta área.",
  },

  notifications: {
    title: "Notificações",
    subtitle: "Avisos importantes do seu plano, sem excesso.",
    unread: "{n} não lidas",
    allRead: "Tudo lido",
    markAllRead: "Marcar tudo como lido",
    markRead: "Marcar como lida",
    clear: "Limpar lidas",
    cleared: "Notificações limpas",
    empty: "Você não tem notificações.",
    emptyHint:
      "Os avisos aparecerão aqui quando houver recebimentos, vencimentos ou metas para acompanhar.",
    preferences: "Preferências",
    preferencesTitle: "Tipos de notificação",
    preferencesDesc:
      "Ative ou desative cada tipo. Os avisos são gerados só quando há algo real para contar.",
    preferencesSaved: "Preferências salvas",
    allTypes: "Todos os tipos",
    generatedNote: "Sem duplicatas: cada aviso aparece uma única vez.",
    actions: {
      view: "Ver",
    },
    types: {
      future_receipt: "Receita futura",
      due_date: "Vencimento",
      installment: "Parcela",
      goal: "Meta",
      debt: "Dívida",
      budget: "Orçamento",
      emergency_fund: "Reserva de emergência",
      insight: "Insights",
    },
    items: {
      futureReceipt: { title: "Recebimento próximo: {name}", body: "Você espera {amount} em {date}." },
      dueDate: { title: "Vencimento de {name}", body: "O seu pagamento vence {when} ({date})." },
      installment: { title: "Parcela de {name}", body: "A parcela {n} de {total} vence {when} ({date})." },
      goalDeadline: { title: "Meta próxima: {name}", body: "Faltam {days} dias para o prazo ({date})." },
      goalAchieved: { title: "Meta alcançada!", body: "Você concluiu «{name}». Revise os aportes." },
      debtPaidOff: { title: "Dívida quitada", body: "Você terminou de pagar «{name}». Excelente progresso." },
      budgetOver: { title: "Você gastou mais do que ganhou", body: "Este mês as suas despesas ({expenses}) superam as receitas ({income})." },
      fundComplete: { title: "Reserva de emergência completa", body: "A sua reserva alcançou {amount}, a meta que você havia definido." },
      fundLow: { title: "A sua reserva está baixa", body: "A sua reserva cobre {months} meses de despesas essenciais." },
      insight: { title: "Insight das suas finanças", body: "{text}" },
      dueIn: {
        today: "hoje",
        tomorrow: "amanhã",
        inDays: "em {n} dias",
      },
      time: {
        now: "agora há pouco",
        minutes: "há {n} min",
        hours: "há {n} h",
        yesterday: "ontem",
        days: "há {n} dias",
        months: "há {n} meses",
      },
    },
  },

  ...billingDictionaryPtBr,
} as const;
