// ACCESO COMERCIALES · cambia SOLO esta línea por la URL de tu dashboard
const DASHBOARD_URL = 'https://appxpanddash.netlify.app';
document.querySelectorAll('[data-dashboard]').forEach(a => { a.href = DASHBOARD_URL; a.rel = 'noopener'; });

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('active'));
  const icon = navToggle.querySelector('svg');
  if (mobileMenu.classList.contains('active')) {
    icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
  } else {
    icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
  }
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    const icon = navToggle.querySelector('svg');
    icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
  });
});

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Form submission (Netlify Forms)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = 'Enviando...';
  btn.disabled = true;
  status.textContent = '';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    });
    if (!res.ok) throw new Error(res.status);
    status.textContent = 'Mensaje enviado. Te respondo en menos de 24 horas.';
    form.reset();
  } catch (err) {
    status.textContent = 'No se ha podido enviar. Escríbeme a appxpandcontact@gmail.com y lo vemos.';
  }
  btn.innerHTML = original;
  btn.disabled = false;
});

// Fondo animado del banner
AXBackground(document.getElementById('heroCanvas'), { colors: ['#4a8eff', '#8b5cf6'] });


/* Demos: escala de la vista previa y filtros */
(function () {
  const screens = document.querySelectorAll('.demo-screen');
  function fit() { screens.forEach(s => s.style.setProperty('--s', s.clientWidth / 1280)); }
  fit(); window.addEventListener('resize', fit);

  const cards = document.querySelectorAll('.demo-card');
  const btns = document.querySelectorAll('.demo-filter');
  function filter(f) {
    btns.forEach(b => b.classList.toggle('active', b.dataset.filter === f));
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.pack !== f));
    setTimeout(fit, 0);
  }
  btns.forEach(b => b.addEventListener('click', () => filter(b.dataset.filter)));
  document.querySelectorAll('.plan-demo-link').forEach(a => a.addEventListener('click', () => filter(a.dataset.filter)));
})();

// Desplegable "Ejemplos" del header
(() => {
  const dd = document.querySelector('.nav-dd');
  if (!dd) return;
  const btn = dd.querySelector('.nav-dd-btn');
  const set = o => { dd.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', e => { e.stopPropagation(); set(!dd.classList.contains('open')); });
  document.addEventListener('click', () => set(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  dd.querySelectorAll('.nav-dd-menu a').forEach(a => a.addEventListener('click', () => set(false)));
})();
