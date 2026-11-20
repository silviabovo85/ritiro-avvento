import { ANNATE } from "./evento";

export type CampoIscrizione = "nome" | "cognome" | "annata" | "cena" | "allergie";
export type Errori = Partial<Record<CampoIscrizione | "consenso_privacy", string>>;

/** Legge e controlla i campi dell'iscrizione, usati sia dal modulo pubblico sia dalla modifica admin. */
export function leggiIscrizione(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim().slice(0, 80);
  const cognome = String(formData.get("cognome") ?? "").trim().slice(0, 80);
  const annataRaw = String(formData.get("annata") ?? "");
  const annata = Number(annataRaw);
  const cenaRaw = String(formData.get("cena") ?? "");
  const animatore = formData.get("animatore") === "on";
  const allergie = String(formData.get("allergie") ?? "").trim().slice(0, 500);

  const errori: Errori = {};
  if (nome.length < 2) errori.nome = "Inserisci il nome.";
  if (!cognome) errori.cognome = "Inserisci il cognome.";
  if (!ANNATE.some((a) => a.anno === annata)) errori.annata = "Scegli la tua annata.";
  if (cenaRaw !== "si" && cenaRaw !== "no") errori.cena = "Dicci se vieni a cena.";

  return {
    dati: { nome, cognome, annata, cena: cenaRaw === "si", animatore, allergie: allergie || null },
    valori: { nome, cognome, annata: annataRaw, cena: cenaRaw, animatore: animatore ? "on" : "", allergie } as Record<string, string>,
    errori,
  };
}
