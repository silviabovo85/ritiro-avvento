"use server";

import { createClient } from "@/lib/supabase";

export type StatoForm = {
  ok: boolean;
  messaggio?: string;
  valori?: Record<string, string>;
  tentativo?: number;
  errori?: Partial<Record<"nome_bambino" | "gruppo_catechismo" | "numero_genitori" | "telefono" | "email" | "consenso_privacy", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^\+?[0-9 ./-]{6,20}$/;

export async function iscrivi(_prev: StatoForm, formData: FormData): Promise<StatoForm> {
  // Campo trappola per i bot: le persone non lo vedono e non lo compilano
  if (formData.get("sito_web")) return { ok: true };

  const nome_bambino = String(formData.get("nome_bambino") ?? "").trim();
  const gruppo_catechismo = String(formData.get("gruppo_catechismo") ?? "").trim();
  const genitoriRaw = String(formData.get("numero_genitori") ?? "");
  const numero_genitori = genitoriRaw === "" ? NaN : Number(genitoriRaw);
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const consenso_privacy = formData.get("consenso_privacy") === "on";

  const errori: StatoForm["errori"] = {};
  if (nome_bambino.length < 2) errori.nome_bambino = "Inserisci nome e cognome del ragazzo/a.";
  if (!gruppo_catechismo) errori.gruppo_catechismo = "Indica il gruppo di catechismo.";
  if (!Number.isInteger(numero_genitori) || numero_genitori < 0 || numero_genitori > 4)
    errori.numero_genitori = "Indica quanti genitori parteciperanno.";
  if (!TEL_RE.test(telefono)) errori.telefono = "Inserisci un numero di telefono valido.";
  if (!EMAIL_RE.test(email)) errori.email = "Inserisci un indirizzo email valido.";
  if (!consenso_privacy) errori.consenso_privacy = "Serve il consenso al trattamento dei dati.";
  // React svuota il form dopo l'invio: restituiamo i valori per non farli riscrivere
  const valori = { nome_bambino, gruppo_catechismo, numero_genitori: genitoriRaw, telefono, email, consenso_privacy: consenso_privacy ? "on" : "" };
  if (Object.keys(errori).length) return { ok: false, errori, valori, tentativo: Date.now(), messaggio: "Controlla i campi evidenziati." };

  const supabase = await createClient();
  const { error } = await supabase.from("iscrizioni").insert({
    nome_bambino: nome_bambino.slice(0, 120),
    gruppo_catechismo: gruppo_catechismo.slice(0, 120),
    numero_genitori,
    telefono,
    email,
    consenso_privacy,
  });
  if (error) {
    console.error("Errore iscrizione", error);
    return { ok: false, valori, tentativo: Date.now(), messaggio: "Non è stato possibile registrare l'iscrizione. Riprova tra qualche minuto o contatta la segreteria." };
  }
  return { ok: true, messaggio: `Grazie! L'iscrizione di ${nome_bambino} è stata registrata.` };
}
