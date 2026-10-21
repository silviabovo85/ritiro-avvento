"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export type StatoAuth = { ok: boolean; messaggio?: string; email?: string };

const PASSWORD_MIN = 8;

async function origine() {
  const h = await headers();
  return h.get("origin") ?? `https://${h.get("host")}`;
}

function leggiEmail(formData: FormData) {
  return String(formData.get("email") ?? "").trim().toLowerCase();
}

export async function accedi(_prev: StatoAuth, formData: FormData): Promise<StatoAuth> {
  const email = leggiEmail(formData);
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const messaggio = error.code === "email_not_confirmed"
      ? "Devi ancora confermare l'indirizzo: apri il link che ti abbiamo inviato via email."
      : "Email o password non corrette.";
    return { ok: false, messaggio, email };
  }
  redirect("/admin");
}

/** Primo accesso: l'admin sceglie la password e conferma l'indirizzo via email. */
export async function primoAccesso(_prev: StatoAuth, formData: FormData): Promise<StatoAuth> {
  const email = leggiEmail(formData);
  const password = String(formData.get("password") ?? "");
  const conferma = String(formData.get("conferma") ?? "");
  if (password.length < PASSWORD_MIN)
    return { ok: false, email, messaggio: `La password deve avere almeno ${PASSWORD_MIN} caratteri.` };
  if (password !== conferma) return { ok: false, email, messaggio: "Le due password non coincidono." };

  const supabase = await createClient();
  const { data: abilitato } = await supabase.rpc("email_is_admin", { check_email: email });
  if (!abilitato)
    return { ok: false, email, messaggio: "Questo indirizzo non è abilitato. Chiedi al super admin di aggiungerti." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${await origine()}/auth/callback` },
  });
  if (error) {
    console.error("Errore primo accesso", error);
    return { ok: false, email, messaggio: "Registrazione non riuscita. Attendi qualche minuto e riprova." };
  }
  // Se l'account esiste gia' Supabase non invia email e non cambia la password
  if (data.user && data.user.identities?.length === 0) {
    return { ok: false, email, messaggio: "Hai già un account. Per impostare o cambiare la password usa \"Password dimenticata?\" dalla pagina di accesso." };
  }
  return {
    ok: true,
    messaggio: "Ti abbiamo inviato un'email: apri il link per confermare l'indirizzo, poi potrai entrare con la tua password.",
  };
}

export async function recuperaPassword(_prev: StatoAuth, formData: FormData): Promise<StatoAuth> {
  const email = leggiEmail(formData);
  const supabase = await createClient();
  const { data: abilitato } = await supabase.rpc("email_is_admin", { check_email: email });
  if (abilitato) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${await origine()}/auth/callback?next=/admin/nuova-password`,
    });
    if (error) console.error("Errore recupero password", error);
  }
  // Stesso messaggio in ogni caso, per non rivelare chi e' abilitato
  return { ok: true, messaggio: "Se l'indirizzo è abilitato, riceverai un'email con il link per scegliere una nuova password." };
}

export async function nuovaPassword(_prev: StatoAuth, formData: FormData): Promise<StatoAuth> {
  const password = String(formData.get("password") ?? "");
  const conferma = String(formData.get("conferma") ?? "");
  if (password.length < PASSWORD_MIN)
    return { ok: false, messaggio: `La password deve avere almeno ${PASSWORD_MIN} caratteri.` };
  if (password !== conferma) return { ok: false, messaggio: "Le due password non coincidono." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    const messaggio = error.code === "same_password"
      ? "La nuova password deve essere diversa da quella attuale."
      : "Non è stato possibile salvare la password. Richiedi un nuovo link e riprova.";
    return { ok: false, messaggio };
  }
  return { ok: true, messaggio: "Password salvata." };
}
