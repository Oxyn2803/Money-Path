import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Evita que módulos Node.js (pg, dns, fs, net, tls) sejam incluídos no bundle do cliente */
  serverExternalPackages: ["pg"],
  /*
   * Cabeceras de seguridad (Etapa 23 — auditoría).
   *
   * - `nosniff`: impide que el navegador reinterprete un tipo MIME.
   * - `Referrer-Policy`: no filtra la URL completa a terceros.
   * - `Permissions-Policy`: desactiva capacidades del dispositivo que la app
   *   no usa.
   * - `frame-ancestors`: protección contra clickjacking que **conserva** el
   *   embebido en el preview (dominios e2b), que es un requisito del producto.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.e2b.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
