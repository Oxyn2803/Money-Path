import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { exportUserData } from "@/lib/settings-page";

export const dynamic = "force-dynamic";

/**
 * Exportación de datos (privacidad, Etapa 21): JSON completo de los datos
 * del usuario para descarga. Autenticación obligatoria.
 */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  const payload = await exportUserData(session.user.id);
  const filename = `money-path-export-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
