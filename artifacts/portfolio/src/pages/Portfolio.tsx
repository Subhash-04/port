import { useState, useEffect, useRef } from 'react';
import DecryptedText from '@/components/DecryptedText';
import InfiniteMenu, { InfiniteMenuItem } from '@/components/InfiniteMenu';
import TechPillsCanvas from '@/components/TechPillsCanvas';
import ErrorBoundary from '@/components/ErrorBoundary';
import Carousel, { CarouselItem } from '@/components/Carousel';

/* ─── DATA ─── */
const projects: InfiniteMenuItem[] = [
  { image: 'https://picsum.photos/seed/spardha/600/600', link: 'https://spardha2k25.vercel.app', title: 'Spardha 2025', description: 'Tech Fest · Website' },
  { image: 'https://picsum.photos/seed/dharani/600/600', link: 'https://dharani-printing-services-subhashmandalap.replit.app/', title: 'Dharani Printing', description: 'Full-Stack · SaaS' },
  { image: 'https://picsum.photos/seed/acmvvit/600/600', link: 'https://subhash-04.github.io/acm_vvit_landingpage-by-Subhash/', title: 'ACM VVIT', description: 'Interactive · Landing' },
  { image: 'https://picsum.photos/seed/qrgen/600/600', link: 'https://earnest-semifreddo-abdb5c.netlify.app/', title: 'QR Generator', description: 'Frontend · Tool' },
  { image: 'https://picsum.photos/seed/roborift/600/600', link: 'https://subhash-04.github.io/Robo-Rift/', title: 'Robo Rift', description: 'Interactive · Game' },
  { image: 'https://picsum.photos/seed/echotrap/600/600', link: 'https://subhash-04.github.io/Echo-Trap/', title: 'Echo Trap', description: 'Interactive · Game' },
];

const services = [
  { num: '01', title: 'Product Design', desc: 'End-to-end interface design — research, information architecture, and pixel-perfect polish.' },
  { num: '02', title: 'Frontend Engineering', desc: 'Production-grade React, TypeScript, accessibility, performance — code that ships and holds up.' },
  { num: '03', title: 'Brand & Identity', desc: 'Visual systems, typography, and motion that hold up consistently across every surface.' },
  { num: '04', title: 'Interactive 3D', desc: 'WebGL scenes, Three.js prototypes, and motion-rich landing pages that stop the scroll.' },
  { num: '05', title: 'AI-Augmented Builds', desc: 'Modern AI tooling woven into the workflow — shipping faster without losing an ounce of craft.' },
];

const testimonials = [
  { quote: 'Subhash ships the kind of work that just looks 10× considered. Calm, fast, and unbothered by hard requirements.', name: 'Aditya R.', role: 'Engineering Lead' },
  { quote: 'Rare combination of taste and craft. The site landed exactly the way the brief was written — and faster than expected.', name: 'Priya N.', role: 'Founder, Dharani' },
  { quote: 'Worked with a lot of designers. Few of them can also build it. Subhash can. And the result feels finished.', name: 'Krish M.', role: 'Tech Lead, ACM' },
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

function ProjectsFallback() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', overflow: 'hidden' }}>
      {projects.map((p, i) => (
        <a key={p.title} href={p.link} target="_blank" rel="noreferrer" style={{
          position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 24, textDecoration: 'none', overflow: 'hidden',
          backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 200,
          borderRight: i % 3 !== 2 ? '1px solid rgba(0,0,0,0.12)' : 'none',
          borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.12)' : 'none',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,23,0.85) 0%, transparent 60%)' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#f4f1ea', lineHeight: 1 }}>{p.title}</div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#f0a36c', marginTop: 4 }}>{p.description}</div>
          </div>
        </a>
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
function HeroPosterCard() {
  const [hovered, setHovered] = useState(false);
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
            backgroundImage: `url(https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80)`,
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
              PORTFOLIO ·<br />2025 / 26
            </div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,26,23,0.75)', textAlign: 'right', lineHeight: 1.7 }}>
              GUNTUR · IN<br />16.51° N · 80.65° E
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
              <Asterisk size={12} color="rgba(26,26,23,0.6)" /> EST · 2022
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
        Currently · Freelancing
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
      background: scrolled ? 'rgba(244,241,234,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
      transition: 'background 250ms ease, box-shadow 250ms ease',
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
function Hero() {
  return (
    <section id="top" style={{ position: 'relative', paddingTop: 120, paddingBottom: 80 }}>
      <div className="port-frame">
        <div className="hero-grid">
          {/* Left: text */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 999, padding: '8px 16px', fontSize: 13, color: '#2c2a25',
              marginBottom: 28, width: 'fit-content',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,0.18)', animation: 'portPulse 2.2s ease-in-out infinite', flexShrink: 0 }} />
              Open to work · Freelance & full-time
            </div>

            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.92, fontSize: 'clamp(52px, 7vw, 110px)', color: '#1a1a17', margin: 0 }}>
              <span style={{ color: '#c64f17', fontStyle: 'italic' }}>Subhash</span>—<br />
              a designer<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                who <span style={{ fontStyle: 'italic', color: '#c64f17' }}>builds.</span>
                <SunStar size={56} />
              </span>
            </h1>

            <p style={{ fontFamily: 'Geist, Inter, sans-serif', marginTop: 28, color: '#2c2a25', fontSize: 17, lineHeight: 1.65, maxWidth: 500 }}>
              Multidisciplinary designer & developer crafting digital experiences that blend cutting-edge tech with elegant design. Currently based in Guntur, India — available worldwide.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <a href="#work" className="port-btn-dark" style={{ fontSize: 15 }}>
                See selected work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </a>
              <a href="#contact" className="port-btn-ghost" style={{ fontSize: 15 }}>Get in touch</a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 44 }}>
              {[['20+', 'shipped projects'], ['3 yrs', 'design + code'], ['100%', 'AI-fluent']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: '#1a1a17', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: poster card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
            <HeroPosterCard />
          </div>
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
function About() {
  const tools = ['Figma', 'Framer', 'React', 'Next.js', 'TypeScript', 'Three.js', 'GSAP', 'Tailwind'];
  const companies = ['ACM VVIT', 'Dharani Print', 'Spardha 25', 'VVITU', 'Freelance'];

  const aboutText1 = "I'm a multidisciplinary designer and developer working on the intersection of aesthetics and engineering. I care about details — type, motion, the feel of a click — and the systems underneath that make them hold up at scale.";
  const aboutText2 = "I work across product design, front-end engineering, brand systems and interactive 3D. I've shipped 20+ projects spanning consumer applications, festival sites, productivity tools and small games.";

  return (
    <section id="about" style={{ padding: '96px 0' }}>
      <div className="port-frame" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
        <div>
          <div className="port-eyebrow" style={{ marginBottom: 20 }}>— About</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
            A short<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>introduction.</span>
          </h2>
          <div style={{
            marginTop: 40, borderRadius: 24, overflow: 'hidden', height: 260,
            border: '1px solid rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.48)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}>
            <ErrorBoundary fallback={<ToolsFallback />}>
              <TechPillsCanvas />
            </ErrorBoundary>
          </div>
        </div>
        <div style={{ paddingTop: 60 }}>
          <div style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 24, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText text={aboutText1} animateOn="view" sequential revealDirection="start" speed={18} className="port-decrypted-revealed" encryptedClassName="port-decrypted-encrypted" />
          </div>
          <div style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 32, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText text={aboutText2} animateOn="view" sequential revealDirection="start" speed={14} className="port-decrypted-revealed" encryptedClassName="port-decrypted-encrypted" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WORK ─── */
function Work() {
  return (
    <section id="work" style={{ padding: '96px 0', background: '#ebe6db' }}>
      <div className="port-frame">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
          <div>
            <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Selected Work</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 6vw, 80px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              Things I've <span style={{ fontStyle: 'italic', color: '#c64f17' }}>built</span><br />recently.
            </h2>
          </div>
          <a href="https://github.com/subhash-04" target="_blank" rel="noreferrer" className="port-btn-ghost" style={{ fontSize: 14 }}>
            View all on GitHub
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17L17 7" /><path d="M9 7h8v8" /></svg>
          </a>
        </div>
        <div style={{ height: 600, borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
          <ErrorBoundary fallback={<ProjectsFallback />}>
            <InfiniteMenu items={projects} scale={1.0} />
          </ErrorBoundary>
        </div>
        <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#6b6a63', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 20, textAlign: 'center' }}>
          Drag to explore · Click arrow to open project
        </p>
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
function ServiceRow({ s, delay }: { s: typeof services[0]; delay: number }) {
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
function Services() {
  const headRef = useRef<HTMLDivElement>(null);
  const headVisible = useScrollReveal(headRef as React.RefObject<HTMLElement>, 0.2);

  return (
    <section id="services" style={{ padding: '96px 0' }}>
      <div className="port-frame">
        {/* Header */}
        <div
          ref={headRef}
          style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            gap: 32, marginBottom: 12, flexWrap: 'wrap',
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <div>
            <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Services</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 5vw, 72px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              How I can<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>help.</span>
            </h2>
          </div>
          <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 16, lineHeight: 1.65, maxWidth: 340, margin: 0 }}>
            Full ownership from problem to shipped product — or an expert pair of hands on a focused engagement.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(0,0,0,0.1)', marginBottom: 0 }} />

        {/* Service rows */}
        {services.map((s, i) => (
          <ServiceRow key={s.num} s={s} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS (Carousel) ─── */
const testimonialCarouselItems: CarouselItem[] = testimonials.map((t, i) => ({
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

function Testimonials() {
  const headRef = useRef<HTMLDivElement>(null);
  const headVisible = useScrollReveal(headRef as React.RefObject<HTMLElement>, 0.15);

  return (
    <section style={{ padding: '96px 0', background: '#ebe6db' }}>
      <div className="port-frame">
        <div
          ref={headRef}
          style={{
            marginBottom: 48,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          <div className="port-eyebrow" style={{ marginBottom: 16 }}>— Kind words</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
            What people say<br />about <span style={{ fontStyle: 'italic', color: '#c64f17' }}>working with me.</span>
          </h2>
        </div>

        <Carousel
          items={testimonialCarouselItems}
          baseWidth={680}
          autoplay
          autoplayDelay={4500}
          pauseOnHover
          loop
        />
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
function Contact() {
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

  return (
    <section id="contact" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
      <div className="port-frame" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Asterisk size={28} />
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(52px, 9vw, 128px)', color: '#1a1a17', lineHeight: 0.9, marginTop: 16, marginBottom: 24 }}>
            Let's make<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>something good.</span>
          </h2>
          <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 18, maxWidth: 520, margin: '0 auto' }}>
            Open for freelance, partnerships, and the occasional weird experiment. I usually reply within 24 hours.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 6 }}>— Email</div>
              <a href="mailto:hello@subhash.dev" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(20px, 3vw, 36px)', color: '#1a1a17', textDecoration: 'none', transition: 'color 200ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c64f17')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1a1a17')}>hello@subhash.dev</a>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 6 }}>— Based in</div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#1a1a17' }}>Guntur, AP — IN</div>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Find me on</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[{ l: 'GitHub', href: 'https://github.com/subhash-04' }, { l: 'LinkedIn', href: '#' }, { l: 'Twitter', href: '#' }, { l: 'Dribbble', href: '#' }].map(s => (
                  <a key={s.l} href={s.href} target="_blank" rel="noreferrer" className="port-tag port-tag-hover">{s.l} →</a>
                ))}
              </div>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#ebe6db', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 999, padding: '8px 14px', fontSize: 13, color: '#2c2a25', width: 'fit-content' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,0.18)', animation: 'portPulse 2.2s ease-in-out infinite' }} />
              Available for new work — May 2026
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.62)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderRadius: 24,
            padding: 32,
            border: '1px solid rgba(255,255,255,0.78)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer style={{ background: '#1a1a17', color: '#f4f1ea', paddingTop: 80, paddingBottom: 40 }}>
      <div className="port-frame">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)', marginBottom: 12 }}>— Currently</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: '#f4f1ea' }}>Freelancing from Guntur, India. Available worldwide.</div>
          </div>
          <div>
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)', marginBottom: 12 }}>— Sitemap</div>
            <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', listStyle: 'none', margin: 0, padding: 0 }}>
              {[...navItems, { label: 'Email', href: 'mailto:hello@subhash.dev' }].map(it => (
                <li key={it.label}><a href={it.href} style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 15, color: 'rgba(244,241,234,0.7)', textDecoration: 'none', transition: 'color 200ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f4f1ea')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,241,234,0.7)')}
                >{it.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.05em', lineHeight: 0.85, fontSize: 'clamp(80px, 20vw, 320px)', color: '#f4f1ea' }}>
          Subhash<span style={{ color: '#c64f17' }}>.</span>
        </div>
        <div style={{ height: 1, background: 'rgba(244,241,234,0.18)', marginTop: 40 }} />
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 12, color: 'rgba(244,241,234,0.5)' }}>© 2026 Subhash Mandalapu. All rights reserved.</div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.5)' }}>Designed & built · Guntur, IN</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ─── */
export default function Portfolio() {
  return (
    <div style={{ background: '#f4f1ea', color: '#1a1a17', minHeight: '100vh', overflowX: 'hidden' }}>
      <Nav />
      <Hero />
      <CompaniesStrip />
      <About />
      <Work />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
