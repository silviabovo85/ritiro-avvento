// Indirizzo e chiave pubblica (publishable) del progetto Supabase "Ritiro Avvento".
// La chiave publishable e' pensata per stare nel browser: la sicurezza dei dati e' garantita dalle regole RLS.
// Le variabili d'ambiente, se impostate su Vercel, hanno la precedenza.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://txpywikfereaogcrnfmd.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_xQfwNaMpV7TkyddtUxXPQw_TwgLncMl";
