import { useEffect, useRef, useState } from 'react';

interface Trail {
  x: number;
  y: number;
  opacity: number;
  size: number;
}

interface CircularTrailProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  trailSize?: number;
  trailLength?: number;
}

export default function CircularTrail({
  children,
  className = '',
  color = '#c64f17',
  trailSize = 16,
  trailLength = 20,
}: CircularTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [trails, setTrails] = useState<Trail[]>([]);
  const posRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!mouseRef.current.active) return;
      posRef.current.unshift({ x: mouseRef.current.x, y: mouseRef.current.y });
      if (posRef.current.length > trailLength) posRef.current.length = trailLength;
      setTrails(
        posRef.current.map((p, i) => ({
          x: p.x,
          y: p.y,
          opacity: 1 - i / trailLength,
          size: trailSize * (1 - i / trailLength * 0.5),
        }))
      );
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [trailLength, trailSize]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ overflow: 'visible' }}>
      {trails.map((trail, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: trail.x - trail.size / 2,
            top: trail.y - trail.size / 2,
            width: trail.size,
            height: trail.size,
            borderRadius: '50%',
            background: color,
            opacity: trail.opacity * 0.7,
            pointerEvents: 'none',
            zIndex: 50,
            transform: `scale(${1 - i * 0.02})`,
            mixBlendMode: 'multiply',
          }}
        />
      ))}
      {children}
    </div>
  );
}
