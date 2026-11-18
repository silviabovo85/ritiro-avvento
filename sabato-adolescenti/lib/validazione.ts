import { ANNATE } from "./evento";

export type CampoIscrizione = "nome_cognome" | "annata" | "cena";
export type Errori = Partial<Record<CampoIscrizione | "consenso_privacy", string>>;

/** Legge e controlla i campi dell'iscrizione, usati sia dal modulo pubblico sia dalla modifica admin. */
export function leggiIscrizione(formData: FormData) {
  const nome_cognome = String(formData.get("nome_cognome") ?? "").trim().slice(0, 120);
  const annataRaw = String(formData.get("annata") ?? "");
  const annata = Number(annataRaw);
  const cenaRaw = String(formData.get("cena") ?? "");

  const errori: Errori = {};
  if (nome_cognome.length < 2) errori.nome_cognome = "Inserisci nome e cognome.";
  if (!ANNATE.some((a) => a.anno === annata)) errori.annata = "Scegli la tua annata.";
  if (cenaRaw !== "si" && cenaRaw !== "no") errori.cena = "Dicci se vieni a cena.";

  return {
    dati: { nome_cognome, annata, cena: cenaRaw === "si" },
    valori: { nome_cognome, annata: annataRaw, cena: cenaRaw } as Record<string, string>,
    errori,
  };
}
