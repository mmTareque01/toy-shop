import * as THREE from 'three';
import gsap from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const C = { tomato: '#FF5A4E', orange: '#FF9F43', sun: '#FFC53D', mint: '#3DD6A5', sky: '#5BB8FF', grape: '#8B6CFF', pink: '#FF8FC7', wood: '#E3B27A' };
const plastic = (color, extra = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, ...extra });

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// ---------- Toy builders ----------------------------------------------------
function letterBlock(letter, color) {
  const tex = canvasTex(256, 256, (g) => {
    g.fillStyle = color;
    g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(255,255,255,.55)';
    g.lineWidth = 10;
    g.beginPath();
    g.roundRect(30, 30, 196, 196, 26);
    g.stroke();
    g.fillStyle = '#fff';
    g.font = '700 150px Fredoka, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(letter, 128, 140);
  });
  return new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 5, 0.14), plastic('#ffffff', { map: tex, roughness: 0.4, clearcoat: 0.6 }));
}

function beachBall() {
  const cols = [C.tomato, '#ffffff', C.sun, '#ffffff', C.sky, '#ffffff', C.mint, '#ffffff'];
  const tex = canvasTex(512, 256, (g) => {
    cols.forEach((c, i) => { g.fillStyle = c; g.fillRect((i * 512) / cols.length, 0, 512 / cols.length + 1, 256); });
    g.fillStyle = '#fff';
    g.fillRect(0, 0, 512, 22);
    g.fillRect(0, 234, 512, 22);
  });
  return new THREE.Mesh(new THREE.SphereGeometry(0.62, 64, 32), plastic('#ffffff', { map: tex }));
}

function rocket() {
  const g = new THREE.Group();
  const prof = [[0, -0.78], [0.28, -0.78], [0.38, -0.5], [0.41, 0], [0.37, 0.34], [0.27, 0.6], [0.13, 0.8], [0, 0.9]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), plastic('#F7F4FF')));
  const nose = new THREE.Mesh(new THREE.LatheGeometry(prof.slice(4).map((v) => v.clone().multiplyScalar(1.02)), 48), plastic(C.tomato));
  g.add(nose);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.045, 16, 40), plastic(C.grape));
  ring.position.set(0, 0.12, 0.39);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.14, 32), plastic(C.sky, { roughness: 0.05 }));
  win.position.set(0, 0.12, 0.395);
  g.add(ring, win);
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.38, -0.36);
  finShape.lineTo(0.36, -0.02);
  finShape.lineTo(0, 0.36);
  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(finGeo, plastic(C.grape));
    const pivot = new THREE.Group();
    fin.position.set(0.3, -0.45, -0.03);
    pivot.add(fin);
    pivot.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 2;
    g.add(pivot);
  }
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.55, 24), new THREE.MeshBasicMaterial({ color: C.orange }));
  flame.rotation.x = Math.PI;
  flame.position.y = -1.02;
  g.add(flame);
  g.userData.flame = flame;
  return g;
}

function duck() {
  const g = new THREE.Group();
  const yellow = plastic(C.sun);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 48, 32), yellow);
  body.scale.set(1.3, 0.82, 1);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.36, 48, 32), yellow);
  head.position.set(-0.42, 0.55, 0);
  const beak = new THREE.Mesh(new THREE.SphereGeometry(0.15, 32, 16), plastic(C.orange));
  beak.scale.set(1.7, 0.5, 1.1);
  beak.position.set(-0.78, 0.5, 0);
  const eyeMat = plastic('#2B1B4A', { roughness: 0.1 });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), eyeMat);
  e1.position.set(-0.6, 0.66, 0.2);
  const e2 = e1.clone();
  e2.position.z = -0.2;
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.36, 24), yellow);
  tail.position.set(0.72, 0.3, 0);
  tail.rotation.z = -0.9;
  const wing = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 16), plastic('#FFB319'));
  wing.scale.set(1.3, 0.6, 0.4);
  wing.position.set(0.1, 0.08, 0.48);
  g.add(body, head, beak, e1, e2, tail, wing);
  return g;
}

function donut(color) {
  return new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.2, 32, 72), plastic(color));
}

function star() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 0.26 : 0.58;
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
    s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
  }
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.07, bevelThickness: 0.08, bevelSegments: 6 });
  geo.center();
  return new THREE.Mesh(geo, plastic(C.sun));
}

// ---------- Scene -------------------------------------------------------------
export function createScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.z = 14;
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const sunLight = new THREE.DirectionalLight('#fff4e0', 2);
  sunLight.position.set(4, 6, 6);
  scene.add(sunLight, new THREE.HemisphereLight('#ffffff', '#ffd9b0', 0.8));

  // Hero toys — positions are fractions of the half viewport
  const hero = new THREE.Group();
  scene.add(hero);
  const defs = [
    { make: () => letterBlock('A', C.tomato), d: [-0.88, 0.6, 0], m: [-0.62, 0.72, 0], s: 1.1 },
    { make: () => letterBlock('B', C.mint), d: [0.8, -0.48, 0.5], m: [0.6, -0.8, 0.5], s: 1 },
    { make: () => letterBlock('C', C.grape), d: [-0.74, -0.74, -1], m: [-0.62, -0.84, -1], s: 0.9 },
    { make: beachBall, d: [0.72, 0.56, -0.5], m: [0.6, 0.62, -0.5], s: 1.25 },
    { make: rocket, d: [0.93, 0.02, 0], m: [0.78, 0.9, -1.5], s: 1.2, tilt: -0.5 },
    { make: duck, d: [-0.9, -0.12, 0.3], m: [0.05, 0.84, -1], s: 1 },
    { make: () => donut(C.pink), d: [0.58, -0.84, -0.8], m: [0.1, -0.9, -0.8], s: 1 },
    { make: star, d: [-0.4, 0.9, -1.2], m: [-0.85, -0.35, -2], s: 1.1 },
    { make: () => donut(C.sky), d: [0.3, 0.9, -2.5], m: [-0.9, -0.5, -2.5], s: 0.8 },
  ];
  const toys = defs.map((def, i) => {
    const obj = def.make();
    const root = new THREE.Group();
    root.add(obj);
    hero.add(root);
    obj.traverse((o) => (o.userData.toy = i));
    return {
      ...def, root, obj,
      st: { appear: 0, jump: 0, spin: 0, squash: 0 },
      phase: Math.random() * Math.PI * 2,
      rs: { x: (Math.random() - 0.5) * 0.6, y: (Math.random() - 0.5) * 0.8 },
    };
  });

  // Ring stacker
  const stack = new THREE.Group();
  const stackInner = new THREE.Group();
  stack.add(stackInner);
  stack.visible = false;
  scene.add(stack);
  const woodMat = new THREE.MeshStandardMaterial({ color: C.wood, roughness: 0.55 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.3, 64), woodMat);
  base.position.y = -1.6;
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 2.9, 32), woodMat);
  post.position.y = -0.1;
  stackInner.add(base, post);
  const ringDefs = [
    [0.98, 0.26, C.tomato], [0.86, 0.24, C.orange], [0.74, 0.22, C.sun], [0.63, 0.2, C.mint], [0.52, 0.19, C.sky],
  ];
  let y = -1.45;
  const rings = ringDefs.map(([r, t, c]) => {
    y += t;
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 32, 96), plastic(c));
    m.rotation.x = Math.PI / 2;
    const target = y;
    y += t;
    m.position.y = 7;
    stackInner.add(m);
    return { mesh: m, target };
  });
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.34, 48, 32), plastic(C.grape));
  cap.position.y = 7;
  stackInner.add(cap);
  rings.push({ mesh: cap, target: y + 0.28 });
  const stackState = { appear: 0, leave: 0 };

  // ---------- Runtime ----------
  let halfW = 1, halfH = 1, baseScale = 1, mobile = false;
  const mouse = new THREE.Vector2(), mouseL = new THREE.Vector2();
  const ndc = new THREE.Vector2(-9, -9);
  const ray = new THREE.Raycaster();
  let heroOut = 0;

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(15)) * camera.position.z;
    halfW = halfH * camera.aspect;
    mobile = camera.aspect < 0.9;
    baseScale = mobile ? 0.62 : camera.aspect < 1.3 ? 0.85 : 1;
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    ndc.set(mouse.x, -mouse.y);
  });

  function toyAt(x, y) {
    if (heroOut > 0.6) return null;
    ray.setFromCamera(new THREE.Vector2(x, y), camera);
    const hit = ray.intersectObjects(hero.children, true)[0];
    return hit ? toys[hit.object.userData.toy] : null;
  }

  function boop(t) {
    gsap.timeline()
      .to(t.st, { squash: 1, duration: 0.1, ease: 'power2.out' })
      .to(t.st, { squash: 0, duration: 0.8, ease: 'elastic.out(1.2, 0.3)' })
      .to(t.st, { jump: 1, duration: 0.35, ease: 'power2.out' }, 0.08)
      .to(t.st, { jump: 0, duration: 0.9, ease: 'bounce.out' }, 0.43)
      .to(t.st, { spin: t.st.spin + Math.PI * 2, duration: 1.1, ease: 'power3.out' }, 0.08);
  }

  function update(time) {
    mouseL.lerp(mouse, 0.06);

    hero.visible = heroOut < 0.999;
    if (hero.visible) {
      for (const t of toys) {
        const p = mobile ? t.m : t.d;
        const out = 1 + heroOut * 1.4;
        const depth = 0.25 + (p[2] + 2.5) * 0.08;
        t.root.position.set(
          p[0] * halfW * 0.92 * out - mouseL.x * depth,
          p[1] * halfH * 0.9 * out + Math.sin(time * 0.9 + t.phase) * 0.18 + t.st.jump * 1.2 + mouseL.y * depth * 0.6,
          p[2],
        );
        const a = t.st.appear;
        const sq = t.st.squash;
        t.root.scale.set(a * (1 + sq * 0.25), a * (1 - sq * 0.3), a * (1 + sq * 0.25)).multiplyScalar(t.s * baseScale * (1 - heroOut * 0.3));
        t.obj.rotation.x = (t.tilt || 0) + Math.sin(time * 0.5 + t.phase) * 0.35 + time * t.rs.x * 0.3;
        t.obj.rotation.y = time * t.rs.y + t.st.spin + mouseL.x * 0.4;
        t.obj.rotation.z = (t.tilt || 0) * 0.6 + Math.cos(time * 0.6 + t.phase) * 0.15;
        if (t.obj.userData.flame) t.obj.userData.flame.scale.y = 0.8 + Math.sin(time * 30) * 0.2;
      }
    }

    const sa = stackState.appear * (1 - stackState.leave);
    stack.visible = sa > 0.001;
    if (stack.visible) {
      stack.position.set(mobile ? 0 : halfW * 0.4, (mobile ? -halfH * 0.18 : -0.1) + stackState.leave * halfH * 1.4, 0);
      stack.scale.setScalar(baseScale * 1.25 * (mobile ? 1.1 : 1) * Math.max(0.001, gsap.parseEase('back.out(1.6)')(sa)));
      stack.rotation.set(0.32 + mouseL.y * 0.1, time * 0.25 + mouseL.x * 0.5, 0);
    }

    if (hero.visible || stack.visible) renderer.render(scene, camera);
  }

  return {
    toys, rings, stackState, update, boop, toyAt,
    setHeroOut: (v) => (heroOut = v),
    hoverToy: () => toyAt(ndc.x, ndc.y),
  };
}
