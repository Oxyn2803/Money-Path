# Money Path

> **"Tu dinero. Tu plan. Tu patrimonio."**

Plataforma de planejamento financeiro pessoal construída de forma incremental, etapa por etapa.

---

## 1. Visão do produto

Money Path **não é** apenas um aplicativo de controle de gastos. O conceito central é:

> **"No te mostramos solamente dónde está tu dinero. Te mostramos qué hacer con él."**

O produto transforma a situação financeira completa do usuário —

`ingresos + gastos + deudas + ahorro + metas + inversiones + patrimonio`

— em uma rota de ação:

`información + interpretación + recomendación + plan de acción`.

## 2. Posicionamento

- **Categoria:** planificación financiera personal (não "expense tracker").
- **Conceito:** toda funcionalidade existe para converter dados em direção.
- **Tom:** claro, honesto, próximo. O produto orienta; quem decide é o usuário.

## 3. Público e mercado

| Dimensão          | Valor                                      |
| ----------------- | ------------------------------------------ |
| Mercado inicial   | México                                     |
| Idioma inicial    | Espanhol mexicano (`es-MX`)                |
| Moeda padrão      | Peso mexicano (`MXN`, 2 decimais)          |
| Expansão prevista | Outros países da LATAM e suas moedas       |

A arquitetura já nasce preparada para multi-idioma e multi-moeda.

## 4. Stack

| Camada       | Tecnologia                                   |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 16 (App Router, React Server Components) |
| Linguagem    | TypeScript (strict)                          |
| UI           | Tailwind CSS 4 + design tokens próprios (`@theme`) |
| Banco        | PostgreSQL                                   |
| ORM          | Drizzle ORM + drizzle-kit                    |
| Autenticação | Better Auth + `@better-auth/drizzle-adapter` (Etapa 4) |
| Tipografia   | Space Grotesk (display) + Manrope (UI)       |

## 5. Arquitetura

Arquitetura modular orientada a recursos:

```
src/
├── app/
│   ├── page.tsx             # Site público: home da fundação
│   ├── design/page.tsx      # Vitrine do Design System (Etapa 1)
│   ├── not-found.tsx        # 404 global
│   ├── layout.tsx           # Layout raiz, fontes, ToastProvider (lang="es")
│   ├── api/
│   │   ├── auth/[...all]/   # Endpoints Better Auth (Etapa 4)
│   │   ├── auth/dev/reset-link/  # Link de reset em preview sem email (flag)
│   │   ├── onboarding/      # POST: guarda o diagnóstico inicial (Etapa 5)
│   │   └── health/          # Healthcheck com consulta real ao banco
│   ├── (auth)/              # PÁGINAS PÚBLICAS COM LAYOUT CENTRAL
│   │   ├── layout.tsx
│   │   ├── login · register · forgot-password · reset-password
│   │   └── onboarding/page.tsx   # ONBOARDING FINANCEIRO (Etapa 5)
│   └── app/                 # APLICATIVO — segmento /app
│       ├── layout.tsx       # Sidebar + bottom nav + sessão + gate de onboarding
│       ├── loading.tsx · not-found.tsx
│       ├── page.tsx         # Inicio (container do dashboard)
│       └── resumen|presupuesto|deudas|fondo|metas|inversiones|patrimonio|
│           money-path|money-ai|calculadoras|academia|notificaciones|
│           configuracion/page.tsx
├── components/
│   ├── onboarding/wizard.tsx# Wizard de 10 passos + tela de resultado (Etapa 5)
│   ├── auth/forms.tsx       # Login, registro, recuperación, reset
│   ├── app/                 # sidebar, mobile-nav, page-shell, session-gate, breadcrumbs, nav-icons
│   ├── ui/                  # Design System (Etapa 1) — 20+ componentes
│   ├── icons.tsx · wordmark.tsx · foundation-status.tsx
│   ├── module-map.tsx · roadmap.tsx
├── config/                  # navigation, locales (7 moedas), modules, roadmap, onboarding (Etapa 5)
├── db/
│   ├── index.ts · schema.ts · seed.sql
│   └── schema/              # MODELO DE DADOS por domínio
│       ├── currencies · common · identity · auth
│       ├── categories · transactions · debts · goals · investments
│       ├── networth · path (money_path_states, Etapa 5) · budgets
│       ├── notifications · ai · academy · calculations
└── lib/
    ├── i18n/                # Dicionários tipados (es-MX base)
    ├── money/index.ts       # Núcleo monetário (centavos inteiros)
    ├── onboarding.ts        # Persistência do diagnóstico (Etapa 5)
    ├── auth-server.ts · auth-client.ts · auth.ts
    └── settings.ts
```

Princípios:

- **Server Components por padrão**; dados reais consultados no servidor.
- **Configuração dirigida por dados**: textos no i18n, estrutura em `src/config/*`, defaults no banco.
- **Cada módulo terá seu próprio espaço** quando sua etapa chegar.

## 6. Arquitetura do aplicativo (Etapa 2)

14 rotas sob `/app` (fonte: `src/config/navigation.ts`): Inicio, Resumen, Presupuesto, Deudas, Fondo de emergencia, Metas, Inversiones, Patrimonio, Money Path, Money AI, Calculadoras, Academia, Notificaciones, Configuración. Layout: sidebar fixa no desktop; barra superior + bottom navigation com menú "Más" no mobile. Breadcrumbs + `PageShell`/`ModulePage`; loading entre rotas; 404 duplo (app + global).

## 7. Autenticação (Etapa 4)

Implementada com **Better Auth** + adapter Drizzle: cadastro, login, logout, recuperação de senha, sessão persistente (cookie httpOnly + `sessions`, 30 dias), proteção de rotas e perfil automático pós-cadastro (`profiles` + `financial_profiles` + 14 categorias base).

- **Senhas:** hasheadas pelo Better Auth (scrypt) em `accounts`; nunca gerenciadas manualmente.
- **Sessão dual:** cookie `SameSite=None; Secure; Partitioned` + fallback **Bearer** (`localStorage`) para contextos com cookies de terceiros bloqueados (preview em iframe). Guard híbrido `SessionGate`.
- **Secreto resiliente:** env ou `app_settings.auth.secret` (persistido).
- **Origens:** `trustedOrigins` dinâmico (wildcard e2b + origens de preview).
- **Variáveis:** `BETTER_AUTH_SECRET` (opcional com fallback), `NEXT_PUBLIC_AUTH_DEV_RESET`, `RESEND_API_KEY` (opcional).

## 8. Onboarding financeiro (Etapa 5)

Diagnóstico inicial premium em **10 passos** (uma pergunta por vez, sem sobrecarga):

1. **País** (MX, BR, CO, CL, AR, PE, US, outro) → sugere moeda.
2. **Moeda** (pré-selecionada pelo país; catálogo completo de 7 moedas).
3. **Renda mensal** aproximada.
4. **Frequência de recebimento** (mensal, quinzenal, semanal, outra).
5. **Gastos essenciais** aproximados.
6. **Dívidas** (sim/não + total aproximado).
7. **Reserva atual** para emergências.
8. **Investimentos atuais**.
9. **Patrimônio aproximado** (aceita negativo).
10. **Objetivo principal**: sair das dívidas · criar reserva · economizar · comprar algo · viajar · investir · construir patrimônio · outro.

**Resultado:** tela personalizada ("Ya tenemos una primera visión de tu situación financiera.") com resumo formatado por padrão financeiro (`MoneyValue`), balance mensal derivado (positivo/negativo/zero), objetivo escolhido, disclaimer de orientação e **primeiro estado do Money Path™** persistido em `money_path_states` (montos em centavos).

**Comportamentos:**

- Usuário com sessão e sem onboarding é redirecionado de `/app` para `/onboarding` (gate no layout).
- `POST /api/onboarding` valida tudo no servidor (moeda, país, frequência, objetivo, montos via núcleo monetário) e grava por **usuário da sessão** — nunca por id vindo do cliente.
- Repetir o onboarding atualiza `financial_profiles` e adiciona novo estado (histórico auditable).
- Estados de loading (submit), erro (alerta com mensagem) e sucesso; mensagens de validação no dicionário es-MX.
- Nenhuma recomendação financeira complexa nesta etapa — apenas leitura clara do ponto de partida.

**Dados (mudanças de schema):** `financial_profiles` ganhou `country`, `income_frequency`, `has_debts`, `total_debts`, `current_reserve`, `current_investments`, `approximate_net_worth`, `primary_goal`, `onboarding_completed_at`; nova tabela `money_path_states` (`source`, `state jsonb`, índice `(user_id, created_at)`).

## 9. Dashboard — página Inicio (Etapa 6)

Dashboard completo em `/app`, priorizando **1) situação atual → 2) progresso → 3) próximo passo**.

**Indicadores principais** (cards com `MoneyValue` + badge "Estimado/Registrado"):
ingresos del mes · gastos del mes · saldo · ahorro/inversión · deudas · fondo de emergencia (com mini-progresso até a meta) · patrimonio neto.

**Personalização:** o usuário escolhe quais indicadores aparecem (modal com switches). A preferência persiste em `user_settings` (`dashboard.indicators`) via `POST /api/dashboard/preferences` (validação servidor: ids conhecidos, mínimo 1, ordem canônica).

**Gráficos** (SVG puro no servidor, sem dependências):
- Ingresos vs gastos — barras agrupadas dos últimos 6 meses (movimentos reais na moeda base; estado vazio sem movimentos).
- Distribución de gastos — dona por categoria do mês atual (top 5 + "Otros"), com legenda e percentuais.
- Evolución del patrimonio — linha/área dos snapshots; com um único ponto mostra o "punto de partida" do diagnóstico.
- Progreso de metas — barras das metas ativas; sem metas criadas, deriva uma meta inicial do objetivo do onboarding (reserva vs meta, deudas, investimento), marcada como derivada.

**Money Path™ preview ("Tu próximo paso"):** card de destaque com regra simples e transparente derivada dos dados reais: diagnóstico incompleto → "Completa tu información financiera para crear tu ruta."; gastos > ingresos → presupuesto; hay deudas → plan de deudas; reserva < meta → fondo; sin ahorro/inversión → invertir; estável → patrimonio. Sempre com CTA para o módulo e disclaimer de orientação.

**Fontes de dados (regra anti-mock):** primeiro os movimentos/registros reais (tabelas `income`, `expenses`, `debts`, `emergency_funds`, `net_worth_snapshots`, `goals`, filtradas por usuário, moeda base e borrado suave); sem registros, o diagnóstico do onboarding é usado como valor **estimado** e sinalizado como tal. Nunca se somam moedas distintas: cada agregado filtra pela moeda base do usuário.

## 10. Módulo Presupuesto (Etapa 7)

Implementação completa em `/app/presupuesto` — primeiro módulo financeiro ativo.

**Abas:** Ingresos · Gastos fijos · Gastos variables (URL-driven: `?tab=`, preservando o período ativo).

**Ingresos:** data, descrição, valor, categoria, recorrência (semanal/quincenal/mensual/trimestral/anual → cria plantilla em `recurring_transactions` + movimento vinculado) e recebimento futuro (cria `future_receipts` + ingreso pendiente, marcável como recebido).

**Gastos:** data, descrição, valor, categoria, tipo (fijo/variable — nova coluna `expenses.kind`, precarregada da categoria), estado (pagado/pendiente) e observação.

**Categorias personalizadas:** criar (única por usuário, case-insensitive → 409 se duplicada) e arquivar (borrado suave; histórico preservado via `set null` nos movimentos).

**Importação de extratos (CSV, sem integração bancária):** colar ou subir arquivo `fecha,descripcion,monto,tipo,categoria`; monto negativo = gasto; categoria criada automaticamente se não existir; máximo 500 filas. **Anti-duplicados:** qualquer movimiento com a mesma (fecha, monto, descripción) e tipo já existente é omitido (verificado: re-import retorna 0 novos).

**Resumo do período:** Ingresos (recibidos) · Gastos (pagados + pendientes) · Ahorro/Inversión (saldo positivo restante) · Saldo — recalculado a cada operação.

**Filtros:** período (este mes, mes pasado, últimos 3/6 meses, todo), categoría, tipo e estado — todos por query string, com botão "Limpiar filtros".

**Regras garantidas:**
- Indicadores do dashboard e gráficos atualizam automaticamente (lêm as mesmas tabelas reais).
- Movimentos eliminados usam borrado suave (`deleted_at`) — nada é destruído; cancelados ficam fora dos totais.
- Toda operação valida sessão e propriedade no servidor (`user_id` da sessão, nunca do cliente) e a moeda base do usuário (nunca mistura moedas).

**APIs:** `POST /api/presupuesto/transactions` (criar), `.../transactions/update` (markReceived/markPaid/cancel/delete), `.../categories` (create/archive), `.../import` (CSV com dedupe).

## 11. Recurrencia financeira (Etapa 8)

**Suporte:** receitas e despesas recorrentes — frequência mensal, quinzenal e semanal (outras no modelo), data inicial, data final opcional, valor e categoria. Gestão em `/app/presupuesto/recurrencias`; cobros em `/app/presupuesto/cobros` (acessos na página principal do Presupuesto).

**Geração consistente e sem duplicatas:** as plantillas vivem em `recurring_transactions`; as ocorrências são **materializadas de forma idempotente** por `ensureOccurrences()` (chamado nas páginas do módulo): despesas viram `expenses` (passadas = pagadas, futuras = pendentes); ingressos até hoje viram `income` (recibidos) e **futuros viram `future_receipts`** — receitas futuras permanecem separadas das já recebidas. Dedupe por (plantilla + fecha); verificado com cargas repetidas (14/3/3 sem duplicar). Horizonte: até hoje + 3 meses, respeitando data final (plantilla vira "completada" ao passar dela).

**Edição por alcance** (padrão de calendário):
- **Solo esta ocurrencia** — altera somente a ocorrência na data de referência.
- **Esta y las próximas** — atualiza a plantilla e regenera a partir da data de referência (ocorrências futuras geradas são substituídas; confirmação explícita na UI).
- **Toda la serie** — atualiza a plantilla e regenera tudo.

**Operações:** criar, editar, pausar (para a geração; ocorrências existentes ficam), reanudar e eliminar (borrado suave da plantilla; histórico de ocorrências preservado).

**Cobros futuros:** página dedicada separada dos ingressos recebidos — pendentes e recebidos recentemente. "Marcar recibido" concretiza o cobro: se havia ingreso vinculado, o marca como recibido; senão, cria o ingreso na data de hoje. Cancelar não cria ingresso. Cobros manuais e gerados por recurrencias convivem (badge "Recurrente"). `future_receipts` ganhou `recurring_id` (anti-duplicados + vínculo com a plantilla).

**APIs:** `POST /api/presupuesto/recurring` (create/update com scope/pause/resume/delete) e `POST /api/presupuesto/future-receipts` (create/markReceived/cancel) — sempre pelo usuário da sessão (acesso cruzado → 404, verificado).

## 12. Compras parceladas (Etapa 9)

Implementação completa em `/app/presupuesto/parcelas` (acesso na página principal do Presupuesto).

**Cadastro:** descrição, valor total, número de parcelas (2–120), data da primeira parcela, categoria (gasto) e **método de pagamento** (novo campo em `installments.payment_method`: crédito, débito, efectivo, transferencia, outro).

**Sistema (tudo derivado no servidor):** valor por parcela (distribuição exata em centavos: `1,000.01 ÷ 3 = 333.34 + 333.34 + 333.33`), parcelas restantes, valor já pago, próxima parcela (data + número) e data de término (vencimentos mensais com dia fixo, clamp de fim de mês).

**Visualização:** card no formato do produto — `iPhone · $18,000 · 12 × $1,500 · 3/12 pagas` — com barra de progresso, método de pagamento, categoria, término, pago/restante e lista expansível das 12 cuotas com botão "Pagar" por cuota pendente.

**Orçamento (regra central):** cada parcela é materializada como gasto real (`expenses.installment_id` + `installment_number`) na sua data de vencimento — geração idempotente (`ensureInstallmentOccurrences`, chamada nas páginas do módulo). **Cada mês registra somente a sua parcela** (verificado: 12 meses × $1,500; nenhum mês carrega os $18,000); o resumen do Presupuesto e os gráficos do dashboard refletem as parcelas automaticamente, no mês certo. Parcelas geradas entram como gastos **fijos** (compromissos mensais).

**Operações:** criar; pagar cuota (marca paga, sincroniza `paid_installments`, plano vira `completed` ao quitar tudo — verificado); eliminar (borrado suave do plano + cancela somente as cuotas **impagas**; as pagas permanecem como histórico real).

**API:** `POST /api/presupuesto/installments` (`create` / `payCuota` / `delete`) — sessão e propriedade validadas no servidor (401 sem sessão; validações 400 testadas).

## 13. Deudas (Etapa 10)

Implementação completa em `/app/deudas` (abas **Mis deudas** / **Plan de pago**).

**Cadastro:** credor, tipo (tarjeta/préstamo/hipoteca/auto/educativo/otra), valor original, saldo atual, juros anual (%), dia de vencimento, pagamento mínimo, número de parcelas, prioridade (alta/média/baja) e estado. Novas colunas em `debts`: `priority` (1–3, check) e `total_installments`.

**Dashboard do módulo:** Deuda total (Σ original das abertas) · Deuda restante (Σ saldos) · Pagos del mes (Σ abonos do mês + contagem) · Progreso de pago (barra %).

**Abonos:** registrar abono descuenta o saldo real; abono acima do saldo é recusado (400); ao zerar o saldo a dívida vira `paid_off` automaticamente. Abonos ficam em `debt_payments` (histórico preservado).

**Alertas de vencimento:** dívidas cujo próximo vencimento está a ≤7 dias aparecem num alerta no topo (hoje/amanhã/em N dias).

**Plan de pago:** ordena por prioridade e **compara duas estratégias de quitação** — Avalancha (maior juros primeiro) vs Bola de nieve (menor saldo primeiro) — via simulação pura (`simulateStrategy`, capitalização mensal, mínimo + excedente rolado). Mostra meses até quitar, juros estimados, total a pagar e primeira dívida liquidada, com um **excedente mensal ajustável** (pré-carregado do diagnóstico). Recomenda a estratégia que poupa juros. **Nunca executa pagamentos** — é orientação.

**Money Path:** o saldo real de dívidas alimenta o indicador do dashboard e a tarjeta "Tu próximo paso" passa a nomear a dívida prioritária ("Empieza por {name}").

**Segurança:** sessão/propriedade validadas no servidor; simulação é função pura sem efeitos colaterais.

## 14. Fondo de Emergencia (Etapa 11)

Implementação completa em `/app/fondo`.

**Cálculo do gasto essencial mensal:** usa o **ajuste manual** do usuário se definido; senão calcula a **média dos últimos 3 meses** de gastos registrados apenas nas categorias **marcadas como essenciais**. Novas colunas: `expense_categories.is_essential` e `financial_profiles.essential_monthly_override` (null = automático). **Discricionárias ficam fora por padrão** (Suscripciones, Comida fuera, Entretenimiento, Otros gastos nunca são marcadas essenciais — nem no seed do registro nem na migração); o usuário vê exatamente quais categorias contam, com o valor médio mensal de cada uma (breakdown).

**Escolha de objetivo de meses:** presets 3 / 6 / 9 / 12 + custom (1–36), salvos em `financial_profiles.emergencyFundTargetMonths`.

**Indicadores:** Meta total (essencial × meses) · Valor atual · Valor restante · Percentual · **Meses protegidos** (valor atual ÷ essencial mensal). Cálculo verificado exato: `(8,500 + 9,330.40 + 2,090.75) ÷ 3 = 6,640.38` × 6 = **39,842.28**.

**Operações:** configurar (meses + override), alternar categoria essencial, aportar (soma ao valor atual) e fixar valor atual. O fundo atual vive em `emergency_funds` (semeado do `currentReserve` do onboarding) e o objetivo fica sincronizado nessa tabela.

**Progresso:** barra de % + visualização de blocos por mês (preenchidos conforme meses protegidos, com fração).

**Integração:** o indicador de fondo do dashboard usa o mesmo `computeEssentialMonthly`, mantendo consistência; seed do registro e migração marcam as essenciais corretas.

**Segurança:** todas as operações validam sessão e propriedade (toggle de categoria alheia → 404).

## 15. Metas (Etapa 12)

Implementação completa em `/app/metas`.

**Criar meta:** nome, **categoria** (viaje/auto/casa/fondo de emergencia/educación/inversión/compra personal/otro — nova coluna `goals.category`), valor objetivo, valor atual, prazo (data) e prioridade (alta/média/baja — `goals.priority` agora NOT NULL 1–3 com check).

**Cálculo:** quanto falta guardar **por mês**, **por semana** e o **período restante** até o prazo (`computeGoalPlan`, aritmética inteira em centavos com arredondamento para cima). Verificado: restante 23,000 ÷ 12 meses = **$1,916.67/mês**.

**Contribuições:** registrar aporte soma ao `current_amount` automaticamente e grava em `goal_contributions`; ao atingir o objetivo a meta vira `achieved`. Progresso atualiza em tempo real (verificado 5,000 → 7,000).

**Previsão:** "Al ritmo actual, alcanzarás tu meta aproximadamente en X" — ritmo = aportes totais da meta ÷ meses desde o primeiro aporte; sem aportes, pede o primeiro aporte. Data estimada calculada.

**Dashboard:** a seção "Progreso de metas" do Inicio lê as metas ativas reais (mesma tabela), exibindo o progresso automaticamente.

**Resumo do módulo:** metas ativas · objetivo total · ahorrado · logradas.

**Segurança:** todas as operações validam sessão e propriedade (404 para meta alheia; 401 sem sessão); validações 400 (objetivo ≤ 0, atual > objetivo, aporte ≤ 0).

## 16. Inversiones (Etapa 13)

Implementação completa em `/app/inversiones` (abas **Inversiones** / **Cuentas**).

**Contas:** instituição, tipo (casa de bolsa/banco/AFORE/cripto/otra), moeda e saldo (nova coluna `investment_accounts.balance`).

**Investimentos:** nome, categoria (CETES/fondo/ETF/acción/bono/cripto/otro), quantidade, preço médio, valor atual, aportes e data. Novas colunas em `investments`: `quantity` (numeric 18,6) e `average_price` (numeric 18,2). Importe investido = quantidade × preço médio (preenchido automaticamente) ou valor explícito.

**Cálculos:** total invertido · valor atual · ganho/perda · percentual · aportes. Verificado exato: invertido 25,000 · actual 23,050 · pérdida −1,950 · **−7.80%**. Aporte soma ao `invested_amount` e grava em `investment_transactions` (kind `contribution`).

**Evolução:** gráfico de área do patrimônio investido (acumulado mensal de aportes + base, 12 meses), SVG sem dependências.

**Restrições (por desenho):** sem integração de corretoras/bancos e sem recomendações de compra/venda — disclaimer visível no módulo.

**Segurança:** totais consideram apenas a moeda base (não se misturam moedas); sessão/propriedade validadas (401 sem sessão, 404 para registro alheio); delete suave preserva histórico.

## 17. Patrimonio (Etapa 14)

Implementação completa em `/app/patrimonio` (abas **Activos** / **Pasivos**).

**Activos:** dinheiro, inversiones, imóveis, veículos e outros ativos (tabela `assets`, kinds existentes). Para veículos e imóveis, valor **manual** por enquanto; novas colunas `assets.valuation_source` (`manual`/`external`) e `assets.external_reference` deixam a estrutura pronta para futura integração com fontes externas de avaliação.

**Pasivos:** financiamientos, préstamos, cartões e outras dívidas (enum de `liabilities` ajustado para `financing`/`personal_loan`/`credit_card`/`other`).

**Fórmula:** Patrimonio Neto = Total de Ativos − Total de Passivos. Verificado exato: 1,100,000 − 262,000 = **838,000**; patrimônio negativo suportado (−62,000 após remover um ativo).

**Evolução:** histórico mensal em `net_worth_snapshots` (um snapshot por mês, atualizado a cada visita). Mostra patrimônio atual, **variação** contra o mês anterior (+38,000 / +4.8% em teste) e gráfico do histórico. O indicador "Evolución del patrimonio" do dashboard lê os mesmos snapshots.

**Segurança:** totais apenas na moeda base; sessão/propriedade validadas (401/404); delete suave recalcula o patrimônio.

## 18. Calculadoras (Etapa 15)

Implementação completa em `/app/calculadoras` (4 abas). Funções puras em `src/lib/calculators.ts`, calculando em centavos (aritmética inteira, sem ponto flutuante para o dinheiro).

**1. Interés compuesto:** investimento inicial + aporte mensal + taxa anual + período → total aportado, juros ganhos e valor final. (Verificado: 10,000 + 1,000/mês @ 10% por 5 anos = final 93,890.15.)

**2. Meta financiera:** valor objetivo + valor atual + prazo → aporte mensal necessário. (Verificado: 45,000 ÷ 36 meses = 1,250/mês.)

**3. Primer gran objetivo:** simula construção de patrimônio (aporte mensal + rendimento até o objetivo), com tempo estimado e crescimento por ano.

**4. Comprar vs rentar:** simulador comparativo a N anos (preço, enganche, taxa/prazo hipotecário, manutenção, plusvalía vs renda, aumento de renda, rendimento do enganche investido) → custo neto de cada opção, vencedor e diferença.

**UX (cada calculadora):** explica os campos (hints), valida inputs (mensagens por campo), mostra o resultado e tem botão "Simular de nuevo". Disclaimer global: resultados são **proyecciones orientativas, no garantías**.

**Segurança:** módulo sob o aplicativo protegido; não acessa nem expõe dados financeiros do usuário (ferramenta de simulação pura).

## 19. Money Path™ (Etapa 16)

O diferencial central do produto, em `/app/money-path`. Não é uma página de gráficos: é um motor que transforma os dados financeiros reais do usuário em uma rota de ação.

**Entradas (todas de dados existentes):** ingresos, gastos, gastos essenciais, deudas, ahorro, fondo de emergencia, metas, inversiones e patrimonio — coletados no servidor por `lib/moneypath.ts` (média de 3 meses para ingresso/gasto reais, com fallback ao diagnóstico do onboarding marcado como estimado).

**Análise:** `analyzeMoneyPath` (função pura em `lib/moneypath-shared.ts`) detecta prioridades ordenadas por severidade: excesso de gastos, dívida relevante (tasa alta ou dívida grande), falta de reserva, baixa capacidade de ahorro, meta incompatible con orçamento, patrimônio evoluindo (sinal positivo), necessidade de reorganização (≥3 frentes) e "on track" quando não há problemas.

**Resultado — Tu Ruta Financiera (5 seções):** 1) Situación actual (indicadores reais), 2) Prioridad (hallazgo principal + severidade), 3) Acción recomendada, 4) Impacto estimado (com badge "Estimado"), 5) Próximo paso (CTA ao módulo correspondente).

**Exemplo real (verificado):** prioridade "Tienes deuda relevante — Tarjeta BBVA (68.5% anual)"; impacto "Si destinas $X al mes a tus deudas, las liquidarías en ~8 meses"; próximo paso → `/app/deudas`.

**Simulação "¿Qué pasa si reduzco mis gastos en $X?":** slider interativo que recalcula o novo excedente e os meses para alcançar o fundo de emergencia antes/depois (verificado: recorte de $500 → 2 meses antes).

**Persistência:** cada visita grava um estado da rota em `money_path_states` (máx. 1/dia, `source='auto'`) para auditoria.

**Importante:** não inventa dados (tudo vem de tabelas reais); projeções marcadas como estimadas; disclaimers de que não é asesoría financeira profissional.

## 20. Money AI (Etapa 17)

Assistente financeiro contextual em `/app/money-ai`. Não é um chatbot genérico: responde **exclusivamente com os dados reais do próprio usuário** via um motor determinístico de intents (`lib/moneyai/`), garantindo que nunca inventa transações, saldos nem patrimônio.

**Perguntas suportadas (todas verificadas com dados reais):** "¿Puedo comprar esto?" (pide precio si falta), "¿Cuánto gasté en comida?" (suma por categorías coincidentes), "¿Por qué no logro ahorrar?", "¿Cuánto necesito ahorrar para mi meta?", "¿Cuál es mi mayor gasto?", "¿Cómo puedo reducir mis gastos?", "¿Cuándo alcanzaré mi meta?".

**Estructura de respuesta (5 partes):** Resumen → Explicación → Datos utilizados (lista de datos reales con montos) → Impacto → Próximo paso (CTA al módulo). Verificado completo.

**Transparencia:** cuando falta información responde "Necesito más información para responder con precisión." (`needsMoreInfo`), p. ej. "¿Puedo comprar esto?" sin precio, o categoría no identificada (lista las categorías disponibles).

**Seguridad (por desenho):** solo lee datos; no ejecuta compras, transferencias ni inversiones; no se pasa por consultor financiero (disclaimer visible). La API valida sesión (401 sin ella).

**UI:** conversa (burbujas + tarjeta estructurada), histórico de conversaciones persistido (`ai_conversations`/`ai_messages`), sugerencias y preguntas rápidas (chips), y cards de contexto (ingreso, gasto, balance, fondo, deudas, patrimonio).

**Arquitectura:** `context.ts` recolecta el contexto real (server); `engine.ts` detecta la intención y construye la respuesta (función pura, i18n); `/api/money-ai` (GET historial / POST chat).

## 21. Reports & Insights (Etapa 18)

Implementado como o módulo **Resumen** (`/app/resumen`), a casa natural dos relatórios. Tudo server-rendered a partir de dados reais; sem dados, mostra estado vazio (nunca inventa).

**Períodos:** seletor com Este mes · Últimos 3 · Últimos 6 · Últimos 12 meses (query param `?p=`). Cada período compara contra o período anterior de igual duração.

**Relatórios (seções):** evolución de ingresos y gastos (barras agrupadas por mes) · gastos por categoría (barras + variação % vs período anterior) · capacidad de ahorro (ahorro del período, promedio mensual e taxa %) · deudas (total, ativas, pagado en el período) · inversiones (invertido, valor actual, ganancia) · patrimonio (línea de evolução desde snapshots + último valor e cambio).

**Comparación:** tabela "Período anterior vs actual" para ingresos, gastos e ahorro, com delta em %.

**Insights automáticos** (`buildInsights`, função pura): gerados só quando há dados — p. ej. "Tu gasto en {categoría} aumentó {pct}%", "Tu patrimonio aumentó {amount}", "Tu ahorro fue superior/menor al período anterior", "Pagaste {amount} a tus deudas", "Tus inversiones generaron {amount} de ganancia", "Tus ingresos aumentaron/bajaron {pct}%". Verificado: "Comida fuera aumentó 93%" e "ahorro fue menor" com dados reais.

**Arquitectura:** `lib/reports.ts` (`getReportsData` coleta séries/totales/comparaciones; `buildInsights` gera insights); `components/reportes/reports-charts.tsx` (gráficos SVG server-rendered).

## 22. Academia (Etapa 19)

Área educacional em `/app/academia` com catálogo persistido em `academy_categories`/`academy_contents` (seed idempotente `src/db/seed-academy.sql`).

**Categorias (8):** Finanzas personales · Presupuesto · Deudas · Ahorro · Fondo de emergencia · Inversiones · Patrimonio · Hábitos financieros.

**Conteúdos (24):** artigos (`article`), aulas (`video`), guias (`guide`) e conteúdos curtos (`tip`), com nível e duração. **Conteúdo educacional geral e básico** (conceitos, definições, hábitos) — sem recomendações complexas nem conteúdo de investimento específico, conforme a regra da etapa; nota permanente de que não é asesoría nem substitui fontes oficiais.

**Experiência:** barra de **progresso** ("X de 24 concluidos" + %), filtros por categoria (com contador "concluídos/total" por chip), filtros de estado (Todo/Favoritos/Concluidos), visor de conteúdo em modal com nota de alcance, **favoritos** (coração) e **marcar como concluído** (com estado Concluido no card).

**Persistência:** nova tabela `academy_progress` (única por usuário+conteúdo, unique index) com `is_completed`, `is_favorite` e `completed_at` — via `POST /api/academy` com sessão (401 sem sessão; idempotente, sem duplicar).

## 23. Notificações (Etapa 20)

Centro de notificações em `/app/notificaciones` sobre a tabela `notifications` existente.

**Tipos (8, configuráveis):** receita futura · vencimiento · parcela · meta · deuda · orçamento · fondo de emergencia · insights.

**Geração (anti-excesso):** gerada ao abrir o centro (`generateNotifications`), **idempotente por chave** (cada aviso aparece uma vez — reabrir não duplica, verificado), respeitando as preferências e com janelas reais (vencimientos/cobros/parcelas: 7 dias; metas: 30 dias; orçamento: mês corrente; insight: maior subida ≥10% vs mês anterior). Tope de 15 avisos por corrida. **Nunca inventa**: todos os avisos derivam de dados existentes (verificado: os 8 tipos dispararam com dados reais).

**Controle (preferências):** 8 toggles por tipo via `POST {op:"preferences"}` persistidos em `user_settings` (`notifications.enabled`); tipo desativado não gera (verificado: desativar "insight" → 7 avisos; reativar → 8).

**UX:** contador de não-lidas (badge no cabeçalho e na sidebar via `NotificationCount`, atualizado no monte/foco sem polling), **marcar como lida** (individual), **marcar todo como leído**, **limpar leídas** (`dismissed`, não re-gera), tempo relativo ("hace 2 h"), empty state e nota de "sem duplicados".

**API:** `GET /api/notifications` (lista + contador + preferências) e `POST` (`read`/`readAll`/`clear`/`generate`/`preferences`) — 401 sem sessão.

## 24. Configuración (Etapa 21)

Implementação completa em `/app/configuracion` com 4 abas: **Perfil · Preferências · Privacidad · Cuenta**.

**Perfil:** nome (via Better Auth `updateUser` + sync `profiles.display_name`), email (Better Auth `changeEmail` com `updateEmailWithoutVerification` — o endpoint aceita newEmail; sem serviço de email a atualização é direta e a sessão continua ativa), país (`financial_profiles.country`) e **idioma** (`profiles.locale`).

**Preferências:**
- **Tema**: preferência persistida em `user_settings` (`ui.theme`) e **plumbing real**: o layout do aplicativo aplica `data-theme` no wrapper (claro ativo; escuro desabilitado com "Próximamente" — um tema parcial quebraria o Design System, então a paleta escura chega com o passe de design).
- **Moeda base**: trocar exige **confirmação explícita** quando existem registros (verificado: 409 sem `confirm`, 200 com). Os registros **conservam sua moeda** (nunca há conversão ou mistura silenciosa); agregações usam apenas a moeda base.
- **Notificações** e **Panel**: os mesmos controles dos módulos originais (armazenamento único compartilhado).

**Privacidade (controles disponíveis pela arquitetura):**
- Nota verificável: Money AI/Money Path™ não usam LLM externo (dado local apenas).
- **Exportar mis datos**: `GET /api/settings/export` → JSON `money-path-export-v1` com 28 seções (perfil, preferências, categorias, movimentos, dívidas, metas, investimentos, patrimônio, notificaciones, IA, academia, cálculos, estados do Money Path™).
- **Borrar historial de Money AI** e **Reiniciar progreso de la Academia** — com `ConfirmDialog` (dados não financeiros, eliminação explícita).
- Nota permanente: nenhuma exclusão automática de dados financeiros.

**Cuenta:** alterar senha (Better Auth `changePassword`, validação de confirmação), sair (`signOut`), e **solicitar exclusão da conta**: grava `account.deletionRequest` (pending) em `user_settings` após o usuário digitar a palavra `ELIMINAR` — **não remove nada** (verificado: usuário e perfil permanecem; cancelável).

**Internacionalização (preparação):** o seletor lista `pt-BR` e `en-US` como `disabled` ("Próximamente"); a API rejeita idiomas sem dicionário ativo — `ACTIVE_LANGUAGES` é a fonte da verdade, então adicionar um locale = criar dicionário + habilitar entrada.

## 25. Banco de dados e modelo (Etapas 0/3/4/5)

PostgreSQL via Drizzle ORM. Entrada única: `src/db/schema.ts`. **37 tabelas**: `currencies`; identidade (`users`, `profiles`, `financial_profiles`, `user_settings`); auth (`sessions`, `accounts`, `verifications`); categorias; movimentos (`income`, `expenses`, `recurring_transactions`, `future_receipts`, `installments`); dívidas (`debts`, `debt_payments`); ahorro (`emergency_funds`, `goals`, `goal_contributions`); investimentos; patrimônio (`assets`, `liabilities`, `net_worth_snapshots`); `budgets`; conta (`notifications`, `subscriptions`); Money AI; academia (`academy_categories`, `academy_contents`, **`academy_progress`** — Etapa 19); `calculations`; **`money_path_states`** (Etapa 5); `app_settings`. Na Etapa 19 o enum `kind` de `academy_contents` ganhou `tip` (conteúdos curtos); notificações usam `user_settings` para preferências (Etapa 20).

Convenções: UUID v4; `created_at`/`updated_at` em tudo; `numeric(18,2)` com cálculo em centavos; multi-moeda explícita (FK `currencies`); borrado suave; constraints/índices por domínio. Preferências do usuário em `user_settings` (`ui.theme`, `dashboard.indicators`, `notifications.enabled`, `account.deletionRequest`). Na Etapa 7, `expenses` ganhou `kind` (fijo/variable, índice `(user_id, kind)`) e `note`; na Etapa 8, `future_receipts` ganhou `recurring_id` (vínculo com a plantilla + anti-duplicados); na Etapa 9, `installments` ganhou `category_id` (FK a categorias de gasto) e `payment_method`; na Etapa 10, `debts` ganhou `priority` (1–3, check) e `total_installments`; na Etapa 11, `expense_categories` ganhou `is_essential` e `financial_profiles` ganhou `essential_monthly_override` (nullable); na Etapa 12, `goals` ganhou `category` (enum) e `priority` virou NOT NULL 1–3 (check); na Etapa 13, `investment_accounts` ganhou `balance` e `investments` ganhou `quantity` (18,6) e `average_price` (18,2); na Etapa 14, `assets` ganhou `valuation_source` e `external_reference`, e o enum de `liabilities` foi ajustado (financing/personal_loan/credit_card/other).

```bash
npx drizzle-kit push                          # aplica o modelo
psql "$DATABASE_URL" -f src/db/seed.sql       # seed de moedas (idempotente)
```

## 26. Módulos

Capacidades de referência (registro em `src/config/modules.ts`): Ingresos, Gastos fijos, Gastos variables, Categorías — **planificados**, aguardando suas etapas. **Disponíveis: Panel/dashboard (Etapa 6), Presupuesto (Etapa 7), Ingresos recurrentes e Cobros futuros (Etapa 8), Pagos a plazos (Etapa 9), Deudas (Etapa 10), Fondo de emergencia (Etapa 11), Metas (Etapa 12), Inversiones (Etapa 13), Patrimonio (Etapa 14), Calculadoras (Etapa 15), Educación financiera/Academia (Etapa 19).** Áreas funcionais sem entrada no registry: Money Path™ (16), Money AI (17), Resumen/Reports (18), Notificaciones (20), Configuración (21).

**Diferenciais:** Money Path™ (motor de rota de ação, Etapa 16) e Money AI (assistente contextual sobre os dados do usuário, Etapa 17) — ambos implementados. A área **Resumen** foi implementada como Reports & Insights na Etapa 18.

## 27. Design System (Etapa 1)

Paleta própria petrol + cobre sobre superfícies cálidas (tokens `@theme`): `primary #14656d`, `primary-hover #0f5159`, `background #f4f3ee`, `surface #fcfbf8`, `elevated #fefdfa`, `text #16262b`, `muted #54656b`, `success #1c8a56`, `warning #a8690c`, `danger #c03d36`, `info #1f6e96`, `border #e4e1d5`, acento cobre. Componentes: Button, Input, Select, Checkbox, Switch, Slider, Card, Modal, Drawer, Badge, Tooltip, Dropdown, Tabs, Progress, Alert, Toast, Empty/Loading/Error states, `MoneyValue`, `Sparkline`; ícones SVG consistentes. Padrões financeiros: receita `+` verde, despesa `−` vermelha, dívida âmbar, meta petrol, patrimônio tinta, investimento azul-petróleo. Vitrine em `/design`. Mobile first.

## 28. Etapas de desenvolvimento

| Etapa | Conteúdo                                                                                     | Estado    |
| ----- | -------------------------------------------------------------------------------------------- | --------- |
| 0     | Fundação — i18n, núcleo monetário, configuração em banco, verificações                        | ✅ Completa |
| 1     | Identidade visual e Design System                                                             | ✅ Completa |
| 2     | Arquitetura do aplicativo — 14 rotas, sidebar/bottom nav, páginas base, 404                   | ✅ Completa |
| 3     | Banco de dados — modelo completo, multi-moeda, auditoria, borrado suave                       | ✅ Completa |
| 4     | Autenticação — Better Auth, sessão dual, recuperação, perfil automático                       | ✅ Completa |
| 5     | Onboarding financeiro — diagnóstico em 10 passos, introdução personalizada, primeiro estado do Money Path | ✅ Completa |
| 6     | Dashboard — página Inicio completa: 7 indicadores personalizáveis, 4 gráficos, "Tu próximo paso" do Money Path | ✅ Completa |
| 7     | Presupuesto — abas Ingresos/Gastos fijos/Gastos variables, categorías personalizadas, importação CSV com anti-duplicados, resumo e filtros | ✅ Completa |
| 8     | Recurrencia financiera — plantillas de ingressos/despesas, geração idempotente de ocorrências, edição por alcance (una/siguientes/serie), cobros futuros separados | ✅ Completa |
| 9     | Compras parceladas — cadastro completo, distribuição exata em centavos, cuotas por mês (impacto correto no orçamento), pagamento por cuota e controle de avance | ✅ Completa |
| 10    | Deudas — cadastro completo, dashboard do módulo, abonos, alertas de vencimiento, plan de pago por prioridade e comparação de estratégias (avalancha/bola de nieve) | ✅ Completa |
| 11    | Fondo de emergencia — gasto essencial por categorías (sem discricionárias), objetivo de meses, ajuste manual, aportes e visualização de progresso | ✅ Completa |
| 12    | Metas — criação com categoria/prazo/prioridade, cálculo por mês/semana/período, contribuições com progresso automático e previsão ao ritmo atual | ✅ Completa |
| 13    | Inversiones — contas (instituição/tipo/moeda/saldo), investimentos (quantidade/preço médio/valor atual), aportes, ganho/perda e evolução do patrimônio investido | ✅ Completa |
| 14    | Patrimonio — activos (dinero/inversiones/inmuebles/vehículos/otros), pasivos (financiamientos/préstamos/tarjetas/otras), patrimonio neto, variação e histórico mensal | ✅ Completa |
| 15    | Calculadoras — interés compuesto, meta financiera, primer gran objetivo y comprar vs rentar; campos explicados, validados, com resultado e "simular de nuevo" | ✅ Completa |
| 16    | Money Path™ — motor que convierte ingresos/gastos/deudas/ahorro/metas/inversiones/patrimonio en una ruta de acción (situación, prioridad, acción, impacto, próximo paso) + simulación "¿y si reduzco gastos?" | ✅ Completa |
| 17    | Money AI — asistente contextual que responde sobre el propio dinero con datos reales: conversa, histórico, sugerencias, preguntas rápidas y cards de contexto | ✅ Completa |
| 18    | Reports & Insights — implementa o módulo Resumen: informes por período (1/3/6/12 meses), comparación entre períodos e insights automáticos | ✅ Completa |
| 19    | Academia — área educacional com 8 categorías, 24 contenidos (artículos/aulas/guías/consejos), progreso, concluidos y favoritos | ✅ Completa |
| **20** | **Notificaciones** — centro con 8 tipos configurables, contador, marcar como leída, limpiar y preferencias; generación idempotente anti-exceso | ✅ Completa |
| **21** | **Configuración** — perfil (nome/email/país/moeda/idioma), preferências (tema, moeda com confirmação, notificações, panel), privacidade (exportação, controles) e conta (senha, sair, solicitação de exclusão sem remoção automática) | ✅ Completa |
| **22** | **Monetização** — planos Free/Pro, catálogo de funcionalidades, tabela comparativa, checkout mensal/anual, estado da assinatura, bloqueio elegante dos recursos premium e limite de 3 metas no Free | ✅ Completa |
| **23** | **Auditoria de seguridad y precisión financiera** — autenticación, autorización, aislamiento por usuario, secrets, headers, inputs, dependencias y suite de 98 verificaciones monetarias | ✅ Completa |
| **24** | **Experiência responsiva** — meta viewport ausente (causa raiz), modais como bottom-sheet, safe-area, alvos de toque ≥ 44 px, overflow de montos/gráficos, tabelas e abas deslizáveis | ✅ Completa |
| **25** | **Pulido de experiência** — hierarquia, contraste, tipografia, consistência, microinterações, feedback, loading, empty/error/success states, destaque de Money Path™ e Money AI contextual | ✅ Completa |
| **26** | **Auditoria funcional** — 22 fluxos principais testados com cenário realista; consistência entre módulos; 4 bugs corrigidos | ✅ Completa |
| **27** | **Preparação para produção** — build, env/secrets, banco, autenticação, performance, error handling, SEO, favicon, metadata, Open Graph, páginas legais, domínio/HTTPS e checklist de despliegue | ✅ Completa |
| **28** | **Auditoria final do produto** — módulos, consistência de dados, cálculos, UX, Money Path/AI, mobile, segurança, performance e monetização; 3 bugs corrigidos; ver **`FINAL_AUDIT.md`** | ✅ Completa |
| **29** | **Localização pt-BR** — dicionário completo (1622 entradas), datas/moedas no padrão brasileiro, troca de idioma sem logout, Money AI em português | ✅ Completa |
| **30** | **Redesign visual** — paleta verde-lima #a4f73d, dark mode #101210, light mode branco, logo Money Path com gradiente, tipografia Inter, landing page renovada | ✅ Completa |
| 31+   | Definidas e aprovadas pelo produto antes de serem construídas                                 | Por definir |

**Etapa atual: 30 — Redesign visual (concluída).** **265 verificações em verde** (auditoria final 47 + funcional 120 + precisão monetária 98), nenhum bloqueador crítico no código, 3 bugs corrigidos. O relatório completo está em **[`FINAL_AUDIT.md`](./FINAL_AUDIT.md)** — inclui o status final, que **não declara "production ready"** enquanto faltarem configurações externas (banco administrado, serviço de e-mail, domínio/HTTPS, gateway de pagamentos e revisão jurídica).

## 29. Funcionalidades concluídas

**Etapa 0 — Fundação:** i18n tipado `es-MX`; núcleo monetário em centavos; registro locales/moedas; `app_settings`; painel de verificação em vivo; healthcheck real.

**Etapa 1 — Design System:** paleta própria; tokens semânticos; ícones; 20 componentes UI; padrões financeiros; vitrine `/design`; `ToastProvider` global.

**Etapa 2 — Arquitetura:** 14 rotas `/app/*`; sidebar + bottom nav com menú "Más"; páginas base com breadcrumbs/estados; 404 duplo.

**Etapa 3 — Banco de dados:** 36 tabelas por domínio; multi-moeda com FK; constraints/índices verificadas; borrado suave.

**Etapa 4 — Autenticação:** cadastro/login/logout/recuperação; sessão persistente dual (cookie + Bearer); proteção de rotas; perfil automático pós-cadastro; secreto resiliente.

**Etapa 5 — Onboarding financeiro:**

- ✅ Wizard premium de 10 passos (país, moeda, renda, frequência, gastos essenciais, dívidas, reserva, investimentos, patrimônio, objetivo) com progresso, validação por passo e retorno.
- ✅ 8 objetivos financeiros (sair de dívidas, criar reserva, economizar, comprar, viajar, investir, patrimônio, outro).
- ✅ Tela de resultado personalizada: "Ya tenemos una primera visión de tu situación financiera." + resumo com padrões financeiros + mensagem de balance.
- ✅ Primeiro estado do Money Path™ criado e persistido (`money_path_states`, montos em centavos).
- ✅ Persistência real: `POST /api/onboarding` com validação server-side e escrita por usuário da sessão (verificado no banco com valores exatos).
- ✅ Gate: `/app` sem onboarding → redirect a `/onboarding`; após concluir → acesso liberado.
- ✅ Prefill + aviso quando o diagnóstico já foi completado (re-execução atualiza).
- ✅ Estados de loading/erro/sucesso; mensagens es-MX; nenhuma recomendação complexa.

**Etapa 6 — Dashboard:**

- ✅ Página Inicio completa com prioridades claras: situação atual → progresso → próximo passo.
- ✅ 7 indicadores (ingresos, gastos, saldo, ahorro/inversión, deudas, fondo de emergencia com mini-progresso, patrimonio neto) com badge "Estimado/Registrado".
- ✅ Personalização persistente: o usuário escolhe quais indicadores ver; salvo em `user_settings` via API validada (mínimo 1, ids conhecidos, ordem canônica).
- ✅ 4 gráficos SVG sem dependências: ingresos vs gastos (6 meses), distribución de gastos (dona por categoria), evolución del patrimonio (área), progreso de metas (barras).
- ✅ Fontes reais com fallback honesto: movimentos/registros primeiro; sem registros, o diagnóstico aparece sinalizado como "Estimado" — nada de mock.
- ✅ Higiene multi-moeda: cada agregado considera somente a moeda base do usuário.
- ✅ Metas derivadas do objetivo do onboarding enquanto não existem metas criadas (marcadas como derivadas).
- ✅ Card "Tu próximo paso" (Money Path™ preview) com regra transparente sobre os dados reais, CTA ao módulo correspondente, disclaimer e caso "Completa tu información financiera para crear tu ruta." quando falta diagnóstico.
- ✅ Estados vazios em todos os gráficos; validado com movimentos reais e com usuário multi-moeda (ARS).

**Etapa 7 — Presupuesto:**

- ✅ Módulo completo em `/app/presupuesto` com 3 abas (Ingresos, Gastos fijos, Gastos variables).
- ✅ Registro de ingresos com data, descrição, valor, categoria, recorrência (plantilla + movimiento vinculado) e cobro futuro (pendente, marcável como recibido).
- ✅ Registro de gastos com data, descrição, valor, categoria, tipo (coluna `expenses.kind`), estado e observação.
- ✅ Categorias personalizadas: criação única por usuário (409 em duplicada) e arquivamento com borrado suave.
- ✅ Importação de extratos CSV (colar ou arquivo) com anti-duplicados por (fecha, monto, descripción): 3 novos + 1 duplicado no primeiro import; 0 novos no re-import.
- ✅ Resumo do período (Ingresos, Gastos comprometidos, Ahorro/Inversión, Saldo) recalculado a cada operação.
- ✅ Filtros por período, categoría, tipo e estado (URL), com limpeza rápida.
- ✅ Operações: marcar recibido/pagado (com concretização do cobro futuro), cancelar e eliminar (soft delete) — todas com diálogo de confirmação.
- ✅ Regra "indicadores automáticos" verificada: o dashboard refletiu os novos movimentos imediatamente.
- ✅ Segurança: 401 sem sessão; validação de propriedade e moeda base no servidor; montantes validados no núcleo monetário.

**Etapa 8 — Recurrencia financiera:**

- ✅ Plantillas de receitas e despesas recorrentes (mensal, quinzenal, semanal) com data inicial, data final opcional, valor e categoria.
- ✅ Geração idempotente de ocorrências (`ensureOccurrences`): gastos concretos (pagados/pendientes), ingressos passados recebidos e **ingressos futuros como cobros futuros separados** — verificado sem duplicatas em cargas repetidas.
- ✅ Edição por alcance: solo esta ocurrencia / esta y próximas / toda la serie (comportamentos verificados no banco).
- ✅ Pausar, reanudar e eliminar (borrado suave; histórico preservado).
- ✅ Página Cobros futuros separada: pendentes + recebidos; "Marcar recibido" cria/completa o ingreso sem duplicar (verificado com repetição).
- ✅ `future_receipts.recurring_id` (vínculo + anti-duplicados) e páginas `/app/presupuesto/recurrencias` e `/cobros` com acessos na página principal.
- ✅ Segurança: propriedade validada no servidor (acesso cruzado → 404).

**Etapa 9 — Compras parceladas:**

- ✅ Cadastro completo: descrição, valor total, número de parcelas (2–120), primeira parcela, categoria e método de pagamento (crédito/débito/efectivo/transferencia/otro).
- ✅ Cálculos derivados no servidor: valor por parcela com distribuição exata em centavos (resto nas primeiras cuotas), parcelas restantes, valor já pago, próxima parcela e data de término.
- ✅ Visualização no formato do produto: `iPhone · $18,000 · 12 × $1,500 · 3/12 pagas` com progresso, pago/restante e lista expansível de cuotas com "Pagar" por parcela.
- ✅ Orçamento correto: cada cuota é um gasto real na sua data de vencimento — verificado que 12 meses registram $1,500 cada e nenhum mês carrega o total.
- ✅ Plano completa automaticamente ao quitar todas as cuotas (`completed`, verificado); eliminar cancela só cuotas impagas e preserva histórico pago.
- ✅ Geração idempotente (recargas repetidas sem duplicatas) e acesso na página principal do Presupuesto.
- ✅ Segurança: 401 sem sessão; validações 400 (parcelas fora de 2–120, total ≤ 0); propriedade por usuário da sessão.

**Etapa 10 — Deudas:**

- ✅ Cadastro completo: credor, tipo, valor original, saldo atual, juros anual, dia de vencimento, pagamento mínimo, parcelas, prioridade e estado (validações 400 testadas: saldo > original, juros fora de 0–300).
- ✅ Dashboard do módulo: Deuda total, Deuda restante, Pagos del mes e Progreso de pago.
- ✅ Abonos: descuenta o saldo real; recusado acima do saldo; ao zerar vira `paid_off`; histórico em `debt_payments`.
- ✅ Alertas de vencimento: dívidas a ≤7 dias do vencimento em alerta destacado (hoje/amanhã/em N dias).
- ✅ Plan de pago: ordem por prioridade + comparação de estratégias **Avalancha vs Bola de nieve** com meses, juros, total a pagar, primeira dívida liquidada e excedente ajustável; recomenda a que poupa juros. Simulação pura validada por unidade (divergência e não-convergência corretas).
- ✅ Money Path alimentado: indicador de deudas do dashboard usa saldos reais e "Tu próximo paso" nomeia a dívida prioritária.
- ✅ Nunca executa pagamentos (orientação com disclaimer); borrado suave preserva histórico.

**Etapa 11 — Fondo de emergencia:**

- ✅ Cálculo do gasto essencial mensal: ajuste manual OU média dos últimos 3 meses de gastos em categorias essenciais (breakdown por categoria com valor médio).
- ✅ Discricionárias fora por padrão: seed do registro e migração marcam só as essenciais (renta, servicios, internet, transporte, súper, salud, educación); o usuário controla o resto.
- ✅ Objetivo de meses (3/6/9/12 + custom 1–36) e ajuste manual do essencial, persistidos.
- ✅ Indicadores: Meta total, Valor atual, Restante, Percentual e **Meses protegidos** — cálculo verificado exato (essencial 6,640.38 × 6 = 39,842.28).
- ✅ Operações: configurar, alternar categoria essencial, aportar e fixar valor atual; fundo em `emergency_funds` semeado do `currentReserve` e objetivo sincronizado.
- ✅ Progresso claro: barra % + blocos por mês (com fração).
- ✅ Integração com o indicador de fondo do dashboard via `computeEssentialMonthly` compartilhado.
- ✅ Segurança: sessão/propriedade validadas (toggle de categoria alheia → 404).

**Etapa 12 — Metas:**

- ✅ Criar meta com nome, categoria (viaje/auto/casa/fondo/educación/inversión/compra personal/otro), valor objetivo, valor atual, prazo e prioridade.
- ✅ Cálculo por mês, por semana e período restante (`computeGoalPlan`, centavos exatos: 23,000 ÷ 12 = $1,916.67/mês).
- ✅ Contribuições: registro de aportes com atualização automática do progresso e virada para `achieved` ao atingir o objetivo (verificado).
- ✅ Previsão "Al ritmo actual, alcanzarás tu meta aproximadamente en X" (ritmo real de aportes; sem aportes, pede o primeiro).
- ✅ Resumo do módulo (ativas, objetivo total, ahorrado, logradas) e progresso refletido no dashboard (mesma tabela).
- ✅ Segurança: 404 para meta alheia, 401 sem sessão, validações 400 (objetivo ≤ 0, atual > objetivo, aporte ≤ 0); delete suave preserva aportes.

**Etapa 13 — Inversiones:**

- ✅ Contas: instituição, tipo, moeda e saldo (`investment_accounts.balance`).
- ✅ Investimentos: nome, categoria, quantidade, preço médio, valor atual, aportes e data (`investments.quantity`/`average_price`); importe = quantidade × preço médio ou explícito.
- ✅ Cálculos: total invertido, valor atual, ganho/perda, percentual e aportes — verificados exatos (−7.80% de pérdida em exemplo real).
- ✅ Aportes: somam ao `invested_amount` e registram em `investment_transactions`.
- ✅ Evolução: gráfico de área do patrimônio investido (SVG, 12 meses).
- ✅ Restrições respeitadas: sem integração de corretoras/bancos e sem recomendações de compra/venda (disclaimer visível).
- ✅ Segurança: totais só na moeda base; 401 sem sessão; 404 para registro alheio; delete suave preserva histórico.

**Etapa 14 — Patrimonio:**

- ✅ Activos: dinheiro, inversiones, imóveis, veículos e outros ativos; valor manual para veículos/imóveis com estrutura pronta para avaliação externa futura (`valuation_source`/`external_reference`).
- ✅ Pasivos: financiamientos, préstamos, cartões e outras dívidas (enum ajustado).
- ✅ Fórmula: neto = ativos − pasivos, verificado exato (1,100,000 − 262,000 = 838,000) e com patrimônio negativo suportado (−62,000).
- ✅ Evolução: histórico mensal em `net_worth_snapshots` (1 snapshot/mês, atualizado por visita), variação contra o mês anterior (+38,000 / +4.8% em teste) e gráfico; o dashboard lê os mesmos snapshots.
- ✅ Segurança: moeda base nos totais; 401 sem sessão; 404 para registro alheio; delete suave recalcula o patrimônio.

**Etapa 15 — Calculadoras:**

- ✅ Interés compuesto (aporte inicial + mensal + taxa + período → aportado/juros/final), verificado exato.
- ✅ Meta financiera (objetivo + atual + prazo → aporte mensal necessário), verificado (1,250/mês).
- ✅ Primer gran objetivo (simulação de construção de patrimônio com tempo estimado e crescimento por ano).
- ✅ Comprar vs rentar (simulador comparativo a N anos → custo neto, vencedor e diferença).
- ✅ UX: cada calculadora explica os campos, valida inputs, mostra resultado e permite "Simular de novo".
- ✅ Disclaimer global: projeções orientativas, não garantias. Funções puras em centavos (`lib/calculators.ts`).
- ✅ Módulo sob o aplicativo protegido; não acessa dados financeiros do usuário.

**Etapa 16 — Money Path™:**

- ✅ Coleta no servidor das 9 entradas reais (ingresos, gastos, gastos essenciais, deudas, ahorro, fondo, metas, inversiones, patrimonio) com média de 3 meses e fallback ao diagnóstico marcado como estimado.
- ✅ `analyzeMoneyPath` (função pura): detecta e ordena prioridades (excesso de gastos, dívida relevante, falta de reserva, baixa capacidade de ahorro, meta incompatível, patrimônio evoluindo, reorganização, on track).
- ✅ Tu Ruta Financiera em 5 seções: Situación actual · Prioridad · Acción recomendada · Impacto estimado (badge "Estimado") · Próximo paso (CTA).
- ✅ Exemplo real verificado: dívida cara → prioridade + impacto "liquidarías en ~8 meses" + CTA a `/app/deudas`.
- ✅ Simulação "¿Qué pasa si reduzco mis gastos en $X?" (slider recalcula excedente e meses do fundo; verificado 2 meses antes).
- ✅ Persistência de estado da rota em `money_path_states` (1/dia, `source='auto'`).
- ✅ Não inventa dados; projeções marcadas como estimadas; disclaimers de não-assessoría.

**Etapa 17 — Money AI:**

- ✅ Motor determinístico de intents (`lib/moneyai/engine.ts`) que responde só com dados reais do usuário — nunca inventa transações/saldos/patrimônio.
- ✅ As 7 perguntas do spec respondidas corretamente (verificado via API com dados reais): comprar, gasto por categoría, por qué no ahorro, cuánto para mi meta, mayor gasto, reducir gastos, cuándo alcanzaré mi meta.
- ✅ Resposta estruturada em 5 partes: Resumen → Explicación → Datos utilizados → Impacto → Próximo paso (CTA).
- ✅ Transparência: "Necesito más información…" quando falta dato (sem preço, categoria não identificada, sem metas).
- ✅ Segurança: só leitura; não executa compras/transferências/inversiones; não se passa por consultor (disclaimer); API 401 sem sessão.
- ✅ UI: conversa, histórico persistido (`ai_conversations`/`ai_messages`), sugestões/perguntas rápidas e cards de contexto.

**Etapa 18 — Reports & Insights (módulo Resumen):**

- ✅ Seletor de períodos (1/3/6/12 meses) via query param, comparando contra o período anterior de igual duração.
- ✅ Relatórios: evolución de ingresos/gastos (barras por mês), gastos por categoría (com variação %), capacidad de ahorro (período, promedio, taxa %), deudas, inversiones e patrimonio (linha de evolução).
- ✅ Comparación "Período anterior vs actual" (ingresos, gastos, ahorro) com delta em %.
- ✅ Insights automáticos (`buildInsights`, função pura) gerados só com dados reais — verificado "Comida fuera aumentó 93%" e "ahorro fue menor".
- ✅ Tudo server-rendered; sem dados → estado vazio (nunca inventa).
- ✅ Proteção: sem sessão o conteúdo não renderiza (gate híbrido).

**Etapa 19 — Academia:**

- ✅ 8 categorias (finanzas personales, presupuesto, deudas, ahorro, fondo de emergencia, inversiones, patrimonio, hábitos) e 24 conteúdos (artículos, aulas, guías, consejos) com nível e duração, semeados via `seed-academy.sql` (idempotente).
- ✅ Conteúdo educacional geral e básico, sem recomendações complexas; nota permanente de que não é asesoría.
- ✅ Progresso ("X de 24" + %), chips por categoria com concluídos/total, filtros Todo/Favoritos/Concluidos.
- ✅ Favoritos (coração) e marcar como concluído, com estado Concluido no card e visor em modal.
- ✅ Nova tabela `academy_progress` (única por usuário+conteúdo); API com sessão, idempotente (sem duplicar) e 401 sem sessão.

**Etapa 20 — Notificações:**

- ✅ Centro de notificações com os 8 tipos (receita futura, vencimiento, parcela, meta, deuda, orçamento, fondo de emergencia, insights) — todos dispararam com dados reais (verificado).
- ✅ Geração idempotente por chave: reabrir não duplica (verificado 7→7); janelas reais (7/30 dias, mês corrente); tope de 15 por corrida; nunca inventa dados.
- ✅ Preferências por tipo (8 toggles) persistidas em `user_settings`; tipo desativado não gera (verificado insight off → 7; on → 8).
- ✅ Contador de não-lidas no cabeçalho e na sidebar (`NotificationCount`, atualiza no monte/foco sem polling).
- ✅ Marcar como lida (individual), marcar tudo como leído, limpar leídas (dismissed sem re-gerar), tempo relativo e empty state.
- ✅ API GET/POST com 401 sem sessão; preferências persistem entre sessões.

**Etapa 21 — Configuración:**

- ✅ Perfil: nome (Better Auth updateUser + sync `display_name`), email (changeEmail habilitado sem serviço de correo), país e idioma validados no servidor (400 para país inválido / idioma sem dicionário).
- ✅ Preferências: tema persistido (`ui.theme`) com `data-theme` aplicado no layout (oscuro desabilitado até o passe de design — verificado na HTML); moeda base com **porta de confirmação explícita** (409 sem `confirm`, 200 com; registros conservam sua moeda, verificado round-trip MXN→BRL→MXN); notificações e indicadores do panel compartilhando o armazenamento dos módulos originais.
- ✅ Privacidade: exportação JSON `money-path-export-v1` (28 seções; 401 sem sessão), apagar histórico do Money AI e reiniciar progreso da Academia com `ConfirmDialog` (verificado 1→0 em ambos).
- ✅ Conta: alteração de senha (testada com restauração), sair e **solicitar exclusão** com palavra-chave `ELIMINAR` — registra `account.deletionRequest` pendente sem apagar nada (verificado: usuário e perfil intactos) e cancelável.
- ✅ i18n preparada: `pt-BR`/`en-US` listados como "Próximamente" (desabilitados); `ACTIVE_LANGUAGES` é a fonte da verdade.

**Etapa 22 — Monetização:** catálogo de planos em `src/config/plans.ts` (Free e Pro, preços em centavos, US$ 3.90/mês e US$ 29.90/ano, matriz de 16 funcionalidades e limite de 3 metas no Free); motor de permissões em `src/lib/billing.ts` (o plano é derivado sempre do banco: `active`/`trialing` com período vigente); adaptador de gateway honesto em `src/lib/billing-gateway.ts`, que responde `GATEWAY_NOT_CONFIGURED` / `GATEWAY_ADAPTER_MISSING` **sem simular nenhum pagamento**; APIs `/api/billing/checkout` (registra a tentativa em `billing_events` e nunca altera a assinatura), `/api/billing/subscription` (estado real + ações) e `/api/billing/webhook` (único caminho que ativa o Pro, com verificação de assinatura); página pública `/precios` com tabela comparativa em forma de tarifa impressa e sello PRO; página `/app/suscripcion` com plano, estado, período, provedor e bitácora de facturación; `PremiumGate` aplicado em Resumen, Deudas, Fondo de emergência, Inversiones, Patrimônio completo, Money Path™, Money AI, Calculadoras e Academia; guarda `402 premium_required` nas APIs desses módulos; limite de 3 metas verificado no servidor (UI + API).

## 30. Funcionalidades pendentes

- Integração real de gateway de pagamento — a arquitetura (checkout, webhook assinado, mensal/anual) está pronta; falta escolher o provedor e implementar o adaptador em `src/lib/billing-gateway.ts`.
- Dependências de desenvolvimento com aviso moderado (`esbuild` via `drizzle-kit`): não entram no runtime do aplicativo; corrigir exige `drizzle-kit@0.18` (breaking change), portanto aceito e documentado (§34.5).

- Módulos base ainda sem área própria (ingresos, gastos, categorías como CRUD dedicado: hoy viven dentro de Presupuesto) — aguardando suas etapas.
- Paleta escura completa (plumbing `data-theme` ya listo; falta el pase de diseño de tokens/uso en componentes).
- Geração de recorrências por job/agenda (hoje a geração é idempotente sob demanda, ao abrir o módulo).
- Integração bancária real — a importação atual é por CSV.
- Verificação de email no registro — quando houver serviço de email configurado.
- Ativação de novos locales/monedas LATAM — estrutura pronta.

## 31. Decisões técnicas

1. **Dinheiro = centavos inteiros na aplicação**; `numeric(18,2)` no banco.
2. **Multi-moeda explícita:** FK `currency` em todo valor.
3. **Segurança no banco, não no frontend:** `user_id NOT NULL` + FK; APIs escrevem sempre pelo usuário da sessão.
4. **Borrado suave** em dados financeiros.
5. **Better Auth** como sistema de autenticação; senhas nunca manuais.
6. **`generateId: "uuid"`** para colunas de identidade.
7. **Origem/CSRF** com wildcard + origem dinâmica de preview.
8. **Perfil automático via `databaseHooks`** no registro.
9. **Email de reset com fallback de preview** (`RESEND_API_KEY` ou flag dev).
10. **Sessão dual cookie + Bearer** e guard híbrido (`SessionGate`).
11. **Secreto com fallback em BD** (`auth.secret`).
12. **Onboarding como upsert + histórico de estados (Etapa 5):** repetir o diagnóstico atualiza o perfil e acrescenta um estado novo em `money_path_states` (auditable).
13. **Gate de onboarding no layout do app (Etapa 5):** garante que todo usuário passe pelo diagnóstico antes dos módulos.
14. **Dashboard sem mock (Etapa 6):** agregados consultam as tabelas reais; sem registros, o diagnóstico do onboarding entra como valor "Estimado" sinalizado — transparência em vez de dados inventados.
15. **Gráficos SVG próprios (Etapa 6):** barras, dona, área e progresso renderizados no servidor sem dependências; bundle leve e estilo consistente.
16. **Personalização persistida (Etapa 6):** indicadores visíveis em `user_settings`; escolha do usuário sobrevive a sessões e dispositivos.
17. **Próximo passo derivado por regras (Etapa 6):** escalera simples e explicável (equilíbrio → deudas → reserva → inversión → patrimonio); sem aconselhamento complexo, sempre com disclaimer.
18. **Código compartilhado server/client sem DB (Etapa 7):** tipos e constantes do Presupuesto vivem em `presupuesto-shared.ts`; o módulo de dados (drizzle) nunca entra no bundle do navegador.
19. **Anti-duplicados por chave natural (Etapa 7):** importação e criação nunca geram movimentos duplicados — dedupe por (fecha, monto, descripción) por usuário e tipo.
20. **Tipo do gasto no próprio movimento (Etapa 7):** `expenses.kind` permite reclassificar sem depender da categoria, e alimenta as abas fijos/variables e o filtro de tipo.
21. **Ocorrências materializadas e idempotentes (Etapa 8):** recurrencias geram linhas reais (dedupe por plantilla + fecha), permitindo edição por ocorrência e integração direta com dashboard/resumo; geração sob demanda nas páginas do módulo (sem job/cron ainda).
22. **Receitas futuras = cobros futuros (Etapa 8):** ingressos recorrentes futuros nunca entram como ingreso até serem recebidos — viram `future_receipts` e só concretizam via "Marcar recibido".
23. **Parcelas = gastos reais por mês (Etapa 9):** cada cuota materializa um gasto na sua data de vencimento (dedupe por plan + número), garantindo que o orçamento registre somente a mensualidade do mês; a distribuição usa aritmética inteira em centavos (resto nas primeiras cuotas) — nunca ponto flutuante.
24. **Simulação de quitação como função pura (Etapa 10):** `simulateStrategy` roda sem efeitos colaterais (nunca executa pagamentos), capitaliza juros mensalmente e rola mínimos de deudas liquidadas — a mesma lógica serve ao cliente e a futuros cálculos server-side.
25. **Essencial ≠ discrecional por desenho (Etapa 11):** o gasto essencial só considera categorias marcadas `is_essential`; nada é assumido automaticamente como essencial e o usuário vê o breakdown exato do que está sendo usado. `computeEssentialMonthly` é compartilhado entre o módulo e o dashboard.
26. **Cálculos de metas puros e compartilhados (Etapa 12):** `computeGoalPlan`/`forecastAtCurrentPace` rodam sem dependências de DB, em centavos com arredondamento para cima; o progresso atualiza no servidor a cada aporte e o dashboard lê a mesma tabela `goals`.
27. **Inversiones sem asesoría nem integraciones (Etapa 13):** o módulo só registra e acompanha; não conecta corretoras/bancos e não recomenda compra/venda. Totais agregam apenas a moeda base e a evolução usa acumulado mensal real de aportes.
28. **Patrimonio con valuación manual y estructura externa (Etapa 14):** vehículos/inmuebles aceitan valor manual hoy; `valuation_source`/`external_reference` dejan la puerta abierta a fuentes externas sin cambiar el modelo. Snapshot mensual idempotente alimenta tanto el módulo como el dashboard.
29. **Calculadoras como funciones puras en centavos (Etapa 15):** la lógica vive en `lib/calculators.ts` sin DB ni efectos colaterales; cada calculadora valida y explica sus campos y aclara que son proyecciones, no garantías.
30. **Money Path™ como motor de análisis puro (Etapa 16):** `analyzeMoneyPath`/`planForFinding`/`simulateExpenseCut` son funciones puras sin DB; el servidor solo recolecta datos reales y persiste el estado de la ruta. Toda recomendación se deriva de datos existentes y las proyecciones se marcan como estimadas.
31. **Money AI determinístico y anclado en datos (Etapa 17):** sin LLM externo (no hay riesgo de alucinación ni dependencia de API); el motor detecta intenciones y responde con cifras reales del usuario. Cuando falta información lo dice explícitamente en vez de inventar.
32. **Insights como função pura derivada de comparaciones (Etapa 18):** `buildInsights` recibe los datos del informe y genera insights solo cuando hay base real (categoría vs período anterior, ahorro, patrimonio, pagos a deudas, ganancia de inversiones, ingresos). Sin datos, no se generan insights falsos.
33. **Conteúdo educacional conservador (Etapa 19):** la Academia solo publica conceptos básicos revisables (definiciones, hábitos, métodos generales); sin recomendaciones complejas ni específicas de inversión, con nota de no-asesoría visible. El progreso vive en `academy_progress` (upsert único por usuario+contenido).
34. **Notificaciones anti-exceso (Etapa 20):** generación bajo demanda al abrir el centro, dedupe por clave persistente (nunca re-avisa algo ya visto, aunque se limpió), ventanas temporales reales, tope por corrida y preferencias por tipo en `user_settings`. Cada aviso deriva de datos existentes — cero avisos inventados.
35. **Configuración sin destrucción silenciosa (Etapa 21):** cambiar moneda exige confirmación explícita cuando hay registros (nunca se convierten ni mezclan); la exclusión de cuenta es una **solicitud** (nunca un borrado automático) y los controles de privacidad solo tocan datos no financieros, siempre con diálogo de confirmación. El plumbing de tema (`ui.theme` + `data-theme`) queda listo sin activar un modo oscuro incompleto.
36. **i18n por dicionários tipados**; `es-MX` base.
37. **Identidade visual própria**; tokens semânticos em `@theme`.
38. **Responsividade total** (mobile first; dashboard em coluna única no celular).
39. **Site público ≠ aplicativo** (`/` e `/design` públicos; produto em `/app/*` protegido).

40. **Planos como configuração versionada (Etapa 22):** preços, limites e matriz de funcionalidades vivem em `src/config/plans.ts`; trocar um preço é um diff revisável, não uma linha editável sem auditoria.
41. **Nunca fingir um pagamento (Etapa 22):** o checkout responde com código honesto quando não há gateway (`GATEWAY_NOT_CONFIGURED`), registra o evento em `billing_events` e **não altera** a assinatura. Não existe ativação "de demonstração" do Pro.
42. **Webhook assinado como única porta de ativação (Etapa 22):** sem verificação de assinatura o evento é recusado (401); sem provedor configurado, 503. Nenhuma request do navegador muda o plano.
43. **Permissões resolvidas no servidor (Etapa 22):** o plano deriva do banco a cada requisição; `PremiumGate` mantém título e descrição do módulo visíveis enquanto bloqueia o conteúdo, e as APIs respondem `402 premium_required` com a feature e o plano atual.
44. **Mensal e anual desde o início (Etapa 22):** `interval` faz parte do modelo (`user_subscriptions`), com o preço congelado em centavos no momento da contratação — prontos para promoções e troca de periodicidade.
45. **Free não expira e não perde dados (Etapa 22):** o plano Free é implícito (sem linha na tabela); ao terminar uma assinatura o usuário volta ao Free mantendo todos os registros.

46. **Nenhuma regra financeira muda sem documentar (Etapa 23):** cada alteração do núcleo monetário está listada em §34.3 com o comportamento antes/depois; o redondeo e a distribuição de parcelas em centavos não mudaram de semântica.
47. **Redondeo monetário por dígitos (Etapa 23):** `toMinorUnits` converte decimal → centavos com aritmética inteira e redondeo mitad-hacia-afuera sobre o primeiro dígito descartado, nunca `valor * factor` em ponto flotante.
48. **Todo monto é inteiro seguro (Etapa 23):** `toMinorUnits`, `add`, `subtract`, `multiply` e `sum` lançam erro se o resultado exceder `Number.MAX_SAFE_INTEGER` — perda silenciosa de precisão não é aceita.
49. **IDs validados antes do banco (Etapa 23):** `isUuid()` em 11 endpoints; entrada mal formada responde 400 em vez de 500 por erro do PostgreSQL.
50. **Autenticação com tasa curta (Etapa 23):** 60 req/min geral e 10/10/5/10 por minuto em sign-in, sign-up, forget-password e reset-password.
51. **Meta viewport explícita (Etapa 24):** `width=device-width, initial-scale=1, viewport-fit=cover` em `layout.tsx`. Sem ela todo o CSS mobile-first não ativa. O zoom não é bloqueado (`maximum-scale` ausente) por acessibilidade (WCAG 1.4.4).
52. **Nada de conteúdo escondido no celular (Etapa 24):** `hidden sm:block` é permitido apenas para variar o **tamanho** de um elemento decorativo, nunca para omitir informação.
53. **Safe-area primeiro (Etapa 24):** `viewport-fit=cover` + `env(safe-area-inset-*)` na barra inferior, no cabeçalho, no modal, no drawer e nos footers.
54. **Campos de formulário a 16 px no celular (Etapa 24):** evita o zoom automático do iOS Safari ao focar.
55. **Alvos de toque ≥ 44 px (Etapa 24):** barra inferior (`min-h-[56px]`), botões de fechar de modal/drawer (`h-11 sm:h-8`) e botões de footer empilhados a todo o ancho no mobile.
56. **Rótulos legíveis (Etapa 25):** os títulos de seção usavam `text-faint` (2.55:1) — abaixo do mínimo WCAG AA para texto pequeno. Passaram a `text-muted` (5.9:1) com tracking de 0.14em em 21 pontos da interface.
57. **Orientação em quatro perguntas (Etapa 25):** *onde estou* (breadcrumb + riel de seção na sidebar), *o que estou vendo* (cintillo do módulo e chips de contexto do Money AI), *o que significa* (descrição da página e legendas), *o que devo fazer agora* (prioridade do Money Path e "próximo paso").
58. **Identidade reservada ao Money Path™ (Etapa 25):** apenas este módulo tem cintillo com trazo cobre punteado e o card de prioridade recebeu riel cobre — destaque sem cor saturada de fundo nem animação exagerada.
59. **Animação com `prefers-reduced-motion` (Etapa 25):** toda nova animação (entrada de mensagens, barra do toast, pontos do Money AI) passa pelo desligamento global do `globals.css`.
60. **Feedback reutilizável (Etapa 25):** as 75 chamadas de toast do produto passaram a exibir barra de acento por variante e indicador de tempo de vida, sem alterar nenhuma chamada existente.
61. **QA reproduzível (Etapa 26):** `scripts/qa-26.test.ts` executa os 22 fluxos contra o servidor real (HTTP com token Bearer + `Origin`, como um navegador) e as libs de agregação diretamente, encerrando com código ≠ 0 se algo falhar.
62. **"Mensual" significa el mes en curso (Etapa 26):** Money AI y Money Path dividen la ventana de 3 meses entre 3 aunque solo haya datos de un mes; ahora usan la misma regla que el dashboard (mes real → promedio de meses con datos → diagnóstico).
63. **Cero es un estado legítimo, no un error (Etapa 26):** el objetivo del fondo se deriva de `gasto esencial × meses` y puede ser 0; la base de datos lo acepta y la UI lo explica en vez de mostrar "$0.00".
64. **Nada de coerción silenciosa (Etapa 26):** valores desconocidos en ajustes responden 400 en lugar de guardarse como si fueran válidos.
65. **Expectativas ancladas en datos (Etapa 26):** los totales esperados se calculan con todo lo que el mes registra (manuales + cuota + recurrencia), nunca con una cifra redonda aislada.
66. **Cero secrets en el código (Etapa 27):** todo valor sensible se lee con `process.env`; `.env.example` documenta cada variable sin valores reales y `.env` sigue fuera del repositorio.
67. **URL canónica configurable (Etapa 27):** `NEXT_PUBLIC_SITE_URL` alimenta `metadataBase`, `robots.txt` y `sitemap.xml`; no se hardcodea un dominio que cambia entre despliegues.
68. **Área privada fuera del índice (Etapa 27):** `/app/*` declara `noindex, nofollow` además del `Disallow` en `robots.txt`; el contenido financiero nunca aparece en buscadores.
69. **Error boundaries propios (Etapa 27):** `error.tsx` y `global-error.tsx` muestran un estado recuperable sin filtrar stack traces ni detalle de base de datos a la interfaz.
70. **Imágenes sin texto generado (Etapa 27):** la Open Graph se rasteriza en el servidor con `next/og`, por lo que el texto sale nítido y no hay PNG desactualizado que mantener.
71. **Éxito solo con filas afectadas (Etapa 28):** toda actualización comprueba `.returning()` y responde 404 si no modificó nada; el mismo código cubre "no existe" y "no es tuyo" para no revelar existencia.
72. **Sin consultas N+1 en páginas frecuentes (Etapa 28):** `ensureInstallmentOccurrences` pasó de un SELECT por plan a una sola consulta agrupada; la importación CSV pasó de un INSERT por nombre a dos INSERTs en lote.
73. **Scripts de QA son módulos (Etapa 28):** `export {}` en las suítes evita colisión de declaraciones globales entre ellas.
74. **Contenido de la Academia verificado tras sembrar (Etapa 28):** `seed-academy.sql` ejecutado e idempotente (8 categorías, 24 contenidos); es un paso de despliegue, no automático.
75. **Estado final documentado (Etapa 28):** `FINAL_AUDIT.md` declara "listo para presentar a primeros usuarios" y **rechaza declarar "production ready"** mientras existan configuraciones externas pendientes.

## 32. Regras de desenvolvimento (obrigatórias)

1. Não remover funcionalidades existentes.
2. Não substituir funcionalidades reais por mock data sem necessidade.
3. Não criar funcionalidades futuras antes da etapa correspondente.
4. Antes de qualquer alteração, verificar o README.
5. Atualizar o README ao concluir cada etapa.
6. Manter arquitetura modular.
7. Preparar internacionalização desde o início.
8. Preparar suporte futuro a múltiplas moedas.
9. Usar cálculos monetários com precisão adequada.
10. Nunca tomar decisões financeiras reais em nome do usuário.
11. Money AI deve apresentar recomendações como orientação, não aconselhamento financeiro profissional.
12. Toda funcionalidade deve funcionar em mobile e desktop.
13. Evitar hardcode sempre que uma configuração ou dado puder ser armazenado.
14. Criar estados de loading, vazio, erro e sucesso.
15. Não avançar automaticamente para a próxima etapa.

## 33. Monetização (Etapa 22)

### 33.1 Planos

| | **Free** | **Pro** |
| --- | --- | --- |
| Preço | US$ 0.00 | **US$ 29.90 / ano** (inicial) · US$ 3.90 / mês |
| Receitas, despesas e orçamento | ✅ | ✅ |
| Dashboard básico | ✅ | ✅ |
| Metas | até **3** ativas | **ilimitadas** |
| Patrimônio | básico (no dashboard) | completo (módulo, passivos, valuación e histórico) |
| Dívidas | — | ✅ |
| Fondo de emergencia | — | ✅ |
| Inversiones | — | ✅ |
| Money Path™ | — | ✅ |
| Money AI | — | ✅ |
| Relatórios (Resumen) | — | ✅ |
| Calculadoras | — | ✅ |
| Academia | — | completa |

A matriz completa (16 funcionalidades) está em `src/config/plans.ts` e é a mesma fonte usada pela tabela de `/precios`, pelo `PremiumGate` e pelas APIs — não há cópia divergente.

### 33.2 Arquitetura de cobrança

```
src/config/plans.ts              catálogo de planos, preços (centavos), limites e matriz
src/lib/billing.ts               permissões: getEntitlements, guardFeature, logBillingEvent
src/lib/billing-gateway.ts       adaptador de gateway (config de env + códigos honestos)
src/db/schema/billing.ts         user_subscriptions + billing_events
src/app/api/billing/checkout     POST { interval } → tentativa registrada, assinatura intocada
src/app/api/billing/subscription GET estado real · POST ações (cancel/resume)
src/app/api/billing/webhook      POST assinado → único caminho que ativa/atualiza o Pro
```

**Fluxo real (sem simulação):**

1. Usuário escolhe periodicidade (mensal ou anual) e envia o checkout.
2. `createCheckoutSession` verifica `PAYMENTS_PROVIDER` + credenciais:
   - sem provedor → `GATEWAY_NOT_CONFIGURED`;
   - provedor declarado sem adaptador → `GATEWAY_ADAPTER_MISSING`.
3. O evento é gravado em `billing_events` com `activated: false` e a resposta explica, em texto claro, que **nenhum cobro foi processado** e que o plano continua Free.
4. Quando existir pagamento real, o gateway envia o webhook: só uma assinatura verificada cria/atualiza `user_subscriptions`.
5. Toda requisição lê o plano do banco: `active`/`trialing` **e** `current_period_end` vigente ⇒ Pro. Caso contrário ⇒ Free (sem perda de dados).

### 33.3 UX de monetização

- **`/precios` (pública):** a comparación tratada como uma tarifa impressa — filetes capilares, cifras tabulares, grupos en versalitas y el sello PRO vectorial estampado sobre la columna Pro; alternância mensal/anual con ahorro anual calculado (US$ 16.90 · 36%); FAQ honesta sobre el estado del gateway.
- **Upgrade (`UpgradeDialog`):** abre desde cualquier módulo bloqueado o desde `/app/suscripcion`; elige periodicidad, muestra el total y termina siempre en un estado veraz (nunca en un "pago exitoso").
- **`/app/suscripcion`:** plan, estado, periodicidad, precio, periodo, próximo cobro, proveedor, referencia, límite de metas, panel de pasarela y **bitácora real** de `billing_events`.
- **Bloqueo elegante (`PremiumGate`):** conserva el título y la descripción del módulo, explica qué desbloquea Pro y ofrece tres salidas: ver planes, abrir el upgrade o ir a la suscripción. Se aplica en Resumen, Deudas, Fondo, Inversiones, Patrimônio, Money Path™, Money AI, Calculadoras y Academia.
- **Límite de metas:** aviso dentro de Metas al usar las 3 del plan Free y respuesta `402` en `POST /api/goals`.
- **Navegación:** entrada `Planes y suscripción` en la sección *Cuenta* (desktop y móvil) y enlace `Planes · US$ 29.90 / año` en el sitio público.

### 33.4 Para conectar un gateway real

1. Definir `PAYMENTS_PROVIDER` y las credenciales en `.env` (nunca en el bundle del navegador).
2. Implementar `createCheckoutSession` y `verifyWebhookSignature` en `src/lib/billing-gateway.ts` y marcar `implemented = true`.
3. Mapear los eventos del proveedor (`checkout.session.completed`, `customer.subscription.updated/deleted`) en `/api/billing/webhook`.
4. A partir de ahí, `/precios` y el diálogo de upgrade ya funcionan sin cambiar la UI.

> **Estado actual:** el gateway **no está conectado**. Por diseño no existe ninguna forma de activar Pro sin un pago verificado; la interfaz lo comunica explícitamente en la página de planes, en el upgrade y en la suscripción.

---

## 34. Auditoria de seguridad y precisión financiera (Etapa 23)

### 34.1 Problemas encontrados y corregidos

| # | Área | Problema encontrado | Corrección | Severidad |
| --- | --- | --- | --- | --- |
| 1 | Secrets / logs | El enlace de restablecimiento (con su **token**) se imprimía en los logs del entorno | Se registra solo el hecho y el correo, nunca el URL | Alta |
| 2 | Autenticación | `/api/auth/dev/reset-link` devolvía el enlace sin expirar, incluso con servicio de correo real configurado | Devuelve 404 si existe `RESEND_API_KEY` y el enlace expira a los 15 minutos | Alta |
| 3 | Fuerza bruta | Rate limit global de 200/min (~3 intentos de login por segundo) | 60/min general + topes 10/10/5/10 en sign-in, sign-up, forget-password y reset-password. Verificado: **429 al intento 10** | Alta |
| 4 | CSRF / orígenes | `hostname.endsWith("e2b.app")` aceptaba dominios ajenos (p. ej. `note2b.app`) como trusted origin | Sufijo exacto: `host === "e2b.app"` o `host.endsWith(".e2b.app")` | Media |
| 5 | Dependencias | `next@16.2.6` en el rango de una **CVE crítica** (bypass de middleware/proxy y DoS con Server Actions) y `postcss <= 8.5.22` (XSS y lectura arbitraria de archivos) | `next@16.4.6` y `postcss@8.5.33`. `npm audit`: de **15 (1 crítica, 2 altas) a 4 moderadas**, todas de herramientas de desarrollo | Crítica |
| 6 | Secrets / repositorio | No existía `.gitignore`: `.env` (`DATABASE_URL`, `BETTER_AUTH_SECRET`) era versionable | `.gitignore` creado cubriendo `.env*`, `node_modules`, `.next` y logs | Alta |
| 7 | Cabeceras | Sin cabeceras de seguridad HTTP | `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` y `frame-ancestors 'self' https://*.e2b.app` (conserva el embebido del preview) | Media |
| 8 | Inputs | 11 endpoints pasaban `id` sin validar a PostgreSQL -> `invalid input syntax for type uuid` = **500** | `src/lib/validation.ts` (`isUuid`) y respuesta **400** estable, sin revelar el esquema | Media |
| 9 | Inputs / dinero | `toMinorUnits("1.005")` devolvía 100 en vez de 101 (multiplicación por `factor` en punto flotante) | Conversión por dígitos con redondeo mitad-hacia-afuera | Alta |
| 10 | Inputs / dinero | `toMinorUnits("12-34")` -> 123400 y `toMinorUnits("1,2,3")` -> 123 (entradas malformadas aceptadas) | Normalización estricta: signo solo al inicio o entre paréntesis; comas solo como miles o como decimal de 1-2 dígitos | Media |
| 11 | Precisión | `addMinor(MAX_SAFE, MAX_SAFE)` devolvía `1.8e16` con pérdida silenciosa de precisión | Todas las operaciones validan el resultado como entero seguro | Alta |
| 12 | Precisión | `installmentAmounts(total, 0)` producía `NaN` y un total negativo repartía cuotas negativas | Valida `count >= 1` y `total > 0` (igual que las reglas de la BD) | Alta |

### 34.2 Verificaciones sin hallazgos

- **Autenticación:** Better Auth con scrypt, sesión de 30 días en cookie `httpOnly` + tabla `sessions`, contraseña mínima de 8, tasa acotada y reset por token. Sin credenciales en el código.
- **Autorización:** todas las rutas de datos exigen sesión (`getSession`); las excepciones son `/api/auth/*`, `/api/health` y el webhook firmado. Los módulos Pro responden `402 premium_required`.
- **Aislamiento por usuario:** revisados los 39 `update`/`delete` de la base de datos: todos ejecutan antes un `select` con `eq(tabla.userId, userId)` o filtran por usuario en la propia instrucción. La exportación de datos consulta las 28 tablas filtrando por `userId`.
- **Database rules:** `user_id NOT NULL` + FK con `ON DELETE CASCADE`, borrado suave en datos financieros, checks de monto positivo y de rangos, UUIDs generados en la aplicación.
- **Exposición de datos:** sin `dangerouslySetInnerHTML`, sin `eval`, sin `console.log` de datos de usuario; los errores se responden con mensajes del diccionario (nunca `error.message` de PostgreSQL); export con `Cache-Control: no-store`.
- **XSS:** React escapa por defecto; los pocos `href` dinámicos usan `encodeURIComponent` y `safeNext()` bloquea redirecciones abiertas.
- **Injection:** consultas 100% parametrizadas vía Drizzle (`eq`, `sql` con parámetros); ninguna interpolación de texto de usuario en SQL.
- **Permisos:** sin endpoints administrativos; la herramienta de desarrollo de reset está desactivada por defecto.
- **Sesiones:** cookie `Secure` + `HttpOnly` + `SameSite=None; Partitioned` para el iframe, token Bearer solo como respaldo y rotado por Better Auth.

### 34.3 Precisión monetaria (cambios documentados)

> Regla 9 del README: *usar cálculos monetarios con precisión adecuada*. Todo cambio de regla queda documentado aquí.

| Función | Comportamiento antes | Comportamiento después | ¿Cambia la regla? |
| --- | --- | --- | --- |
| `toMinorUnits` | `roundHalfAwayFromZero(valor * factor)`, afectado por punto flotante (`1.005` -> 100) | Aritmética de dígitos: parte entera x factor + redondeo mitad-hacia-afuera sobre el primer dígito descartado (`1.005` -> 101) | **Sí, corrección**: el redondeo declarado ahora se cumple; montos de 2 decimales no cambian |
| `toMinorUnits` | Aceptaba `12-34` y `1,2,3` | Rechaza entradas malformadas con `Error` | **Sí, endurecimiento** |
| `toMinorUnits` | Devolvía valores no seguros (p. ej. `1e22`) | Lanza `Monto fuera de rango` si excede `Number.MAX_SAFE_INTEGER` | **Sí, endurecimiento** |
| `add/subtract/multiply/sum` | Solo validaban las entradas | Validan también el resultado | **Sí, endurecimiento** |
| `installmentAmounts` | Sin validación (`count=0` -> NaN) | Exige `count >= 1` y `total > 0` | **Sí, endurecimiento**: coincide con los `CHECK` de la BD |
| Distribución de cuotas | `base = floor(total/n)` con resto en las primeras cuotas | Idéntico | No |
| Redondeo | Mitad hacia afuera con signo | Idéntico | No |
| Fechas y vencimientos | Cálculo UTC con corte de fin de mes | Idéntico | No |
| Monedas de 0 decimales (COP, CLP) | Factor 1 | Idéntico, ahora también validado | No |

### 34.4 Suite automatizada

`scripts/audit-money.test.ts` — **98 verificaciones** que cubren cero, negativos (incluido notación contable `(1,000)`), decimales y mitades de centavo, valores muy altos hasta el entero seguro, fechas (bisiesto, 30/feb, vencimientos que cruzan año), monedas (MXN/BRL/USD/ARS/PEN con 2 decimales y COP/CLP con 0), distribución de cuotas y plan de metas.

```bash
npx tsx scripts/audit-money.test.ts
# 98 verificaciones correctas · 0 fallos
```

### 34.5 Riesgos aceptados

- `esbuild` via `drizzle-kit` (moderada): es CLI de desarrollo, no corre en el runtime; la corrección requiere `drizzle-kit@0.18` (breaking).
- Token Bearer en `localStorage` y cookies `SameSite=None`: necesarios para el preview embebido en iframe (decisión de la Etapa 4).
- `requireEmailVerification: false` y cambio de correo sin verificación: consecuencia de no tener servicio de correo; queda pendiente al integrar email.

## 35. Experiência responsiva (Etapa 24)

Prioridade do brief: **1. iPhone/Android · 2. tablet · 3. desktop**. As 14 áreas foram verificadas uma a uma. Nenhuma funcionalidade foi removida e nenhum conteúdo foi escondido no celular.

### 35.1 Problemas encontrados y corregidos

| # | Área | Problema | Corrección | Impacto |
| --- | --- | --- | --- | --- |
| 1 | **Viewport** | A aplicação **não declarava meta viewport**. iPhone/Android renderizavam a ~980 px lógicos e escalavam a página para baixo: todo o CSS mobile-first (bottom nav, colunas apiladas, bottom-sheets) **nunca ativava** e o texto ficava ilegível | `export const viewport` em `layout.tsx` com `width=device-width, initial-scale=1, viewport-fit=cover` + `themeColor` | **Crítico** — afetava todas as telas |
| 2 | Modais | O painel não tinha scroll nem limite de altura: um formulário longo ficava **recortado fora da viewport** e o botão de guardar era inalcançável no telefone | Painel vira **bottom-sheet** no mobile (`max-h-[100dvh]`, corpo com `overflow-y-auto`, cabeçalho e footer fixos); no ≥ `sm` mantém o diálogo centrado | Alto |
| 3 | Formulários | Campos com fonte de 14 px faziam o **iOS Safari dar zoom automático** ao focar, empurrando o formulário para fora da tela | `text-base sm:text-sm` em `Input` e `Select` | Alto |
| 4 | Safe-area | A barra inferior usava `env(safe-area-inset-bottom)`, mas sem `viewport-fit=cover` o valor era sempre 0 — os itens ficavam sob o indicador de início do iPhone | `viewport-fit=cover` + respiro de safe-area em bottom nav, cabeçalho, modal, drawer e footers | Alto |
| 5 | Overflow | `MoneyValue` renderizava o montante como um único nó de texto dentro de flex item com `min-width: auto`: valores longos ("$1,234,567.89") **estouravam cards estreitos** — caso concreto dos 7 indicadores do Money Path em 320 px (cada card ~150 px) | `max-w-full flex-wrap` + filho com `min-w-0 break-words` | Alto |
| 6 | Gráficos | Dona de gastos com `width`/`height` fixos de 168 px e sparkline de 160 px transbordavam cards mais estreitos | `max-w-full` + viewBox preservando proporção; legenda com `min-w-0` | Médio |
| 7 | Tabelas | Comparação de períodos com `min-w-[480px]`: em 320 px exigia rolar mesmo tendo só 4 colunas | `min-w-[340px]` — a tabela continua sendo tabela e rola só se precisar | Médio |
| 8 | Abas | As trilhas de abas (Presupuesto, Resumen, Calculadoras, Configuración) mostravam uma barra de scroll que ocupava altura útil sem indicar continuação | Classe `mp-scroller`: deslize com o dedo, barra oculta, `scroll-snap` e respiro inferior de safe-area | Médio |
| 9 | Alvos de toque | Itens da barra inferior com área útil de ~28 px e botões de fechar de modal/drawer com 32 px — abaixo dos 44 px recomendados | `min-h-[56px]` + rótulo 11 px na barra inferior; `h-11 sm:h-8` nos botões de fechar; botões de footer empilhados a todo o ancho no mobile | Médio |
| 10 | Conteúdo oculto | O **detalhe de cada funcionalidade** da tabela de planos estava `hidden sm:block` — no celular a comparação perdia a única explicação do alcance real | Detalhe sempre visível; o selo PRO passa a ter variante menor no celular em vez de desaparecer | Médio |
| 11 | Navegação | No celular o único caminho para ver o próprio plano era abrir o menu "Más" (duas interações) | Cabeçalho mobile ganha atalho direto para **Planes y suscripción** com o indicador do plano atual | Médio |
| 12 | Texto | Sem `-webkit-text-size-adjust`, o Safari reescalava o texto em orientação landscape e quebrava a grade | Ajuste a 100 % + `prefers-reduced-motion` respeitado nas animações de entrada | Baixo |

### 35.2 Verificações sem hallazgos

- **Grades:** todas as telas usam colunas apiladas por padrão e só expandem em `sm`/`md`/`lg` — o dashboard cumpre a regra 38 (coluna única no celular).
- **Overflow horizontal estrutural:** nenhum `w-[…]px` além da sidebar (264 px, apenas ≥ `lg`); os dois `<table>` do produto têm wrapper `overflow-x-auto`.
- **XSS/HTML:** nenhum `dangerouslySetInnerHTML`; os poucos `href` dinâmicos usam `encodeURIComponent`.
- **Acessibilidade:** o zoom não é bloqueado (`maximum-scale` ausente), `prefers-reduced-motion` respeitado, navegação por teclado das abas preservada.

### 35.3 Resultado por dispositivo

| Dispositivo | Comportamento |
| --- | --- |
| **iPhone/Android (320–430 px)** | Layout em coluna única; modais e drawers como bottom-sheet com corpo rolável; barra inferior com 5 áreas + "Más" e safe-area; tabelas e abas deslizáveis com snap; montantes quebram dentro do card |
| **Tablet (768–1024 px)** | Colunas duplas em formulários e módulos; sidebar ainda oculta com bottom nav; modais centrados com largura máxima |
| **Desktop (≥ 1024 px)** | Sidebar fixa de 264 px; modais centrados; tabelas sem rolagem; hierarquia tipográfica completa |

### 35.4 Como verificar

Todas as rotas foram conferidas com sessão ativa (`bottom nav` + atalho de plano presentes em cada uma):

```bash
curl -s http://localhost:3000 | grep -o '<meta name="viewport"[^>]*>'
# <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

Os utilitários gerados pelo Tailwind foram conferidos no CSS de produção (`max-h-[100dvh]`, `min-h-[56px]`, `pb-[max(…)]`, `sm:h-8`, `w-14`, `break-words`, `mp-scroller`, `env(safe-area-inset-bottom)`).

---

## 36. Pulido de experiência (Etapa 25)

Revisão visual e de experiência completa. **Nenhuma funcionalidade nova foi adicionada** — apenas refinamento. Princípio aplicado em toda a interface: o usuário deve sempre saber **onde estou**, **o que estou vendo**, **o que isso significa** e **o que devo fazer agora**.

### 36.1 Onde estou / o que estou vendo / o que significa / o que faço agora

| Pergunta | Onde é respondida | Melhoria feita |
| --- | --- | --- |
| **Onde estou?** | Breadcrumbs de todas as páginas + seção na sidebar | O item ativo da sidebar ganhou um **riel petrol vertical**, não apenas fundo colorido — localiza o usuário mesmo havendo vários itens com o mesmo tom |
| **O que estou vendo?** | Cintillo do módulo (Money Path™) e **chips de contexto** do Money AI | O Money AI passou a mostrar, antes do usuário escrever, quais dados reais estão sobre a mesa (renda, gastos, deuda, patrimônio…) |
| **O que isso significa?** | Descrição da página no `PageShell` e legendas de cada módulo | Cabecalho rehierarquizado: ícone com anillo, título com `leading-tight`, descrição com `mt-1.5` e estado do módulo alinhado à linha base |
| **O que devo fazer agora?** | Prioridade do Money Path™ e card "Tu próximo paso" do dashboard | A prioridade do Money Path é agora o elemento de maior peso visual da página (ver §36.3) |

### 36.2 Hierarquia, tipografia, contraste e consistência

| # | Problema | Corrección |
| --- | --- | --- |
| 1 | **Contraste abaixo do WCAG:** os títulos de seção usavam `text-faint` (#7f8c90) sobre #f4f3ee — **2.55:1**, muito abaixo do 4.5:1 exigido para texto pequeno | Passaram a `text-muted` (#54656b) — **5.9:1** — em **21 pontos** da interface, com tracking padronizado em 0.14em |
| 2 | Tracking inconsistente (`0.12em` em alguns lugares, `0.14em` em outros) | Normalizado para `0.14em` em todos os rótulos de seção |
| 3 | Rótulos internos a 10 px eram pequenos demais para leitura confortável | Subiram para 11 px nos rótulos de contexto |
| 4 | O ícone do cabeçalho da página competia com o conteúdo | Ganhou `ring-1 ring-inset ring-primary-100` para separar-se da superfície |

### 36.3 Money Path™ — destaque especial, sem exagero

Apenas **este módulo** recebe tratamento próprio; nenhum outro tem o mesmo elemento, então a identidade é inequívoca:

- **Cintillo** com o wordmark em cobre (`MONEY PATH™`), o subtítulo do módulo e um **trazo punteado** que evoca o recorrido — em gradiente de fundo suave de `accent-100`, sem cor saturada.
- **Card de prioridade** com **riel cobre vertical** à esquerda e fundo `accent-100/30` — é a resposta a "o que devo fazer agora?", portanto recebe o maior peso da página.
- **Próximo passo** mantém o card escuro com setas em cobre e deslize ao passar o puntero (`group-hover:translate-x-1`).
- Nenhuma animação exagerada: a entrada usa o mesmo `animate-rise` de 0.32 s do resto da interface.

### 36.4 Money AI — experiência premium e contextual

| Elemento | Antes | Depois |
| --- | --- | --- |
| **Estado vazio** | Ícone plano em `bg-primary-soft` | Avatar em gradiente `primary-950 → primary-700` com **anel cobre** (`ring-4 ring-accent-100`) e entrada animada |
| **Identidad del hablante** | Sin distinción entre burbujas | **Avatar cobre con Money AI** en cada respuesta; el usuario mantiene la burbuja petrol alineada a la derecha |
| **"Pensando"** | Spinner genérico | **Tres puntos animados** junto al avatar, con `role="status"` y `aria-label` — comunica proceso sin competir con el contenido |
| **Contexto** | Tarjeta oculta en la barra lateral | **Chips visibles sobre el composer** con los datos reales que usa Money AI (+ aviso en ámbar cuando faltan datos) |
| **Tarjeta de contexto** | Card neutro | Card con borde y fondo `primary-50`, cabecera con icono de estrellas — se lee como "fuentes de la respuesta" |
| **Campo de entrada** | 14 px (zoom automático en iOS) | 16 px en móvil, 14 px en ≥ `sm` (consistente con la Etapa 24) |

### 36.5 Feedback, loading, empty, error e success states

| Estado | Qué se mejoró |
| --- | --- |
| **Success** | As 39 chamadas de sucesso existentes agora exibem **barra de acento** na cor da variante + **indicador de tempo de vida** que enche a base do toast. Cobertura verificada: 39 success, 36 danger, 75 toasts no total |
| **Error** | `ErrorState` mantém ícone, título, descrição e botão de reintento; `Alert` cobre os 4 tipos com `role="alert"` para os graves |
| **Loading** | `app/loading.tsx` já usa esqueleto fiel ao layout real; botões com `loading` em **50 pontos** da interface; novos indicadores (pensando do Money AI) usam `role="status"` |
| **Empty** | `EmptyState` ganhou `animate-rise` no ícone; estado vazio do Money AI redesenhado (§36.4) |
| **Microinterações** | Botões com **compressão 0.98** ao pressionar; tarjetas com elevação de sombra ao passar o puntero — indicadores de "isto é clicável" sem ruído visual |

Toda animação nova (entrada de mensagens, barra do toast, pontos do Money AI, ícone do estado vazio) respeita `prefers-reduced-motion` através do desligamento global já existente no `globals.css` (Etapa 24).

### 36.6 Verificación

```bash
npm exec tsc -- --noEmit   # 0 errores
npm run build              # rutas /app/* OK
```

Las 14 áreas del aplicativo fueron revisadas una a una contra los cuatro principios. Se confirmó además que **no se añadió ninguna funcionalidad**: no hubo cambios en rutas, APIs, esquema de datos ni en la lógica de negocio de ninguna etapa anterior (la suite financiera de la Etapa 23 sigue en 98/98).

---

## 37. Auditoria funcional (Etapa 26)

Suíte reproduzível: **`scripts/qa-26.test.ts`** — 120 verificações, 0 fallos.

```bash
set -a; . ./.env; set +a
npx tsx scripts/qa-26.test.ts
# ✓ 120 verificaciones correctas · 0 fallos
```

### 37.1 Cenário realista

Usuário novo em MXN, com os valores pedidos no brief:

| Item | Valor |
| --- | --- |
| Receita | **$25,000** (1 movimento no mês) |
| Gastos | **$15,000** manuais (Renta 8,000 · Serviços 3,500 · Súper 3,500) |
| Dívida | **$20,000** (Cartão Banorte, 32.5%, abono de $2,000 → saldo $18,000) |
| Reserva | **$5,000** |
| Meta | **$30,000** (Viagem ao Japão, aporte de $3,000 → faltam $27,000) |

Além disso, os fluxos de teste criam recorrência ($600/mês), recebimento futuro ($8,000), parcelamento (6× $2,000), conta e investimento, ativo ($80,000) e passivo ($40,000).

### 37.2 Bugs encontrados e corrigidos

| # | Módulo | Sintoma | Causa raiz | Correção |
| --- | --- | --- | --- | --- |
| 1 | **Fondo de emergência** | `GET /app/fondo` retornava **500** para qualquer usuário sem gasto essencial definido | `syncFundTarget` gravava `target_amount = 0` (derivado de `gasto esencial × meses`), violando o CHECK `emergency_funds_target_positive` (`> 0`). `getOrCreateFund` já contornava isso inventando `max(1, seed)` — "1 centavo" de meta | Constraint alterada para `>= 0` (0 = *objetivo aún no definido*), `getOrCreateFund` deixa de fabricar meta, e a UI mostra um estado explícito com aviso *"Aún no podemos calcular tu meta"* em vez de exibir "$0.00" como se fosse a meta |
| 2 | **Money AI** | Respondia **$8,333** de renda mensal quando o usuário ganhava **$25,000** no mês | `monthlyIncomeMinor = soma(janela de 3 meses) / 3` **sempre**, mesmo com dados de apenas 1 mês — um terço da renda real | Espelha a regra do dashboard: mês corrente se tiver movimentos → senão média dos meses que **têm** dados → senão diagnóstico. Mesma correção para gastos |
| 3 | **Money Path™** | Mesmo erro: situação mostrava **8,333 / 9,800** em vez de **25,000 / 17,600**, gerando superávit negativo falso (−$1,467) | Cópia do mesmo `soma / WINDOW_MONTHS` | Mesma correção; agora os três módulos (dashboard, Money AI, Money Path) reportam os mesmos valores |
| 4 | **Configurações** | `POST /api/settings {op:"theme", theme:"neon"}` respondia **200** e gravava como `light` | Coerção silenciosa: `body.theme === "dark" ? "dark" : "light"` — o cliente recebia `ok:true` para algo que nunca foi aplicado | Resposta **400** para valores desconhecidos |

Nenhuma funcionalidade foi removida para fazer os testes passarem.

### 37.3 Verificações que passaram (sem achados)

| Área | Resultado |
| --- | --- |
| **Cadastro** | Cria conta + token; duplicado rejeitado; login correto e senha errada rejeitada |
| **Login / sessão** | API sem token → 401; token Bearer funcional |
| **CSRF** | POST sem `Origin` → **403** `MISSING_OR_NULL_ORIGIN`; com `Origin` de domínio alheio → **403** `INVALID_ORIGIN` |
| **Onboarding** | Cenário aceito; moeda inválida e monto não numérico rejeitados |
| **Receitas** | $25,000 criada; data inválida, monto cero e monto negativo rejeitados |
| **Despesas** | 3 movimentos criados |
| **Recorrências** | Mensal criada; frequência desconhecida rejeitada; **ocorrência materializa no orçamento** |
| **Recebimentos futuros** | Criado; data inválida rejeitada |
| **Parcelamentos** | 6 cuotas criadas; `count = 0` rejeitado; **1ª cuota entra no mês** |
| **Orçamento** | Resumo do período coerente (25,000 / 17,600 / 7,400) |
| **Dívidas** | 402 em Free (gating); saldo $18,000 verificado via agregação |
| **Reserva** | 402 em Free; $5,000 refletido; objetivo calculado sem quebrar |
| **Metas** | Criada, aporte de $3,000 persistido (verificado no banco), aporte negativo rejeitado, **4ª meta → 402** |
| **Investimentos / Patrimônio** | 402 em Free; agregações corretas com fixtures |
| **Calculadoras** | Juros compostos fecham (`final = aportado + juros`), caso zero devolve zero, meta em 24 meses |
| **Money Path / Money AI** | Agora coerentes com o dashboard |
| **Relatórios** | Renda 25,000 · gastos 17,600 · poupança 7,400 |
| **Academia** | 402 em Free |
| **Notificações** | `generate` OK; op desconhecida rejeitada |
| **Configurações** | Nome e tema salvos; tema desconhecido agora rejeitado |
| **Free/Pro** | Checkout responde `503 GATEWAY_NOT_CONFIGURED` com `activated:false`; assinatura segue `free`; limite de 3 metas |
| **Páginas** | 18 rotas respondem 2xx/3xx; Resumen mostra o gate Pro em Free |

### 37.4 Consistência entre módulos (o mesmo cenário em todos)

| Módulo | Renda | Gastos | Observação |
| --- | --- | --- | --- |
| Dashboard (Inicio) | 25,000 | 17,600 | Mês em curso |
| Presupuesto (resumo) | 25,000 | 17,600 | `incomeReceived` / `expensesCommitted` |
| Relatórios (Resumen) | 25,000 | 17,600 | Poupança 7,400 = 25,000 − 17,600 |
| Money AI (contexto) | 25,000 | 17,600 | **Corrigido na Etapa 26** |
| Money Path (situação) | 25,000 | 17,600 | **Corrigido na Etapa 26** |

Os gastos do mês somam **17,600** (e não 15,000) porque os fluxos de teste também criam uma parcela ($2,000) e uma ocorrência recorrente ($600) datadas no mês corrente — exatamente o comportamento esperado de parcelamento e recorrência. A expectativa do teste foi ancorada nessa composição em vez de num número redondo isolado.

### 37.5 Observações (não são bugs)

- **Tabela `budgets` nunca é gravada.** O módulo de orçamento é o **Presupuesto** (o README não promete limites por categoria); a tabela existe desde a Etapa 3 como modelo e é lida apenas na exportação de dados. Candidata a ser removida ou implementada numa etapa futura aprovada.
- **`POST /api/goals {op:"create"}` responde `{ok:true}` sem o id.** O cliente refresca a lista, então não há impacto funcional; a suíte localiza a meta recién creada na base para aportar.
- **Ajustes de tema eram coerionados** (corrigido no bug 4) — sinal de que vale varrer os demais `op` de `/api/settings` numa próxima auditoria.

### 37.6 Como reproduzir

```bash
set -a; . ./.env; set +a
npx tsx scripts/qa-26.test.ts          # QA funcional (120 verificaciones)
npx tsx scripts/audit-money.test.ts    # precisão monetaria (Etapa 23, 98/98)
```

Ambos encerram com código ≠ 0 se qualquer verificação falhar.

---

## 38. Preparação para produção (Etapa 27)

### 38.1 Verificações executadas

```bash
npx next typegen        # ✓ tipos de rota
npm exec tsc -- --noEmit  # ✓ 0 erros
npm run build           # ✓ build de produção (Next 16.4.6, Turbopack)
npx tsx scripts/qa-26.test.ts          # ✓ 120 verificaciones
npx tsx scripts/audit-money.test.ts    # ✓ 98 verificaciones
```

| Métrica | Valor |
| --- | --- |
| Latência `/` | 22 ms |
| Latência `/precios` | 10 ms |
| Latência `/app` (privada) | 8 ms |
| Latência `/api/health` | 3 ms |
| Chunks estáticos | 1.4 MB |
| Imagens públicas | 543 KB (con lazy-load en la segunda) |

### 38.2 Checklist de produção

#### Build e código

- [x] `next build` limpio sin errores ni warnings de tipos
- [x] `tsc --noEmit` y `next typegen` en verde
- [x] Suítes de regresión en verde (QA funcional y precisión monetaria)
- [x] Sin `console.log` de datos de usuario; los errores se registran en servidor con `console.error`
- [x] Sin dependencias de desarrollo en el bundle del cliente

#### Variáveis de entorno e secrets

- [x] **Ningún secret vive en el código**: todo se lee con `process.env`
- [x] `.env` está en `.gitignore` (desde la Etapa 23) — no se versiona
- [x] `.env.example` documenta **cada** variable con su propósito y sin valores reales
- [x] Secrets de pago y de correo vacíos por defecto (el servicio arranca sin ellos)
- [x] `BETTER_AUTH_SECRET` con fallback persistido en BD si no existe
- [ ] **Fijar `BETTER_AUTH_SECRET`** en el entorno de producción (evita que las sesiones se invaliden en un rebuild)
- [ ] **Fijar `NEXT_PUBLIC_SITE_URL`** con el dominio real (afecta canonical, robots y sitemap)

#### Banco de dados

- [x] Esquema versionado en `src/db/schema/*` y aplicado con `drizzle-kit push`
- [x] `user_id NOT NULL` + FK con `ON DELETE CASCADE` en todas las tablas de datos
- [x] Borrado suave en datos financieros; nada se destruye sin confirmación
- [x] Constraints de monto y rangos verificados en BD (Etapa 23)
- [ ] **PostgreSQL administrado** con TLS, respaldos automáticos y credenciales dedicadas (hoy el `.env` apunta a una instancia local)
- [ ] **Ejecutar `src/db/seed-academy.sql`** en el entorno de producción para cargar el contenido educativo

#### Autenticação

- [x] Better Auth con scrypt, sesión de 30 días en cookie `HttpOnly` + `Secure`
- [x] Rate limit por ruta: 60/min general y 10/10/5/10 en sign-in, sign-up, forget-password y reset (verificado con 409/429)
- [x] CSRF: POST sin `Origin` → 403; origen ajeno → 403 (verificado)
- [x] Herramienta de reset de desarrollo deshabilitada si hay `RESEND_API_KEY`
- [x] Recuperación de contraseña por token sin exponer el enlace en logs
- [ ] **Configurar `RESEND_API_KEY`** para enviar correos reales (sin él, el registro funciona pero no hay verificación ni reset por correo)

#### Performance

- [x] Respuestas < 25 ms en las rutas públicas y privadas medidas
- [x] Fuentes con `display: swap` y precarga automática de Next
- [x] Imágenes con `width`/`height` (sin CLS) y `loading="lazy"` en las de bajo pliegue
- [x] Animaciones desactivadas con `prefers-reduced-motion`
- [ ] **Comprimir en el edge** (gzip/brotli) — depende del proveedor de despliegue
- [ ] **Auditoría Lighthouse en el dominio real** (los números de arriba son del entorno de preview)

#### Error handling

- [x] `not-found.tsx` global con diseño propio
- [x] `error.tsx` por ruta con reintento y salida al inicio
- [x] `global-error.tsx` autónomo (no depende de tokens ni diccionarios)
- [x] `loading.tsx` con esqueleto fiel al layout
- [x] APIs responden mensajes del diccionario, nunca stack traces ni errores de BD
- [x] Webhook de pagos valida firma antes de tocar datos

#### SEO, favicon e metadata

- [x] `metadataBase` + canonical + `description` en el layout raíz
- [x] **Favicon** `src/app/icon.svg` (mismo trazo cobre que la identidad)
- [x] **Open Graph** 1200×630 generado en el servidor con `next/og` (`opengraph-image.tsx` + `twitter-image.tsx`)
- [x] `robots.ts` indexa el sitio público y bloquea `/app/`, `/api/`, `/design` y auth
- [x] `sitemap.xml` con 6 rutas públicas
- [x] Área privada con `noindex, nofollow`
- [x] Landing semántica: `lang="es"`, un solo `h1`, `main`/`section`/`footer`, `alt` en imágenes
- [x] `title` y `description` propios en `/precios`, `/legal/*` y las páginas del app

#### Analytics

- [ ] **Pendiente — decisión de producto.** No hay ningún proveedor configurado y **no se ha añadido código de analítica falso**. Para activarlo: elegir proveedor (Plausible, PostHack, GA4…), añadir su script con consentimiento del usuario y documentar la variable en `.env.example`. Nunca se debe cargar un script de terceros sin aviso previo.

#### Páginas legais

- [x] `/legal/privacidad` — qué datos se recopilan, para qué, aislamiento, cookies, pagos inactivos y derechos (exportación/eliminación)
- [x] `/legal/terminos` — alcance del servicio, planes, **no es asesoría financiera**, uso aceptable y responsabilidad
- [x] Enlaces visibles en el pie del sitio público y en el layout legal
- [x] Ambas fuera del índice de buscadores
- [ ] **Revisión jurídica** antes de publicar (LFPDPPP en México) — el texto es una base, no un dictamen

#### Domínio e HTTPS

- [x] URL canónica configurable por `NEXT_PUBLIC_SITE_URL` (no hardcodeada)
- [x] Cookies de sesión marcadas `Secure` + `SameSite=None; Partitioned`
- [x] `frame-ancestors` permite solo el propio sitio y el dominio de preview
- [ ] **Apuntar el DNS** del dominio al despliegue y verificar el certificado (HTTPS lo emite la plataforma)
- [ ] **Activar HSTS** una vez confirmado HTTPS en el dominio definitivo

#### Responsividade

- [x] Meta viewport con `viewport-fit=cover` (Etapa 24)
- [x] 14 áreas verificadas en móvil, tablet y desktop
- [x] Modales como bottom-sheet con scroll y safe-area
- [ ] **Repetir la revisión en dispositivos físicos** tras el apuntamiento del dominio

#### Pagamentos (no activar sin configuración)

- [x] **No hay proveedor configurado**: el checkout responde `GATEWAY_NOT_CONFIGURED` con `activated: false`
- [x] No existe forma de activar Pro sin un pago confirmado por **webhook firmado**
- [x] Arquitectura lista para mensual y anual (`user_subscriptions.interval`)
- [ ] **Elegir proveedor**, implementar `createCheckoutSession`/`verifyWebhookSignature` en `src/lib/billing-gateway.ts` y probar en modo sandbox antes de producción

### 38.3 Orden sugerido de despliegue

1. Provisionar PostgreSQL administrado + correr `drizzle-kit push` y `seed-academy.sql`.
2. Definir `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` y `NEXT_PUBLIC_SITE_URL`.
3. Apuntar el DNS y verificar HTTPS.
4. Configurar `RESEND_API_KEY` (registro y recuperación de contraseña).
5. Revisión jurídica de `/legal/*` y publicar.
6. Ejecutar las dos suítes de regresión contra el entorno real.
7. Decidir y activar analytics con consentimiento.
8. Integrar el gateway de pagos en sandbox y, solo después, en vivo.

---

## 39. Auditoria final do produto (Etapa 28)

O relatório completo, com listas detalhadas e o status final, está em
**[`FINAL_AUDIT.md`](./FINAL_AUDIT.md)**. Resumo:

### 39.1 Resultado

```bash
npx tsx scripts/final-audit.test.ts     # ✓ 47   (isolation, UX, Path/AI, plans)
npx tsx scripts/qa-26.test.ts           # ✓ 120  (22 fluxos + cálculos)
npx tsx scripts/audit-money.test.ts     # ✓ 98   (precisión monetaria)
# Total: 265 verificaciones · 0 fallos
```

| Dimensão | Estado |
| --- | --- |
| Todos os módulos funcionam | ✅ |
| Módulos compartilham os mesmos dados | ✅ `dashboard == reports == aiContext` campo a campo |
| Cálculos sem inconsistências | ✅ 98 verificações de precisão |
| UX responde às 6 perguntas do usuário | ✅ situação, gastos, dívidas, metas, patrimônio, próximo passo |
| Money Path usa dados reais | ✅ prioridade e plano derivados dos montos do usuário |
| Money AI não inventa | ✅ cita $25.000 real; em Free responde 402 |
| Mobile | ✅ viewport, bottom nav, bottom-sheets, sem conteúdo oculto |
| Segurança / isolamento | ✅ IDOR bloqueado com 404; CSRF, rate limit, headers |
| Performance | ✅ 4–21 ms; sem polling |
| Free / Pro | ✅ gating 402, limite de 3 metas, checkout sem simulação |

### 39.2 Bugs encontrados e corrigidos nesta auditoria

1. **API com sucesso falso** — `transactions/update` respondia `{ok:true}`
   sem verificar as linhas afetadas. Os dados nunca eram modificados (o filtro
   `user_id` estava presente), mas a API mentia. Corrigido com `.returning()` +
   **404** (mesmo código para "não existe" e "não é seu", sem revelar
   existência).
2. **N+1 nos parcelamentos** — um SELECT por plano **a cada visita** da página
   Presupuesto. Corrigido com uma consulta agrupada.
3. **N+1 na importação CSV** — um INSERT por categoria faltante. Corrigido
   com dois INSERTs em lote.

### 39.3 Status final

> **Pronto para ser apresentado aos primeiros usuários** (demonstração/preview):
> nenhum bloqueador crítico no produto.
>
> **Não declarado "production ready":** faltam configurações externas —
> banco administrado, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`,
> **serviço de e-mail** (bloqueador prático: sem ele o usuário não recupera a
> senha), domínio/HTTPS, gateway de pagamentos e revisão jurídica. Detalhado
> em `FINAL_AUDIT.md` §12.

Problemas conhecidos não bloqueantes (tabela `budgets` sem uso, `goals create`
sem id, analytics por decidir, tema escuro pendente) estão listados em
`FINAL_AUDIT.md` §11.

---

*Money Path — Tu dinero. Tu plan. Tu patrimonio.*
