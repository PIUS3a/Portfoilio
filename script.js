const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < 160; i++) {
    stars.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      r:       Math.random() * 1.4 + 0.2,
      speed:   Math.random() * 0.12 + 0.03,
      opacity: Math.random() * 0.7 + 0.2,
      flicker: Math.random() * 0.008,
      gold:    Math.random() < 0.12
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.opacity += s.flicker;
    if (s.opacity > .9 || s.opacity < .1) s.flicker *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = s.gold
      ? `rgba(251,191,36,${s.opacity})`
      : `rgba(180,230,190,${s.opacity})`;
    ctx.fill();
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