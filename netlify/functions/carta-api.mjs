import { bares, slugs, barIdDeRequest, activo, slugify, json } from "../lib/carta.mjs";

export default async (req) => {
  const barId = barIdDeRequest(req);
  if (!barId) return json({ error: "no autorizado" }, 401);
  const bar = await bares().get(barId, { type: "json" });
  if (!bar) return json({ error: "no existe" }, 404);

  if (req.method === "GET") {
    return json({ ...bar, activo: activo(bar) });
  }

  if (req.method === "PUT") {
    if (!activo(bar)) return json({ error: "Suscripción caducada. Renueva para editar." }, 402);

    const raw = await req.text();
    if (raw.length > 300_000) return json({ error: "Carta demasiado grande" }, 413);
    const body = JSON.parse(raw);

    if (body.nombre) bar.nombre = String(body.nombre).slice(0, 80);
    if (body.carta && typeof body.carta === "object") bar.carta = body.carta;

    if (body.slug && body.slug !== bar.slug) {
      const nuevo = slugify(body.slug);
      if (nuevo.length < 3) return json({ error: "URL demasiado corta" }, 400);
      if (await slugs().get(nuevo)) return json({ error: "Esa URL ya está cogida" }, 409);
      await slugs().set(nuevo, bar.id);
      await slugs().delete(bar.slug);
      bar.slug = nuevo;
    }

    await bares().setJSON(bar.id, bar);
    return json({ ok: true, slug: bar.slug });
  }

  return json({ error: "método" }, 405);
};

export const config = { path: "/api/carta" };
