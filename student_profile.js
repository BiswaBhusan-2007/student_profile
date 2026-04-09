/* ============================================================
   SCRIPT.JS — Alex Rivera Student Profile
   ============================================================ */

/* ── Theme ────────────────────────────────────────────────── */
const html = document.documentElement;
const body = document.body;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(dark) {
  body.classList.toggle('dark', dark);
  themeBtn.textContent = dark ? '○' : '◑';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!body.classList.contains('dark'));
}

themeBtn.addEventListener('click', toggleTheme);

// Restore saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyTheme(true);
  else if (saved === 'light') applyTheme(false);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme(true);
})();

/* ── Mobile menu ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMob() {
  mobileMenu.classList.remove('open');
}

/* ── Active nav link on scroll ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.35 }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── Reveal on scroll ─────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when about section reveals
        if (entry.target.classList.contains('skills-block')) animateSkills();
        // Animate donut when marks section reveals
        if (entry.target.classList.contains('donut-col')) animateDonut();
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach(el => revealObserver.observe(el));

/* ── Greeting ─────────────────────────────────────────────── */
const greetBtn = document.getElementById('greetBtn');
const greetMsg = document.getElementById('greetMsg');
const name = 'Biswa Bhusan';
const greetings = [
  `Welcome, ${name}! Great to have you here. 🎉`,
  `Hey there! ${name} says hi! 👋`,
  `Hello, world! — ${name} 🌍`,
  `Nice to meet you! I'm ${name}. 😊`,
];
let greetIdx = 0;

greetBtn.addEventListener('click', () => {
  greetMsg.textContent = greetings[greetIdx % greetings.length];
  greetIdx++;
  greetMsg.classList.add('show');
  greetBtn.style.transform = 'scale(.95)';
  setTimeout(() => { greetBtn.style.transform = ''; }, 150);
});

/* ── Marks: compute average & update UI ───────────────────── */
function computeAvg() {
  const rows = document.querySelectorAll('#marksBody tr');
  let total = 0, count = 0;
  rows.forEach(r => {
    const m = parseFloat(r.dataset.m);
    if (!isNaN(m)) { total += m; count++; }
  });
  return count ? (total / count) : 0;
}

function updateAvg() {
  const avg = computeAvg();
  const display = avg ? avg.toFixed(1) : '—';
  document.getElementById('avgMarks').innerHTML = `<strong>${display}${avg ? ' / 100' : ''}</strong>`;
  document.getElementById('gpaDisplay').textContent = avg ? avg.toFixed(1) : '—';
  return avg;
}

/* ── Donut chart ──────────────────────────────────────────── */
function animateDonut() {
  const avg = updateAvg();
  if (!avg) return;
  const ring = document.getElementById('donutRing');
  const r = 70;
  const circ = 2 * Math.PI * r;
  const pct = avg / 100;
  ring.style.strokeDasharray = `${(circ * pct).toFixed(2)} ${circ.toFixed(2)}`;
  document.getElementById('donutVal').textContent = avg.toFixed(1);
}

// Trigger on page load too (after a tick so CSS transition works)
setTimeout(() => {
  const donutCol = document.querySelector('.donut-col');
  if (donutCol && donutCol.classList.contains('visible')) animateDonut();
  else updateAvg();
}, 100);

/* ── Skills bars ──────────────────────────────────────────── */
function animateSkills() {
  document.querySelectorAll('.skill-row').forEach((row, i) => {
    const pct = parseInt(row.dataset.pct) || 0;
    const fill = row.querySelector('.sk-fill');
    if (fill) {
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, i * 80);
    }
  });
}

/* ── Subjects: Add / Remove ───────────────────────────────── */
const emojis = ['📚','🔭','🧪','🎯','✏️','🌱','🎵','🧮','🗺️','💡','⚗️','🖥️','🎲','📊','🌐'];

function addSubject() {
  const input = document.getElementById('newSubject');
  const val = input.value.trim();
  if (!val) { flashInput(input); return; }

  const list = document.getElementById('subjectList');
  const li = document.createElement('li');
  li.className = 'sc';
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  li.innerHTML = `
    <div class="sc-top"><span class="sc-emoji">${emoji}</span></div>
    <span class="sc-name">${escHtml(val)}</span>
    <button class="sc-del" onclick="removeSubject(this)" title="Remove">×</button>
  `;

  // Animate in
  li.style.opacity = '0';
  li.style.transform = 'scale(.85)';
  list.appendChild(li);
  requestAnimationFrame(() => {
    li.style.transition = 'opacity .3s, transform .3s';
    li.style.opacity = '1';
    li.style.transform = '';
  });

  input.value = '';
  input.focus();
}

function removeSubject(btn) {
  const li = btn.closest('li');
  li.style.transition = 'opacity .25s, transform .25s';
  li.style.opacity = '0';
  li.style.transform = 'scale(.8)';
  setTimeout(() => li.remove(), 260);
}

// Enter key
document.getElementById('newSubject').addEventListener('keydown', e => {
  if (e.key === 'Enter') addSubject();
});

/* ── Contact Form Validation ──────────────────────────────── */
function submitForm() {
  const name    = document.getElementById('fname').value.trim();
  const cls     = document.getElementById('fclass').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const msg     = document.getElementById('formMsg');

  // Clear
  msg.className = 'form-msg';
  msg.textContent = '';

  const missing = [];
  if (!name)    { missing.push('Name');    shake(document.getElementById('fname')); }
  if (!cls)     { missing.push('Class');   shake(document.getElementById('fclass')); }
  if (!message) { missing.push('Message'); shake(document.getElementById('fmessage')); }

  if (missing.length) {
    msg.textContent = `⚠ Please fill in: ${missing.join(', ')}.`;
    msg.classList.add('show', 'err');
    return;
  }

  msg.textContent = `✓ Thanks, ${name}! Your message has been sent successfully.`;
  msg.classList.add('show', 'ok');

  document.getElementById('fname').value    = '';
  document.getElementById('fclass').value   = '';
  document.getElementById('fmessage').value = '';

  setTimeout(() => msg.classList.remove('show'), 6000);
}

/* ── FAB ──────────────────────────────────────────────────── */
const fab = document.getElementById('fab');
window.addEventListener('scroll', () => {
  fab.classList.toggle('show', window.scrollY > 400);
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Helpers ──────────────────────────────────────────────── */
function shake(el) {
  el.style.borderColor = '#dc2626';
  el.style.animation = '';
  void el.offsetHeight;
  el.style.animation = 'shake .4s ease';
  el.addEventListener('animationend', () => {
    el.style.animation = '';
    el.style.borderColor = '';
  }, { once: true });
}

function flashInput(input) {
  input.style.boxShadow = '0 0 0 3px rgba(201,74,32,.35)';
  setTimeout(() => { input.style.boxShadow = ''; }, 800);
}

function escHtml(str) {
  return str.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

/* ── Typing effect for hero tagline ───────────────────────── */
(function typeTagline() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  el.style.opacity = '1';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 38);
    }
  }
  setTimeout(type, 900);
})();

/* ── Smooth counter for hero stats ────────────────────────── */
function animateCounter(el, target, duration) {
  const start = performance.now();
  const startVal = 0;
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    document.querySelectorAll('.hs-val').forEach(el => {
      const val = parseInt(el.textContent);
      if (!isNaN(val)) animateCounter(el, val, 1200);
    });
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);