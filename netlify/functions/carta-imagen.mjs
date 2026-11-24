import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const { barId, id } = context.params;
  if (!/^[a-f0-9-]{36}$/.test(barId) || !/^[a-f0-9]{12}$/.test(id)) return new Response("no", { status: 400 });
  const r = await getStore("imagenes").getWithMetadata(`${barId}/${id}`, { type: "arrayBuffer" });
  if (!r) return new Response("no encontrada", { status: 404 });
  return new Response(r.data, {
    headers: {
      "content-type": r.metadata?.tipo || "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/img/:barId/:id" };
