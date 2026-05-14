import { useState, useEffect, useCallback } from 'react';

/* ─── TYPES ─── */
interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  siteUrl: string;
  category: string;
  displayOrder: number;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  displayOrder: number;
}

type ContentMap = Record<string, string>;

/* ─── API HELPERS ─── */
function apiHeaders(password: string) {
  return { 'Content-Type': 'application/json', 'X-Admin-Password': password };
}

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ─── GLASS STYLES ─── */
const glass = {
  background: 'rgba(255,255,255,0.62)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.8)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
} as React.CSSProperties;

const glassDark = {
  background: 'rgba(26,26,23,0.82)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
} as React.CSSProperties;

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Geist, Inter, sans-serif',
  fontSize: 14,
  color: '#1a1a17',
  background: 'rgba(244,241,234,0.7)',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 10,
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 200ms, background 200ms',
};

const btnAccent: React.CSSProperties = {
  background: '#c64f17',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '10px 20px',
  fontFamily: 'Geist, Inter, sans-serif',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
};

const btnGhost: React.CSSProperties = {
  background: 'rgba(0,0,0,0.06)',
  color: '#1a1a17',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 10,
  padding: '10px 20px',
  fontFamily: 'Geist, Inter, sans-serif',
  fontSize: 14,
  cursor: 'pointer',
};

const btnDanger: React.CSSProperties = {
  background: 'rgba(185,28,28,0.08)',
  color: '#b91c1c',
  border: '1px solid rgba(185,28,28,0.2)',
  borderRadius: 8,
  padding: '6px 12px',
  fontFamily: 'Geist, Inter, sans-serif',
  fontSize: 12,
  cursor: 'pointer',
};

/* ─── LABEL ─── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6a63', marginBottom: 6 }}>
      {children}
    </div>
  );
}

/* ─── PROJECT FORM ─── */
function ProjectForm({ initial, onSave, onCancel, password }: {
  initial?: Partial<Project>; onSave: (p: Project) => void;
  onCancel: () => void; password: string;
}) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    imageUrl: initial?.imageUrl || '',
    siteUrl: initial?.siteUrl || '',
    category: initial?.category || '',
    displayOrder: initial?.displayOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    try {
      const url = initial?.id ? `/api/projects/${initial.id}` : '/api/projects';
      const method = initial?.id ? 'PUT' : 'POST';
      const result = await apiFetch(url, { method, headers: apiHeaders(password), body: JSON.stringify(form) });
      onSave(result);
    } catch { setErr('Failed to save. Check your connection.'); }
    setSaving(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>Title *</Label><input value={form.title} onChange={set('title')} placeholder="Project name" style={inputStyle} /></div>
        <div><Label>Category</Label><input value={form.category} onChange={set('category')} placeholder="Frontend · Tool" style={inputStyle} /></div>
      </div>
      <div><Label>Description</Label>
        <textarea value={form.description} onChange={set('description')} rows={4} placeholder="What does this project do? What problem does it solve?" style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div><Label>Image URL</Label><input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." style={inputStyle} /></div>
      {form.imageUrl && (
        <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      )}
      <div><Label>Site URL</Label><input value={form.siteUrl} onChange={set('siteUrl')} placeholder="https://yourproject.com" style={inputStyle} /></div>
      <div><Label>Display Order</Label><input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: 100 }} /></div>
      {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={btnAccent} disabled={saving}>{saving ? 'Saving…' : initial?.id ? 'Update Project' : 'Add Project'}</button>
        <button type="button" style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ─── TESTIMONIAL FORM ─── */
function TestimonialForm({ initial, onSave, onCancel, password }: {
  initial?: Partial<Testimonial>; onSave: (t: Testimonial) => void;
  onCancel: () => void; password: string;
}) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    role: initial?.role || '',
    quote: initial?.quote || '',
    displayOrder: initial?.displayOrder ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) { setErr('Name and quote are required'); return; }
    setSaving(true); setErr('');
    try {
      const url = initial?.id ? `/api/testimonials/${initial.id}` : '/api/testimonials';
      const method = initial?.id ? 'PUT' : 'POST';
      const result = await apiFetch(url, { method, headers: apiHeaders(password), body: JSON.stringify(form) });
      onSave(result);
    } catch { setErr('Failed to save.'); }
    setSaving(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>Name *</Label><input value={form.name} onChange={set('name')} placeholder="Jane Doe" style={inputStyle} /></div>
        <div><Label>Role</Label><input value={form.role} onChange={set('role')} placeholder="Founder, Company" style={inputStyle} /></div>
      </div>
      <div><Label>Quote *</Label>
        <textarea value={form.quote} onChange={set('quote')} rows={4} placeholder="What did they say about you?" style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div><Label>Display Order</Label><input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: 100 }} /></div>
      {err && <div style={{ color: '#b91c1c', fontSize: 13 }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={btnAccent} disabled={saving}>{saving ? 'Saving…' : initial?.id ? 'Update' : 'Add Testimonial'}</button>
        <button type="button" style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ─── PROJECTS TAB ─── */
function ProjectsTab({ password }: { password: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProjects(await apiFetch('/api/projects')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await apiFetch(`/api/projects/${id}`, { method: 'DELETE', headers: apiHeaders(password) });
    setProjects(p => p.filter(x => x.id !== id));
  };

  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: 0 }}>Projects</h2>
        {!adding && !editing && (
          <button style={btnAccent} onClick={() => setAdding(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Project
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ ...glass, borderRadius: 18, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#1a1a17', margin: '0 0 20px' }}>
            {editing ? 'Edit Project' : 'New Project'}
          </h3>
          <ProjectForm
            initial={editing || undefined}
            password={password}
            onSave={(p) => { setProjects(prev => editing ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]); setEditing(null); setAdding(false); }}
            onCancel={() => { setEditing(null); setAdding(false); }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {projects.length === 0 && <div style={{ color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif', padding: 24, textAlign: 'center' }}>No projects yet. Add your first project above.</div>}
        {projects.map(p => (
          <div key={p.id} style={{ ...glass, borderRadius: 16, padding: '16px 20px', display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: '#ebe6db', flexShrink: 0 }}>
              {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <div>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#1a1a17', lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#6b6a63', letterSpacing: '0.1em', marginTop: 2 }}>{p.category || 'No category'} · Order #{p.displayOrder}</div>
              {p.description && <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, color: '#6b6a63', marginTop: 4, lineHeight: 1.4, maxWidth: 480 }}>{p.description.slice(0, 100)}{p.description.length > 100 ? '…' : ''}</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button style={{ ...btnGhost, padding: '6px 12px', fontSize: 12 }} onClick={() => { setEditing(p); setAdding(false); }}>Edit</button>
              <button style={btnDanger} onClick={() => remove(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── TESTIMONIALS TAB ─── */
function TestimonialsTab({ password }: { password: string }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setTestimonials(await apiFetch('/api/testimonials')); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: apiHeaders(password) });
    setTestimonials(t => t.filter(x => x.id !== id));
  };

  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: 0 }}>Testimonials</h2>
        {!adding && !editing && (
          <button style={btnAccent} onClick={() => setAdding(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            Add Testimonial
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div style={{ ...glass, borderRadius: 18, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#1a1a17', margin: '0 0 20px' }}>
            {editing ? 'Edit Testimonial' : 'New Testimonial'}
          </h3>
          <TestimonialForm
            initial={editing || undefined}
            password={password}
            onSave={(t) => { setTestimonials(prev => editing ? prev.map(x => x.id === t.id ? t : x) : [...prev, t]); setEditing(null); setAdding(false); }}
            onCancel={() => { setEditing(null); setAdding(false); }}
          />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {testimonials.length === 0 && <div style={{ color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif', padding: 24, textAlign: 'center' }}>No testimonials yet.</div>}
        {testimonials.map(t => (
          <div key={t.id} style={{ ...glass, borderRadius: 16, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: '#c64f17', marginBottom: 8 }}>"</div>
                <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#2c2a25', fontSize: 15, lineHeight: 1.6, margin: '0 0 14px' }}>{t.quote}</p>
                <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, fontWeight: 600, color: '#1a1a17' }}>{t.name}</div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: '#6b6a63', letterSpacing: '0.1em' }}>{t.role}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button style={{ ...btnGhost, padding: '6px 12px', fontSize: 12 }} onClick={() => { setEditing(t); setAdding(false); }}>Edit</button>
                <button style={btnDanger} onClick={() => remove(t.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CONTENT TAB ─── */
const CONTENT_KEYS = [
  { key: 'hero_badge', label: 'Hero Badge Text', hint: 'e.g. Open to work · Freelance & full-time' },
  { key: 'hero_tagline', label: 'Hero Tagline', hint: 'Short paragraph below the headline' },
  { key: 'about_p1', label: 'About — Paragraph 1', hint: 'First paragraph of introduction', multiline: true },
  { key: 'about_p2', label: 'About — Paragraph 2', hint: 'Second paragraph', multiline: true },
  { key: 'contact_email', label: 'Contact Email', hint: 'hello@yourname.dev' },
  { key: 'contact_location', label: 'Location', hint: 'City, State — Country' },
  { key: 'contact_available', label: 'Availability Status', hint: 'e.g. Available for new work — May 2026' },
];

function ContentTab({ password }: { password: string }) {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/content').then(setContent).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    try {
      await apiFetch(`/api/content/${key}`, { method: 'PUT', headers: apiHeaders(password), body: JSON.stringify({ value }) });
      setContent(c => ({ ...c, [key]: value }));
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch {}
    setSaving(null);
  };

  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;

  return (
    <div>
      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: '0 0 8px' }}>Site Content</h2>
      <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 14, margin: '0 0 28px' }}>Edit the text content of your portfolio. Changes are saved immediately.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {CONTENT_KEYS.map(({ key, label, hint, multiline }) => {
          const val = content[key] ?? '';
          return (
            <div key={key} style={{ ...glass, borderRadius: 16, padding: '20px 24px' }}>
              <Label>{label}</Label>
              <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 12, margin: '0 0 10px' }}>{hint}</p>
              <ContentField
                value={val}
                multiline={multiline}
                onSave={(v) => save(key, v)}
                saving={saving === key}
                saved={saved === key}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentField({ value, multiline, onSave, saving, saved }: {
  value: string; multiline?: boolean;
  onSave: (v: string) => void; saving: boolean; saved: boolean;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);

  const changed = draft !== value;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <div style={{ flex: 1 }}>
        {multiline
          ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          : <input value={draft} onChange={e => setDraft(e.target.value)} style={inputStyle} />
        }
      </div>
      <button
        style={{ ...btnAccent, opacity: !changed && !saved ? 0.4 : 1, transition: 'opacity 200ms', background: saved ? '#15803d' : '#c64f17', flexShrink: 0 }}
        disabled={saving || !changed}
        onClick={() => onSave(draft)}
      >
        {saving ? '…' : saved ? '✓' : 'Save'}
      </button>
    </div>
  );
}

/* ─── LOGIN SCREEN ─── */
function Login({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        sessionStorage.setItem('admin_pw', pw);
        onLogin(pw);
      } else {
        setErr('Wrong password. Try again.');
      }
    } catch { setErr('Could not reach server. Is the API running?'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f1ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...glass, borderRadius: 24, padding: 48, width: '100%', maxWidth: 400 }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: '#1a1a17', lineHeight: 1, marginBottom: 4 }}>
          Subhash<span style={{ color: '#c64f17' }}>.</span>
        </div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6a63', marginBottom: 36 }}>Admin Panel</div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <Label>Password</Label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter admin password"
              style={inputStyle}
              autoFocus
            />
          </div>
          {err && <div style={{ color: '#b91c1c', fontSize: 13, fontFamily: 'Geist, Inter, sans-serif' }}>{err}</div>}
          <button type="submit" style={{ ...btnAccent, justifyContent: 'center', padding: '12px 24px' }} disabled={loading}>
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
        <a href="/" style={{ display: 'block', marginTop: 24, textAlign: 'center', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, color: '#6b6a63', textDecoration: 'none' }}>
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─── */
const TABS = [
  { id: 'projects', label: 'Projects', icon: '◈' },
  { id: 'testimonials', label: 'Testimonials', icon: '◎' },
  { id: 'content', label: 'Content', icon: '≡' },
];

function Dashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [tab, setTab] = useState('projects');

  return (
    <div style={{ minHeight: '100vh', background: '#f4f1ea', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: 220, flexShrink: 0, ...glassDark, padding: '32px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: '#f4f1ea', lineHeight: 1 }}>
            Subhash<span style={{ color: '#c64f17' }}>.</span>
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(244,241,234,0.4)', marginTop: 4 }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                padding: '12px 24px', background: tab === t.id ? 'rgba(198,79,23,0.15)' : 'transparent',
                border: 'none', borderLeft: `3px solid ${tab === t.id ? '#c64f17' : 'transparent'}`,
                color: tab === t.id ? '#f4f1ea' : 'rgba(244,241,234,0.5)',
                fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, cursor: 'pointer',
                transition: 'all 200ms ease', textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '0 16px' }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
            background: 'rgba(255,255,255,0.06)', borderRadius: 10, marginBottom: 10,
            color: 'rgba(244,241,234,0.6)', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13,
            textDecoration: 'none', transition: 'background 200ms',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            View Site
          </a>
          <button onClick={onLogout} style={{
            width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: 10, color: 'rgba(244,241,234,0.5)',
            fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, cursor: 'pointer', textAlign: 'left',
          }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '48px 56px', overflowY: 'auto' }}>
        {tab === 'projects' && <ProjectsTab password={password} />}
        {tab === 'testimonials' && <TestimonialsTab password={password} />}
        {tab === 'content' && <ContentTab password={password} />}
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function AdminPanel() {
  const [password, setPassword] = useState<string | null>(() => sessionStorage.getItem('admin_pw'));

  const logout = () => { sessionStorage.removeItem('admin_pw'); setPassword(null); };

  if (!password) return <Login onLogin={setPassword} />;
  return <Dashboard password={password} onLogout={logout} />;
}
