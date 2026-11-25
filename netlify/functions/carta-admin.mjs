import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import { bares, codigos, slugs, hashCodigo, generarCodigo, sumarMeses, activo, slugify, cartaVacia, json } from "../lib/carta.mjs";

// Panel de administración: solo tú, con la clave ADMIN_KEY (variable de entorno en Netlify).
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();
const claveOk = (req) => {
  const k = process.env.ADMIN_KEY || "";
  const got = req.headers.get("x-admin-key") || "";
  return crypto.timingSafeEqual(sha(got), sha(k));
};
const mesesOk = (m) => Number.isInteger(m) && m >= 1 && m <= 36;

async function slugLibre(nombre) {
  let base = slugify(nombre);
  if (base.length < 3) base = "bar-" + crypto.randomBytes(2).toString("hex");
  let s = base;
  for (let i = 2; await slugs().get(s); i++) s = `${base.slice(0, 36)}-${i}`;
  return s;
}

async function borrarCodigosDe(id) {
  const st = codigos();
  const { blobs } = await st.list();
  for (const { key } of blobs) if ((await st.get(key)) === id) await st.delete(key);
}

export default async (req, context) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  if ((process.env.ADMIN_KEY || "").length < 12)
    return json({ error: "Falta la variable ADMIN_KEY en Netlify (mínimo 12 caracteres)." }, 500);

  // Límite de intentos fallidos: 10 cada 15 min por IP
  const intentos = getStore("intentos");
  const ip = "admin-" + String(context.ip || "x").replace(/[^a-z0-9.:]/gi, "_");
  let reg = (await intentos.get(ip, { type: "json" })) || { n: 0, desde: Date.now() };
  if (Date.now() - reg.desde > 15 * 60 * 1000) reg = { n: 0, desde: Date.now() };
  if (reg.n >= 10) return json({ error: "Demasiados intentos. Espera 15 minutos." }, 429);
  if (!claveOk(req)) {
    reg.n++;
    await intentos.setJSON(ip, reg);
    return json({ error: "Clave incorrecta" }, 401);
  }
  if (reg.n) await intentos.delete(ip);

  const b = await req.json().catch(() => ({}));

  switch (b.accion) {
    case "listar": {
      const { blobs } = await bares().list();
      const lista = [];
      for (const { key } of blobs) {
        const bar = await bares().get(key, { type: "json" });
        if (bar) lista.push({ id: bar.id, nombre: bar.nombre, contacto: bar.contacto || bar.email || "", slug: bar.slug, creado: bar.creado, fecha_fin: bar.fecha_fin, activo: activo(bar) });
      }
      lista.sort((a, c) => new Date(a.fecha_fin) - new Date(c.fecha_fin));
      return json({ bares: lista });
    }

    case "crear": {
      const nombre = String(b.nombre || "").trim().slice(0, 80);
      const contacto = String(b.contacto || "").trim().slice(0, 120);
      const meses = Number(b.meses);
      if (!nombre) return json({ error: "Falta el nombre del bar" }, 400);
      if (!mesesOk(meses)) return json({ error: "Meses entre 1 y 36" }, 400);
      const id = crypto.randomUUID();
      const codigo = generarCodigo();
      const slug = await slugLibre(nombre);
      const bar = { id, nombre, contacto, slug, creado: new Date().toISOString(), fecha_fin: sumarMeses(Date.now(), meses), carta: cartaVacia() };
      await bares().setJSON(id, bar);
      await codigos().set(hashCodigo(codigo), id);
      await slugs().set(slug, id);
      return json({ ok: true, codigo, id, nombre, slug, fecha_fin: bar.fecha_fin });
    }

    case "renovar": {
      const meses = Number(b.meses);
      if (!mesesOk(meses)) return json({ error: "Meses entre 1 y 36" }, 400);
      const bar = await bares().get(String(b.id), { type: "json" });
      if (!bar) return json({ error: "No existe" }, 404);
      // Se suman desde la caducidad (o desde hoy si ya caducó)
      bar.fecha_fin = sumarMeses(Math.max(Date.now(), new Date(bar.fecha_fin).getTime()), meses);
      await bares().setJSON(bar.id, bar);
      return json({ ok: true, fecha_fin: bar.fecha_fin });
    }

    case "nuevo-codigo": {
      const bar = await bares().get(String(b.id), { type: "json" });
      if (!bar) return json({ error: "No existe" }, 404);
      await borrarCodigosDe(bar.id); // el código antiguo deja de funcionar
      const codigo = generarCodigo();
      await codigos().set(hashCodigo(codigo), bar.id);
      return json({ ok: true, codigo, nombre: bar.nombre, fecha_fin: bar.fecha_fin });
    }

    case "borrar": {
      const bar = await bares().get(String(b.id), { type: "json" });
      if (!bar) return json({ error: "No existe" }, 404);
      await borrarCodigosDe(bar.id);
      await slugs().delete(bar.slug);
      const img = getStore("imagenes");
      const { blobs } = await img.list({ prefix: bar.id + "/" });
      for (const { key } of blobs) await img.delete(key);
      await bares().delete(bar.id);
      return json({ ok: true });
    }

    default:
      return json({ error: "acción no válida" }, 400);
  }
};

export const config = { path: "/api/admin-carta" };
