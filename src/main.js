import './style.css';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Physics2DPlugin } from 'gsap/Physics2DPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';
import { products, filters, projects, reviews } from './data.js';
import { svg } from './art.js';
import { createScene } from './scene.js';
import { createCart, fmt } from './cart.js';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Draggable, InertiaPlugin, Physics2DPlugin, DrawSVGPlugin);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const COLORS = ['#FF5A4E', '#FF9F43', '#FFC53D', '#3DD6A5', '#5BB8FF', '#8B6CFF', '#FF8FC7'];
const rand = gsap.utils.random;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

/* ---------------------------------------------------------------------------
   Dynamic content
--------------------------------------------------------------------------- */
document.querySelectorAll('[data-art]').forEach((el) => (el.innerHTML = svg(el.dataset.art)));

// Animated wavy top edges
const wavePath = (() => {
  let d = 'M0 40 V22';
  for (let x = 0; x < 2880; x += 180) d += ` Q${x + 45} 4 ${x + 90} 22 T${x + 180} 22`;
  return `${d} V40 Z`;
})();
document.querySelectorAll('[data-wave]').forEach((s) => {
  s.style.setProperty('--wave', s.dataset.wave);
  s.insertAdjacentHTML('afterbegin', `<div class="wave" aria-hidden="true"><svg viewBox="0 0 2880 40" preserveAspectRatio="none"><path d="${wavePath}"/></svg></div>`);
});

const chips = document.querySelector('.chips');
chips.insertAdjacentHTML('beforeend', filters.map((f, i) => `<button class="chip${i ? '' : ' is-active'}" data-filter="${f.key}" role="tab">${f.label}</button>`).join(''));

const grid = document.querySelector('.grid');
grid.innerHTML = products.map((p) => `
  <article class="toy" data-cat="${p.cat}" style="--bg:${p.bg}">
    <div class="toy__art">${svg(p.art)}${p.badge ? `<span class="toy__badge${p.badge === 'New' ? ' toy__badge--new' : ''}">${p.badge}</span>` : ''}</div>
    <div class="toy__body">
      <span class="toy__age">${p.age}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="toy__foot"><strong>${fmt(p.price)}</strong><button class="toy__add jelly" data-add="${p.id}" data-cursor="Yes!">Add +</button></div>
    </div>
  </article>`).join('');

document.querySelector('.deck').innerHTML = projects.map((p) => `
  <article class="proj" data-cursor="Ooh!">
    <div class="proj__art" style="--bg:${p.bg}">${svg(p.art)}</div>
    <div class="proj__body"><h3>${p.title}</h3><p>${p.meta}</p></div>
  </article>`).join('');

const reviewCard = (r, i) => `
  <figure class="review" style="--c:${['#FFC53D', '#FF8FC7', '#3DD6A5', '#5BB8FF', '#ffffff', '#FF9F43'][i % 6]};--r:${i % 2 ? 1.5 : -1.5}deg">
    <div class="review__stars">★★★★★</div><p>“${r.q}”</p><small>${r.who}</small>
  </figure>`;
document.querySelectorAll('.reviews__row').forEach((row, k) => {
  const list = k ? [...reviews].reverse() : reviews;
  const html = list.map(reviewCard).join('');
  row.innerHTML = html + html;
});

document.querySelector('.footer__big').innerHTML = [...'wobble'].map((c, i) => `<span style="color:${COLORS[i]}">${c}</span>`).join('');

const toybox = document.querySelector('.toybox');
const palKeys = ['stacker', 'bear', 'train', 'blocks', 'rocket', 'duck', 'xylophone', 'kite', 'star', 'ball'];
toybox.insertAdjacentHTML('afterbegin', palKeys.map((k) => `<div class="pal" data-cursor="Grab!">${svg(k)}</div>`).join(''));

/* ---------------------------------------------------------------------------
   Smooth scroll
--------------------------------------------------------------------------- */
const lenis = reduced ? null : new Lenis({ lerp: 0.09 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  lenis.stop();
}
gsap.ticker.lagSmoothing(0);
const velocity = () => (lenis ? lenis.velocity : 0);
const scrollToTarget = (t) => (lenis ? lenis.scrollTo(t, { duration: 1.6 }) : (typeof t === 'number' ? window.scrollTo(0, t) : t.scrollIntoView({ behavior: 'smooth' })));

/* ---------------------------------------------------------------------------
   Toast + confetti + squishy cursor
--------------------------------------------------------------------------- */
const toastEl = document.querySelector('.toast');
let toastTl;
gsap.set(toastEl, { xPercent: -50, yPercent: 200 });
function toast(msg) {
  toastEl.textContent = msg;
  toastTl?.kill();
  toastTl = gsap.timeline()
    .fromTo(toastEl, { yPercent: 200, opacity: 0, rotation: -6 }, { yPercent: 0, opacity: 1, rotation: 0, duration: 0.7, ease: 'back.out(2.2)' })
    .to(toastEl, { yPercent: 200, opacity: 0, duration: 0.4, ease: 'back.in(2)' }, '+=2.4');
}

const confettiLayer = document.querySelector('.confetti');
function confetti(x, y, n = 36, spread = 70) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.style.background = COLORS[i % COLORS.length];
    if (i % 3 === 0) p.style.borderRadius = '50%';
    confettiLayer.appendChild(p);
    const dur = rand(1.3, 2.2);
    gsap.set(p, { x, y, rotation: rand(0, 360), scale: rand(0.5, 1.2) });
    gsap.to(p, {
      duration: dur, ease: 'none',
      physics2D: { velocity: rand(350, 850), angle: rand(-90 - spread, -90 + spread), gravity: 1300 },
      rotation: `+=${rand(-720, 720)}`,
      onComplete: () => p.remove(),
    });
    gsap.to(p, { opacity: 0, duration: 0.4, delay: dur - 0.4 });
  }
}

const cursor = document.querySelector('.cursor');
const cursorLabel = cursor.querySelector('.cursor__label');
let domHover = null;
function setCursor(el, fallbackLabel) {
  const label = el?.dataset?.cursor || fallbackLabel || '';
  cursor.classList.toggle('is-hover', !!el || !!fallbackLabel);
  cursor.classList.toggle('has-label', !!label);
  if (label) cursorLabel.textContent = label;
}
if (finePointer) {
  document.body.classList.add('has-cursor');
  const blob = cursor.querySelector('.cursor__blob');
  const pos = { x: -100, y: -100 }, cur = { x: -100, y: -100 };
  window.addEventListener('pointermove', (e) => { pos.x = e.clientX; pos.y = e.clientY; });
  gsap.ticker.add(() => {
    const dx = pos.x - cur.x, dy = pos.y - cur.y;
    cur.x += dx * 0.22;
    cur.y += dy * 0.22;
    const speed = Math.min(Math.hypot(dx, dy) / 60, 0.6);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    gsap.set(cursor, { x: cur.x, y: cur.y });
    gsap.set(blob, { rotation: angle, scaleX: 1 + speed, scaleY: 1 - speed * 0.5 });
    gsap.set(cursorLabel, { x: 0, y: 0 });
  });
  document.addEventListener('pointerover', (e) => {
    domHover = e.target.closest('[data-cursor], a, button, .pal');
    setCursor(domHover);
  });
}

/* ---------------------------------------------------------------------------
   Cart + fly-to-bag
--------------------------------------------------------------------------- */
const bagBtn = document.querySelector('.nav__bag');
const cart = createCart({
  products, lenis, toast,
  onAdd: () => {
    const r = bagBtn.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + r.height / 2, 24, 80);
    gsap.fromTo(bagBtn, { rotation: -18 }, { rotation: 0, duration: 1, ease: 'elastic.out(1.2, 0.3)' });
  },
});

function flyToBag(card, id) {
  const src = card.querySelector('.toy__art .art');
  const a = src.getBoundingClientRect();
  const b = bagBtn.getBoundingClientRect();
  const fly = document.createElement('div');
  fly.className = 'fly';
  fly.innerHTML = src.outerHTML;
  document.body.appendChild(fly);
  document.querySelector('.nav').classList.remove('is-hidden');
  gsap.set(fly, { x: a.left, y: a.top, width: a.width, height: a.height });
  const ex = b.left + b.width / 2 - 20, ey = b.top + b.height / 2 - 20;
  gsap.timeline({ onComplete: () => { fly.remove(); cart.add(id); } })
    .to(fly, { x: ex, width: 40, height: 40, duration: 0.9, ease: 'power1.inOut' }, 0)
    .to(fly, { y: Math.min(a.top, ey) - 120, duration: 0.4, ease: 'power2.out' }, 0)
    .to(fly, { y: ey, duration: 0.5, ease: 'power2.in' }, 0.4)
    .to(fly, { rotation: 540, duration: 0.9, ease: 'power1.in' }, 0);
}
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (!add) return;
  gsap.fromTo(add, { scale: 0.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1.4, 0.3)' });
  flyToBag(add.closest('.toy'), add.dataset.add);
});

/* ---------------------------------------------------------------------------
   Navigation
--------------------------------------------------------------------------- */
const nav = document.querySelector('.nav');
const menu = document.querySelector('.menu');
const burger = document.querySelector('.nav__burger');
let menuOpen = false;
function toggleMenu(force) {
  menuOpen = force ?? !menuOpen;
  burger.setAttribute('aria-expanded', menuOpen);
  menu.setAttribute('aria-hidden', !menuOpen);
  if (menuOpen) {
    lenis?.stop();
    gsap.timeline()
      .set(menu, { visibility: 'visible' })
      .to(menu, { clipPath: 'circle(150% at calc(100% - 50px) 48px)', duration: 0.8, ease: 'power3.inOut' })
      .fromTo(menu.querySelectorAll('a'), { y: 80, rotation: () => rand(-12, 12), opacity: 0 }, { y: 0, rotation: 0, opacity: 1, stagger: 0.06, duration: 0.8, ease: 'back.out(2)' }, 0.25);
  } else {
    lenis?.start();
    gsap.timeline()
      .to(menu, { clipPath: 'circle(0% at calc(100% - 50px) 48px)', duration: 0.6, ease: 'power3.inOut' })
      .set(menu, { visibility: 'hidden' });
  }
}
burger.addEventListener('click', () => toggleMenu());
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    e.preventDefault();
    if (id.length < 2) return;
    const go = () => scrollToTarget(id === '#top' ? 0 : document.querySelector(id));
    if (menuOpen) { toggleMenu(false); gsap.delayedCall(0.5, go); } else go();
  }),
);
function onScroll(y, dir) {
  nav.classList.toggle('is-hidden', dir > 0 && y > 300 && !menuOpen);
}
if (lenis) lenis.on('scroll', (l) => onScroll(l.scroll, l.direction));
else {
  let last = 0;
  window.addEventListener('scroll', () => { onScroll(scrollY, Math.sign(scrollY - last)); last = scrollY; });
}
const logoLetters = document.querySelectorAll('.nav__logo span');
document.querySelector('.nav__logo').addEventListener('pointerenter', () =>
  gsap.fromTo(logoLetters, { y: 0 }, {
    keyframes: [{ y: -12, rotation: () => rand(-20, 20), duration: 0.2, ease: 'power2.out' }, { y: 0, rotation: 0, duration: 0.6, ease: 'bounce.out' }],
    stagger: 0.04,
  }),
);

/* ---------------------------------------------------------------------------
   Ribbons (react to scroll speed)
--------------------------------------------------------------------------- */
document.querySelectorAll('.ribbon').forEach((row) => {
  const track = row.querySelector('.ribbon__track');
  row.appendChild(track.cloneNode(true));
  row.appendChild(track.cloneNode(true));
  const tracks = row.querySelectorAll('.ribbon__track');
  const dir = +row.dataset.dir;
  let x = 0;
  gsap.ticker.add((t, dt) => {
    const v = velocity();
    x -= dir * (0.008 + Math.min(Math.abs(v) * 0.004, 0.1)) * dt * (v < 0 ? -1 : 1);
    const w = track.offsetWidth;
    if (!w) return;
    const px = -((((x % 100) + 100) % 100) / 100) * w;
    tracks.forEach((tr) => (tr.style.transform = `translate3d(${px}px,0,0)`));
  });
});

/* ---------------------------------------------------------------------------
   Shop filter (Flip)
--------------------------------------------------------------------------- */
const pill = chips.querySelector('.chips__pill');
function movePill(chip, instant) {
  gsap.to(pill, {
    x: chip.offsetLeft, y: chip.offsetTop, width: chip.offsetWidth, height: chip.offsetHeight,
    duration: instant ? 0 : 0.7, ease: 'elastic.out(1, 0.7)',
  });
}
chips.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip || chip.classList.contains('is-active')) return;
  chips.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === chip));
  movePill(chip);
  const f = chip.dataset.filter;
  const cards = grid.querySelectorAll('.toy');
  const state = Flip.getState(cards);
  cards.forEach((c) => (c.style.display = f === 'all' || c.dataset.cat === f ? '' : 'none'));
  grid.classList.add('is-anim');
  Flip.from(state, {
    duration: 0.8, ease: 'back.out(1.3)', absolute: true, scale: true, stagger: 0.03,
    onEnter: (els) => gsap.fromTo(els, { scale: 0, rotation: -15, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: 'back.out(2)' }),
    onLeave: (els) => gsap.to(els, { scale: 0, rotation: 15, opacity: 0, duration: 0.4, ease: 'back.in(2)' }),
    onComplete: () => { grid.classList.remove('is-anim'); ScrollTrigger.refresh(); },
  });
});
window.addEventListener('resize', () => movePill(chips.querySelector('.chip.is-active'), true));

/* ---------------------------------------------------------------------------
   Loader → intro
--------------------------------------------------------------------------- */
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]);
let scene = null;

function loader() {
  return new Promise((resolve) => {
    const ball = document.querySelector('.loader__ball');
    const shadow = document.querySelector('.loader__shadow');
    const bounce = gsap.timeline({ repeat: -1 })
      .set(ball, { y: 90, scaleX: 1.3, scaleY: 0.7 })
      .to(ball, { y: 0, scaleX: 0.9, scaleY: 1.1, duration: 0.38, ease: 'power2.out' })
      .to(ball, { scaleX: 1, scaleY: 1, rotation: '+=180', duration: 0.2 }, '<0.1')
      .to(ball, { y: 90, scaleX: 0.9, scaleY: 1.1, duration: 0.38, ease: 'power2.in' })
      .fromTo(shadow, { scale: 1.2, opacity: 1 }, { scale: 0.5, opacity: 0.4, duration: 0.38, ease: 'power2.out', yoyo: true, repeat: 1 }, 0);
    const num = document.querySelector('.loader__text b');
    const c = { v: 0 };
    const count = gsap.to(c, { v: 100, duration: reduced ? 0.5 : 2.2, ease: 'power1.inOut', onUpdate: () => (num.textContent = Math.round(c.v)) });
    Promise.all([fontsReady, count.then()]).then(() => {
      bounce.kill();
      resolve();
    });
  });
}

function intro() {
  document.body.classList.remove('is-loading');
  ScrollTrigger.refresh();
  const words = document.querySelectorAll('.hero__title .w');
  gsap.set(words, { opacity: 0 });
  gsap.timeline({ onComplete: () => lenis?.start() })
    .to('.wipe--1', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power3.in' })
    .to('.wipe--2', { clipPath: 'circle(150% at 50% 50%)', duration: 0.7, ease: 'power3.in' }, 0.15)
    .set('.loader, .wipe--1', { display: 'none' })
    .to('.wipe--2', { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'power3.inOut' })
    .set('.wipe--2', { display: 'none' })
    .add('go', '-=0.45')
    .fromTo(words, { yPercent: 120, scale: 0.3, rotation: () => rand(-30, 30), opacity: 0 }, { yPercent: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.2, stagger: 0.07, ease: 'elastic.out(1, 0.55)' }, 'go')
    .from('.hl__squiggle path', { drawSVG: 0, duration: 0.8, ease: 'power2.inOut' }, 'go+=0.6')
    .from('.hero__pill', { y: -40, scale: 0.5, opacity: 0, duration: 0.9, ease: 'back.out(2.5)' }, 'go')
    .from('.hero__lead, .hero__ctas > *', { y: 40, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)' }, 'go+=0.5')
    .from('.nav > *', { y: -100, stagger: 0.08, duration: 0.9, ease: 'back.out(1.8)', clearProps: 'transform' }, 'go+=0.2')
    .from('.sticker', { scale: 0, rotation: -180, stagger: 0.15, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, 'go+=0.7')
    .from('.hero__hint', { opacity: 0, y: 20, duration: 0.6 }, 'go+=1.2')
    .to(scene.toys.map((t) => t.st), { appear: 1, stagger: 0.07, duration: 1.6, ease: 'elastic.out(1, 0.45)' }, 'go+=0.1');
}

/* ---------------------------------------------------------------------------
   Toys: boop on click
--------------------------------------------------------------------------- */
function setupBoops() {
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input, .pal, .bag, .menu')) return;
    const t = scene.toyAt((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    if (!t) return;
    scene.boop(t);
    confetti(e.clientX, e.clientY, 18, 60);
  });
  if (!finePointer) return;
  let f = 0, onToy = false;
  gsap.ticker.add(() => {
    if (++f % 5 || domHover) return;
    const hit = !!scene.hoverToy();
    if (hit !== onToy) { onToy = hit; setCursor(null, hit ? 'Boop!' : ''); }
  });
}

/* ---------------------------------------------------------------------------
   Scroll choreography
--------------------------------------------------------------------------- */
function buildScroll() {
  // Build: pinned ring stacker (pins first so later triggers account for it)
  const steps = gsap.utils.toArray('.step');
  gsap.set(steps.slice(1), { autoAlpha: 0 });
  const btl = gsap.timeline({
    scrollTrigger: { trigger: '.build', start: 'top top', end: () => '+=' + innerHeight * 3.2, pin: true, scrub: 1 },
  });
  const stepAt = { 1: 1.8, 2: 2.8, 3: 4.8 };
  scene.rings.forEach((r, i) => {
    btl.fromTo(r.mesh.position, { y: 7 }, { y: r.target, duration: 1, ease: 'bounce.out' }, i)
      .fromTo(r.mesh.rotation, { y: rand(-0.8, 0.8) }, { y: 0, duration: 1.1, ease: 'elastic.out(1, 0.3)' }, i + 0.5)
      .to('.build__roll-in', { yPercent: (-100 / 7) * (i + 1), duration: 0.3, ease: 'back.out(3)' }, i + 0.55);
  });
  Object.entries(stepAt).forEach(([n, at]) => {
    const prev = steps[n - 1], next = steps[n];
    btl.to(prev, { y: -40, rotation: -4, autoAlpha: 0, duration: 0.3, ease: 'back.in(2)' }, at)
      .fromTo(next, { y: 50, rotation: 4, autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' }, at + 0.3);
  });
  btl.to({}, { duration: 0.6 });
  ScrollTrigger.create({
    trigger: '.build', start: 'top bottom', end: 'top top', scrub: true,
    onUpdate: (s) => (scene.stackState.appear = s.progress),
  });
  ScrollTrigger.create({
    trigger: '.play', start: 'top bottom', end: 'top 30%', scrub: true,
    onUpdate: (s) => (scene.stackState.leave = s.progress),
  });

  // Hero: toys scatter + content drifts
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom top', onUpdate: (s) => scene.setHeroOut(s.progress) });
  gsap.to('.hero__content', { yPercent: 25, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // Pop-in headings
  document.querySelectorAll('[data-pop]').forEach((el) => {
    const chars = new SplitText(el, { type: 'chars,words', charsClass: 'char' }).chars;
    gsap.from(chars, {
      yPercent: 110, rotation: () => rand(-25, 25), scale: 0.4, opacity: 0, stagger: 0.022, duration: 0.9, ease: 'back.out(2.5)',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
  gsap.utils.toArray('.kicker').forEach((k) => gsap.from(k, { scale: 0, rotation: -20, duration: 0.8, ease: 'back.out(3)', scrollTrigger: { trigger: k, start: 'top 90%' } }));

  // Ages
  gsap.from('.age', {
    y: 160, rotation: (i) => [-12, 6, 14][i], scale: 0.6, opacity: 0, stagger: 0.12, duration: 1.2, ease: 'elastic.out(1, 0.65)',
    scrollTrigger: { trigger: '.ages__grid', start: 'top 85%' },
  });

  // Shop grid
  movePill(chips.querySelector('.chip'), true);
  gsap.from('.chips', { scale: 0.6, opacity: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: '.chips', start: 'top 90%' } });
  gsap.set('.toy', { opacity: 0 });
  ScrollTrigger.batch('.toy', {
    start: 'top 92%', once: true,
    onEnter: (els) => {
      grid.classList.add('is-anim');
      gsap.fromTo(els, { y: 120, rotation: () => rand(-10, 10), opacity: 0 }, {
        y: 0, rotation: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'back.out(1.6)',
        onComplete: () => { grid.classList.remove('is-anim'); gsap.set(els, { clearProps: 'transform' }); },
      });
    },
  });

  // Toy box
  const pals = gsap.utils.toArray('.pal');
  const palPos = () => {
    const w = toybox.clientWidth, h = toybox.clientHeight, s = pals[0].offsetWidth;
    return pals.map(() => ({ x: rand(10, w - s - 10), y: rand(h * 0.08, h - s - 20), rotation: rand(-25, 25) }));
  };
  palPos().forEach((p, i) => gsap.set(pals[i], p));
  let z = 10;
  Draggable.create(pals, {
    type: 'x,y', bounds: toybox, inertia: true, edgeResistance: 0.6,
    onPress() { gsap.to(this.target, { scale: 1.15, duration: 0.3, ease: 'back.out(3)' }); this.target.style.zIndex = ++z; },
    onDrag() { gsap.to(this.target, { rotation: gsap.utils.clamp(-35, 35, this.deltaX * 3), duration: 0.4 }); },
    onRelease() { gsap.to(this.target, { scale: 1, duration: 0.8, ease: 'elastic.out(1.2, 0.35)' }); },
    onThrowComplete() { gsap.to(this.target, { rotation: rand(-15, 15), duration: 0.6, ease: 'back.out(2)' }); },
  });
  ScrollTrigger.create({
    trigger: toybox, start: 'top 70%', once: true,
    onEnter: () => gsap.from(pals, { y: -700, rotation: () => rand(-180, 180), duration: 1.4, stagger: 0.07, ease: 'bounce.out' }),
  });
  document.querySelector('.toybox__shake').addEventListener('click', (e) => {
    gsap.fromTo(toybox, { x: 0 }, { keyframes: { x: [-14, 12, -10, 8, -4, 0] }, duration: 0.5, ease: 'none' });
    palPos().forEach((p, i) => gsap.to(pals[i], { ...p, rotation: p.rotation + rand(-360, 360), duration: 1.2, delay: i * 0.03, ease: 'elastic.out(1, 0.45)' }));
    const r = e.currentTarget.getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top, 40, 60);
  });

  // Work deck fans out on desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    const cards = gsap.utils.toArray('.proj');
    gsap.set(cards, { rotation: (i) => [-9, 6, -4, 11][i], x: (i) => (i - 1.5) * 12, y: (i) => i * -6 });
    gsap.to(cards, {
      x: (i) => (i - 1.5) * Math.min(cards[0].offsetWidth * 1.08, (document.querySelector('.deck').offsetWidth - cards[0].offsetWidth) / 3),
      y: (i) => [10, -24, 18, -10][i],
      rotation: (i) => [-5, 3, -2, 5][i],
      ease: 'power2.out',
      scrollTrigger: { trigger: '.deck', start: 'top 85%', end: 'center 55%', scrub: 1, invalidateOnRefresh: true },
    });
  });
  mm.add('(max-width: 767px)', () => {
    gsap.from('.proj', { y: 100, rotation: (i) => (i % 2 ? 8 : -8), opacity: 0, stagger: 0.1, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.deck', start: 'top 85%' } });
  });

  // Reviews: infinite rows, slow down on hover
  document.querySelectorAll('.reviews__row').forEach((row, k) => {
    const tween = k
      ? gsap.fromTo(row, { xPercent: -50 }, { xPercent: 0, duration: 45, ease: 'none', repeat: -1 })
      : gsap.to(row, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    row.addEventListener('pointerenter', () => gsap.to(tween, { timeScale: 0.1, duration: 0.6 }));
    row.addEventListener('pointerleave', () => gsap.to(tween, { timeScale: 1, duration: 0.6 }));
  });

  // Club floaters + form
  document.querySelectorAll('.float').forEach((el) =>
    gsap.to(el, { y: -150 * +el.dataset.speed, rotation: 60 * +el.dataset.speed, ease: 'none', scrollTrigger: { trigger: '.club', start: 'top bottom', end: 'bottom top', scrub: true } }),
  );

  // Footer letters
  const big = gsap.utils.toArray('.footer__big span');
  gsap.from(big, {
    yPercent: 120, rotation: () => rand(-40, 40), stagger: 0.07, duration: 1.3, ease: 'bounce.out',
    scrollTrigger: { trigger: '.footer', start: 'top 80%' },
  });
  big.forEach((s) =>
    s.addEventListener('pointerenter', () =>
      gsap.to(s, { keyframes: [{ y: -50, rotation: rand(-25, 25), duration: 0.25, ease: 'power2.out' }, { y: 0, rotation: 0, duration: 0.9, ease: 'bounce.out' }] }),
    ),
  );

  ScrollTrigger.refresh();
}

document.querySelector('.club__form').addEventListener('submit', (e) => {
  e.preventDefault();
  const r = e.target.querySelector('button').getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top, 70, 75);
  e.target.reset();
  toast('Welcome to the Wobble Club! 🎉');
});

/* ---------------------------------------------------------------------------
   Boot (canvas textures need Fredoka, so wait for fonts)
--------------------------------------------------------------------------- */
fontsReady.then(() => {
  scene = createScene(document.getElementById('webgl'));
  gsap.ticker.add((t) => scene.update(t));
  buildScroll();
  setupBoops();
});
Promise.all([loader(), fontsReady]).then(intro);
