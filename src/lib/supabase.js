import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Falls back to a harmless dummy client if env vars aren't set yet, so the
// app still runs (with empty data) instead of crashing on first load.
export const supabase =
  url && key
    ? createClient(url, key)
    : createClient('https://placeholder.supabase.co', 'placeholder-anon-key');

export const isSupabaseConfigured = Boolean(url && key);
