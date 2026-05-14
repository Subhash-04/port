import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const TOOLS = [
  'Figma', 'Framer', 'React', 'Next.js', 'TypeScript', 'Three.js',
  'GSAP', 'Tailwind', 'Node', 'Postgres', 'Cursor', 'Blender',
  'WebGL', 'Motion', 'Vite', 'Express',
];

const ACCENT = new THREE.Color('#c64f17');
const PAPER = new THREE.Color('#f4f1ea');
const INK = new THREE.Color('#1a1a17');
const OLIVE = new THREE.Color('#5b6244');

const PALETTE = [ACCENT, OLIVE, new THREE.Color('#2c2a25'), new THREE.Color('#b0967a')];

function makePillTexture(label: string, bgColor: THREE.Color, textColor: THREE.Color) {
  const W = 256, H = 80;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const r = H / 2;
  ctx.fillStyle = `#${bgColor.getHexString()}`;
  ctx.beginPath();
  ctx.moveTo(r, 0); ctx.lineTo(W - r, 0);
  ctx.arcTo(W, 0, W, H, r);
  ctx.lineTo(W, H - r);
  ctx.arcTo(W, H, W - r, H, r);
  ctx.lineTo(r, H);
  ctx.arcTo(0, H, 0, H - r, r);
  ctx.lineTo(0, r);
  ctx.arcTo(0, 0, r, 0, r);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = `#${textColor.getHexString()}`;
  ctx.font = `500 ${H * 0.36}px 'Geist', 'Inter', sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, W / 2, H / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const ALL_TOOLS = TOOLS;
const TOOL_COLORS_FB = ['#c64f17', '#5b6244', '#2c2a25', '#b0967a'];

function PillsFallback() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: 10, padding: 24, alignContent: 'center', justifyContent: 'center' }}>
      {ALL_TOOLS.map((t, i) => (
        <span key={t} style={{
          display: 'inline-flex', alignItems: 'center',
          background: TOOL_COLORS_FB[i % TOOL_COLORS_FB.length],
          color: '#f4f1ea', borderRadius: 999, padding: '7px 18px',
          fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>{t}</span>
      ))}
    </div>
  );
}

export default function TechPillsCanvas({ className = '' }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth, H = container.clientHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglFailed(true);
      return;
    }
    // Extra check: if context is null, three may not throw but still fail
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.z = 9;

    const pills: { mesh: THREE.Mesh; vel: THREE.Vector3; rotVel: THREE.Euler; phase: number }[] = [];

    TOOLS.forEach((label, i) => {
      const bg = PALETTE[i % PALETTE.length];
      const textColor = bg.equals(PAPER) ? INK : PAPER;
      const tex = makePillTexture(label, bg, textColor);

      const geo = new THREE.PlaneGeometry(2.6, 0.82, 1, 1);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat);

      const spread = 6;
      mesh.position.set(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 3
      );
      mesh.rotation.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.3
      );

      scene.add(mesh);
      pills.push({
        mesh,
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          0
        ),
        rotVel: new THREE.Euler(
          (Math.random() - 0.5) * 0.002,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.001
        ),
        phase: Math.random() * Math.PI * 2,
      });
    });

    let mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / H - 0.5) * 2;
    };
    container.addEventListener('mousemove', onMouse);

    let raf: number;
    let t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.008;

      pills.forEach((pill, i) => {
        const { mesh, vel, rotVel, phase } = pill;
        mesh.position.x += vel.x + mouse.x * 0.0008;
        mesh.position.y += vel.y + mouse.y * 0.0008;
        mesh.position.y += Math.sin(t + phase) * 0.0018;
        mesh.position.x += Math.cos(t * 0.7 + phase) * 0.0012;

        mesh.rotation.x += rotVel.x;
        mesh.rotation.y += rotVel.y;
        mesh.rotation.z += rotVel.z;

        const bound = 7.5;
        if (Math.abs(mesh.position.x) > bound) vel.x *= -1;
        if (Math.abs(mesh.position.y) > bound * 0.6) vel.y *= -1;
      });

      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.15 - camera.position.y) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const W2 = container.clientWidth, H2 = container.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  if (webglFailed) return <PillsFallback />;

  return <div ref={mountRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
