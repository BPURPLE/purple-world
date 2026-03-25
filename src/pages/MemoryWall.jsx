// src/pages/MemoryWall.jsx
// ─────────────────────────────────────────────────────────────────
// Purple World — Memory Wall
// Fan memories submitted, moderated by Gemini, stored in Supabase.
// Features:
//   • Masonry card grid, filtered by era
//   • Submit form with Gemini auto-moderation
//   • Delete own post (localStorage delete token)
//   • Admin delete (password-gated, service role key)
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { moderateMemory } from '../lib/gemini';
import { eras } from '../data/eras';
import './MemoryWall.css';

// ── Helpers ──────────────────────────────────────────────────────

function generateToken() {
  return crypto.randomUUID();
}

function getMyTokens() {
  try {
    return JSON.parse(localStorage.getItem('pw_delete_tokens') || '{}');
  } catch {
    return {};
  }
}

function saveToken(memoryId, token) {
  const tokens = getMyTokens();
  tokens[memoryId] = token;
  localStorage.setItem('pw_delete_tokens', JSON.stringify(tokens));
}

function isMine(memoryId) {
  const tokens = getMyTokens();
  return !!tokens[memoryId];
}

// ── Era colour map ───────────────────────────────────────────────

function getEraColor(eraSlug) {
  const era = eras.find(e => e.slug === eraSlug || e.id === eraSlug);
  return era?.color || '#b197fc';
}

function getEraName(eraSlug) {
  const era = eras.find(e => e.slug === eraSlug || e.id === eraSlug);
  return era?.name || eraSlug;
}

// ── Sub-components ───────────────────────────────────────────────

function MemoryCard({ memory, onDelete, adminMode }) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const mine = isMine(memory.id);
  const eraColor = getEraColor(memory.era);

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    await onDelete(memory.id, mine ? getMyTokens()[memory.id] : null, adminMode);
    setDeleting(false);
  }

  const canDelete = mine || adminMode;

  return (
    <article className="memory-card" style={{ '--era-color': eraColor }}>
      <div className="memory-card__era-stripe" />
      <div className="memory-card__body">
        <p className="memory-card__message">{memory.message}</p>
      </div>
      <footer className="memory-card__footer">
        <div className="memory-card__meta">
          <span className="memory-card__name">{memory.display_name}</span>
          {memory.army_since && (
            <span className="memory-card__since">ARMY since {memory.army_since}</span>
          )}
        </div>
        <span
          className="memory-card__era-tag"
          style={{ backgroundColor: eraColor + '33', color: eraColor }}
        >
          {getEraName(memory.era)}
        </span>
      </footer>
      {canDelete && (
        <button
          className={`memory-card__delete ${confirmDelete ? 'memory-card__delete--confirm' : ''}`}
          onClick={handleDelete}
          disabled={deleting}
          title={confirmDelete ? 'Click again to confirm' : 'Delete this memory'}
        >
          {deleting ? '…' : confirmDelete ? '✓ confirm' : '✕'}
        </button>
      )}
    </article>
  );
}

function SubmitForm({ onSubmitted }) {
  const [form, setForm] = useState({
    display_name: '',
    army_since: '',
    era: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const eraOptions = eras.map(e => ({ value: e.slug || e.id, label: e.name }));

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.display_name.trim() || !form.era || !form.message.trim()) return;

    setStatus('submitting');
    setStatusMsg('Adding your memory to the wall… 💜');

    try {
      // 1. Gemini moderation — FAIL OPEN
      // Default: approve everything unless Gemini explicitly hard-rejects
      let isApproved = true;
      let isFlagged  = false;

      try {
        const modResult = await moderateMemory({
          displayName: form.display_name,
          message: form.message,
          era: form.era,
        });

        // Only block if Gemini returns BOTH approved:false AND flagged:false
        // (that's our "hard reject" signal — racist/slur/explicit content only)
        // If result is empty, malformed, or ambiguous → approve anyway
        if (
          modResult &&
          typeof modResult.approved === 'boolean' &&
          modResult.approved === false &&
          modResult.flagged === false
        ) {
          setStatus('rejected');
          setStatusMsg("We couldn't publish this memory. Please keep Purple World a safe, loving space. 💜");
          return;
        }

        // If flagged:true (borderline) — still publish but mark for your review
        isApproved = modResult?.approved !== false;
        isFlagged  = modResult?.flagged === true;

      } catch (modErr) {
        // Moderation threw an error — approve with flag so you can review later
        console.warn('Moderation unavailable, defaulting to approve:', modErr);
        isApproved = true;
        isFlagged  = true;
      }

      // 2. Generate delete token
      const deleteToken = generateToken();

      // 3. Insert into Supabase
      const { data, error } = await supabase
        .from('memories')
        .insert([{
          display_name: form.display_name.trim(),
          army_since: form.army_since ? parseInt(form.army_since) : null,
          era: form.era,
          message: form.message.trim(),
          delete_token: deleteToken,
          is_approved: isApproved,
          is_flagged: isFlagged,
        }])
        .select()
        .single();

      if (error) throw error;

      // 4. Save delete token locally so user can delete their own post
      saveToken(data.id, deleteToken);

      setStatus('success');
      setStatusMsg('Your memory has been added to the wall! 💜');
      setForm({ display_name: '', army_since: '', era: '', message: '' });
      onSubmitted();

    } catch (err) {
      console.error('Submit failed:', err);
      setStatus('error');
      setStatusMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <section className="memory-form-section">
      <h2 className="memory-form__title">Leave your memory</h2>
      <p className="memory-form__subtitle">
        What's the moment BTS changed something for you?
      </p>

      <div className="memory-form">
        <div className="memory-form__row">
          <div className="memory-form__field">
            <label htmlFor="display_name">Your name / ARMY name</label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="e.g. moonchild_97"
              value={form.display_name}
              onChange={handleChange}
              maxLength={40}
              disabled={status === 'submitting'}
            />
          </div>
          <div className="memory-form__field memory-form__field--small">
            <label htmlFor="army_since">ARMY since</label>
            <input
              id="army_since"
              name="army_since"
              type="number"
              placeholder="year"
              value={form.army_since}
              onChange={handleChange}
              min={2013}
              max={new Date().getFullYear()}
              disabled={status === 'submitting'}
            />
          </div>
        </div>

        <div className="memory-form__field">
          <label htmlFor="era">Which era is this memory from?</label>
          <select
            id="era"
            name="era"
            value={form.era}
            onChange={handleChange}
            disabled={status === 'submitting'}
          >
            <option value="">— choose an era —</option>
            {eraOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="memory-form__field">
          <label htmlFor="message">Your memory</label>
          <textarea
            id="message"
            name="message"
            placeholder="I first heard BTS when… / The moment I became ARMY was… / This era means everything because…"
            value={form.message}
            onChange={handleChange}
            maxLength={500}
            rows={5}
            disabled={status === 'submitting'}
          />
          <span className="memory-form__char-count">{form.message.length}/500</span>
        </div>

        {statusMsg && (
          <p className={`memory-form__status memory-form__status--${status}`}>
            {statusMsg}
          </p>
        )}

        <button
          className="memory-form__submit"
          onClick={handleSubmit}
          disabled={
            status === 'submitting' ||
            !form.display_name.trim() ||
            !form.era ||
            !form.message.trim()
          }
        >
          {status === 'submitting' ? (
            <span className="memory-form__submit-loading">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </span>
          ) : (
            'Add to the wall 💜'
          )}
        </button>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────

export default function MemoryWall() {
  const [memories, setMemories]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filterEra, setFilterEra]       = useState('all');
  const [adminMode, setAdminMode]       = useState(false);
  const [adminInput, setAdminInput]     = useState('');
  const [showAdminBox, setShowAdminBox] = useState(false);

  const ADMIN_PW = import.meta.env.VITE_ADMIN_DELETE_PASSWORD;

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('memories')
      .select('id, display_name, army_since, era, message, created_at')
      .eq('is_approved', true)
      .eq('is_flagged', false)
      .order('created_at', { ascending: false });

    if (filterEra !== 'all') {
      query = query.eq('era', filterEra);
    }

    const { data, error } = await query;
    if (!error) setMemories(data || []);
    setLoading(false);
  }, [filterEra]);

  useEffect(() => { fetchMemories(); }, [fetchMemories]);

  async function handleDelete(memoryId, userToken, isAdmin) {
    if (isAdmin) {
      if (!supabaseAdmin) {
        alert('Admin client not configured. Check VITE_SUPABASE_SERVICE_KEY.');
        return;
      }
      const { error } = await supabaseAdmin.from('memories').delete().eq('id', memoryId);
      if (!error) setMemories(prev => prev.filter(m => m.id !== memoryId));
    } else {
      const { data, error } = await supabase
        .from('memories')
        .select('id, delete_token')
        .eq('id', memoryId)
        .single();

      if (error || !data) return;
      if (data.delete_token !== userToken) {
        alert("You can only delete your own memories.");
        return;
      }

      if (supabaseAdmin) {
        await supabaseAdmin.from('memories').delete().eq('id', memoryId);
      } else {
        await supabase.from('memories').update({ is_approved: false }).eq('id', memoryId);
      }

      setMemories(prev => prev.filter(m => m.id !== memoryId));
      const tokens = getMyTokens();
      delete tokens[memoryId];
      localStorage.setItem('pw_delete_tokens', JSON.stringify(tokens));
    }
  }

  function handleAdminLogin() {
    if (adminInput === ADMIN_PW) {
      setAdminMode(true);
      setShowAdminBox(false);
      setAdminInput('');
    } else {
      alert('Wrong password.');
    }
  }

  const eraFilters = [
    { value: 'all', label: 'All eras' },
    ...eras.map(e => ({ value: e.slug || e.id, label: e.name })),
  ];

  return (
    <div className="memory-wall">

      <header className="memory-wall__header">
        <div className="memory-wall__header-bg" />
        <div className="memory-wall__header-content">
          <p className="memory-wall__eyebrow">Purple World</p>
          <h1 className="memory-wall__title">Memory Wall</h1>
          <p className="memory-wall__subtitle">
            ARMY from every era, every continent, every story.<br />
            This is where we remember.
          </p>
        </div>
      </header>

      <SubmitForm onSubmitted={fetchMemories} />

      <div className="memory-wall__filters">
        <div className="memory-wall__filter-scroll">
          {eraFilters.map(f => (
            <button
              key={f.value}
              className={`memory-wall__filter-btn ${filterEra === f.value ? 'active' : ''}`}
              onClick={() => setFilterEra(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <main className="memory-wall__grid-section">
        {loading ? (
          <div className="memory-wall__loading">
            <span className="memory-wall__loading-dot" />
            <span className="memory-wall__loading-dot" />
            <span className="memory-wall__loading-dot" />
          </div>
        ) : memories.length === 0 ? (
          <div className="memory-wall__empty">
            <p>No memories here yet. Be the first to add one 💜</p>
          </div>
        ) : (
          <div className="memory-wall__masonry">
            {memories.map(memory => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                onDelete={handleDelete}
                adminMode={adminMode}
              />
            ))}
          </div>
        )}
      </main>

      <div className="memory-wall__admin-zone">
        {!adminMode ? (
          <>
            <button
              className="memory-wall__admin-trigger"
              onClick={() => setShowAdminBox(prev => !prev)}
            >
              ···
            </button>
            {showAdminBox && (
              <div className="memory-wall__admin-box">
                <input
                  type="password"
                  placeholder="admin password"
                  value={adminInput}
                  onChange={e => setAdminInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                />
                <button onClick={handleAdminLogin}>Enter</button>
              </div>
            )}
          </>
        ) : (
          <div className="memory-wall__admin-active">
            <span>🛡 Admin mode</span>
            <button onClick={() => setAdminMode(false)}>Exit</button>
          </div>
        )}
      </div>

    </div>
  );
}