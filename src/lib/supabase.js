// src/lib/supabase.js
// ─────────────────────────────────────────────
// Two clients:
//   supabase      → anon key  (public reads + inserts)
//   supabaseAdmin → service key (admin deletes, bypasses RLS)
// ─────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY     = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_KEY  = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('⚠️  Supabase env vars missing. Check your .env file.');
}

// Public client — used for all user-facing reads and inserts
export const supabase = createClient(SUPABASE_URL, ANON_KEY);

// Admin client — used ONLY for admin deletes (service role bypasses RLS)
// Never expose SERVICE_KEY in any user-visible output
export const supabaseAdmin = SERVICE_KEY
  ? createClient(SUPABASE_URL, SERVICE_KEY)
  : null;