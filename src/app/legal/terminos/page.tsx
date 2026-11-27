import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de uso — Money Path",
  description:
    "Condiciones de uso de Money Path, alcance del servicio, planes Free y Pro y límites de responsabilidad.",
  alternates: { canonical: "/legal/terminos" },
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

/** Términos de uso (Etapa 27 — producción). */
export default function TerminosPage() {
  return (
    <article>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-accent-600">
        Legal · Términos
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary-950">
        Términos de uso
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Al crear una cuenta en Money Path aceptas estas condiciones. Lee con
        atención: el punto más importante es el apartado 4.
      </p>

      <Section title="1. Qué es Money Path">
        <p>
          Money Path es una herramienta de <strong className="text-text">planeación
          financiera personal</strong>: registra tus ingresos, gastos, deudas,
          reservas, metas e inversiones, y te muestra indicadores, alertas y una
          ruta de acción derivada de esos datos.
        </p>
        <p>
          No es una cuenta bancaria, una corretora ni un servicio de cobro: no
          movemos tu dinero ni operamos en tu nombre.
        </p>
      </Section>

      <Section title="2. Tu cuenta">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Debes proporcionar un correo real y una contraseña de al menos 8
            caracteres; eres responsable de mantenerla secreta.
          </li>
          <li>
            Una cuenta por persona. No compartas tus credenciales ni uses la
            cuenta de otro usuario.
          </li>
          <li>
            Puedes cerrar sesión desde cualquier dispositivo y solicitar la
            eliminación de tu cuenta en Configuración → Privacidad.
          </li>
        </ul>
      </Section>

      <Section title="3. Planes Free y Pro">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong className="text-text">Free:</strong> ingresos, gastos,
            orçamento, dashboard básico, hasta 3 metas y patrimonio básico. No
            caduca.
          </li>
          <li>
            <strong className="text-text">Pro:</strong> US$ 29.90 al año (o
            US$ 3.90 al mes) e incluye dívidas, fondo de emergencia,
            inversiones, patrimonio completo, Money Path™, Money AI,
            relatórios, calculadoras y Academia completa.
          </li>
          <li>
            Los precios están en USD y pueden cambiar; si ya tienes una
            suscripción activa, el cambio se aplica al siguiente periodo.
          </li>
          <li>
            <strong className="text-text">Hoy no se procesan pagos:</strong> el
            checkout está construido pero sin proveedor de cobro conectado, por
            lo que no es posible contratar Pro. No existe ninguna forma de
            activar Pro sin un pago verificado.
          </li>
        </ul>
      </Section>

      <Section title="4. No es asesoría financiera">
        <p>
          Todo lo que Money Path calcula —incluidos Money Path™, Money AI,
          relatórios, simulaciones y calculadoras— es{" "}
          <strong className="text-text">orientación derivada de los datos que
          tú registras</strong>. No constituye asesoría financiera, de
          inversión, fiscal ni legal, ni una recomendación de compra o venta.
        </p>
        <p>
          Las cifras marcadas como estimadas son proyecciones, no garantías.
          <strong className="text-text"> Tú decides</strong>; Money Path nunca
          ejecuta pagos ni toma decisiones financieras en tu nombre.
        </p>
      </Section>

      <Section title="5. Uso aceptable">
        <p>No está permitido:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Intentar acceder a datos de otros usuarios o vulnerar la seguridad.</li>
          <li>Automatizar el servicio con bots o extraer información en masa.</li>
          <li>Usar el servicio para actividad ilícita o fraude.</li>
          <li>Suplantar la identidad de otra persona.</li>
        </ul>
      </Section>

      <Section title="6. Disponibilidad y datos">
        <p>
          Trabajamos para que el servicio esté disponible, pero puede haber
          interrupciones por mantenimiento. <strong className="text-text">Haz
          respaldos</strong> de lo que te importe: la exportación de datos está
          en Configuración → Privacidad.
        </p>
        <p>
          Tu información se guarda con borrado suave: nada se destruye sin tu
          confirmación explícita.
        </p>
      </Section>

      <Section title="7. Limitación de responsabilidad">
        <p>
          El servicio se entrega "tal cual". En la máxima medida permitida por
          la ley, Money Path no responde por decisiones tomadas a partir de sus
          cálculos, por la exactitud de datos que introduce el usuario ni por
          lucro cesante derivado del uso del servicio.
        </p>
      </Section>

      <Section title="8. Cambios">
        <p>
          Podemos actualizar estos términos. Si el cambio afecta tu suscripción
          o tus datos, te lo avisaremos dentro de la aplicación o por correo.
        </p>
      </Section>

      <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-6">
        <Link
          href="/legal/privacidad"
          className="rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-elevated"
        >
          Aviso de privacidad
        </Link>
        <Link
          href="/precios"
          className="rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-primary-50 transition-colors hover:bg-primary-hover"
        >
          Ver planes
        </Link>
      </div>

      <p className="mt-6 text-xs text-faint">
        Documento base para el lanzamiento. Antes de publicar debe revisarlo
        un asesor jurídico conforme a la legislación aplicable.
      </p>
    </article>
  );
}
