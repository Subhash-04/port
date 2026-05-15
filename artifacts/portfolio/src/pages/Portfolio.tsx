import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import DecryptedText from '@/components/DecryptedText';
import InfiniteMenu, { InfiniteMenuItem } from '@/components/InfiniteMenu';
import TechPillsCanvas from '@/components/TechPillsCanvas';
import ErrorBoundary from '@/components/ErrorBoundary';
import Carousel, { CarouselItem } from '@/components/Carousel';

/* ─── ANIMATION PRESETS ─── */
const VP = { once: true, amount: 0.15 } as const;
const T  = { duration: 0.75, ease: [0.22, 1, 0.36, 1] } as const;
const Tfast = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

const fadeUp   = { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } };
const fadeIn   = { hidden: { opacity: 0 },          visible: { opacity: 1 } };
const slideL   = { hidden: { opacity: 0, x: -48 }, visible: { opacity: 1, x: 0 } };
const slideR   = { hidden: { opacity: 0, x: 48 },  visible: { opacity: 1, x: 0 } };
const scaleUp  = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } };

function Stagger({ children, delay = 0, gap = 0.1, className, style }: {
  children: React.ReactNode; delay?: number; gap?: number;
  className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, VP);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Reveal({ children, variant = fadeUp, delay = 0, style, className }: {
  children: React.ReactNode; variant?: typeof fadeUp; delay?: number;
  style?: React.CSSProperties; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, VP);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variant}
      transition={{ ...T, delay }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── API TYPES ─── */
interface CmsProject {
  id: number; title: string; description: string;
  imageUrl: string; siteUrl: string; category: string; displayOrder: number;
}
interface CmsTestimonial {
  id: number; name: string; role: string; quote: string; displayOrder: number;
}
type ContentMap = Record<string, string>;

/* ─── CMS HELPER ─── */
function cms(content: ContentMap | undefined, key: string, fallback: string): string {
  if (!content) return fallback;
  return content[key]?.trim() || fallback;
}

/* ─── DEFAULT DATA (shown before API loads) ─── */
const DEFAULT_PROJECTS: CmsProject[] = [
  { id: 0, title: 'Spardha 2025', description: 'Tech Fest · Website', imageUrl: 'https://picsum.photos/seed/spardha/800/600', siteUrl: 'https://spardha2k25.vercel.app', category: 'Tech Fest · Website', displayOrder: 0 },
  { id: 1, title: 'Dharani Prints', description: 'Full-Stack · SaaS', imageUrl: 'https://picsum.photos/seed/dharani/800/600', siteUrl: 'https://dharani-printing-services-subhashmandalap.replit.app/', category: 'Full-Stack · SaaS', displayOrder: 1 },
  { id: 2, title: 'ACM VVITU', description: 'Interactive · Landing', imageUrl: 'https://picsum.photos/seed/acmvvit/800/600', siteUrl: 'https://subhash-04.github.io/acm_vvit_landingpage-by-Subhash/', category: 'Interactive · Landing', displayOrder: 2 },
  { id: 3, title: 'QR Generator', description: 'Frontend · Tool', imageUrl: 'https://picsum.photos/seed/qrgen/800/600', siteUrl: 'https://earnest-semifreddo-abdb5c.netlify.app/', category: 'Frontend · Tool', displayOrder: 3 },
  { id: 4, title: 'Robo Rift', description: 'Interactive · Game', imageUrl: 'https://picsum.photos/seed/roborift/800/600', siteUrl: 'https://subhash-04.github.io/Robo-Rift/', category: 'Interactive · Game', displayOrder: 4 },
  { id: 5, title: 'Echo Trap', description: 'Interactive · Game', imageUrl: 'https://picsum.photos/seed/echotrap/800/600', siteUrl: 'https://subhash-04.github.io/Echo-Trap/', category: 'Interactive · Game', displayOrder: 5 },
];
const DEFAULT_TESTIMONIALS: CmsTestimonial[] = [
  { id: 0, quote: 'Subhash ships the kind of work that just looks 10× considered. Calm, fast, and unbothered by hard requirements.', name: 'Aditya R.', role: 'Engineering Lead', displayOrder: 0 },
  { id: 1, quote: 'Rare combination of taste and craft. The site landed exactly the way the brief was written — and faster than expected.', name: 'Priya N.', role: 'Founder, Dharani', displayOrder: 1 },
  { id: 2, quote: 'Worked with a lot of designers. Few of them can also build it. Subhash can. And the result feels finished.', name: 'Krish M.', role: 'Tech Lead, ACM', displayOrder: 2 },
];

/* ─── DEFAULT SERVICES ─── */
const DEFAULT_SERVICES = [
  { num: '01', title: 'Product Design', desc: 'End-to-end interface design — research, information architecture, and pixel-perfect polish.' },
  { num: '02', title: 'Frontend Engineering', desc: 'Production-grade React, TypeScript, accessibility, performance — code that ships and holds up.' },
  { num: '03', title: 'Brand & Identity', desc: 'Visual systems, typography, and motion that hold up consistently across every surface.' },
  { num: '04', title: 'Interactive 3D', desc: 'WebGL scenes, Three.js prototypes, and motion-rich landing pages that stop the scroll.' },
  { num: '05', title: 'AI-Augmented Builds', desc: 'Modern AI tooling woven into the workflow — shipping faster without losing an ounce of craft.' },
];


const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

/* ─── WEBGL FALLBACKS ─── */
const ALL_TOOLS = ['Figma', 'Framer', 'React', 'Next.js', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind', 'Node', 'Postgres', 'Cursor', 'Blender', 'WebGL', 'Motion'];
const TOOL_COLORS = ['#c64f17', '#5b6244', '#2c2a25', '#b0967a', '#c64f17', '#5b6244', '#2c2a25', '#b0967a'];

function ToolsFallback() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexWrap: 'wrap', gap: 10, padding: 24, alignContent: 'center', justifyContent: 'center' }}>
      {ALL_TOOLS.map((t, i) => (
        <span key={t} style={{
          display: 'inline-flex', alignItems: 'center',
          background: TOOL_COLORS[i % TOOL_COLORS.length],
          color: '#f4f1ea', borderRadius: 999, padding: '7px 18px',
          fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        }}>{t}</span>
      ))}
    </div>
  );
}

/* ─── PROJECT MODAL ─── */
function ProjectModal({ project, onClose }: { project: CmsProject; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(6,5,4,0.88)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 52, scale: 0.93 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(255,252,248,0.94) 0%, rgba(244,241,234,0.90) 100%)',
          backdropFilter: 'blur(56px) saturate(180%)',
          WebkitBackdropFilter: 'blur(56px) saturate(180%)',
          borderRadius: 32, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.88)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(255,220,180,0.25), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.03)',
          maxWidth: 880, width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          maxHeight: '90vh',
        }}
      >
        {/* Warm shimmer overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 40%)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Left: image */}
        <div style={{ position: 'relative', minHeight: 340, overflow: 'hidden', background: '#1a1a17', zIndex: 2 }}>
          {project.imageUrl && (
            <img src={project.imageUrl} alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,23,0.45) 0%, transparent 55%)' }} />
          <div style={{
            position: 'absolute', top: 18, left: 18,
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 999, padding: '5px 14px',
            border: '1px solid rgba(255,255,255,0.9)',
            fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: '#c64f17',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}>{project.category}</div>
        </div>

        {/* Right: content */}
        <div style={{ padding: '40px 36px 36px', display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 22 }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(26px, 3.5vw, 42px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              {project.title}
            </h2>
            <button onClick={onClose} style={{
              flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.09)',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
              color: '#6b6a63', transition: 'background 200ms',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          {project.description && (
            <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#3a3832', fontSize: 15, lineHeight: 1.78, margin: '0 0 30px', flex: 1 }}>
              {project.description}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
            {project.siteUrl && (
              <a href={project.siteUrl} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #c64f17 0%, #d45a1b 100%)',
                color: '#fff', borderRadius: 14,
                padding: '13px 24px', fontFamily: 'Geist, Inter, sans-serif',
                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(198,79,23,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}>
                Visit Site
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17L17 7"/><path d="M9 7h8v8"/></svg>
              </a>
            )}
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#9a9890', letterSpacing: '0.12em', textAlign: 'center' }}>
              ESC to close
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectsFallback({ projects, onProjectClick }: { projects: CmsProject[]; onProjectClick: (p: CmsProject) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', overflow: 'hidden' }}>
      {projects.map((p, i) => (
        <div
          key={p.id ?? p.title}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            overflow: 'hidden', minHeight: 200, cursor: 'pointer',
            backgroundImage: `url(${p.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center',
            borderRight: i % 3 !== 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none',
            transition: 'transform 400ms cubic-bezier(.2,.7,.2,1)',
            transform: hovered === i ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: hovered === i
              ? 'linear-gradient(to top, rgba(26,26,23,0.95) 0%, rgba(26,26,23,0.3) 60%, transparent 100%)'
              : 'linear-gradient(to top, rgba(26,26,23,0.8) 0%, transparent 55%)',
            transition: 'background 350ms ease',
          }} />
          <div style={{ position: 'relative', zIndex: 1, padding: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#f4f1ea', lineHeight: 1 }}>{p.title}</div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f0a36c', marginTop: 4 }}>{p.category}</div>
            </div>
            {/* Arrow button */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: hovered === i ? 1 : 0,
              transform: hovered === i ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 300ms ease, transform 300ms ease',
            }}>
              <button
                onClick={() => onProjectClick(p)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 999, padding: '7px 16px',
                  color: '#f4f1ea', fontFamily: 'Geist, Inter, sans-serif',
                  fontSize: 12, cursor: 'pointer', transition: 'background 200ms',
                }}
              >
                View Project
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7"/><path d="M9 7h8v8"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── ORNAMENT ─── */
function Asterisk({ size = 18, color = '#c64f17' }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" /><line x1="3" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" /><line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
    </svg>
  );
}

function SunStar({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ animation: 'slowSpin 24s linear infinite', transformOrigin: '50% 50%', flexShrink: 0 }}>
      <circle cx="60" cy="60" r="14" fill="#1a1a17" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={60 + Math.cos(a) * 22} y1={60 + Math.sin(a) * 22} x2={60 + Math.cos(a) * 56} y2={60 + Math.sin(a) * 56} stroke="#1a1a17" strokeWidth="4" strokeLinecap="round" />;
      })}
    </svg>
  );
}

/* ─── HERO POSTER CARD ─── */
function HeroPosterCard({ content }: { content: ContentMap }) {
  const [hovered, setHovered] = useState(false);
  const photoUrl = cms(content, 'hero_photo_url', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80');
  const posterYear = cms(content, 'hero_poster_year', '2025 / 26');
  const posterLocation = cms(content, 'hero_poster_location', 'GUNTUR · IN');
  const posterCoords = cms(content, 'hero_poster_coords', '16.51° N · 80.65° E');
  const posterEst = cms(content, 'hero_poster_est', 'EST · 2022');
  const heroAvailability = cms(content, 'hero_availability', 'Currently · Freelancing');
  return (
    <div
      className="hero-card-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto' }}
    >
      <div className="photo-frame">
        <div className="photo-grid" />
        {/* Hover photo layer */}
        <div
          className="photo-hover-layer"
          style={{
            opacity: hovered ? 1 : 0,
            backgroundImage: `url(${photoUrl})`,
          }}
        >
          <div className="photo-hover-overlay" />
          <div className="photo-hover-tag">Subhash Mandalapu</div>
        </div>
        {/* Poster content overlay */}
        <div style={{
          position: 'absolute', inset: 0, padding: 24, zIndex: 4,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          opacity: hovered ? 0 : 1, transition: 'opacity 380ms ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,23,0.75)', lineHeight: 1.7 }}>
              PORTFOLIO ·<br />{posterYear}
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,23,0.75)', textAlign: 'right', lineHeight: 1.7 }}>
              {posterLocation}<br />{posterCoords}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", color: '#1a1a17', fontSize: 'clamp(56px, 9vw, 88px)', lineHeight: 0.85 }}>
              Subhash
            </div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#c64f17', fontSize: 'clamp(32px, 5.5vw, 48px)', lineHeight: 1, marginTop: 6 }}>
              Mandalapu
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,23,0.75)', lineHeight: 1.7 }}>
              DESIGN ·<br />DEVELOPMENT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,23,0.75)' }}>
              <Asterisk size={12} color="rgba(26,26,23,0.6)" /> {posterEst}
            </div>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <div style={{
        position: 'absolute', bottom: -22, left: -22,
        background: 'rgba(26,26,23,0.95)', color: '#f4f1ea',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 999, padding: '11px 20px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        zIndex: 10,
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 3px rgba(22,163,74,0.22)', flexShrink: 0, animation: 'portPulse 2.2s ease-in-out infinite' }} />
        {heroAvailability}
      </div>
      {/* Asterisk ornament */}
      <div style={{ position: 'absolute', top: -20, right: -12, zIndex: 10 }}>
        <Asterisk size={36} color="#c64f17" />
      </div>
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(244,241,234,0.85)' : 'rgba(244,241,234,0.5)',
      backdropFilter: scrolled ? 'blur(36px) saturate(180%)' : 'blur(12px) saturate(140%)',
      WebkitBackdropFilter: scrolled ? 'blur(36px) saturate(180%)' : 'blur(12px) saturate(140%)',
      borderBottom: '1px solid rgba(255,255,255,0.72)',
      boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.05), 0 6px 32px rgba(0,0,0,0.06)' : '0 1px 0 rgba(0,0,0,0.03)',
      transition: 'background 300ms ease, box-shadow 300ms ease, backdrop-filter 300ms ease',
    }}>
      <div className="port-frame" style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #d9c9b0 0%, #b0967a 100%)',
            display: 'grid', placeItems: 'center',
            fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#1a1a17',
            border: '2px solid rgba(244,241,234,0.6)',
          }}>S</div>
          <div>
            <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontWeight: 500, fontSize: 15, color: '#1a1a17' }}>Subhash Mandalapu</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#6b6a63', letterSpacing: '0.1em' }}>designer · developer</div>
          </div>
        </a>
        <nav className="port-desktop-nav">
          <ul style={{ display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map(it => <li key={it.label}><a href={it.href} className="port-nav-link">{it.label}</a></li>)}
          </ul>
        </nav>
        <a href="#contact" className="port-btn-dark" style={{ fontSize: 14 }}>
          Let's talk
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 17L17 7" /><path d="M9 7h8v8" />
          </svg>
        </a>
      </div>
    </header>
  );
}

/* ─── HERO ─── */
function Hero({ content }: { content: ContentMap }) {
  const badge = cms(content, 'hero_badge', 'Open to work · Freelance & full-time');
  const tagline = cms(content, 'hero_tagline', 'Multidisciplinary designer & developer crafting digital experiences that blend cutting-edge tech with elegant design. Currently based in Guntur, India — available worldwide.');
  const stat1num = cms(content, 'hero_stat_1_num', '20+');
  const stat1label = cms(content, 'hero_stat_1_label', 'shipped projects');
  const stat2num = cms(content, 'hero_stat_2_num', '3 yrs');
  const stat2label = cms(content, 'hero_stat_2_label', 'design + code');
  const stat3num = cms(content, 'hero_stat_3_num', '100%');
  const stat3label = cms(content, 'hero_stat_3_label', 'AI-fluent');
  return (
    <section id="top" style={{ position: 'relative', paddingTop: 120, paddingBottom: 80 }}>
      <div className="port-frame">
        <div className="hero-grid">
          {/* Left: text — staggered entrance */}
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
          >
            <motion.div variants={fadeUp} transition={T} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 999, padding: '8px 16px', fontSize: 13, color: '#2c2a25',
              marginBottom: 28, width: 'fit-content',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,0.18)', animation: 'portPulse 2.2s ease-in-out infinite', flexShrink: 0 }} />
              {badge}
            </motion.div>

            <motion.h1 variants={fadeUp} transition={T} style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.95, fontSize: 'clamp(52px, 7vw, 110px)', color: '#1a1a17', margin: 0 }}>
              Hey, I'm<br />
              <span style={{ color: '#c64f17', fontStyle: 'italic' }}>Subhash</span>—<br />
              a designer<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                who <span style={{ fontStyle: 'italic', color: '#c64f17' }}>builds.</span>
                <SunStar size={56} />
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} transition={T} style={{ fontFamily: 'Geist, Inter, sans-serif', marginTop: 28, color: '#2c2a25', fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}>
              {tagline}
            </motion.p>

            <motion.div variants={fadeUp} transition={T} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <a href="#work" className="port-btn-dark" style={{ fontSize: 15 }}>
                See selected work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </a>
              <a href="#contact" className="port-btn-ghost" style={{ fontSize: 15 }}>Get in touch</a>
            </motion.div>

            <motion.div variants={fadeUp} transition={T} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 44 }}>
              {[[stat1num, stat1label], [stat2num, stat2label], [stat3num, stat3label]].map(([num, label]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.62)',
                  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  borderRadius: 16, padding: '14px 20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
                }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: '#1a1a17', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: poster card — slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...T, delay: 0.35 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}
          >
            <HeroPosterCard content={content} />
          </motion.div>
        </div>

        {/* Marquee */}
        <div style={{ marginTop: 72, overflow: 'hidden', borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)', padding: '12px 0' }}>
          <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: 64, animation: 'portMarquee 38s linear infinite' }}>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
                {[
                  ['Available for new projects', false], ['Design · build · ship', true],
                  ['Selected work below', false], ['Hello, nice to meet you', true],
                ].map(([text, accent], j) => (
                  <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(28px, 4vw, 54px)', color: accent ? '#c64f17' : '#1a1a17', fontStyle: accent ? 'italic' : 'normal' }}>{text as string}</span>
                    <Asterisk size={20} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ─── */
function About({ content }: { content: ContentMap }) {
  const rawTools = cms(content, 'about_tools', 'Figma,Framer,React,Next.js,TypeScript,Three.js,GSAP,Tailwind');
  const rawCompanies = cms(content, 'about_companies', 'ACM VVIT,Dharani Print,Spardha 25,VVITU,Freelance');
  const tools = rawTools.split(',').map(s => s.trim()).filter(Boolean);
  const companies = rawCompanies.split(',').map(s => s.trim()).filter(Boolean);

  const aboutText1 = cms(content, 'about_p1', "I'm a multidisciplinary designer and developer working on the intersection of aesthetics and engineering. I care about details — type, motion, the feel of a click — and the systems underneath that make them hold up at scale.");
  const aboutText2 = cms(content, 'about_p2', "I work across product design, front-end engineering, brand systems and interactive 3D. I've shipped 20+ projects spanning consumer applications, festival sites, productivity tools and small games.");
  const aboutHeading = cms(content, 'about_heading', 'introduction.');

  return (
    <section id="about" style={{ padding: '96px 0' }}>
      <div className="port-frame" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        {/* Left: sticky heading slides in from left */}
        <Reveal variant={slideL}>
          <div style={{ position: 'sticky', top: 120 }}>
            <div className="port-eyebrow" style={{ marginBottom: 20 }}>— About</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              A short<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>{aboutHeading}</span>
            </h2>
          </div>
        </Reveal>

        {/* Right: staggered content fades up */}
        <Stagger style={{ paddingTop: 60 }} delay={0.1} gap={0.15}>
          <motion.div variants={fadeUp} transition={T} style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 24, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText text={aboutText1} animateOn="view" sequential revealDirection="start" speed={18} className="port-decrypted-revealed" encryptedClassName="port-decrypted-encrypted" />
          </motion.div>
          <motion.div variants={fadeUp} transition={T} style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 32, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText text={aboutText2} animateOn="view" sequential revealDirection="start" speed={14} className="port-decrypted-revealed" encryptedClassName="port-decrypted-encrypted" />
          </motion.div>
          <motion.div variants={fadeUp} transition={T} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Worked with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {companies.map(c => <span key={c} className="port-tag-glass">{c}</span>)}
              </div>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Tools of trade</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tools.map(t => <span key={t} className="port-tag-glass">{t}</span>)}
              </div>
            </div>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}

/* ─── WORK ─── */
function Work({ projects, onProjectClick, content }: { projects: CmsProject[]; onProjectClick: (p: CmsProject) => void; content: ContentMap }) {
  const workHeading = cms(content, 'work_heading', "Things I've built recently.");
  const workGithub = cms(content, 'work_github_url', 'https://github.com/subhash-04');

  const menuItems: InfiniteMenuItem[] = projects.map(p => ({
    image: p.imageUrl,
    link: p.siteUrl,
    title: p.title,
    description: p.category,
  }));

  const handleMenuClick = (item: InfiniteMenuItem) => {
    const project = projects.find(p => p.title === item.title);
    if (project) onProjectClick(project);
  };

  return (
    <section id="work" style={{ padding: '96px 0', background: '#ebe6db' }}>
      <div className="port-frame">
        <Stagger style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
          <motion.div variants={fadeUp} transition={T}>
            <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Selected Work</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 6vw, 80px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              {workHeading.split('\n').map((line, i) => <span key={i}>{line}{i < workHeading.split('\n').length - 1 && <br />}</span>)}
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ ...T, delay: 0.15 }}>
            <a href={workGithub} target="_blank" rel="noreferrer" className="port-btn-ghost" style={{ fontSize: 14 }}>
              View all on GitHub
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7" /><path d="M9 7h8v8" /></svg>
            </a>
          </motion.div>
        </Stagger>
        <Reveal variant={scaleUp} delay={0.1}>
          <div style={{ height: 600, borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}>
            <ErrorBoundary fallback={<ProjectsFallback projects={projects} onProjectClick={onProjectClick} />}>
              <InfiniteMenu items={menuItems} scale={1.0} onItemClick={handleMenuClick} />
            </ErrorBoundary>
          </div>
        </Reveal>
        <Reveal variant={fadeIn} delay={0.2}>
          <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#6b6a63', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 20, textAlign: 'center' }}>
            Hover to explore · Click arrow to view project details
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── COMPANIES STRIP ─── */
function CompaniesStrip() {
  const companies = ['ACM VVIT', 'Dharani Printing', 'Spardha', 'VVIT University', 'Independent / Freelance', 'Open Source'];
  return (
    <section style={{ padding: '64px 0' }}>
      <div className="port-frame" style={{ marginBottom: 24 }}>
        <div className="port-eyebrow" style={{ textAlign: 'center' }}>— Collaborations & affiliations</div>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: 64, animation: 'portMarquee 42s linear infinite' }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
              {companies.map(c => (
                <span key={`${k}-${c}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
                  <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(28px, 4vw, 50px)', color: 'rgba(26,26,23,0.7)' }}>{c}</span>
                  <Asterisk size={18} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── USE SCROLL REVEAL ─── */
function useScrollReveal(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ─── SERVICE ROW (glass card) ─── */
function ServiceRow({ s, delay }: { s: typeof DEFAULT_SERVICES[0]; delay: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const visible = useScrollReveal(rowRef as React.RefObject<HTMLElement>, 0.2);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '72px 1fr auto',
        alignItems: 'center',
        gap: 24,
        padding: hovered ? '28px 20px' : '28px 8px',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(.2,.7,.2,1) ${delay}ms, padding 350ms ease, background 350ms ease, border-radius 350ms ease, box-shadow 350ms ease, border-color 350ms ease`,
        position: 'relative',
        borderRadius: hovered ? 20 : 0,
        background: hovered ? 'rgba(255,255,255,0.62)' : 'transparent',
        backdropFilter: hovered ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: hovered ? 'blur(20px)' : 'none',
        borderTop: hovered ? '1px solid rgba(255,255,255,0.8)' : '1px solid transparent',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)' : 'none',
        marginLeft: hovered ? -8 : 0,
        marginRight: hovered ? -8 : 0,
      }}
    >
      {/* Number */}
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        color: hovered ? '#c64f17' : '#6b6a63',
        letterSpacing: '0.12em',
        transition: 'color 300ms ease',
      }}>{s.num}</div>

      {/* Title + desc */}
      <div style={{ transform: hovered ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 350ms cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(24px, 3vw, 40px)',
          color: '#1a1a17',
          lineHeight: 1,
          marginBottom: 6,
        }}>{s.title}</div>
        <div style={{
          fontFamily: 'Geist, Inter, sans-serif',
          fontSize: 14,
          color: '#6b6a63',
          lineHeight: 1.5,
          maxWidth: 420,
          opacity: hovered ? 1 : 0.55,
          transition: 'opacity 300ms ease',
        }}>{s.desc}</div>
      </div>

      {/* Arrow */}
      <div style={{
        width: 44, height: 44,
        borderRadius: '50%',
        border: `1px solid ${hovered ? '#c64f17' : 'rgba(0,0,0,0.12)'}`,
        background: hovered ? 'rgba(198,79,23,0.06)' : 'transparent',
        display: 'grid', placeItems: 'center',
        color: hovered ? '#c64f17' : 'rgba(0,0,0,0.3)',
        transform: hovered ? 'rotate(45deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        transition: 'transform 350ms cubic-bezier(.2,.7,.2,1), border-color 300ms ease, color 300ms ease, background 300ms ease',
        flexShrink: 0,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M7 17L17 7" /><path d="M9 7h8v8" />
        </svg>
      </div>
    </div>
  );
}

/* ─── SERVICES ─── */
function Services({ content }: { content: ContentMap }) {
  const servicesHeading = cms(content, 'services_heading', 'help.');
  const servicesSubtext = cms(content, 'services_subtext', 'Full ownership from problem to shipped product — or an extra pair of expert hands on a focused engagement.');
  const services = DEFAULT_SERVICES.map((s, i) => ({
    ...s,
    title: cms(content, `service_${i + 1}_title`, s.title),
    desc: cms(content, `service_${i + 1}_desc`, s.desc),
  }));

  return (
    <section id="services" style={{ padding: '96px 0' }}>
      <div className="port-frame">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
          {/* Left: heading block slides in from left, sticky */}
          <Reveal variant={slideL}>
            <div style={{ position: 'sticky', top: 120 }}>
              <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Services</div>
              <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: '0 0 20px' }}>
                How I can<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>{servicesHeading}</span>
              </h2>
              <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                {servicesSubtext}
              </p>
            </div>
          </Reveal>

          {/* Right: service rows stagger in */}
          <div>
            {services.map((s, i) => (
              <ServiceRow key={s.num} s={s} delay={i * 80} />
            ))}
            <div style={{ height: 1, background: 'rgba(0,0,0,0.08)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS (Carousel) ─── */
function buildCarouselItems(testimonials: CmsTestimonial[]): CarouselItem[] {
  return testimonials.map((t, i) => ({
    id: i,
    content: (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 0 }}>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 64, color: '#c64f17', lineHeight: 0.8, marginBottom: 12 }}>"</div>
          <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 16, lineHeight: 1.7, margin: 0 }}>{t.quote}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 32 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #d9c9b0 0%, #b0967a 100%)',
            display: 'grid', placeItems: 'center',
            fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#1a1a17',
          }}>{t.name[0]}</div>
          <div>
            <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 15, fontWeight: 600, color: '#1a1a17' }}>{t.name}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 2 }}>{t.role}</div>
          </div>
        </div>
      </div>
    ),
  }));
}

function Testimonials({ testimonials }: { testimonials: CmsTestimonial[] }) {
  const carouselItems = buildCarouselItems(testimonials);
  return (
    <section style={{ padding: '96px 0', background: '#ebe6db' }}>
      <div className="port-frame">
        <Reveal variant={fadeUp} style={{ marginBottom: 48 }}>
          <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Kind words</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
            What people say<br />about <span style={{ fontStyle: 'italic', color: '#c64f17' }}>working with me.</span>
          </h2>
        </Reveal>

        <Reveal variant={scaleUp} delay={0.1}>
          <Carousel
            items={carouselItems}
            baseWidth={680}
            autoplay
            autoplayDelay={4500}
            pauseOnHover
            loop
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── CONTACT FORM ─── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState({ sending: false, sent: false, error: '' });
  const onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState({ sending: false, sent: false, error: '' });
    if (!form.name.trim() || form.name.trim().length < 2) return setState(s => ({ ...s, error: 'Please enter your name.' }));
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setState(s => ({ ...s, error: 'Please enter a valid email.' }));
    if (!form.message.trim() || form.message.trim().length < 10) return setState(s => ({ ...s, error: 'Tell me a little more (min 10 chars).' }));
    setState({ sending: true, sent: false, error: '' });
    setTimeout(() => { setState({ sending: false, sent: true, error: '' }); setForm({ name: '', email: '', message: '' }); }, 1100);
  };
  const inputStyle: React.CSSProperties = {
    fontFamily: 'Geist, Inter, sans-serif', width: '100%', borderRadius: 12, padding: '12px 16px', fontSize: 15,
    background: '#ebe6db', border: '1px solid rgba(0,0,0,0.1)', color: '#1a1a17', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 200ms ease',
  };
  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div className="port-eyebrow" style={{ marginBottom: 8 }}>— Name</div>
          <input type="text" value={form.name} onChange={onChange('name')} placeholder="Jane Doe" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#1a1a17'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = '#ebe6db'; }} />
        </div>
        <div>
          <div className="port-eyebrow" style={{ marginBottom: 8 }}>— Email</div>
          <input type="email" value={form.email} onChange={onChange('email')} placeholder="you@studio.com" style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#1a1a17'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = '#ebe6db'; }} />
        </div>
      </div>
      <div>
        <div className="port-eyebrow" style={{ marginBottom: 8 }}>— Tell me about your project</div>
        <textarea rows={6} value={form.message} onChange={onChange('message')} placeholder="Timeline, scope, goals — anything that helps."
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={e => { e.target.style.borderColor = '#1a1a17'; e.target.style.background = '#fff'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.background = '#ebe6db'; }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13, minHeight: 20 }}>
          {state.error && <span style={{ color: '#b91c1c' }}>{state.error}</span>}
          {state.sent && <span style={{ color: '#15803d' }}>Sent — I'll reply within 24 hours.</span>}
        </div>
        <button type="submit" disabled={state.sending} className="port-btn-dark" style={{ fontSize: 15, opacity: state.sending ? 0.6 : 1 }}>
          {state.sending ? 'Sending…' : 'Send message'}
          {!state.sending && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>}
        </button>
      </div>
    </form>
  );
}

/* ─── CONTACT CTA ─── */
function Contact({ content }: { content: ContentMap }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      raf = requestAnimationFrame(draw);
      t += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + t * (i % 2 === 0 ? 0.3 : -0.2);
        const rx = cx + Math.cos(angle) * (W * 0.28);
        const ry = cy + Math.sin(angle) * (H * 0.3);
        const size = 120 + Math.sin(t * 1.5 + i) * 40;
        const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, size);
        const colors: [string, string][] = [
          ['rgba(198,79,23,0.14)', 'rgba(198,79,23,0)'],
          ['rgba(91,98,68,0.12)', 'rgba(91,98,68,0)'],
          ['rgba(240,163,108,0.1)', 'rgba(240,163,108,0)'],
        ];
        const [c1, c2] = colors[i % colors.length];
        grad.addColorStop(0, c1); grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(rx, ry, size, 0, Math.PI * 2); ctx.fill();
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const contactHeading = cms(content, 'contact_heading', 'something good.');
  const contactSubtext = cms(content, 'contact_subtext', 'Open for freelance, partnerships, and the occasional weird experiment. I usually reply within 24 hours.');
  const contactEmail = cms(content, 'contact_email', 'hello@subhash.dev');
  const contactLocation = cms(content, 'contact_location', 'Guntur, AP — IN');
  const contactAvailable = cms(content, 'contact_available', 'Available for new work — May 2026');
  const contactGithub = cms(content, 'contact_github', 'https://github.com/subhash-04');
  const contactLinkedin = cms(content, 'contact_linkedin', '#');
  const contactTwitter = cms(content, 'contact_twitter', '#');
  const contactDribbble = cms(content, 'contact_dribbble', '#');

  return (
    <section id="contact" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      <div className="port-frame" style={{ position: 'relative', zIndex: 1 }}>
        <Stagger style={{ textAlign: 'center', marginBottom: 64 }} gap={0.15}>
          <motion.div variants={fadeIn} transition={Tfast}>
            <Asterisk size={28} />
          </motion.div>
          <motion.h2 variants={fadeUp} transition={T} style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(52px, 9vw, 128px)', color: '#1a1a17', lineHeight: 0.9, marginTop: 16, marginBottom: 24 }}>
            Let's make<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>{contactHeading}</span>
          </motion.h2>
          <motion.p variants={fadeUp} transition={T} style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 18, maxWidth: 520, margin: '0 auto' }}>
            {contactSubtext}
          </motion.p>
        </Stagger>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 48 }}>
          <Reveal variant={slideL} style={{
            display: 'flex', flexDirection: 'column', gap: 24,
            background: 'rgba(255,255,255,0.52)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.82)', borderRadius: 24, padding: 28,
            boxShadow: '0 8px 40px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 6 }}>— Email</div>
              <a href={`mailto:${contactEmail}`} style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(18px, 2.5vw, 32px)', color: '#1a1a17', textDecoration: 'none', transition: 'color 200ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c64f17')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1a1a17')}>{contactEmail}</a>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 6 }}>— Based in</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#1a1a17' }}>{contactLocation}</div>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Find me on</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[{ l: 'GitHub', href: contactGithub }, { l: 'LinkedIn', href: contactLinkedin }, { l: 'Twitter', href: contactTwitter }, { l: 'Dribbble', href: contactDribbble }].map(s => (
                  <a key={s.l} href={s.href} target="_blank" rel="noreferrer" className="port-tag port-tag-hover">{s.l} →</a>
                ))}
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: 999, padding: '8px 14px', fontSize: 13, color: '#2c2a25', width: 'fit-content', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,0.18)', animation: 'portPulse 2.2s ease-in-out infinite' }} />
              {contactAvailable}
            </div>
          </Reveal>
          <Reveal variant={slideR} delay={0.1} style={{
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: 24,
            padding: 32,
            border: '1px solid rgba(255,255,255,0.78)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer({ content }: { content: ContentMap }) {
  const footerTagline = cms(content, 'footer_tagline', 'Freelancing from Guntur, India. Available worldwide.');
  const footerEmail = cms(content, 'contact_email', 'hello@subhash.dev');

  return (
    <footer style={{ background: '#1a1a17', color: '#f4f1ea', paddingTop: 80, paddingBottom: 40 }}>
      <div className="port-frame">
        <Stagger style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }} gap={0.12}>
          <motion.div variants={slideL} transition={T}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)', marginBottom: 12 }}>— Currently</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: '#f4f1ea' }}>{footerTagline}</div>
          </motion.div>
          <motion.div variants={slideR} transition={T}>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)', marginBottom: 12 }}>— Sitemap</div>
            <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', listStyle: 'none', margin: 0, padding: 0 }}>
              {[...navItems, { label: 'Email', href: `mailto:${footerEmail}` }].map(it => (
                <li key={it.label}><a href={it.href} style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 15, color: 'rgba(244,241,234,0.7)', textDecoration: 'none', transition: 'color 200ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f4f1ea')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,241,234,0.7)')}
                >{it.label}</a></li>
              ))}
            </ul>
          </motion.div>
        </Stagger>
        <Reveal variant={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.05em', lineHeight: 0.85, fontSize: 'clamp(80px, 20vw, 320px)', color: '#f4f1ea' }}>
            Subhash<span style={{ color: '#c64f17' }}>.</span>
          </div>
        </Reveal>
        <div style={{ height: 1, background: 'rgba(244,241,234,0.18)', marginTop: 40 }} />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 12, color: 'rgba(244,241,234,0.5)' }}>{cms(content, 'footer_copyright', '© 2026 Subhash Mandalapu. All rights reserved.')}</div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)' }}>{cms(content, 'footer_built_by', 'Designed & built · Guntur, IN')}</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function Portfolio() {
  const [projects, setProjects] = useState<CmsProject[]>(DEFAULT_PROJECTS);
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>(DEFAULT_TESTIMONIALS);
  const [content, setContent] = useState<ContentMap>({});
  const [modalProject, setModalProject] = useState<CmsProject | null>(null);

  useEffect(() => {
    fetch('/api/works')
      .then(r => r.json())
      .then((data: CmsProject[]) => { if (Array.isArray(data) && data.length > 0) setProjects(data); })
      .catch(() => {});
    fetch('/api/testimonials')
      .then(r => r.json())
      .then((data: CmsTestimonial[]) => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
      .catch(() => {});
    fetch('/api/sections')
      .then(r => r.json())
      .then((data: ContentMap) => { if (data && typeof data === 'object') setContent(data); })
      .catch(() => {});

    // Analytics tracking
    fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'pageview' }) }).catch(() => {});
    const milestones = new Set<string>();
    const sections = ['about', 'work', 'services', 'testimonials', 'contact'];
    const handleScroll = () => {
      const scrollPct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight) * 100;
      sections.forEach((s, i) => {
        const threshold = (i + 1) * (100 / (sections.length + 1));
        if (scrollPct >= threshold && !milestones.has(s)) {
          milestones.add(s);
          fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'section_view', section: s }) }).catch(() => {});
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#f4f1ea', color: '#1a1a17', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />
      <Hero content={content} />
      <CompaniesStrip />
      <About content={content} />
      <Work projects={projects} onProjectClick={setModalProject} content={content} />
      <Services content={content} />
      <Testimonials testimonials={testimonials} />
      <Contact content={content} />
      <Footer content={content} />
      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
    </div>
  );
}
