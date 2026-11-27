import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de privacidad — Money Path",
  description:
    "Cómo Money Path recopila, usa, almacena y protege tus datos personales y financieros.",
  alternates: { canonical: "/legal/privacidad" },
  robots: { index: false, follow: true },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-6">
      <h2 className="font-display text-base font-bold text-primary-950">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

/**
 * Aviso de privacidad (Etapa 27 — producción).
 * Describe exactamente lo que la aplicación hace hoy: sin agregadores de
 * terceros, sin publicidad, sin conexión bancaria y sin modelos externos.
 */
export default function PrivacidadPage() {
  return (
    <article>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-600">
        Legal · Privacidad
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950">
        Aviso de privacidad
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Este aviso describe qué datos recopila Money Path, para qué los usa y
        qué control tienes sobre ellos. Aplica desde el registro hasta la
        eliminación de la cuenta.
      </p>

      <Section title="1. Responsable del tratamiento">
        <p>
          Money Path es responsable del tratamiento de tus datos personales.
          Para cualquier solicitud relacionada con privacidad puedes usar las
          herramientas incluidas en la aplicación (exportación y solicitud de
          eliminación) o contactar al equipo del producto a través de los
          canales oficiales del sitio.
        </p>
      </Section>

      <Section title="2. Qué datos recopilamos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-text">Datos de cuenta:</strong> nombre,
            correo electrónico y contraseña (guardada de forma cifrada con
            scrypt; nunca en texto plano ni accesible para el producto).
          </li>
          <li>
            <strong className="text-text">Datos financieros que tú registras:</strong>{" "}
            ingresos, gastos, categorías, presupuestos, deudas, reservas, metas,
            inversiones, activos, pasivos y movimientos de todo tipo.
          </li>
          <li>
            <strong className="text-text">Diagnóstico inicial:</strong> país,
            moneda, ingreso aproximado, gastos, deudas, reserva, inversiones,
            patrimonio y objetivo principal.
          </li>
          <li>
            <strong className="text-text">Preferencias:</strong> tema, moneda
            base, indicadores visibles y notificaciones activadas.
          </li>
          <li>
            <strong className="text-text">Uso de la aplicación:</strong> mensajes
            que escribes a Money AI y el historial de conversaciones, que se
            almacena en tu cuenta.
          </li>
        </ul>
      </Section>

      <Section title="3. Para qué usamos tus datos">
        <p>
          Únicamente para operar el producto: mostrar tus números, calcular
          indicadores, generar tu ruta financiera, responderte en Money AI y
          recordarte fechas relevantes. Money AI responde con cálculos sobre
          tus propios datos; no envía tu información a modelos externos ni usa
          tus datos para entrenar nada.
        </p>
        <p>
          <strong className="text-text">No vendemos tus datos</strong>, no los
          compartimos con anunciantes y no los usamos para publicidad de
          terceros.
        </p>
      </Section>

      <Section title="4. Aislamiento y seguridad">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Todos los registros están ligados a tu usuario; cada consulta se
            filtra por tu sesión en el servidor. Un usuario nunca puede leer
            datos de otro.
          </li>
          <li>
            Las contraseñas se almacenan hasheadas (scrypt) y no son reversibles.
          </li>
          <li>
            La sesión usa una cookie <code className="font-mono text-xs">HttpOnly</code>{" "}
            con cifrado HTTPS; los datos financieros se guardan con borrado
            suave, nunca se destruyen sin tu confirmación explícita.
          </li>
          <li>No conectamos bancos ni corretoras: la importación es manual por CSV.</li>
        </ul>
      </Section>

      <Section title="5. Cookies y almacenamiento local">
        <p>
          Usamos una cookie técnica de sesión (necesaria para mantenerte
          autenticado) y, como respaldo cuando el navegador bloquea cookies de
          terceros, guardamos el token de sesión en el almacenamiento local
          del navegador. No usamos cookies de publicidad ni de seguimiento de
          terceros.
        </p>
      </Section>

      <Section title="6. Pagos">
        <p>
          En este momento <strong className="text-text">no se procesan pagos</strong>:
          no hay proveedor de cobro conectado. Si en el futuro se activa el
          plan Pro, los datos de tarjeta serían tratados por el proveedor de
          pagos seleccionado; Money Path no almacenaría números de tarjeta.
        </p>
      </Section>

      <Section title="7. Tus derechos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-text">Portabilidad:</strong> Configuración →
            Privacidad → exportar descarga un JSON con todos tus datos.
          </li>
          <li>
            <strong className="text-text">Eliminación:</strong> puedes solicitar
            la baja de la cuenta desde la misma sección. Es una solicitud
            manual: nunca se borra tu cuenta automáticamente.
          </li>
          <li>
            <strong className="text-text">Corrección:</strong> puedes editar
            perfil, moneda y diagnóstico en cualquier momento.
          </li>
        </ul>
      </Section>

      <Section title="8. Cambios a este aviso">
        <p>
          Si cambia qué datos recopilamos o cómo los usamos, actualizaremos
          esta página y lo indicaremos con la fecha de la última revisión.
        </p>
      </Section>

      <p className="border-t border-border pt-6 text-xs text-faint">
        Documento base para el lanzamiento. Antes de publicar debe revisarlo
        un asesor jurídico conforme a la legislación aplicable (LFPDPPP en
        México).
      </p>
    </article>
  );
}
