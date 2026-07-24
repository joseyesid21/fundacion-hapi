// ===== Fundación HAPI — Interacciones =====

// Año actual en el footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  navList.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => navList.classList.remove('open'))
  );
}

// Conteo animado de métricas
const counters = document.querySelectorAll('.metric strong[data-count]');
const animate = (el) => {
  const target = +el.dataset.count;
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('es');
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('es') + '+';
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => observer.observe(c));

// Logo del encabezado: siempre lleva al inicio visual absoluto de la página.
const brandTop = document.getElementById('brandTop');
if (brandTop) {
  brandTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    history.replaceState(null, '', location.pathname + location.search);
  });
}

// Consentimiento de datos: el botón se habilita solo cuando la casilla está marcada.
// (Mientras la casilla siga "disabled" en el HTML, el botón permanece bloqueado.)
const acepto = document.getElementById('acepto');
const submitBtn = document.getElementById('submitBtn');
if (acepto && submitBtn) {
  acepto.addEventListener('change', () => {
    submitBtn.disabled = !acepto.checked;
  });
}

// Formulario de contacto — envío real vía FormSubmit (AJAX)
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const note = document.getElementById('formNote');
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  fetch('https://formsubmit.co/ajax/fundacionhapi@gmail.com', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new FormData(form),
  })
    .then((res) => res.json())
    .then(() => {
      note.hidden = false;
      note.style.color = '';
      note.textContent = '¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.';
      form.reset();
    })
    .catch(() => {
      note.hidden = false;
      note.style.color = '#b23a3a';
      note.textContent = 'Hubo un problema al enviar. Escríbenos directo a fundacionhapi@gmail.com';
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = originalText;
    });

  return false;
}
