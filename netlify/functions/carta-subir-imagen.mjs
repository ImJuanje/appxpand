import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import { bares, barIdDeRequest, activo, json } from "../lib/carta.mjs";

// El navegador comprime a WebP (~800px) antes de subir. Aquí solo validamos.
export default async (req) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  const barId = barIdDeRequest(req);
  if (!barId) return json({ error: "no autorizado" }, 401);
  const bar = await bares().get(barId, { type: "json" });
  if (!bar || !activo(bar)) return json({ error: "suscripción caducada" }, 402);

  const tipo = req.headers.get("content-type") || "";
  if (!/^image\/(webp|jpeg|png)$/.test(tipo)) return json({ error: "formato no válido" }, 400);

  const buf = await req.arrayBuffer();
  if (buf.byteLength > 700_000) return json({ error: "imagen demasiado pesada (máx 700KB)" }, 413);

  const id = crypto.randomBytes(6).toString("hex");
  await getStore("imagenes").set(`${barId}/${id}`, buf, { metadata: { tipo } });
  return json({ url: `/img/${barId}/${id}` });
};

export const config = { path: "/api/subir-imagen" };
