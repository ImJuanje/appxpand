import { bares, slugs, activo, json } from "../lib/carta.mjs";

export default async (req) => {
  const slug = new URL(req.url).searchParams.get("slug") || "";
  const barId = await slugs().get(slug);
  if (!barId) return json({ disponible: false }, 404);
  const bar = await bares().get(barId, { type: "json" });
  if (!bar || !activo(bar)) return json({ disponible: false });
  return new Response(
    JSON.stringify({ disponible: true, nombre: bar.nombre, carta: bar.carta }),
    { headers: { "content-type": "application/json", "cache-control": "public, max-age=30" } }
  );
};

export const config = { path: "/api/carta-publica" };
