import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createSculptureGeometry, radialTexture, SCULPTURE_VIOLET } from './sculptureGeometry';

interface SeerSculptureCanvasProps {
  reducedMotion: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
}

const degrees = THREE.MathUtils.degToRad;

const Sculpture: React.FC<{ reducedMotion: boolean; onReady?: () => void }> = ({ reducedMotion, onReady }) => {
  const rig = useRef<THREE.Group>(null);
  const crown = useRef<THREE.Group>(null);
  const middle = useRef<THREE.Group>(null);
  const base = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const visible = useRef(true);
  const ready = useRef(false);
  const pendingFrame = useRef<number | null>(null);
  const lastFrame = useRef(0);
  const { camera, gl, scene, invalidate, size } = useThree();
  const geometry = useMemo(createSculptureGeometry, []);
  const materials = useMemo(() => ({
    ceramic: new THREE.MeshStandardMaterial({
      color: '#fffefd', roughness: 0.82, metalness: 0, envMapIntensity: 0.09,
      vertexColors: true, dithering: true,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#ffffff', vertexColors: true, roughness: 0.075, metalness: 0,
      // The closed curved shell refracts the ramp; absorption colours its thick edges.
      transmission: 0.72, transparent: true, opacity: 0.9,
      thickness: 0.28, ior: 1.46, clearcoat: 1, clearcoatRoughness: 0.065,
      attenuationColor: SCULPTURE_VIOLET, attenuationDistance: 0.7,
      envMapIntensity: 1.1, side: THREE.FrontSide, depthWrite: false, dithering: true,
    }),
  }), []);

  const requestFrame = useCallback(() => {
    if (!visible.current || document.hidden || pendingFrame.current !== null) return;
    // Slow motion needs only 25fps. Reduced motion has no recurring invalidations.
    pendingFrame.current = window.setTimeout(() => {
      pendingFrame.current = null;
      if (visible.current && !document.hidden) {
        lastFrame.current = performance.now();
        invalidate();
      }
    }, Math.max(0, 40 - (performance.now() - lastFrame.current)));
  }, [invalidate]);

  useEffect(() => {
    const environment = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(gl);
    const target = generator.fromScene(environment, 0.04);
    scene.environment = target.texture;
    environment.dispose();
    generator.dispose();
    invalidate();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, invalidate, scene]);

  useEffect(() => () => {
    Object.values(geometry).forEach(item => item.dispose());
    Object.values(materials).forEach(item => item.dispose());
    if (pendingFrame.current !== null) window.clearTimeout(pendingFrame.current);
  }, [geometry, materials]);

  useLayoutEffect(() => {
    const layers = [crown.current, middle.current, base.current];
    if (layers.some(layer => !layer)) return;
    const animations: gsap.core.Animation[] = [];
    const offsets = [degrees(-5), degrees(6), degrees(-4)];
    layers.forEach((layer, i) => { layer!.rotation.y = reducedMotion ? 0 : offsets[i]; });
    if (!reducedMotion) {
      const entrance = gsap.timeline({
        onUpdate: requestFrame,
        onComplete: () => {
          layers.forEach((layer, i) => {
            animations.push(gsap.fromTo(layer!.rotation, { y: 0 }, {
              y: degrees([1.2, -1.4, 0.8][i]), duration: [18, 22, 25][i],
              ease: 'sine.inOut', repeat: -1, yoyo: true, onUpdate: requestFrame,
            }));
          });
          syncVisibility();
        },
      });
      layers.forEach(layer => entrance.to(layer!.rotation, { y: 0, duration: 2.8, ease: 'power2.out' }, 0));
      animations.push(entrance);
    }
    const syncVisibility = () => {
      const active = visible.current && !document.hidden;
      animations.forEach(animation => animation.paused(!active));
      if (!active && pendingFrame.current !== null) {
        window.clearTimeout(pendingFrame.current);
        pendingFrame.current = null;
      }
      if (active) requestFrame();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      syncVisibility();
    });
    observer.observe(gl.domElement);
    document.addEventListener('visibilitychange', syncVisibility);
    syncVisibility();
    invalidate();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncVisibility);
      animations.forEach(animation => animation.kill());
    };
  }, [gl, invalidate, reducedMotion, requestFrame]);

  useLayoutEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(size.height, 1);
    // Include the contact shadow and expose the crown's open top and inner wall.
    const distance = Math.max(12.5, 7.8 / (2 * Math.tan(degrees(31 / 2)) * aspect));
    const direction = new THREE.Vector3(0.32, 0.52, 0.93).normalize();
    const target = new THREE.Vector3(0, 1.5, 0);
    perspective.position.copy(target).addScaledVector(direction, distance);
    perspective.lookAt(target);
    perspective.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.width, size.height]);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = gl.domElement;
    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.current.x = THREE.MathUtils.clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
      pointer.current.y = THREE.MathUtils.clamp((event.clientY - bounds.top) / bounds.height * 2 - 1, -1, 1);
      requestFrame();
    };
    const reset = () => { pointer.current = { x: 0, y: 0 }; requestFrame(); };
    canvas.addEventListener('pointermove', move, { passive: true });
    canvas.addEventListener('pointerleave', reset, { passive: true });
    return () => {
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', reset);
    };
  }, [gl, reducedMotion, requestFrame]);

  useFrame((_, delta) => {
    if (!ready.current) {
      ready.current = true;
      // Reveal only after a real frame has been submitted.
      window.requestAnimationFrame(() => onReady?.());
    }
    if (!rig.current || reducedMotion || !visible.current || document.hidden) return;
    const targetX = pointer.current.y * degrees(0.65);
    const targetY = pointer.current.x * degrees(1.6);
    rig.current.rotation.x = THREE.MathUtils.damp(rig.current.rotation.x, targetX, 4.5, Math.min(delta, 0.06));
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY, 4.5, Math.min(delta, 0.06));
    if (Math.abs(rig.current.rotation.x - targetX) + Math.abs(rig.current.rotation.y - targetY) > 0.00005) requestFrame();
  });

  return (
    <group ref={rig}>
      <group ref={crown} position={[0, 2.15, 0]}>
        <mesh geometry={geometry.crown} material={materials.ceramic} castShadow receiveShadow />
      </group>
      <group ref={middle} position={[-0.035, 0.44, -0.035]}>
        <mesh geometry={geometry.middle} material={materials.ceramic} castShadow receiveShadow />
      </group>
      <group ref={base} position={[0, 0, 0]}>
        <mesh geometry={geometry.base} material={materials.ceramic} castShadow receiveShadow />
      </group>
      <mesh geometry={geometry.ribbon} material={materials.ceramic} castShadow receiveShadow />
      <mesh position={[0, 0.53, 0]} geometry={geometry.glass} material={materials.glass} />
      <pointLight position={[0.1, 1.5, 0.15]} color={SCULPTURE_VIOLET} intensity={34} distance={6.2} decay={2} />
      <pointLight position={[0, 0.65, 0.2]} color={SCULPTURE_VIOLET} intensity={14} distance={5} decay={2} />
    </group>
  );
};

const Floor: React.FC = () => {
  const contact = useMemo(() => radialTexture(new THREE.Color('#28202f'), 0.92, 2.1, 0.36), []);
  const reflection = useMemo(() => radialTexture(new THREE.Color(SCULPTURE_VIOLET), 0.74, 1.8, 0.12), []);
  useEffect(() => () => { contact.dispose(); reflection.dispose(); }, [contact, reflection]);
  return (
    <group>
      <mesh position={[0, -0.028, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.48} color="#6b6672" />
      </mesh>
      <mesh position={[-0.65, -0.008, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.4, 6.2]} />
        <meshBasicMaterial map={contact} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0.3, -0.016, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10.5]} />
        <meshBasicMaterial map={reflection} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
};

const SeerSculptureCanvas: React.FC<SeerSculptureCanvasProps> = ({ reducedMotion, onReady, onUnavailable }) => (
  <Canvas
    aria-hidden="true"
    camera={{ fov: 31, near: 0.1, far: 100, position: [4, 4.5, 10] }}
    dpr={[1, 1.75]}
    frameloop="demand"
    gl={{ alpha: true, antialias: true, powerPreference: 'default', stencil: false }}
    shadows={{ type: THREE.VSMShadowMap }}
    onCreated={({ gl }) => {
      gl.setClearColor(0x000000, 0);
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 0.82;
      gl.domElement.addEventListener('webglcontextlost', () => onUnavailable?.(), { once: true });
    }}
  >
    <hemisphereLight args={['#ffffff', '#62586f', 0.22]} />
    <ambientLight color="#fffefd" intensity={0.015} />
    <directionalLight
      castShadow position={[7, 7, 4]} color="#fffaf1" intensity={4.3}
      shadow-mapSize={[2048, 2048]} shadow-camera-left={-5} shadow-camera-right={5}
      shadow-camera-top={5} shadow-camera-bottom={-5} shadow-camera-near={0.5}
      shadow-camera-far={25} shadow-bias={-0.0003} shadow-normalBias={0.015}
      shadow-radius={5} shadow-blurSamples={16}
    />
    <directionalLight position={[-6, 3, 5]} color="#eee8ff" intensity={0.12} />
    <directionalLight position={[4, 5, -4]} color="#fffefd" intensity={0.65} />
    <Sculpture reducedMotion={reducedMotion} onReady={onReady} />
    <Floor />
  </Canvas>
);

export default SeerSculptureCanvas;
