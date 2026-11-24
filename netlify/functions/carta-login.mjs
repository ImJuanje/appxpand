import { getStore } from "@netlify/blobs";
import { bares, codigos, hashCodigo, crearToken, activo, json } from "../lib/carta.mjs";

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);

  // Límite de intentos: 10 cada 15 min por IP
  const intentos = getStore("intentos");
  const ip = String(context.ip || "x").replace(/[^a-z0-9.:]/gi, "_");
  let reg = (await intentos.get(ip, { type: "json" })) || { n: 0, desde: Date.now() };
  if (Date.now() - reg.desde > 15 * 60 * 1000) reg = { n: 0, desde: Date.now() };
  if (reg.n >= 10) return json({ error: "Demasiados intentos. Espera 15 minutos." }, 429);

  const { codigo } = await req.json().catch(() => ({}));
  const barId = codigo ? await codigos().get(hashCodigo(codigo)) : null;

  if (!barId) {
    reg.n++;
    await intentos.setJSON(ip, reg);
    return json({ error: "Código incorrecto" }, 401);
  }

  await intentos.delete(ip);
  const bar = await bares().get(barId, { type: "json" });
  return json({ token: crearToken(barId), activo: activo(bar), fecha_fin: bar.fecha_fin });
};

export const config = { path: "/api/login" };
