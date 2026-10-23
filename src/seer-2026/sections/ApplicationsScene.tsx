import { useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { ceramicWall, radialTexture, SCULPTURE_VIOLET } from '../sculptureGeometry';

function Sculptures({ active, reduced }: { active: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree(state => state.invalidate);
  const objects = useMemo(() => {
    const white = new THREE.MeshStandardMaterial({ color: '#f7f7f9', roughness: 0.82, metalness: 0.04 });
    const glass = new THREE.MeshPhysicalMaterial({ color: SCULPTURE_VIOLET, roughness: 0.15, metalness: 0.12, transparent: true, opacity: 0.77, transmission: 0.18, thickness: 0.6, ior: 1.45, clearcoat: 1 });
    const models = Array.from({ length: 5 }, () => new THREE.Group());
    const mesh = (model: number, geometry: THREE.BufferGeometry, material: THREE.Material, position: [number, number, number], rotation: [number, number, number] = [0, 0, 0]) => {
      const object = new THREE.Mesh(geometry, material); object.position.set(...position); object.rotation.set(...rotation); object.castShadow = true; object.receiveShadow = true; models[model].add(object); return object;
    };
    // Explorer: open, concentric terraces around a glass outcome at the centre.
    [1.9, 1.43, 0.96].forEach((r, i) => mesh(0, ceramicWall(r - 0.22, r, 0.3, -0.7 + i * 0.8, Math.PI * 1.63), white, [0, i * 0.5 - 0.8, 0]));
    mesh(0, ceramicWall(0.54, 0.65, 1.75, -1.1, Math.PI * 1.5), glass, [0, -0.65, 0]);
    // Futarchy: two equal architectural gates framing a conditional choice.
    [-1, 1].forEach(x => {
      mesh(1, new THREE.BoxGeometry(0.25, 2.5, 0.8), white, [x * 1.55, 0.15, 0]);
      mesh(1, new THREE.BoxGeometry(1.25, 0.25, 0.8), white, [x * 1.05, 1.28, 0]);
      mesh(1, new THREE.BoxGeometry(0.7, 1.5, 0.16), glass, [x * 0.85, 0, 0]);
    });
    mesh(1, new THREE.CylinderGeometry(1.95, 1.95, 0.22, 96), white, [0, -1.23, 0]);
    // Deep: nested apertures align many perspectives into a single focal plane.
    [0, 1, 2, 3].forEach(i => mesh(2, ceramicWall(1.12 - i * 0.16, 1.36 - i * 0.16, 0.23), i === 3 ? glass : white, [0, 0.1, (i - 1.5) * 0.65], [Math.PI / 2, 0, 0]));
    mesh(2, new THREE.CylinderGeometry(1.8, 1.8, 0.22, 96), white, [0, -1.4, 0]);
    // Opportunity: a rising field of submissions, with one brought into focus.
    [[-1.15, -0.65, 0.5], [0, -0.15, 0.6], [1.15, 0.45, 0.3], [-0.6, 0.15, -0.8], [0.6, 1.05, -0.65]].forEach((p, i) => mesh(3, new THREE.CylinderGeometry(0.5, 0.5, i === 4 ? 0.6 : 0.24, 72), i === 4 ? glass : white, p as [number, number, number]));
    mesh(3, new THREE.CylinderGeometry(1.95, 1.95, 0.2, 96), white, [0, -1.18, 0]);
    // Risk: protective open shells reveal the exposure held within.
    [1.9, 1.38, 0.86].forEach((r, i) => mesh(4, ceramicWall(r - 0.17, r, 1.9 - i * 0.3, -0.35, Math.PI * 1.35), i === 2 ? glass : white, [0, -1, 0], [0, i * 0.25, 0]));
    return { models, white, glass };
  }, []);
  useEffect(() => {
    objects.models.forEach((model, i) => { model.visible = i === active; });
    if (!group.current) return;
    const target = group.current;
    gsap.killTweensOf([target.rotation, target.scale]);
    if (reduced) { target.rotation.y = -0.22; target.scale.setScalar(1); invalidate(); return; }
    target.scale.setScalar(0.86); target.rotation.y = -0.56;
    const timeline = gsap.timeline({ onUpdate: invalidate });
    timeline.to(target.scale, { x: 1, y: 1, z: 1, duration: 0.85, ease: 'power3.out' }, 0)
      .to(target.rotation, { y: -0.22, duration: 1.1, ease: 'power3.out' }, 0);
    return () => { timeline.kill(); };
  }, [active, reduced, objects, invalidate]);
  useEffect(() => () => {
    objects.models.forEach(model => model.traverse(object => { if (object instanceof THREE.Mesh) object.geometry.dispose(); }));
    objects.white.dispose(); objects.glass.dispose();
  }, [objects]);
  const shadow = useMemo(() => radialTexture(new THREE.Color('#17171c'), 0.24, 2.8), []);
  useEffect(() => () => shadow.dispose(), [shadow]);
  return <>
    <ambientLight intensity={1.4} /><hemisphereLight args={['#ffffff', '#bbb8ca', 2.3]} />
    <directionalLight position={[-4, 7, 5]} intensity={3.5} />
    <directionalLight position={[4, 3, -3]} intensity={1.7} color="#eee7ff" />
    <pointLight position={active === 1 ? [0, 0.8, 0.5] : [0.7, 0, 1]} intensity={active === 4 ? 3 : 6} color={SCULPTURE_VIOLET} distance={5} />
    <group ref={group} position={[0, 0.15, 0]}>{objects.models.map((model, i) => <primitive key={i} object={model} visible={i === active} />)}</group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.37, 0]}><planeGeometry args={[8, 7]} /><meshBasicMaterial map={shadow} transparent depthWrite={false} /></mesh>
  </>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function ApplicationsScene({ active, reduced }: { active: number; reduced: boolean }) {
  const [ready, setReady] = useState(false);
  return <SceneBoundary><div className={`s26-apps-renderer${ready ? ' is-ready' : ''}`}><Canvas frameloop="demand" dpr={[1, 1.75]} camera={{ position: [4.6, 3.1, 6.4], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }} onCreated={({ camera, gl }) => { camera.lookAt(0, 0, 0); gl.setClearColor(0x000000, 0); setReady(true); }}><Sculptures active={active} reduced={reduced} /></Canvas></div></SceneBoundary>;
}
