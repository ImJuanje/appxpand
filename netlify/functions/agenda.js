// Agenda de AppXpand · Netlify Function (Google Calendar + Gmail, sin coste de IA)
// Citas con el administrador o con cada comercial (equipo y horarios vienen del dashboard).
// Variables de entorno: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN
//   Equipo (opcionales; sin ellas solo se puede reservar con el administrador):
//     DASHBOARD_URL (ej: https://tu-dashboard.netlify.app) y AGENDA_KEY (la MISMA en los dos sitios, mín. 16 caracteres)
//   Otras opcionales: CALENDAR_ID, OWNER_EMAIL, ALLOWED_ORIGIN
const crypto = require('crypto');

/* ===== TU DISPONIBILIDAD POR DEFECTO (si no la fijas en el dashboard) ===== */
const TZ = 'Europe/Madrid';
const HOURS = { 1: [['16:00', '20:00']], 2: [['16:00', '20:00']], 3: [['16:00', '20:00']], 4: [['16:00', '20:00']], 5: [['16:00', '20:00']] }; // 0=domingo
const SLOT_MIN = 30;     // duración de cada llamada
const NOTICE_H = 12;     // antelación mínima en horas
const DAYS_AHEAD = 14;   // cuántos días hacia delante se puede reservar
/* ========================================================================== */

const OWNER = process.env.OWNER_EMAIL || 'appxpandcontact@gmail.com';
const CALS = (process.env.CALENDAR_ID || 'primary').split(',').map(s => s.trim());
const DASH = (process.env.DASHBOARD_URL || '').replace(/\/+$/, '');
const KEY = (process.env.AGENDA_KEY || '').trim();
const res = (code, obj) => ({ statusCode: code, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const pad = n => String(n).padStart(2, '0');

function wall(ms) {
  const o = {};
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(new Date(ms)).forEach(x => (o[x.type] = x.value));
  return Date.UTC(o.year, o.month - 1, o.day, o.hour === '24' ? 0 : +o.hour, o.minute, o.second);
}
function madrid(y, m, d, hh, mm) {
  const g = Date.UTC(y, m - 1, d, hh, mm);
  let t = g - (wall(g) - g);
  return g - (wall(t) - t);
}

/* ---------- equipo (viene del dashboard) ---------- */
let teamCache = { v: null, exp: 0 };
async function team() {
  if (!DASH || KEY.length < 16) return [];
  if (teamCache.v && Date.now() < teamCache.exp) return teamCache.v;
  try {
    const r = await fetch(DASH + '/api/public/team', { headers: { 'x-agenda-key': KEY } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const v = await r.json();
    teamCache = { v, exp: Date.now() + 60e3 };
    return v;
  } catch (e) { console.error('equipo', e.message); return teamCache.v || []; }
}
const hoursOf = p => {
  if (!p || !Array.isArray(p.days) || !p.days.length || !p.from || !p.to) return null;
  const h = {}; p.days.forEach(d => (h[d] = [[p.from, p.to]])); return h;
};
async function person(rep) {
  const t = await team();
  if (!rep || rep === 'admin') {
    const a = t.find(x => x.id === 'admin');
    return { id: 'admin', name: (a && a.name) || '', email: '', hours: hoursOf(a) || HOURS };
  }
  const p = t.find(x => x.id === rep);
  return p ? { id: p.id, name: p.name, email: p.email || '', hours: hoursOf(p) } : null;
}

/* ---------- Google ---------- */
let tok = { v: null, exp: 0 };
async function token() {
  if (tok.v && Date.now() < tok.exp) return tok.v;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, refresh_token: process.env.GOOGLE_REFRESH_TOKEN, grant_type: 'refresh_token' }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token: ' + JSON.stringify(j));
  tok = { v: j.access_token, exp: Date.now() + (j.expires_in - 120) * 1000 };
  return tok.v;
}
async function g(url, body) {
  const r = await fetch(url, body === undefined
    ? { headers: { Authorization: 'Bearer ' + (await token()) } }
    : { method: 'POST', headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!r.ok) throw new Error(url + ' ' + JSON.stringify(j));
  return j;
}

async function getSlots(p) {
  const now = Date.now(), w = new Date(wall(now)), all = [];
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const d = new Date(Date.UTC(w.getUTCFullYear(), w.getUTCMonth(), w.getUTCDate() + i));
    const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1, dd = d.getUTCDate();
    (p.hours[d.getUTCDay()] || []).forEach(([a, b]) => {
      const [h, mi] = a.split(':').map(Number), [eh, em] = b.split(':').map(Number);
      for (let min = h * 60 + mi; min + SLOT_MIN <= eh * 60 + em; min += SLOT_MIN) {
        const s = madrid(y, m, dd, Math.floor(min / 60), min % 60);
        if (s >= now + NOTICE_H * 3600e3) all.push({ date: `${y}-${pad(m)}-${pad(dd)}`, time: `${pad(Math.floor(min / 60))}:${pad(min % 60)}`, s, e: s + SLOT_MIN * 60e3 });
      }
    });
  }
  const out = { today: new Date(wall(now)).toISOString().slice(0, 10), rep: { id: p.id, name: p.name }, slots: {} };
  if (!all.length) return { out, all: [] };
  const timeMin = new Date(all[0].s).toISOString(), timeMax = new Date(all[all.length - 1].e).toISOString();
  const busy = [];
  if (p.id === 'admin') { // el administrador: su calendario real
    const fb = await g('https://www.googleapis.com/calendar/v3/freeBusy', { timeMin, timeMax, timeZone: TZ, items: CALS.map(id => ({ id })) });
    Object.values(fb.calendars || {}).forEach(c => (c.busy || []).forEach(b => busy.push([Date.parse(b.start), Date.parse(b.end)])));
  } else { // un comercial: solo se bloquean las citas ya reservadas con él
    const q = new URLSearchParams({ timeMin, timeMax, singleEvents: 'true', maxResults: '250', privateExtendedProperty: 'rep=' + p.id });
    const ev = await g(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALS[0])}/events?` + q);
    (ev.items || []).forEach(e => { if (e.status !== 'cancelled' && e.start && e.start.dateTime) busy.push([Date.parse(e.start.dateTime), Date.parse(e.end.dateTime)]); });
  }
  const free = all.filter(sl => !busy.some(([bs, be]) => bs < sl.e && be > sl.s));
  free.forEach(sl => (out.slots[sl.date] = out.slots[sl.date] || []).push(sl.time));
  return { out, all: free };
}

const hits = new Map();
function limited(key, max, ms) {
  const n = Date.now(), a = (hits.get(key) || []).filter(t => n - t < ms); a.push(n); hits.set(key, a); return a.length > max;
}
const clean = (s, n) => String(s || '').replace(/[\r\n\t<>]/g, ' ').trim().slice(0, n);
const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const dateEs = (d, t) => new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(d + 'T00:00:00Z')) + ' a las ' + t;

exports.handler = async (event) => {
  const origin = event.headers.origin || '';
  if (process.env.ALLOWED_ORIGIN && origin && origin !== process.env.ALLOWED_ORIGIN) return res(403, { error: 'origen' });
  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || 'anon';
  try {
    if (event.httpMethod === 'GET') {
      if (limited('g' + ip, 60, 10 * 60e3)) return res(429, { error: 'limite' });
      const qs = event.queryStringParameters || {};
      if (qs.team) return res(200, { team: (await team()).map(({ email, ...pub }) => pub) });
      const p = await person(qs.rep);
      if (!p) return res(404, { error: 'responsable' });
      return res(200, (await getSlots(p)).out);
    }
    if (event.httpMethod !== 'POST') return res(405, { error: 'metodo' });
    if (limited('p' + ip, 5, 60 * 60e3)) return res(429, { error: 'limite' });

    const b = JSON.parse(event.body || '{}');
    if (b.hp) return res(200, { ok: true }); // honeypot anti-bots
    const name = clean(b.name, 60), email = clean(b.email, 100), phone = clean(b.phone, 25);
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res(400, { error: 'datos' });
    const p = await person(b.rep);
    if (!p) return res(404, { error: 'responsable' });

    const { out, all } = await getSlots(p);
    const sl = all.find(x => x.date === b.date && x.time === b.time);
    if (!sl) return res(409, out); // hueco ocupado: devolvemos huecos actualizados

    const isRep = p.id !== 'admin';
    const attendees = [{ email, displayName: name }];
    if (isRep && p.email) attendees.push({ email: p.email, displayName: p.name });
    const ev = await g(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALS[0])}/events?conferenceDataVersion=1&sendUpdates=all`, {
      summary: `Llamada AppXpand · ${name}` + (isRep ? ` · con ${p.name}` : ''),
      description: `Reserva desde la web.\nCliente: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\nCon: ${p.name || 'administración'}`,
      start: { dateTime: new Date(sl.s).toISOString(), timeZone: TZ },
      end: { dateTime: new Date(sl.e).toISOString(), timeZone: TZ },
      attendees,
      transparency: isRep ? 'transparent' : 'opaque', // la cita de un comercial no ocupa tu agenda
      extendedProperties: { private: { rep: p.id } },
      conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    });
    const when = dateEs(sl.date, sl.time);

    // Aviso por email para ti (cliente y comercial reciben la invitación de Google con el enlace de Meet)
    try {
      const text = `Nueva reunión agendada desde la web.\n\nCuándo: ${when} (hora de España, ${SLOT_MIN} min)\nCon: ${p.name || 'administración'}\nCliente: ${name}\nEmail: ${email}\nTeléfono: ${phone || '-'}\nMeet: ${ev.hangoutLink || '-'}\nEvento: ${ev.htmlLink || '-'}`;
      const raw = [`To: ${OWNER}`, `From: AppXpand <${OWNER}>`, `Reply-To: ${email}`,
        `Subject: =?UTF-8?B?${b64('Nueva reunión: ' + name + (isRep ? ' con ' + p.name : '') + ' · ' + when)}?=`, 'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', b64(text)].join('\r\n');
      await g('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', { raw: Buffer.from(raw).toString('base64url') });
    } catch (e) { console.error('aviso email', e.message); }

    // El cliente entra como lead en el dashboard, asignado a quien atiende la cita
    if (DASH && KEY) {
      try {
        const r = await fetch(DASH + '/api/public/lead', {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'x-agenda-key': KEY },
          body: JSON.stringify({ rep: p.id, name, email, phone, when: new Date(sl.s).toISOString(), label: when, meet: ev.hangoutLink || '' }),
        });
        if (!r.ok) console.error('lead HTTP', r.status);
      } catch (e) { console.error('lead', e.message); }
    }

    return res(200, { ok: true, meet: ev.hangoutLink || null, rep: { id: p.id, name: p.name } });
  } catch (e) {
    console.error(e.message);
    return res(500, { error: 'interno' });
  }
};
