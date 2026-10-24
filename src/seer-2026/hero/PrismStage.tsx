import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import './PrismStage.css';

/* A crystal prism in a chrome ring. One beam of light enters from the left, the crystal refracts it,
   and a fan of rays leaves to the right: many perspectives, one clear signal. Real-time glass, no baked media. */

const VIOLET = new THREE.Color('#6c47ff');
const LILAC = new THREE.Color('#b9a8ff');

const beamVert = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const beamFrag = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime; uniform float uPhase; uniform float uSpeed; uniform float uAlpha; uniform float uFade;
  uniform vec3 uA; uniform vec3 uB; uniform float uCore;
  void main(){
    float across = abs(vUv.y - .5) * 2.0;
    float edge = pow(1.0 - across, 1.6);
    float along = vUv.x;
    float pulse = .5 + .5 * sin(along * 26.0 - uTime * uSpeed + uPhase);
    float pulse2 = .5 + .5 * sin(along * 9.0 - uTime * uSpeed * .6 + uPhase * 1.7);
    float fade = pow(1.0 - along, uFade) * smoothstep(0.0, .06, along);
    float a = edge * fade * (.34 + .66 * pulse * pulse2) * uAlpha;
    vec3 col = mix(uA, uB, along);
    col = mix(col, vec3(1.0), pow(1.0 - across, 6.0) * uCore * pulse);
    gl_FragColor = vec4(col, a);
  }
`;

function ribbon(len: number, w0: number, w1: number, segs = 48) {
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, w = (w0 + (w1 - w0) * t) / 2, x = t * len;
    pos.push(x, -w, 0, x, w, 0); uv.push(t, 0, t, 1);
    if (i < segs) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

function crystalGeometry() {
  // A faceted gem: pointed top and bottom with a hexagonal girdle band.
  const pts = [
    new THREE.Vector2(0.001, -1.85), new THREE.Vector2(0.62, -0.78), new THREE.Vector2(0.98, -0.38),
    new THREE.Vector2(0.98, 0.42), new THREE.Vector2(0.62, 0.86), new THREE.Vector2(0.001, 1.9),
  ];
  const g = new THREE.LatheGeometry(pts, 7);
  // break the symmetry slightly so facets catch light differently
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const n = Math.sin(x * 7.1 + y * 3.3) * Math.cos(z * 5.7 - y * 2.1) * 0.035;
    p.setXYZ(i, x + n, y, z - n);
  }
  g.computeVertexNormals();
  return g;
}

function radialTexture(inner: string, outer: string) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d')!; const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner); g.addColorStop(1, outer); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function PrismStage() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' }); }
    catch { el.classList.add('is-static'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env; scene.environmentIntensity = 0.95;

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 80);
    camera.position.set(0, 0.2, 21);

    const rig = new THREE.Group(); scene.add(rig);

    // soft key + rim so facets read as glass
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 5, 6); scene.add(key);
    const rim = new THREE.PointLight(0x8f78ff, 60, 18, 2); rim.position.set(3.5, 0.5, -3.2); scene.add(rim);

    // backlight disc: gives the glass something to refract; its rim melts into the page colour
    const bgc = document.createElement('canvas'); bgc.width = bgc.height = 512; const bx = bgc.getContext('2d')!;
    const bg = bx.createRadialGradient(256, 256, 0, 256, 256, 256);
    bg.addColorStop(0, '#b9a6ff'); bg.addColorStop(0.35, '#d6caff'); bg.addColorStop(0.7, '#efeaff'); bg.addColorStop(1, '#fafafb');
    bx.fillStyle = bg; bx.fillRect(0, 0, 512, 512);
    const bgTex = new THREE.CanvasTexture(bgc); bgTex.colorSpace = THREE.SRGBColorSpace;
    const backlight = new THREE.Mesh(new THREE.CircleGeometry(3.3, 96), new THREE.MeshBasicMaterial({ map: bgTex, toneMapped: false }));
    backlight.position.set(0, -0.05, -1.4); rig.add(backlight);

    // chrome double ring + base
    const chrome = new THREE.MeshStandardMaterial({ color: 0xe4e4ee, metalness: 1, roughness: 0.14, envMapIntensity: 1.5 });
    const ringGeo = new THREE.TorusGeometry(2.55, 0.034, 28, 220);
    const ring1 = new THREE.Mesh(ringGeo, chrome), ring2 = new THREE.Mesh(ringGeo, chrome);
    ring1.position.z = 0.07; ring2.position.z = -0.07; ring2.scale.setScalar(0.985);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.45, 0.08, 120), chrome);
    base.position.y = -2.62;
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.026, 20, 160), chrome);
    baseRing.rotation.x = Math.PI / 2; baseRing.position.y = -2.55;
    rig.add(ring1, ring2, base, baseRing);

    // the crystal
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 2.6, ior: 1.6,
      dispersion: 0.7, attenuationColor: new THREE.Color('#8a70ff'), attenuationDistance: 2.6, clearcoat: 1, clearcoatRoughness: 0.03,
      envMapIntensity: 2.6, flatShading: true, specularIntensity: 1, side: THREE.FrontSide,
    });
    const crystal = new THREE.Mesh(crystalGeometry(), crystalMat);
    crystal.rotation.z = THREE.MathUtils.degToRad(9); crystal.position.y = -0.1;
    rig.add(crystal);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(crystal.geometry, 12), new THREE.LineBasicMaterial({ color: 0x3a2a8f, transparent: true, opacity: 0.5 }));
    crystal.add(edges);

    // contact shadow + violet floor spill
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.2), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(46,32,90,.34)', 'rgba(46,32,90,0)'), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.2, -2.66, 0.2); rig.add(shadow);
    const spill = new THREE.Mesh(new THREE.PlaneGeometry(14, 5), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(108,71,255,.22)', 'rgba(108,71,255,0)'), transparent: true, depthWrite: false }));
    spill.rotation.x = -Math.PI / 2; spill.position.set(4.4, -2.65, 0.4); rig.add(spill);

    // light: one beam in, a fan out
    const mats: THREE.ShaderMaterial[] = [];
    const mkBeam = (len: number, w0: number, w1: number, a: THREE.Color, b: THREE.Color, alpha: number, speed: number, phase: number, fade: number, core: number) => {
      const m = new THREE.ShaderMaterial({
        vertexShader: beamVert, fragmentShader: beamFrag, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uPhase: { value: phase }, uSpeed: { value: speed }, uAlpha: { value: alpha }, uFade: { value: fade }, uA: { value: a }, uB: { value: b }, uCore: { value: core } },
      });
      mats.push(m); return new THREE.Mesh(ribbon(len, w0, w1), m);
    };
    const inBeam = mkBeam(9, 0.09, 0.09, new THREE.Color('#c9bbff'), VIOLET, 1.4, 3.2, 0, 0.0001, 1);
    inBeam.position.set(-9.4, -0.62, 0.05); inBeam.rotation.z = Math.atan2(0.5, 9.2); inBeam.renderOrder = 1; rig.add(inBeam);
    const fan = new THREE.Group(); fan.position.set(0.1, -0.1, 0.02); rig.add(fan);
    const N = 40, rays: THREE.Mesh[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1), r = Math.sin(i * 12.9898) * 43758.5453; const rnd = r - Math.floor(r);
      const ang = THREE.MathUtils.degToRad(-15 + t * 34 + (rnd - 0.5) * 1.6);
      const w = 0.03 + rnd * 0.11;
      const m = mkBeam(12, w * 0.5, w * 1.5, new THREE.Color('#cdbfff'), VIOLET.clone().lerp(new THREE.Color('#4b2fe0'), rnd * 0.5), 0.8 + rnd * 0.5, 2.2 + rnd * 2.4, rnd * 6.28, 0.9 + rnd * 0.8, 0.7);
      m.rotation.z = ang; m.renderOrder = 1; fan.add(m); rays.push(m);
    }

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%';
      camera.aspect = w / h; camera.updateProjectionMatrix();
      // keep the whole object framed on narrow stages
      camera.position.z = w / h < 1 ? 27 : 21; rig.position.x = w / h < 1 ? 0.3 : 0.9;
    };
    resize(); const ro = new ResizeObserver(resize); ro.observe(el);

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = ((e.clientY - r.top) / r.height) * 2 - 1; };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true, hidden = document.hidden, raf = 0; const clock = new THREE.Clock();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 }); io.observe(el);
    const onVis = () => { hidden = document.hidden; }; document.addEventListener('visibilitychange', onVis);

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible || hidden) return;
      const t = reduce ? 0 : clock.getElapsedTime();
      mats.forEach((m) => { m.uniforms.uTime.value = t; });
      mouse.sx += (mouse.x - mouse.sx) * 0.05; mouse.sy += (mouse.y - mouse.sy) * 0.05;
      rig.rotation.y = mouse.sx * 0.22 + Math.sin(t * 0.22) * 0.07; rig.rotation.x = -mouse.sy * 0.07;
      crystal.rotation.y = t * 0.12 + mouse.sx * 0.4; crystal.rotation.z = THREE.MathUtils.degToRad(9) + Math.sin(t * 0.3) * 0.03;
      fan.rotation.z = Math.sin(t * 0.35) * 0.012; rays.forEach((r, i) => { r.scale.y = 1 + Math.sin(t * 0.8 + i) * 0.12; });
      rim.intensity = 60 + Math.sin(t * 0.7) * 8;
      renderer.render(scene, camera);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); const mm = m.material as THREE.Material | THREE.Material[] | undefined; (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach((x) => x.dispose()); });
      env.dispose(); pm.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return <div className="prism" ref={host} role="img" aria-label="A crystal prism in a chrome ring. One beam of light enters from the left and leaves as many rays: many perspectives refracted into one signal." />;
}
