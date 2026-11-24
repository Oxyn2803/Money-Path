-- Money Path — Semilla de la Academia (Etapa 19).
-- Contenido educativo general: conceptos básicos, sin recomendaciones
-- específicas de compra/venta ni asesoría financiera.
-- Ejecutar después de `npx drizzle-kit push`:
--   psql "$DATABASE_URL" -f src/db/seed-academy.sql

BEGIN;

-- ── Categorías ──────────────────────────────────────────────────────────
INSERT INTO academy_categories (id, name, slug, description, sort_order, is_active) VALUES
  (gen_random_uuid(), 'Finanzas personales', 'finanzas-personales', 'Conceptos básicos para organizarte.', 1, true),
  (gen_random_uuid(), 'Presupuesto',         'presupuesto',         'Planear a dónde va tu dinero.', 2, true),
  (gen_random_uuid(), 'Deudas',              'deudas',              'Entender y ordenar tus deudas.', 3, true),
  (gen_random_uuid(), 'Ahorro',              'ahorro',              'Formar el hábito de guardar.', 4, true),
  (gen_random_uuid(), 'Fondo de emergencia', 'fondo-emergencia',    'Un colchón para imprevistos.', 5, true),
  (gen_random_uuid(), 'Inversiones',         'inversiones',         'Conceptos iniciales de inversión.', 6, true),
  (gen_random_uuid(), 'Patrimonio',          'patrimonio',          'Activos, pasivos y patrimonio neto.', 7, true),
  (gen_random_uuid(), 'Hábitos financieros', 'habitos',             'Rutinas que sostienen tus finanzas.', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- ── Contenidos (3 por categoría) ────────────────────────────────────────
INSERT INTO academy_contents (id, category_id, title, slug, kind, body, duration_minutes, level, is_published, published_at)
SELECT gen_random_uuid(), c.id, v.title, v.slug, v.kind::text, v.body, v.duration_minutes, v.level::text, true, now()
FROM (VALUES
  -- Finanzas personales
  (1, '¿Qué son las finanzas personales?', 'fp-que-son', 'article',
    'Las finanzas personales son la forma en que gestionas tu dinero: cuánto entra, cuánto sale y qué haces con lo que sobra. Ordenar tus finanzas empieza por saber en qué estado estás: ingresos, gastos, deudas y ahorro. Con esa base puedes tomar decisiones más claras sobre tus prioridades.',
    4, 'beginner'),
  (1, 'Tu primer diagnóstico financiero', 'fp-diagnostico', 'lesson',
    'Un diagnóstico inicial responde tres preguntas: ¿cuánto gano al mes?, ¿cuánto gasto?, ¿cuánto debo?. Con estas tres respuestas puedes ver tu balance mensual y detectar si hay margen para ahorrar. Money Path te ayuda a construirlo con tu onboarding.',
    5, 'beginner'),
  (1, 'Consejo: revisa tus movimientos una vez al mes', 'fp-consejo-revision', 'tip',
    'Dedicar 10 minutos al mes a revisar tus movimientos te ayuda a detectar gastos que se te escapan y a confirmar que tus finanzas van como esperabas.',
    2, 'beginner'),

  -- Presupuesto
  (2, '¿Qué es un presupuesto?', 'pres-que-es', 'article',
    'Un presupuesto es un plan que reparte tus ingresos entre tus gastos y tus metas. No es un castigo: es una herramienta para decidir antes de gastar. La meta básica es que tus gastos no superen tus ingresos y que reserves una parte para tu futuro.',
    4, 'beginner'),
  (2, 'Métodos de presupuesto más comunes', 'pres-metodos', 'guide',
    'Existen varios enfoques: el 50/30/20 reparte necesidades, gustos y ahorro; el método por sobres separa dinero por categoría; el presupuesto cero asigna cada peso a un destino. Elige el que mejor se adapte a tu ritmo y mantén la consistencia.',
    6, 'beginner'),
  (2, 'Consejo: presupuesta tus gastos fijos primero', 'pres-consejo-fijos', 'tip',
    'Al iniciar un presupuesto, separa primero tus gastos fijos (renta, servicios). Saber cuánto comprometes cada mes te deja claro cuánto queda para lo variable.',
    2, 'beginner'),

  -- Deudas
  (3, 'Entiende tus deudas: saldo, tasa y plazo', 'deu-basico', 'article',
    'Toda deuda tiene tres datos: el saldo que debes, la tasa de interés y el plazo para pagarlo. Conocerlos te permite comparar deudas y ordenar tus prioridades de pago. Las deudas con tasa más alta cuestan más por cada peso que debes.',
    5, 'beginner'),
  (3, 'Estrategias comunes de pago de deudas', 'deu-estrategias', 'guide',
    'Dos enfoques clásicos: pagar primero la deuda con mayor tasa (menor costo total) o pagar primero la más pequeña (motivación rápida). Ambos requieren mantener los pagos mínimos al día. La elección depende de tu perfil y disciplina.',
    7, 'intermediate'),
  (3, 'Consejo: evita acumular nueva deuda mientras pagas', 'deu-consejo-nueva', 'tip',
    'Mientras intentas reducir deudas, limita nuevas compras a crédito a lo esencial. Agregar deuda nueva atrasa tu plan, aunque sea con buena intención.',
    2, 'beginner'),

  -- Ahorro
  (4, 'Ahorra primero, gasta después', 'aho-regla', 'article',
    'La regla más usada es tratar el ahorro como un gasto más: aparta una parte de tu ingreso el día que cobras, no lo que sobra al final del mes. Automatizar ese aporte aumenta mucho la probabilidad de que se cumpla.',
    4, 'beginner'),
  (4, '¿Cuánto deberías ahorrar?', 'aho-cuanto', 'lesson',
    'No existe un porcentaje universal. Algunos apuntan a 10-20% del ingreso, pero tu punto de partida real es tu capacidad actual: si tu excedente es 5%, empieza ahí y busca aumentarlo con el tiempo. Lo importante es la constancia.',
    5, 'beginner'),
  (4, 'Consejo: revisa tus suscripciones cada trimestre', 'aho-consejo-suscripciones', 'tip',
    'Las suscripciones que ya no usas son gastos fijos que puedes recortar sin afectar tu día a día. Revisarlas cada cierto tiempo libera dinero para tus metas.',
    2, 'beginner'),

  -- Fondo de emergencia
  (5, '¿Qué es el fondo de emergencia?', 'fondo-que-es', 'article',
    'Es dinero apartado para imprevistos reales: una urgencia médica, una reparación o perder tu ingreso por unos meses. Su objetivo es que no tengas que endeudarte o tocar tus ahorros de largo plazo cuando pase algo inesperado.',
    4, 'beginner'),
  (5, '¿Cuánto debería tener mi reserva?', 'fondo-cuanto', 'lesson',
    'Una referencia común es cubrir entre 3 y 6 meses de tus gastos esenciales. El punto de partida depende de tu estabilidad: si tu ingreso es variable, apunta a más meses. Lo esencial es empezar con lo que puedas y mantenerlo apartado.',
    5, 'beginner'),
  (5, 'Consejo: mantén tu reserva en una cuenta separada', 'fondo-consejo-cuenta', 'tip',
    'Tener tu reserva lejos de tu cuenta de uso diario reduce la tentación de tocarla. Lo ideal es que siga creciendo sin que la mezcles con tu flujo normal.',
    2, 'beginner'),

  -- Inversiones
  (6, 'Conceptos iniciales: riesgo, rendimiento y plazo', 'inv-conceptos', 'article',
    'En inversión, riesgo y rendimiento suelen ir de la mano: mayor rendimiento esperado implica mayor incertidumbre. También importa el plazo: mientras más tiempo puedas mantener tu dinero, más puedes tolerar vaivenes. Ningún instrumento garantiza ganancias.',
    6, 'beginner'),
  (6, 'Diversificar: no pongas todo en un solo lugar', 'inv-diversificar', 'lesson',
    'Diversificar significa repartir tu dinero entre distintos instrumentos para que un mal resultado en uno no arruine todo. Es una de las prácticas más recomendadas por fuentes educativas de finanzas personales.',
    5, 'beginner'),
  (6, 'Consejo: antes de invertir, define tu objetivo y plazo', 'inv-consejo-plazo', 'tip',
    'Saber para qué y cuándo necesitas el dinero te ayuda a elegir instrumentos coherentes. Comprar sin objetivo es la forma más común de frustrarse con las inversiones.',
    2, 'beginner'),

  -- Patrimonio
  (7, 'Activos, pasivos y patrimonio neto', 'pat-definicion', 'article',
    'Los activos son lo que tienes (dinero, inversiones, propiedades) y los pasivos lo que debes. Tu patrimonio neto es la diferencia: activos menos pasivos. Puede ser negativo, y eso no significa fracaso: significa que estás construyendo.',
    4, 'beginner'),
  (7, 'Cómo evoluciona tu patrimonio', 'pat-evolucion', 'lesson',
    'Tu patrimonio crece de dos formas: aumentando tus activos (ahorro e inversiones) y reduciendo tus pasivos (pagando deudas). Registrar tu patrimonio con el tiempo te muestra la dirección real de tus finanzas.',
    5, 'beginner'),
  (7, 'Consejo: valora tus bienes de forma realista', 'pat-consejo-valoracion', 'tip',
    'Usar valores estimados realistas evita decisiones optimistas. Para vehículos e inmuebles, el mercado te dará una referencia más cercana a la realidad.',
    2, 'beginner'),

  -- Hábitos financieros
  (8, 'Hábitos que sostienen tus finanzas', 'hab-rutinas', 'article',
    'Los hábitos pequeños importan más que los grandes gestos: revisar tus movimientos, pagar tus deudas a tiempo, apartar tu ahorro apenas cobras y revisar tus metas periódicamente. La constancia vence al perfeccionismo.',
    5, 'beginner'),
  (8, 'Automatiza lo importante', 'hab-automatizar', 'guide',
    'Programar tus aportes a ahorro e inversiones el día de pago convierte una decisión recurrente en una rutina. Lo que no ves, no gastas. Empieza con montos pequeños y aumenta cuando puedas.',
    6, 'beginner'),
  (8, 'Consejo: define un día de revisión mensual', 'hab-consejo-revision', 'tip',
    'Elegir un mismo día cada mes para revisar tus finanzas crea constancia. Elige el que te resulte cómodo y márcalo en tu calendario.',
    2, 'beginner')
) AS v(cat_id, title, slug, kind, body, duration_minutes, level)
JOIN academy_categories c ON c.sort_order = v.cat_id
ON CONFLICT (slug) DO NOTHING;

COMMIT;
