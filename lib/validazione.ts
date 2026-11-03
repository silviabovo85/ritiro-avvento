export type CampoIscrizione = "nome_bambino" | "gruppo_catechismo" | "numero_genitori" | "fratelli_7_piu" | "fratelli_sotto_7";
export type Errori = Partial<Record<CampoIscrizione | "consenso_privacy", string>>;

function leggiNumero(formData: FormData, nome: CampoIscrizione, max: number) {
  const raw = String(formData.get(nome) ?? "");
  const n = raw === "" ? NaN : Number(raw);
  return { raw, n, valido: Number.isInteger(n) && n >= 0 && n <= max };
}

/** Legge e controlla i campi dell'iscrizione, usati sia dal modulo pubblico sia dalla modifica admin. */
export function leggiIscrizione(formData: FormData) {
  const nome_bambino = String(formData.get("nome_bambino") ?? "").trim().slice(0, 120);
  const gruppo_catechismo = String(formData.get("gruppo_catechismo") ?? "").trim().slice(0, 120);
  const genitori = leggiNumero(formData, "numero_genitori", 4);
  const grandi = leggiNumero(formData, "fratelli_7_piu", 10);
  const piccoli = leggiNumero(formData, "fratelli_sotto_7", 10);

  const errori: Errori = {};
  if (nome_bambino.length < 2) errori.nome_bambino = "Inserisci nome e cognome del ragazzo/a.";
  if (!gruppo_catechismo) errori.gruppo_catechismo = "Indica il gruppo di catechismo.";
  if (!genitori.valido) errori.numero_genitori = "Indica quanti genitori parteciperanno.";
  if (!grandi.valido) errori.fratelli_7_piu = "Indica quanti fratelli dai 7 anni in su parteciperanno.";
  if (!piccoli.valido) errori.fratelli_sotto_7 = "Indica quanti fratelli sotto i 7 anni parteciperanno.";

  return {
    dati: {
      nome_bambino,
      gruppo_catechismo,
      numero_genitori: genitori.n,
      fratelli_7_piu: grandi.n,
      fratelli_sotto_7: piccoli.n,
    },
    valori: {
      nome_bambino,
      gruppo_catechismo,
      numero_genitori: genitori.raw,
      fratelli_7_piu: grandi.raw,
      fratelli_sotto_7: piccoli.raw,
    } as Record<string, string>,
    errori,
  };
}
