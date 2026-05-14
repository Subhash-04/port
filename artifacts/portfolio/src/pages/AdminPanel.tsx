import { useState, useEffect, useCallback, useRef } from 'react';

/* ─── TYPES ─── */
interface Work { id: number; title: string; description: string; imageUrl: string; siteUrl: string; category: string; displayOrder: number; }
interface Testimonial { id: number; name: string; role: string; quote: string; displayOrder: number; }
type ContentMap = Record<string, string>;
type Step = 'password' | 'otp' | 'dashboard';
type Tab = 'works' | 'testimonials' | 'content' | 'password';

const SESSION_KEY = 'admin_session_token';

/* ─── API HELPERS ─── */
function getToken() { return localStorage.getItem(SESSION_KEY) ?? ''; }

function apiHeaders(token?: string) {
  const t = token ?? getToken();
  return { 'Content-Type': 'application/json', 'X-Admin-Token': t };
}

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ─── CLAY / GLASS STYLE CONSTANTS ─── */
const BG = 'linear-gradient(135deg, #f4f1ea 0%, #ebe6db 50%, #e3ddd0 100%)';

const clay: React.CSSProperties = {
  background: 'linear-gradient(145deg, #ffffff 0%, #faf8f4 100%)',
  borderRadius: 28,
  boxShadow: '0 20px 60px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.08), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.05)',
  border: '1px solid rgba(255,255,255,0.9)',
};

const claySmall: React.CSSProperties = {
  background: 'linear-gradient(145deg, #ffffff 0%, #faf8f4 100%)',
  borderRadius: 18,
  boxShadow: '0 8px 28px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
  border: '1px solid rgba(255,255,255,0.85)',
};

const glass: React.CSSProperties = {
  background: 'rgba(255,255,255,0.62)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.8)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
  borderRadius: 18,
};

const inputStyle: React.CSSProperties = {
  width: '100%', fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, color: '#1a1a17',
  background: 'rgba(244,241,234,0.8)', border: '1.5px solid rgba(0,0,0,0.10)',
  borderRadius: 12, padding: '11px 14px', outline: 'none', boxSizing: 'border-box',
  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
  transition: 'border-color 200ms, box-shadow 200ms',
};

const btnAccent: React.CSSProperties = {
  background: 'linear-gradient(145deg, #d45a1b, #c64f17)',
  color: '#fff', border: 'none', borderRadius: 12, padding: '11px 22px',
  fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 7,
  boxShadow: '0 8px 24px rgba(198,79,23,0.30), 0 2px 8px rgba(198,79,23,0.15), inset 0 1px 0 rgba(255,255,255,0.22)',
  transition: 'transform 150ms, box-shadow 150ms',
};

const btnGhost: React.CSSProperties = {
  background: 'rgba(0,0,0,0.05)', color: '#1a1a17',
  border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 12, padding: '11px 22px',
  fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, cursor: 'pointer',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
};

const btnDanger: React.CSSProperties = {
  background: 'rgba(185,28,28,0.07)', color: '#b91c1c',
  border: '1px solid rgba(185,28,28,0.18)', borderRadius: 10,
  padding: '6px 12px', fontFamily: 'Geist, Inter, sans-serif', fontSize: 12, cursor: 'pointer',
};

/* ─── LABEL ─── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6a63', marginBottom: 6 }}>
      {children}
    </div>
  );
}

/* ─── LOGO ─── */
function Logo({ size = 28 }: { size?: number }) {
  return (
    <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: size, color: '#1a1a17', letterSpacing: '-0.02em' }}>
      Subhash<span style={{ color: '#c64f17' }}>.</span>
    </span>
  );
}

/* ─── STEP INDICATOR ─── */
function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ['password', 'otp'];
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
      {steps.map((s, i) => (
        <div key={s} style={{
          width: step === s ? 24 : 8, height: 8, borderRadius: 99,
          background: step === s ? '#c64f17' : (steps.indexOf(step) > i ? '#c64f1766' : 'rgba(0,0,0,0.12)'),
          transition: 'all 300ms ease',
        }} />
      ))}
    </div>
  );
}

/* ─── LOGIN STEP ─── */
function LoginStep({ onSuccess }: { onSuccess: (devOtp?: string) => void }) {
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [show, setShow] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) return;
    setLoading(true); setErr('');
    try {
      const data = await apiFetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      }) as { step: string; devMode?: boolean; devOtp?: string };
      onSuccess(data.devOtp);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg.includes('401') || msg.includes('Incorrect') ? 'Incorrect password' : 'Something went wrong. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Floating orbs */}
        <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(198,79,23,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '15%', right: '8%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,98,68,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <form onSubmit={submit} style={{ ...clay, padding: '44px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size={32} />
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 4 }}>
              Admin Panel
            </div>
          </div>

          <StepDots step="password" />

          <div style={{ marginBottom: 14 }}>
            <Label>Password</Label>
            <div style={{ position: 'relative' }}>
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password"
                style={{ ...inputStyle, paddingRight: 44 }}
                autoFocus
              />
              <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b6a63', padding: 2 }}>
                {show
                  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          {err && (
            <div style={{ background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.18)', borderRadius: 10, padding: '10px 14px', color: '#b91c1c', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, marginBottom: 14 }}>
              {err}
            </div>
          )}

          <button type="submit" style={{ ...btnAccent, width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                Verifying…
              </>
            ) : (
              <>
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/" style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, color: '#6b6a63', textDecoration: 'none' }}>← Back to portfolio</a>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── OTP STEP ─── */
function OtpStep({ devOtp, onSuccess, onBack }: { devOtp?: string; onSuccess: (token: string) => void; onBack: () => void }) {
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const verify = useCallback(async (code: string) => {
    setLoading(true); setErr('');
    try {
      const data = await apiFetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code }),
      }) as { token: string };
      onSuccess(data.token);
    } catch {
      setErr('Invalid or expired OTP. Please try again.');
      setDigits(Array(6).fill(''));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
    setLoading(false);
  }, [onSuccess]);

  const handleDigit = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const nd = [...digits];
    nd[idx] = val.slice(-1);
    setDigits(nd);
    if (val && idx < 5) setTimeout(() => inputRefs.current[idx + 1]?.focus(), 10);
    if (nd.every(d => d !== '') && nd.join('').length === 6) verify(nd.join(''));
  };

  const handleKey = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setDigits(text.split(''));
      setTimeout(() => verify(text), 50);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(198,79,23,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ ...clay, padding: '44px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Logo size={32} />
            <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 4 }}>
              Admin Panel
            </div>
          </div>

          <StepDots step="otp" />

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#1a1a17', marginBottom: 8 }}>Check your phone</div>
            <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, color: '#6b6a63', lineHeight: 1.5 }}>
              We sent a 6-digit code to <strong>+91 9014470659</strong>
            </div>
          </div>

          {devOtp && (
            <div style={{ background: 'rgba(91,98,68,0.08)', border: '1px solid rgba(91,98,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: '#5b6244', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Dev mode — OTP</div>
              <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 24, color: '#1a1a17', letterSpacing: '0.3em', fontWeight: 700 }}>{devOtp}</div>
              <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 11, color: '#6b6a63', marginTop: 4 }}>Set FAST2SMS_API_KEY to send real SMS</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }} onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleDigit(i, e.target.value)}
                onKeyDown={e => handleKey(i, e)}
                autoFocus={i === 0}
                style={{
                  width: 46, height: 56, textAlign: 'center', fontSize: 22, fontFamily: "'Geist Mono', monospace", fontWeight: 700,
                  color: '#1a1a17', background: d ? 'rgba(198,79,23,0.07)' : 'rgba(244,241,234,0.9)',
                  border: d ? '2px solid rgba(198,79,23,0.4)' : '1.5px solid rgba(0,0,0,0.10)',
                  borderRadius: 14, outline: 'none', boxSizing: 'border-box',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 150ms ease',
                }}
              />
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, color: '#6b6a63', marginBottom: 12 }}>
              Verifying…
            </div>
          )}

          {err && (
            <div style={{ background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.18)', borderRadius: 10, padding: '10px 14px', color: '#b91c1c', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
              {err}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, color: '#6b6a63' }}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── WORK FORM ─── */
function WorkForm({ initial, onSave, onCancel }: { initial?: Partial<Work>; onSave: (p: Work) => void; onCancel: () => void; }) {
  const [form, setForm] = useState({ title: initial?.title || '', description: initial?.description || '', imageUrl: initial?.imageUrl || '', siteUrl: initial?.siteUrl || '', category: initial?.category || '', displayOrder: initial?.displayOrder ?? 0 });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    try {
      const url = initial?.id ? `/api/works/${initial.id}` : '/api/works';
      const result = await apiFetch(url, { method: initial?.id ? 'PUT' : 'POST', headers: apiHeaders(), body: JSON.stringify(form) });
      onSave(result);
    } catch { setErr('Failed to save.'); }
    setSaving(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>Title *</Label><input value={form.title} onChange={set('title')} placeholder="Work title" style={inputStyle} /></div>
        <div><Label>Category</Label><input value={form.category} onChange={set('category')} placeholder="Frontend · Tool" style={inputStyle} /></div>
      </div>
      <div><Label>Description</Label><textarea value={form.description} onChange={set('description')} rows={4} placeholder="What does this project do?" style={{ ...inputStyle, resize: 'vertical' }} /></div>
      <div><Label>Image URL</Label><input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." style={inputStyle} /></div>
      {form.imageUrl && <div style={{ width: '100%', height: 160, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}><img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
      <div><Label>Site URL</Label><input value={form.siteUrl} onChange={set('siteUrl')} placeholder="https://yourproject.com" style={inputStyle} /></div>
      <div><Label>Display Order</Label><input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: 100 }} /></div>
      {err && <div style={{ color: '#b91c1c', fontSize: 13, fontFamily: 'Geist, Inter, sans-serif' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={btnAccent} disabled={saving}>{saving ? 'Saving…' : initial?.id ? 'Update Work' : 'Add Work'}</button>
        <button type="button" style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ─── TESTIMONIAL FORM ─── */
function TestimonialForm({ initial, onSave, onCancel }: { initial?: Partial<Testimonial>; onSave: (t: Testimonial) => void; onCancel: () => void; }) {
  const [form, setForm] = useState({ name: initial?.name || '', role: initial?.role || '', quote: initial?.quote || '', displayOrder: initial?.displayOrder ?? 0 });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) { setErr('Name and quote are required'); return; }
    setSaving(true); setErr('');
    try {
      const url = initial?.id ? `/api/testimonials/${initial.id}` : '/api/testimonials';
      const result = await apiFetch(url, { method: initial?.id ? 'PUT' : 'POST', headers: apiHeaders(), body: JSON.stringify(form) });
      onSave(result);
    } catch { setErr('Failed to save.'); }
    setSaving(false);
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div><Label>Name *</Label><input value={form.name} onChange={set('name')} placeholder="Jane Doe" style={inputStyle} /></div>
        <div><Label>Role</Label><input value={form.role} onChange={set('role')} placeholder="Founder, Company" style={inputStyle} /></div>
      </div>
      <div><Label>Quote *</Label><textarea value={form.quote} onChange={set('quote')} rows={4} placeholder="What did they say?" style={{ ...inputStyle, resize: 'vertical' }} /></div>
      <div><Label>Display Order</Label><input type="number" value={form.displayOrder} onChange={e => setForm(f => ({ ...f, displayOrder: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: 100 }} /></div>
      {err && <div style={{ color: '#b91c1c', fontSize: 13, fontFamily: 'Geist, Inter, sans-serif' }}>{err}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" style={btnAccent} disabled={saving}>{saving ? 'Saving…' : initial?.id ? 'Update' : 'Add Testimonial'}</button>
        <button type="button" style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/* ─── WORKS TAB ─── */
function WorksTab() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Work> | null>(null);
  const [adding, setAdding] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setWorks(await apiFetch('/api/works')); } catch {} setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const remove = async (id: number) => {
    if (!confirm('Delete this work?')) return;
    await apiFetch(`/api/works/${id}`, { method: 'DELETE', headers: apiHeaders() });
    setWorks(p => p.filter(x => x.id !== id));
  };
  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: 0 }}>Works</h2>
        {!adding && !editing && <button style={btnAccent} onClick={() => setAdding(true)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>Add Work</button>}
      </div>
      {(adding || editing) && (
        <div style={{ ...glass, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#1a1a17', margin: '0 0 20px' }}>{editing ? 'Edit Work' : 'New Work'}</h3>
          <WorkForm initial={editing || undefined} onSave={(p) => { setWorks(prev => editing ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]); setEditing(null); setAdding(false); }} onCancel={() => { setEditing(null); setAdding(false); }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {works.length === 0 && <div style={{ color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif', padding: 24, textAlign: 'center' }}>No works yet. Add your first work above.</div>}
        {works.map(p => (
          <div key={p.id} style={{ ...glass, padding: '16px 20px', display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: '#ebe6db', flexShrink: 0 }}>
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
function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [adding, setAdding] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { setTestimonials(await apiFetch('/api/testimonials')); } catch {} setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const remove = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await apiFetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: apiHeaders() });
    setTestimonials(t => t.filter(x => x.id !== id));
  };
  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: 0 }}>Testimonials</h2>
        {!adding && !editing && <button style={btnAccent} onClick={() => setAdding(true)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>Add Testimonial</button>}
      </div>
      {(adding || editing) && (
        <div style={{ ...glass, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#1a1a17', margin: '0 0 20px' }}>{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
          <TestimonialForm initial={editing || undefined} onSave={(t) => { setTestimonials(prev => editing ? prev.map(x => x.id === t.id ? t : x) : [...prev, t]); setEditing(null); setAdding(false); }} onCancel={() => { setEditing(null); setAdding(false); }} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {testimonials.length === 0 && <div style={{ color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif', padding: 24, textAlign: 'center' }}>No testimonials yet.</div>}
        {testimonials.map(t => (
          <div key={t.id} style={{ ...glass, padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, color: '#c64f17', marginBottom: 4 }}>"</div>
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
type ContentSection = { section: string; keys: { key: string; label: string; hint: string; multiline?: boolean; isImage?: boolean }[] };

const CONTENT_SECTIONS: ContentSection[] = [
  { section: 'Hero', keys: [
    { key: 'hero_badge', label: 'Badge Text', hint: 'e.g. Open to work · Freelance & full-time' },
    { key: 'hero_tagline', label: 'Tagline Paragraph', hint: 'Short paragraph below the headline', multiline: true },
    { key: 'hero_photo_url', label: 'Hero Photo URL', hint: 'Direct image URL for your hover photo', isImage: true },
    { key: 'hero_stat_1_num', label: 'Stat 1 — Number', hint: 'e.g. 20+' },
    { key: 'hero_stat_1_label', label: 'Stat 1 — Label', hint: 'e.g. shipped projects' },
    { key: 'hero_stat_2_num', label: 'Stat 2 — Number', hint: 'e.g. 3 yrs' },
    { key: 'hero_stat_2_label', label: 'Stat 2 — Label', hint: 'e.g. design + code' },
    { key: 'hero_stat_3_num', label: 'Stat 3 — Number', hint: 'e.g. 100%' },
    { key: 'hero_stat_3_label', label: 'Stat 3 — Label', hint: 'e.g. AI-fluent' },
    { key: 'hero_availability', label: 'Availability Badge', hint: 'e.g. Currently · Freelancing' },
    { key: 'hero_poster_year', label: 'Poster Year', hint: 'e.g. 2025 / 26' },
    { key: 'hero_poster_location', label: 'Poster Location', hint: 'e.g. GUNTUR · IN' },
    { key: 'hero_poster_coords', label: 'Poster Coordinates', hint: 'e.g. 16.51° N · 80.65° E' },
    { key: 'hero_poster_est', label: 'Poster EST Year', hint: 'e.g. EST · 2022' },
  ]},
  { section: 'About', keys: [
    { key: 'about_heading', label: 'Section Heading', hint: 'e.g. introduction.' },
    { key: 'about_p1', label: 'Paragraph 1', hint: 'First paragraph', multiline: true },
    { key: 'about_p2', label: 'Paragraph 2', hint: 'Second paragraph', multiline: true },
    { key: 'about_companies', label: 'Worked With (comma-separated)', hint: 'ACM VVIT, Dharani Print, ...' },
    { key: 'about_tools', label: 'Tools (comma-separated)', hint: 'Figma, React, Three.js, ...' },
  ]},
  { section: 'Work', keys: [
    { key: 'work_heading', label: 'Section Heading', hint: "e.g. Things I've built recently." },
    { key: 'work_github_url', label: 'GitHub Profile URL', hint: 'https://github.com/yourhandle' },
  ]},
  { section: 'Services', keys: [
    { key: 'services_heading', label: 'Heading', hint: 'e.g. help.' },
    { key: 'services_subtext', label: 'Subtext', hint: 'Short description', multiline: true },
    { key: 'service_1_title', label: 'Service 1 Title', hint: 'e.g. Product Design' },
    { key: 'service_1_desc', label: 'Service 1 Description', hint: 'Short description', multiline: true },
    { key: 'service_2_title', label: 'Service 2 Title', hint: 'e.g. Frontend Engineering' },
    { key: 'service_2_desc', label: 'Service 2 Description', hint: 'Short description', multiline: true },
    { key: 'service_3_title', label: 'Service 3 Title', hint: 'e.g. Brand & Identity' },
    { key: 'service_3_desc', label: 'Service 3 Description', hint: 'Short description', multiline: true },
    { key: 'service_4_title', label: 'Service 4 Title', hint: 'e.g. Interactive 3D' },
    { key: 'service_4_desc', label: 'Service 4 Description', hint: 'Short description', multiline: true },
    { key: 'service_5_title', label: 'Service 5 Title', hint: 'e.g. AI-Augmented Builds' },
    { key: 'service_5_desc', label: 'Service 5 Description', hint: 'Short description', multiline: true },
  ]},
  { section: 'Contact', keys: [
    { key: 'contact_heading', label: 'Heading', hint: 'e.g. something good.' },
    { key: 'contact_subtext', label: 'Subtext', hint: 'Appears below heading', multiline: true },
    { key: 'contact_email', label: 'Email', hint: 'hello@yourname.dev' },
    { key: 'contact_location', label: 'Location', hint: 'City, State — Country' },
    { key: 'contact_available', label: 'Availability Status', hint: 'e.g. Available for new work — May 2026' },
    { key: 'contact_github', label: 'GitHub URL', hint: 'https://github.com/...' },
    { key: 'contact_linkedin', label: 'LinkedIn URL', hint: 'https://linkedin.com/in/...' },
    { key: 'contact_twitter', label: 'Twitter / X URL', hint: 'https://twitter.com/...' },
    { key: 'contact_dribbble', label: 'Dribbble URL', hint: 'https://dribbble.com/...' },
  ]},
  { section: 'Footer', keys: [
    { key: 'footer_tagline', label: 'Footer Tagline', hint: 'e.g. Freelancing from Guntur, India.' },
    { key: 'footer_copyright', label: 'Copyright Line', hint: 'e.g. © 2026 Subhash Mandalapu.' },
    { key: 'footer_built_by', label: 'Built By Line', hint: 'e.g. Designed & built · Guntur, IN' },
  ]},
];

function ContentField({ value, multiline, onSave, saving, saved }: { value: string; multiline?: boolean; onSave: (v: string) => void; saving: boolean; saved: boolean; }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => { setDraft(value); }, [value]);
  const changed = draft !== value;
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
      <div style={{ flex: 1 }}>
        {multiline
          ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          : <input value={draft} onChange={e => setDraft(e.target.value)} style={inputStyle} />
        }
      </div>
      <button
        onClick={() => onSave(draft)}
        disabled={saving || !changed}
        style={{ ...btnAccent, padding: '10px 16px', fontSize: 13, opacity: (!changed && !saved) ? 0.45 : 1, background: saved ? 'linear-gradient(145deg,#3d8b5e,#2d6b47)' : btnAccent.background as string, boxShadow: saved ? '0 4px 14px rgba(45,107,71,0.3)' : btnAccent.boxShadow as string, flexShrink: 0, transition: 'all 200ms' }}
      >
        {saved ? '✓ Saved' : saving ? '…' : 'Save'}
      </button>
    </div>
  );
}

function ContentTab() {
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Hero: true });

  useEffect(() => { apiFetch('/api/content').then(setContent).catch(() => {}).finally(() => setLoading(false)); }, []);

  const save = async (key: string, value: string) => {
    setSaving(key);
    try {
      await apiFetch(`/api/content/${key}`, { method: 'PUT', headers: apiHeaders(), body: JSON.stringify({ value }) });
      setContent(c => ({ ...c, [key]: value }));
      setSaved(key);
      setTimeout(() => setSaved(null), 2200);
    } catch {}
    setSaving(null);
  };

  if (loading) return <div style={{ padding: 40, color: '#6b6a63', fontFamily: 'Geist, Inter, sans-serif' }}>Loading…</div>;

  return (
    <div>
      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: '0 0 6px' }}>Site Content</h2>
      <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 14, margin: '0 0 24px' }}>Every section of your portfolio is editable here.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CONTENT_SECTIONS.map(({ section, keys }) => {
          const isOpen = !!openSections[section];
          return (
            <div key={section} style={{ ...glass, overflow: 'hidden', padding: 0 }}>
              <button onClick={() => setOpenSections(s => ({ ...s, [section]: !s[section] }))} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'transparent', border: 'none', cursor: 'pointer', borderBottom: isOpen ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#1a1a17' }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6a63', background: 'rgba(0,0,0,0.05)', borderRadius: 6, padding: '3px 8px' }}>{keys.length}</span>
                  {section}
                </span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b6a63" strokeWidth="2" strokeLinecap="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 250ms', flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
              </button>
              {isOpen && (
                <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {keys.map(({ key, label, hint, multiline, isImage }) => {
                    const val = content[key] ?? '';
                    return (
                      <div key={key}>
                        <Label>{label}</Label>
                        <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 12, margin: '0 0 8px' }}>{hint}</p>
                        {isImage && val && <div style={{ width: '100%', height: 100, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', marginBottom: 8 }}><img src={val} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} /></div>}
                        <ContentField value={val} multiline={multiline} onSave={(v) => save(key, v)} saving={saving === key} saved={saved === key} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── PASSWORD TAB ─── */
function PasswordTab() {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (pw !== confirm) { setErr('Passwords do not match'); return; }
    setSaving(true); setErr(''); setMsg('');
    try {
      await apiFetch('/api/admin/change-password', { method: 'POST', headers: apiHeaders(), body: JSON.stringify({ password: pw }) });
      setMsg('Password updated successfully!');
      setPw(''); setConfirm('');
    } catch { setErr('Failed to update password.'); }
    setSaving(false);
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 32, color: '#1a1a17', margin: '0 0 6px' }}>Change Password</h2>
      <p style={{ fontFamily: 'Geist, Inter, sans-serif', color: '#6b6a63', fontSize: 14, margin: '0 0 28px' }}>Update the admin panel password. Stored securely in the database.</p>
      <div style={{ ...glass, padding: 28 }}>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><Label>New Password</Label><input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Min. 6 characters" style={inputStyle} /></div>
          <div><Label>Confirm Password</Label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={inputStyle} /></div>
          {err && <div style={{ color: '#b91c1c', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.18)', borderRadius: 10, padding: '10px 14px' }}>{err}</div>}
          {msg && <div style={{ color: '#2d6b47', fontFamily: 'Geist, Inter, sans-serif', fontSize: 13, background: 'rgba(45,107,71,0.07)', border: '1px solid rgba(45,107,71,0.2)', borderRadius: 10, padding: '10px 14px' }}>{msg}</div>}
          <button type="submit" style={btnAccent} disabled={saving}>{saving ? 'Updating…' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}

/* ─── SIDEBAR NAV ITEM ─── */
function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px',
        background: active ? 'rgba(198,79,23,0.10)' : 'transparent',
        border: active ? '1px solid rgba(198,79,23,0.18)' : '1px solid transparent',
        borderRadius: 14, cursor: 'pointer', textAlign: 'left',
        boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 8px rgba(198,79,23,0.08)' : 'none',
        transition: 'all 150ms ease',
      }}
    >
      <span style={{ color: active ? '#c64f17' : '#6b6a63', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#1a1a17' : '#4a4942' }}>{label}</span>
    </button>
  );
}

/* ─── DASHBOARD ─── */
function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('works');

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'works', label: 'Works', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'testimonials', label: 'Testimonials', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { id: 'content', label: 'Site Content', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { id: 'password', label: 'Password', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: BG }}>
      {/* Sidebar */}
      <div style={{
        width: 248, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.85)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.06), inset -1px 0 0 rgba(0,0,0,0.04)',
        padding: '32px 16px', position: 'sticky', top: 0, height: '100vh', overflow: 'auto',
      }}>
        {/* Logo */}
        <div style={{ paddingLeft: 8, marginBottom: 32 }}>
          <Logo size={26} />
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6b6a63', marginTop: 2 }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(n => (
            <NavItem key={n.id} id={n.id} label={n.label} icon={n.icon} active={tab === n.id} onClick={() => setTab(n.id)} />
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 24 }}>
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'rgba(91,98,68,0.08)', border: '1px solid rgba(91,98,68,0.18)', borderRadius: 14, textDecoration: 'none', color: '#5b6244', fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, fontWeight: 500, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)', transition: 'all 150ms ease' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>
            View Site
          </a>
          <button
            onClick={onSignOut}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 16px', background: 'rgba(185,28,28,0.07)', border: '1px solid rgba(185,28,28,0.15)', borderRadius: 14, cursor: 'pointer', color: '#b91c1c', fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '48px 40px', overflow: 'auto' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          {tab === 'works' && <WorksTab />}
          {tab === 'testimonials' && <TestimonialsTab />}
          {tab === 'content' && <ContentTab />}
          {tab === 'password' && <PasswordTab />}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN PANEL ─── */
export default function AdminPanel() {
  const [step, setStep] = useState<Step>('password');
  const [devOtp, setDevOtp] = useState<string | undefined>();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) { setChecking(false); return; }
    fetch('/api/admin/check', { headers: { 'X-Admin-Token': token } })
      .then(r => r.json() as Promise<{ ok: boolean }>)
      .then(data => {
        if (data.ok) setStep('dashboard');
        else { localStorage.removeItem(SESSION_KEY); }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleLoginSuccess = (otp?: string) => {
    setDevOtp(otp);
    setStep('otp');
  };

  const handleOtpSuccess = (token: string) => {
    localStorage.setItem(SESSION_KEY, token);
    setStep('dashboard');
  };

  const handleSignOut = async () => {
    const token = getToken();
    if (token) {
      try {
        await fetch('/api/admin/logout', { method: 'POST', headers: apiHeaders(token) });
      } catch {}
      localStorage.removeItem(SESSION_KEY);
    }
    setStep('password');
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <div style={{ ...clay, padding: '32px 48px', textAlign: 'center' }}>
          <Logo size={26} />
          <div style={{ fontFamily: 'Geist, Inter, sans-serif', fontSize: 14, color: '#6b6a63', marginTop: 12 }}>Checking session…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      {step === 'password' && <LoginStep onSuccess={handleLoginSuccess} />}
      {step === 'otp' && <OtpStep devOtp={devOtp} onSuccess={handleOtpSuccess} onBack={() => setStep('password')} />}
      {step === 'dashboard' && <Dashboard onSignOut={handleSignOut} />}
    </>
  );
}
