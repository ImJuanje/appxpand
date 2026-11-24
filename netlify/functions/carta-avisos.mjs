import { bares, enviarEmail } from "../lib/carta.mjs";

// Se ejecuta 1 vez al día (08:00 UTC). Avisa a los bares que caducan en ≤7 días.
export default async () => {
  const store = bares();
  const { blobs } = await store.list();
  const base = process.env.URL || "https://appxpand.netlify.app";

  for (const { key } of blobs) {
    const bar = await store.get(key, { type: "json" });
    if (!bar || bar.avisado) continue;
    const dias = Math.ceil((new Date(bar.fecha_fin).getTime() - Date.now()) / 86400000);
    if (dias > 0 && dias <= 7) {
      try {
        await enviarEmail({
          to: bar.email,
          subject: `Tu carta caduca en ${dias} ${dias == 1 ? "día" : "días"}`,
          html: `<p>Hola, tu carta de <b>${bar.nombre}</b> caduca el ${new Date(bar.fecha_fin).toLocaleDateString("es-ES")}.</p>
                 <p>Renueva aquí para que tus clientes no se queden sin carta: <a href="${base}/carta-planes.html">${base}/carta-planes.html</a></p>`,
        });
        bar.avisado = true;
        await store.setJSON(bar.id, bar);
      } catch (e) { console.error(e); }
    }
  }
};

export const config = { schedule: "0 8 * * *" };
