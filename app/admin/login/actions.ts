"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase";

export type StatoLogin = { ok: boolean; messaggio?: string };

export async function inviaLink(_prev: StatoLogin, formData: FormData): Promise<StatoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, messaggio: "Inserisci un indirizzo email valido." };

  const supabase = await createClient();
  const { data: abilitato } = await supabase.rpc("email_is_admin", { check_email: email });
  // Stesso messaggio in entrambi i casi, per non rivelare chi e' abilitato
  const risposta = { ok: true, messaggio: "Se l'indirizzo è abilitato, riceverai a breve un'email con il link di accesso." };
  if (!abilitato) return risposta;

  const h = await headers();
  const origin = h.get("origin") ?? `https://${h.get("host")}`;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback`, shouldCreateUser: true },
  });
  if (error) {
    console.error("Errore invio link", error);
    return { ok: false, messaggio: "Invio non riuscito. Attendi qualche minuto e riprova." };
  }
  return risposta;
}
