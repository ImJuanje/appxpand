import Stripe from "stripe";
import { PLANES, json, bares, barIdDeRequest } from "../lib/carta.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "método" }, 405);
  const { meses } = await req.json().catch(() => ({}));
  const precio = PLANES[meses];
  if (!precio) return json({ error: "plan no válido" }, 400);

  // Renovación desde el panel: usamos el mismo email para que se sumen los meses
  let customer_email;
  const barId = barIdDeRequest(req);
  if (barId) customer_email = (await bares().get(barId, { type: "json" }))?.email;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const base = process.env.URL || new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: precio,
          product_data: { name: `Carta digital AppXpand · ${meses} ${meses == 1 ? "mes" : "meses"}` },
        },
      },
    ],
    metadata: { meses: String(meses) },
    success_url: `${base}/carta-gracias.html`,
    cancel_url: `${base}/#herramientas`,
    // Stripe ya pide el email, no hace falta formulario propio
  });

  return json({ url: session.url });
};

export const config = { path: "/api/crear-pago" };
