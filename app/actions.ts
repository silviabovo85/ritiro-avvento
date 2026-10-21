"use server";

import { createClient } from "@/lib/supabase";
import { leggiIscrizione, type Errori } from "@/lib/validazione";

export type StatoForm = {
  ok: boolean;
  messaggio?: string;
  valori?: Record<string, string>;
  tentativo?: number;
  errori?: Errori;
};

export async function iscrivi(_prev: StatoForm, formData: FormData): Promise<StatoForm> {
  // Campo trappola per i bot: le persone non lo vedono e non lo compilano
  if (formData.get("sito_web")) return { ok: true };

  const { dati, valori, errori } = leggiIscrizione(formData);
  const consenso_privacy = formData.get("consenso_privacy") === "on";
  if (!consenso_privacy) errori.consenso_privacy = "Serve il consenso al trattamento dei dati.";
  // React svuota il form dopo l'invio: restituiamo i valori per non farli riscrivere
  valori.consenso_privacy = consenso_privacy ? "on" : "";
  if (Object.keys(errori).length) return { ok: false, errori, valori, tentativo: Date.now(), messaggio: "Controlla i campi evidenziati." };

  const supabase = await createClient();
  const { error } = await supabase.from("iscrizioni").insert({ ...dati, consenso_privacy });
  if (error) {
    console.error("Errore iscrizione", error);
    return { ok: false, valori, tentativo: Date.now(), messaggio: "Non è stato possibile registrare l'iscrizione. Riprova tra qualche minuto o contatta la segreteria." };
  }
  return { ok: true, messaggio: `Grazie! L'iscrizione di ${dati.nome_bambino} è stata registrata.` };
}
