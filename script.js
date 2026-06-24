
'use strict';


/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
const rpmEl  = document.getElementById('navRpm');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  const rpm = Math.floor(pct * 14000);
  rpmEl.textContent = String(rpm).padStart(4, '0');
  highlightNav();
});

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}

/* ---------- HAMBURGER ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ---------- HERO CANVAS (Particle Speed Lines) ---------- */
(function heroCanvas() {
  const canvas = document.getElementById('bikeCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class SpeedLine {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.len   = Math.random() * 180 + 40;
      this.speed = Math.random() * 8 + 4;
      this.alpha = Math.random() * 0.5 + 0.05;
      this.color = Math.random() > 0.6 ? '#39ff14' : '#00d4ff';
    }
    update() {
      this.x -= this.speed;
      if (this.x + this.len < 0) this.reset(), (this.x = W + this.len);
    }
    draw() {
      ctx.save();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.lineWidth   = Math.random() > 0.8 ? 1.5 : 0.7;
      ctx.beginPath();
      ctx.moveTo(this.x + this.len, this.y);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new SpeedLine());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------- TYPED ROLE ---------- */
(function typedRole() {
  const el    = document.getElementById('typedRole');
  const roles = [
    'Software Engineer',
    'AI/ML Enthusiast',
    'Full Stack Developer',
    'Prompt Engineer',
    'Campus Ambassador',
    'Problem Solver',
    'Frontend developer',
  ];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    let delay = deleting ? 60 : 100;
    if (!deleting && ci === word.length + 1) { delay = 1600; deleting = true; }
    if (deleting && ci < 0) { deleting = false; ri = (ri + 1) % roles.length; ci = 0; delay = 300; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 1800);
})();

/* ---------- SPEEDOMETER ---------- */
(function speedo() {
  const canvas  = document.getElementById('speedoCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const numEl   = document.getElementById('speedoNum');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 10;
  const R  = 88;

  let speed = 0, target = 0;
  let phase = 'up'; // up → peak → down
  let peakTimer = 0;

  // Ticks and labels
  function draw(sp) {
    ctx.clearRect(0, 0, W, H);

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, R + 6, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(57,255,20,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arc background
    const startA = Math.PI * 0.7;
    const endA   = Math.PI * 2.3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, startA, endA);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Speed arc
    const fraction = sp / 400;
    const arcEnd   = startA + fraction * (endA - startA);
    const grad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    grad.addColorStop(0, '#00d4ff');
    grad.addColorStop(0.6, '#39ff14');
    grad.addColorStop(1, '#ff4000');
    ctx.beginPath();
    ctx.arc(cx, cy, R, startA, arcEnd);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 18;
    ctx.shadowColor = sp > 200 ? '#39ff14' : '#00d4ff';
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startA + (i / 10) * (endA - startA);
      const inner = R - 14, outer = R - 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
      ctx.strokeStyle = i % 2 === 0 ? '#39ff14' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = i % 2 === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Needle
    const needleAngle = startA + fraction * (endA - startA);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(needleAngle);
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(R - 20, 0);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.stroke();
    ctx.restore();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#39ff14';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#39ff14';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function animate() {
    if (phase === 'up') {
      target = 380;
      speed += (target - speed) * 0.025;
      if (speed >= 370) { phase = 'peak'; peakTimer = 90; }
    } else if (phase === 'peak') {
      peakTimer--;
      if (peakTimer <= 0) phase = 'down';
    } else {
      target = 0;
      speed += (target - speed) * 0.02;
      if (speed <= 5) { phase = 'up'; speed = 0; }
    }
    draw(speed);
    numEl.textContent = Math.floor(speed);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---------- GAUGE CANVASES (Skills) ---------- */
function drawGauge(id, value, color) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2 + 8;
  const R = 52;

  let current = 0;
  function animate() {
    current += (value - current) * 0.04;
    ctx.clearRect(0, 0, W, H);

    const startA = Math.PI * 0.8, endA = Math.PI * 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, startA, endA);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.stroke();

    const arcEnd = startA + (current / 100) * (endA - startA);
    ctx.beginPath();
    ctx.arc(cx, cy, R, startA, arcEnd);
    ctx.strokeStyle = color;
    ctx.lineWidth = 10; ctx.lineCap = 'round';
    ctx.shadowBlur = 12; ctx.shadowColor = color;
    ctx.stroke(); ctx.shadowBlur = 0;

    // Needle
    const needleAngle = startA + (current / 100) * (endA - startA);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(needleAngle);
    ctx.beginPath();
    ctx.moveTo(-6, 0); ctx.lineTo(R - 14, 0);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
    ctx.stroke(); ctx.restore();

    // Center
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();

    if (Math.abs(value - current) > 0.5) requestAnimationFrame(animate);
  }

  // Start when in view
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animate(); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(canvas);
}

drawGauge('gauge1', 92, '#39ff14');
drawGauge('gauge2', 80, '#00d4ff');
drawGauge('gauge3', 75, '#ff9f00');
drawGauge('gauge4', 85, '#ff4000');
drawGauge('gauge5', 78, '#9d4edd');
drawGauge('gauge6', 80, '#ffc0cb');

/* ---------- SCROLL FADE IN ---------- */
(function scrollReveal() {
  const items = document.querySelectorAll(
    '.glass-card, .proj-card, .exp-item, .cert-chip, .gauge-item, .tl-item'
  );
  items.forEach(el => el.classList.add('fade-in-up'));
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  items.forEach(el => obs.observe(el));
})();

/* ---------- CONTACT FORM ---------- */
(function contactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('mailtoBtn');
  const success = document.getElementById('formSuccess');
  if (!form || !btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();

    const name    = form.querySelector('input[placeholder="Your name"]').value.trim();
    const email   = form.querySelector('input[placeholder="your@email.com"]').value.trim();
    const subject = form.querySelector('input[placeholder="What\'s this about?"]').value.trim();
    const message = form.querySelector('textarea').value.trim();

    // Validation
    if (!name || !email || !message) {
      alert('Name, Email and Message are required!');
      return;
    }

    const mailSubject = encodeURIComponent(subject || 'Message from Portfolio');
    const mailBody    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:aakritijainmvemjsun2007@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    form.style.display = 'none';
    success.style.display = 'block';
    setTimeout(() => {
      success.style.display = 'none';
      form.style.display = 'block';
      form.reset();
    }, 4000);
  });
})();

/* ---------- HERO PARTICLES (floating dots) ---------- */
(function heroParticles() {
  const container = document.getElementById('heroParticles');
  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('div');
    const size = Math.random() * 3 + 1;
    Object.assign(dot.style, {
      position: 'absolute',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? '#39ff14' : '#00d4ff',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: Math.random() * 0.5 + 0.1,
      animation: `floatDot ${Math.random() * 8 + 6}s ease-in-out infinite`,
      animationDelay: Math.random() * 6 + 's',
    });
    container.appendChild(dot);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatDot {
      0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
      33% { transform: translateY(-30px) translateX(15px); opacity: 0.7; }
      66% { transform: translateY(20px) translateX(-10px); opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
})();

/* ---------- SMOOTH ACTIVE STATE ON CLICK ---------- */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
