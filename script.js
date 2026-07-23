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

// Formulario de contacto (demo — sin backend)
function handleSubmit(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.hidden = false;
  e.target.reset();
  return false;
}
