// ══════════════════════════════════════
// SHADER / STARFIELD
// ══════════════════════════════════════
const canvas = document.getElementById('shader');
const ctx    = canvas.getContext('2d');
let stars    = [];
let mouse    = { x: 0, y: 0 };

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.5 + 0.2,
      speed:   Math.random() * 0.15 + 0.02,
      opacity: Math.random() * 0.7 + 0.2,
      flicker: Math.random() * 0.007,
      gold:    Math.random() < 0.1,
      ox: 0, oy: 0
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // subtle aurora at top
  const aurora = ctx.createLinearGradient(0, 0, canvas.width, 0);
  aurora.addColorStop(0,   'rgba(74,222,128,0.00)');
  aurora.addColorStop(0.3, 'rgba(74,222,128,0.03)');
  aurora.addColorStop(0.7, 'rgba(251,191,36,0.03)');
  aurora.addColorStop(1,   'rgba(74,222,128,0.00)');
  ctx.fillStyle = aurora;
  ctx.fillRect(0, 0, canvas.width, 180);

  stars.forEach(s => {
    s.opacity += s.flicker;
    if (s.opacity > .92 || s.opacity < .1) s.flicker *= -1;

    // subtle mouse parallax
    const dx = (mouse.x - canvas.width  / 2) * 0.003;
    const dy = (mouse.y - canvas.height / 2) * 0.003;
    s.ox += (dx - s.ox) * 0.05 * s.r;
    s.oy += (dy - s.oy) * 0.05 * s.r;

    ctx.beginPath();
    ctx.arc(s.x + s.ox, s.y + s.oy, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.gold
      ? `rgba(251,191,36,${s.opacity})`
      : `rgba(180,230,190,${s.opacity})`;
    ctx.fill();

    // glow on bigger stars
    if (s.r > 1.1) {
      ctx.beginPath();
      ctx.arc(s.x + s.ox, s.y + s.oy, s.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(251,191,36,${s.opacity * 0.15})`
        : `rgba(74,222,128,${s.opacity * 0.1})`;
      ctx.fill();
    }

    s.y -= s.speed;
    if (s.y < -2) {
      s.y = canvas.height + 2;
      s.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(drawStars);
}

resize();
initStars();
drawStars();

window.addEventListener('resize', () => { resize(); initStars(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// ══════════════════════════════════════
// PROGRESS BAR
// ══════════════════════════════════════
const progressBar = document.getElementById('progress-bar');

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPct + '%';
});

// ══════════════════════════════════════
// NAVBAR SHRINK ON SCROLL
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ══════════════════════════════════════
// MOBILE SIDEBAR
// ══════════════════════════════════════
const hamburger       = document.getElementById('hamburger');
const sidebar         = document.getElementById('sidebar');
const sidebarClose    = document.getElementById('sidebarClose');
const sidebarOverlay  = document.getElementById('sidebarOverlay');
const sidebarLinks    = document.querySelectorAll('.s-link');

function openSidebar() {
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);
sidebarLinks.forEach(l => l.addEventListener('click', closeSidebar));

// ══════════════════════════════════════
// TYPEWRITER
// ══════════════════════════════════════
const roles     = ['Python Developer', 'Data Analyst', 'AI Engineer', 'ML Enthusiast'];
let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
const roleEl    = document.getElementById('roleText');

function typeRole() {
  const current = roles[roleIndex];
  charIndex += isDeleting ? -1 : 1;
  roleEl.textContent = current.substring(0, charIndex);

  let speed = isDeleting ? 55 : 100;

  if (!isDeleting && charIndex === current.length) {
    speed = 1800; isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    speed      = 400;
  }
  setTimeout(typeRole, speed);
}

setTimeout(typeRole, 1200);

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ══════════════════════════════════════
// SKILL ITEM STAGGER ON REVEAL
// ══════════════════════════════════════
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const items = entry.target.querySelectorAll('.skill-item');
      items.forEach((item, i) => {
        item.style.opacity    = '0';
        item.style.transform  = 'translateY(14px)';
        item.style.transition = `opacity .4s ${i * 0.07}s, transform .4s ${i * 0.07}s`;
        setTimeout(() => {
          item.style.opacity   = '1';
          item.style.transform = 'translateY(0)';
        }, 100);
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));

// ══════════════════════════════════════
// ACTIVE NAV HIGHLIGHT ON SCROLL
// ══════════════════════════════════════
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// ══════════════════════════════════════
// BACK TO TOP BUTTON
// ══════════════════════════════════════
const backBtn = document.getElementById('back-top');

window.addEventListener('scroll', () => {
  backBtn.classList.toggle('show', window.scrollY > 400);
});

backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ══════════════════════════════════════
// PROJECT CARD TILT EFFECT
// ══════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) *  6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
  });
});
