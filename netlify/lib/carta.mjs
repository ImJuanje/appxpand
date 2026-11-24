import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";

// Precios en céntimos. Cámbialos aquí cuando quieras.
export const PLANES = { 1: 1300, 3: 3500, 6: 6500, 12: 11000 };

export const bares = () => getStore("bares");
export const codigos = () => getStore("codigos");
export const slugs = () => getStore("slugs");
export const emails = () => getStore("emails");

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

const secret = () => process.env.SESSION_SECRET;
const hmac = (txt) => crypto.createHmac("sha256", secret()).update(txt).digest("hex");

export const hashCodigo = (c) => hmac("codigo:" + String(c).trim().toUpperCase());

// Código tipo K7X9-P2MQ-84LD (sin letras confusas)
export function generarCodigo() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const b = crypto.randomBytes(12);
  let s = "";
  for (let i = 0; i < 12; i++) {
    s += A[b[i] % A.length];
    if (i % 4 === 3 && i < 11) s += "-";
  }
  return s;
}

// Sesión: barId.expira.firma (7 días)
export function crearToken(barId) {
  const exp = Date.now() + 7 * 24 * 3600 * 1000;
  const data = `${barId}.${exp}`;
  return `${data}.${hmac("token:" + data)}`;
}

export function barIdDeRequest(req) {
  const t = (req.headers.get("authorization") || "").replace("Bearer ", "");
  const [id, exp, sig] = t.split(".");
  if (!id || !exp || !sig) return null;
  const a = Buffer.from(sig);
  const b = Buffer.from(hmac(`token:${id}.${exp}`));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(exp)) return null;
  return id;
}

export const activo = (bar) => new Date(bar.fecha_fin).getTime() > Date.now();

export function sumarMeses(desde, meses) {
  const d = new Date(desde);
  d.setMonth(d.getMonth() + meses);
  return d.toISOString();
}

export function slugify(t) {
  return String(t)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function enviarEmail({ to, subject, html }) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, html }),
  });
  if (!r.ok) throw new Error("Resend: " + (await r.text()));
}

export const cartaVacia = () => ({
  titulo: "Nuestra carta",
  colores: { fondo: "#ffffff", texto: "#1a1a1a", acento: "#d62828" },
  logo: null,
  categorias: [], // { id, nombre, platos: [{ id, nombre, descripcion, precio, imagen, visible }] }
  menus: [], // { id, nombre, precio, descripcion, incluye: [] }
});
