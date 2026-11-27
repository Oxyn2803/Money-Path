/**
 * Validación de entradas (Etapa 23 — auditoría de seguridad).
 *
 * Todas las identidades de Money Path son UUID v4 generados en la aplicación
 * (`common.id()`). Validar el formato **antes** de tocar la base de datos
 * evita dos cosas:
 *
 * 1. Errores 500 por `invalid input syntax for type uuid` ante basura.
 * 2. Sondeo de errores: una respuesta 400 estable no revela nada del esquema.
 *
 * El patrón es deliberadamente laxo en versión/variante (acepta cualquier
 * UUID bien formado) para no rechazar identidades legítimas.
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** ¿El valor es un UUID bien formado? */
export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/**
 * Lee un identificador del cuerpo de una petición. Devuelve cadena vacía si
 * no es UUID válido, de modo que el llamador responda 400 con su mensaje.
 */
export function readId(body: Record<string, unknown>, key = "id"): string {
  const value = body[key];
  return isUuid(value) ? value : "";
}
