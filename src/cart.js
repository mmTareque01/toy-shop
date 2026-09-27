import gsap from 'gsap';
import { svg } from './art.js';

const KEY = 'wobble-bag';
export const fmt = (n) => `$${n.toFixed(0)}`;

export function createCart({ products, lenis, toast, onAdd }) {
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const root = document.querySelector('.bag');
  const panel = root.querySelector('.bag__panel');
  const overlay = root.querySelector('.bag__overlay');
  const list = root.querySelector('.bag__list');
  const empty = root.querySelector('.bag__empty');
  const counts = document.querySelectorAll('[data-bag-count]');
  const checkout = root.querySelector('.bag__checkout');
  let items = load();
  let isOpen = false;
  gsap.set(panel, { xPercent: 110 });

  function load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(d) ? d.filter((i) => byId[i.id]) : [];
    } catch { return []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } }

  function render() {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + byId[i.id].price * i.qty, 0);
    counts.forEach((el) => (el.textContent = count));
    root.querySelector('[data-subtotal]').textContent = fmt(total);
    const left = Math.max(0, 60 - total);
    root.querySelector('.bag__ship span').textContent = left ? `You’re ${fmt(left)} away from free shipping!` : 'Woohoo — free shipping unlocked!';
    gsap.to(root.querySelector('.bag__ship i'), { scaleX: Math.min(1, total / 60), duration: 0.8, ease: 'elastic.out(1, 0.6)' });
    empty.hidden = items.length > 0;
    checkout.disabled = !items.length;
    list.innerHTML = items.map((i, idx) => {
      const p = byId[i.id];
      return `<li class="bag__item">
        <div class="bag__thumb" style="background:${p.bg}">${svg(p.art)}</div>
        <div class="bag__meta"><strong>${p.name}</strong><span>${p.age}</span>
          <div class="bag__qty"><button data-act="dec" data-idx="${idx}" aria-label="Less">−</button><b>${i.qty}</b><button data-act="inc" data-idx="${idx}" aria-label="More">+</button></div>
        </div>
        <div class="bag__price">${fmt(p.price * i.qty)}<button data-act="rm" data-idx="${idx}">Remove</button></div>
      </li>`;
    }).join('');
  }

  function add(id) {
    const f = items.find((i) => i.id === id);
    if (f) f.qty++;
    else items.push({ id, qty: 1 });
    save();
    render();
    gsap.fromTo(counts, { scale: 2, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)' });
    onAdd?.();
    toast(`${byId[id].name} jumped into your bag!`);
  }

  list.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const idx = +b.dataset.idx;
    if (b.dataset.act === 'inc') items[idx].qty++;
    if (b.dataset.act === 'dec') items[idx].qty--;
    if (b.dataset.act === 'rm' || items[idx].qty <= 0) {
      gsap.to(b.closest('.bag__item'), {
        x: 80, rotate: 8, opacity: 0, duration: 0.45, ease: 'back.in(2)',
        onComplete: () => { items.splice(idx, 1); save(); render(); },
      });
      return;
    }
    save();
    render();
  });

  function open() {
    if (isOpen) return;
    isOpen = true;
    lenis?.stop();
    root.classList.add('is-open');
    gsap.timeline()
      .to(overlay, { autoAlpha: 1, duration: 0.4 })
      .to(panel, { xPercent: 0, duration: 0.9, ease: 'elastic.out(1, 0.85)' }, 0)
      .fromTo(panel.querySelectorAll('.bag__item'), { x: 60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'back.out(2)' }, 0.25);
  }
  function close() {
    if (!isOpen) return;
    isOpen = false;
    gsap.timeline({ onComplete: () => { root.classList.remove('is-open'); lenis?.start(); } })
      .to(panel, { xPercent: 110, duration: 0.5, ease: 'back.in(1.4)' })
      .to(overlay, { autoAlpha: 0, duration: 0.3 }, 0.2);
  }
  document.querySelectorAll('[data-open-bag]').forEach((b) => b.addEventListener('click', open));
  root.querySelectorAll('[data-close-bag]').forEach((b) => b.addEventListener('click', close));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  checkout.addEventListener('click', () => {
    items = [];
    save();
    render();
    close();
    onAdd?.();
    toast('Yay! (This is a demo shop, so no real order was placed.)');
  });
  render();
  return { add, open, close };
}
