import { useState, useEffect, useRef } from 'react';
import PixelCard from '@/components/PixelCard';
import DecryptedText from '@/components/DecryptedText';
import BorderGlow from '@/components/BorderGlow';
import CircularTrail from '@/components/CircularTrail';
import InfiniteMenu, { InfiniteMenuItem } from '@/components/InfiniteMenu';
import TechPillsCanvas from '@/components/TechPillsCanvas';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  { num: '01', title: 'Product Design', desc: 'End-to-end interface design — research, IA, and polish.' },
  { num: '02', title: 'Frontend Engineering', desc: 'Production-grade React, TypeScript, accessibility, performance.' },
  { num: '03', title: 'Brand & Identity', desc: 'Visual systems, typography, and motion that hold up across surfaces.' },
  { num: '04', title: 'Interactive 3D', desc: 'WebGL scenes, Three.js prototypes, and motion-rich landing pages.' },
  { num: '05', title: 'AI-Augmented Builds', desc: 'Modern AI tooling to ship faster without losing craft.' },
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

/* ─── HERO CARD DATA ─── */
const heroCards = [
  { title: 'Designer', subtitle: 'Interface & brand systems', accent: '#c64f17', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80' },
  { title: 'Developer', subtitle: 'React · Three.js · Node', accent: '#5b6244', image: 'https://images.unsplash.com/photo-1555066931-4365d14431b9?w=400&q=80' },
  { title: 'Builder', subtitle: '20+ shipped projects', accent: '#2c2a25', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80' },
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
          color: '#f4f1ea', borderRadius: 999,
          padding: '7px 18px',
          fontFamily: "'Geist Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          animation: `portFloat${i % 3} ${3 + (i % 3) * 0.7}s ease-in-out infinite`,
          animationDelay: `${(i * 0.22) % 2}s`,
        }}>{t}</span>
      ))}
    </div>
  );
}

function ProjectsFallback() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, overflow: 'hidden' }}>
      {projects.map((p, i) => (
        <a key={p.title} href={p.link} target="_blank" rel="noreferrer" style={{
          position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 24, textDecoration: 'none', overflow: 'hidden',
          backgroundImage: `url(${p.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
          minHeight: 200,
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
function Asterisk({ size = 18, color = '#c64f17' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" /><line x1="3" y1="12" x2="21" y2="12" />
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" /><line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
    </svg>
  );
}

function SunStar({ size = 120 }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} style={{ animation: 'slowSpin 24s linear infinite', transformOrigin: '50% 50%' }}>
      <g fill="#1a1a17">
        <circle cx="60" cy="60" r="14" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 60 + Math.cos(a) * 22, y1 = 60 + Math.sin(a) * 22;
          const x2 = 60 + Math.cos(a) * 56, y2 = 60 + Math.sin(a) * 56;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1a1a17" strokeWidth="4" strokeLinecap="round" />;
        })}
      </g>
    </svg>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(244,241,234,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
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

        <nav style={{ display: 'none' }} className="port-desktop-nav">
          <ul style={{ display: 'flex', alignItems: 'center', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}>
            {navItems.map(it => (
              <li key={it.label}>
                <a href={it.href} className="port-nav-link">{it.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="#contact" className="port-btn-dark" style={{ fontSize: 14 }}>
            Let's talk
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 17L17 7" /><path d="M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section id="top" style={{ position: 'relative', paddingTop: 140, paddingBottom: 100 }}>
      <div className="port-frame">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, alignItems: 'start' }}>

          {/* Left: text */}
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#ebe6db', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 999, padding: '8px 14px', fontSize: 13, color: '#2c2a25', marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 0 4px rgba(22,163,74,0.18)', animation: 'portPulse 2.2s ease-in-out infinite' }} />
              Open to work · Freelance & full-time
            </div>

            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.95, fontSize: 'clamp(52px, 9vw, 128px)', color: '#1a1a17', margin: 0 }}>
              Hey, I'm <span style={{ fontStyle: 'italic', color: '#c64f17' }}>Subhash</span>—<br />
              a designer<br />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                who <span style={{ fontStyle: 'italic', color: '#c64f17' }}>builds.</span>
                <SunStar size={64} />
              </span>
            </h1>

            <p style={{ fontFamily: 'Geist, Inter, sans-serif', marginTop: 28, color: '#2c2a25', fontSize: 18, lineHeight: 1.65, maxWidth: 560 }}>
              Multidisciplinary designer & developer crafting digital experiences that blend cutting-edge tech with elegant design. Currently based in Guntur, India — available worldwide.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
              <a href="#work" className="port-btn-dark" style={{ fontSize: 15 }}>
                See selected work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
              </a>
              <a href="#contact" className="port-btn-ghost" style={{ fontSize: 15 }}>Get in touch</a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 48, alignItems: 'center' }}>
              {[['20+', 'shipped projects'], ['3 yrs', 'design + code'], ['100%', 'AI-fluent workflow']].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 40, color: '#1a1a17', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero cards with PixelCard */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {heroCards.map((card) => (
              <PixelCard
                key={card.title}
                variant="warm"
                colors={`#f4f1ea,${card.accent},#d9c9b0`}
                className="port-hero-card"
                style={{ width: 200, height: 260 }}
              >
                {/* Default state: text, Z=2 above pixel canvas */}
                <div className="port-hero-card-default" style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20,
                  transition: 'opacity 0.35s ease',
                }}>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', lineHeight: 1 }}>{card.title}</div>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 6 }}>{card.subtitle}</div>
                </div>
                {/* Hover state: image, also Z=2 */}
                <div className="port-hero-card-hover" style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  opacity: 0, transition: 'opacity 0.35s ease',
                  borderRadius: 'inherit',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, background: `linear-gradient(to top, ${card.accent}cc 0%, transparent 50%)`,
                    borderRadius: 'inherit',
                  }} />
                  <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                    <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: '#f4f1ea', lineHeight: 1 }}>{card.title}</div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.8)', marginTop: 4 }}>{card.subtitle}</div>
                  </div>
                </div>
              </PixelCard>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div style={{ marginTop: 80, overflow: 'hidden', borderTop: '1px solid rgba(0,0,0,0.12)', borderBottom: '1px solid rgba(0,0,0,0.12)', padding: '12px 0' }}>
          <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', gap: 64, animation: 'portMarquee 38s linear infinite' }}>
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 5vw, 60px)', color: '#1a1a17' }}>Available for new projects</span>
                <Asterisk size={24} />
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 5vw, 60px)' }}><span style={{ color: '#c64f17', fontStyle: 'italic' }}>Design</span> · build · ship</span>
                <Asterisk size={24} />
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 5vw, 60px)', color: '#1a1a17' }}>Selected work below</span>
                <Asterisk size={24} />
                <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 5vw, 60px)' }}><span style={{ color: '#c64f17', fontStyle: 'italic' }}>Hello,</span> nice to meet you</span>
                <Asterisk size={24} />
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
        {/* Left */}
        <div>
          <div className="port-eyebrow" style={{ marginBottom: 20 }}>— About</div>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
            A short<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>introduction.</span>
          </h2>

          {/* Three.js 3D pills for tools */}
          <div style={{ marginTop: 40, borderRadius: 24, overflow: 'hidden', height: 260, border: '1px solid rgba(0,0,0,0.08)', background: '#ebe6db' }}>
            <ErrorBoundary fallback={<ToolsFallback />}>
              <TechPillsCanvas />
            </ErrorBoundary>
          </div>
        </div>

        {/* Right: DecryptedText paragraphs */}
        <div style={{ paddingTop: 60 }}>
          <div style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 24, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText
              text={aboutText1}
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={18}
              className="port-decrypted-revealed"
              encryptedClassName="port-decrypted-encrypted"
            />
          </div>
          <div style={{ color: '#2c2a25', fontSize: 18, lineHeight: 1.7, marginBottom: 32, fontFamily: 'Geist, Inter, sans-serif' }}>
            <DecryptedText
              text={aboutText2}
              animateOn="view"
              sequential={true}
              revealDirection="start"
              speed={14}
              className="port-decrypted-revealed"
              encryptedClassName="port-decrypted-encrypted"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Worked with</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {companies.map(c => <span key={c} className="port-tag">{c}</span>)}
              </div>
            </div>
            <div>
              <div className="port-eyebrow" style={{ marginBottom: 10 }}>— Tools of trade</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {tools.map(t => <span key={t} className="port-tag">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── WORK (InfiniteMenu) ─── */
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

        {/* InfiniteMenu */}
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

/* ─── SERVICES (BorderGlow cards) ─── */
function Services() {
  return (
    <section id="services" style={{ padding: '96px 0' }}>
      <div className="port-frame">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div className="port-eyebrow" style={{ marginBottom: 20 }}>— Services</div>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(40px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: 0 }}>
              How I can<br /><span style={{ fontStyle: 'italic', color: '#c64f17' }}>help.</span>
            </h2>
            <p style={{ fontFamily: 'Geist, Inter, sans-serif', marginTop: 24, color: '#2c2a25', fontSize: 17, lineHeight: 1.6, maxWidth: 300 }}>
              Full ownership from problem to shipped product — or an extra pair of expert hands on a focused engagement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {services.map((s, i) => (
              <BorderGlow
                key={s.num}
                backgroundColor="#1a1a17"
                glowColor={i % 2 === 0 ? '22 78 38' : '198 79 23'}
                colors={i % 2 === 0 ? ['#4ade80', '#22c55e', '#16a34a'] : ['#f0a36c', '#c64f17', '#ea6c20']}
                borderRadius={20}
                glowRadius={30}
                glowIntensity={1.2}
                edgeSensitivity={25}
                animated={i === 0}
                className="port-service-card"
              >
                <div style={{ padding: '28px 24px', minHeight: 160 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: '#6b6a63', letterSpacing: '0.15em', marginBottom: 12 }}>{s.num}</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 26, color: '#f4f1ea', lineHeight: 1.1, marginBottom: 12 }}>{s.title}</div>
                  <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, color: 'rgba(244,241,234,0.7)', lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS (CircularTrail) ─── */
function Testimonials() {
  return (
    <section style={{ padding: '96px 0', background: '#ebe6db' }}>
      <div className="port-frame">
        <div className="port-eyebrow" style={{ marginBottom: 20 }}>— Kind words</div>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontSize: 'clamp(36px, 5vw, 64px)', color: '#1a1a17', lineHeight: 0.95, margin: '0 0 48px' }}>
          What people say<br />about <span style={{ fontStyle: 'italic', color: '#c64f17' }}>working with me.</span>
        </h2>

        <CircularTrail color="#c64f17" trailSize={20} trailLength={18}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} style={{
                background: '#f4f1ea', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 24, padding: 32,
                transition: 'transform 280ms ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, color: '#c64f17', lineHeight: 1 }}>"</div>
                <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 15, lineHeight: 1.65, margin: '8px 0 0' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #d9c9b0 0%, #b0967a 100%)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: "'Instrument Serif', serif", fontSize: 18, color: '#1a1a17',
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, fontWeight: 500, color: '#1a1a17' }}>{t.name}</div>
                    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6b6a63' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CircularTrail>
      </div>
    </section>
  );
}

/* ─── CONTACT ─── */
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

/* ─── LETS MAKE SOMETHING (animated CTA) ─── */
function Contact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
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
        const colors = [
          ['rgba(198,79,23,0.14)', 'rgba(198,79,23,0)'],
          ['rgba(91,98,68,0.12)', 'rgba(91,98,68,0)'],
          ['rgba(240,163,108,0.1)', 'rgba(240,163,108,0)'],
        ];
        const [c1, c2] = colors[i % colors.length];
        grad.addColorStop(0, c1); grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(rx, ry, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Floating asterisk-like particles
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + t * 0.15;
        const r = W * 0.35 + Math.sin(t * 0.8 + i * 0.7) * W * 0.05;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r * 0.5;
        const size2 = 2 + Math.sin(t + i) * 1.2;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(198,79,23,0.5)' : 'rgba(26,26,23,0.2)';
        ctx.beginPath();
        ctx.arc(x, y, size2, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section id="contact" style={{ padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Animated canvas background */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      <div className="port-frame" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <Asterisk size={28} />
          <h2 style={{
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontSize: 'clamp(52px, 9vw, 128px)', color: '#1a1a17', lineHeight: 0.9, marginTop: 16, marginBottom: 24,
          }}>
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
              <a href="mailto:hello@subhash.dev" style={{
                fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(20px, 3vw, 36px)', color: '#1a1a17',
                textDecoration: 'none', transition: 'color 200ms ease',
              }}
                onMouseEnter={e => (e.currentTarget.style.color = '#c64f17')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1a1a17')}
              >hello@subhash.dev</a>
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

          <div style={{ background: '#f4f1ea', borderRadius: 24, padding: 32, border: '1px solid rgba(0,0,0,0.06)' }}>
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

/* ─── REVEAL HOOK ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.port-reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── APP ─── */
export default function Portfolio() {
  useReveal();
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
