import Stripe from "stripe";
import { getStore } from "@netlify/blobs";
import crypto from "node:crypto";
import {
  bares, codigos, slugs, emails, hashCodigo, generarCodigo,
  sumarMeses, enviarEmail, cartaVacia,
} from "../lib/carta.mjs";

export default async (req) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text(); // raw, necesario para verificar la firma

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      req.headers.get("stripe-signature"),
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("firma inválida", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") return new Response("ok");
  const s = event.data.object;
  if (s.payment_status !== "paid") return new Response("ok");

  // Idempotencia: Stripe puede reenviar el mismo evento
  const sesiones = getStore("sesiones");
  if (await sesiones.get(s.id)) return new Response("ya procesado");

  const email = (s.customer_details?.email || "").trim().toLowerCase();
  const meses = Number(s.metadata?.meses);
  if (!email || !meses) return new Response("datos incompletos", { status: 400 });

  const base = process.env.URL || "https://appxpand.netlify.app";
  const existente = await emails().get(email);

  if (existente) {
    // Renovación: se suman meses desde la caducidad (o desde hoy si ya caducó)
    const bar = await bares().get(existente, { type: "json" });
    const desde = Math.max(Date.now(), new Date(bar.fecha_fin).getTime());
    bar.fecha_fin = sumarMeses(desde, meses);
    bar.avisado = false;
    await bares().setJSON(bar.id, bar);
    try {
      await enviarEmail({
        to: email,
        subject: "Tu carta se ha renovado ✅",
        html: `<p>Hemos añadido ${meses} ${meses == 1 ? "mes" : "meses"} a tu carta.</p>
               <p>Nueva fecha de caducidad: <b>${new Date(bar.fecha_fin).toLocaleDateString("es-ES")}</b></p>
               <p>Entra con tu código de siempre: <a href="${base}/carta-panel.html">${base}/carta-panel.html</a></p>`,
      });
    } catch (e) { console.error(e); }
  } else {
    const id = crypto.randomUUID();
    const codigo = generarCodigo();
    const slug = "bar-" + crypto.randomBytes(3).toString("hex");
    const bar = {
      id, email, nombre: "Mi bar", slug,
      creado: new Date().toISOString(),
      fecha_fin: sumarMeses(Date.now(), meses),
      avisado: false,
      carta: cartaVacia(),
    };
    await bares().setJSON(id, bar);
    await codigos().set(hashCodigo(codigo), id);
    await slugs().set(slug, id);
    await emails().set(email, id);
    try {
      await enviarEmail({
        to: email,
        subject: "Tu código para entrar a tu carta 🍽️",
        html: `<h2>¡Gracias por confiar en AppXpand!</h2>
               <p>Tu código personal es:</p>
               <p style="font-size:26px;letter-spacing:2px"><b>${codigo}</b></p>
               <p>Entra aquí: <a href="${base}/carta-panel.html">${base}/carta-panel.html</a></p>
               <p>Guárdalo bien: es tu llave de acceso. Tu carta estará activa hasta el <b>${new Date(bar.fecha_fin).toLocaleDateString("es-ES")}</b>.</p>`,
      });
    } catch (e) { console.error(e); }
  }

  await sesiones.set(s.id, "1");
  return new Response("ok");
};

export const config = { path: "/api/webhook-stripe" };
