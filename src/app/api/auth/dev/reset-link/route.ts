import { NextResponse } from "next/server";
import { getDevResetLink } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

/**
 * Herramienta SOLO para entornos de preview sin servicio de correo:
 * devuelve el último enlace de restablecimiento solicitado.
 * Deshabilitada si `NEXT_PUBLIC_AUTH_DEV_RESET` no es "true".
 */
export async function GET(request: Request) {
  if (process.env.NEXT_PUBLIC_AUTH_DEV_RESET !== "true") {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  // AUDITORÍA 23: con servicio de correo real configurado, esta herramienta
  // deja de existir — no debe haber una vía alternativa a la bandeja de entrada.
  if (process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  const email = new URL(request.url).searchParams.get("email")?.toLowerCase();
  const entry = getDevResetLink();

  // El enlace expira a los 15 minutos: no sirve como credencial permanente.
  const expired = entry ? Date.now() - entry.createdAt > 15 * 60 * 1000 : true;

  if (!email || !entry || expired || entry.email.toLowerCase() !== email) {
    return NextResponse.json({ link: null });
  }

  return NextResponse.json({ link: entry.url });
}
