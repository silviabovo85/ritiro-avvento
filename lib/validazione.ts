export type CampoIscrizione = "nome_bambino" | "gruppo_catechismo" | "numero_genitori" | "telefono" | "email";
export type Errori = Partial<Record<CampoIscrizione | "consenso_privacy", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^\+?[0-9 ./-]{6,20}$/;

/** Legge e controlla i campi dell'iscrizione, usati sia dal modulo pubblico sia dalla modifica admin. */
export function leggiIscrizione(formData: FormData) {
  const nome_bambino = String(formData.get("nome_bambino") ?? "").trim().slice(0, 120);
  const gruppo_catechismo = String(formData.get("gruppo_catechismo") ?? "").trim().slice(0, 120);
  const genitoriRaw = String(formData.get("numero_genitori") ?? "");
  const numero_genitori = genitoriRaw === "" ? NaN : Number(genitoriRaw);
  const telefono = String(formData.get("telefono") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  const errori: Errori = {};
  if (nome_bambino.length < 2) errori.nome_bambino = "Inserisci nome e cognome del ragazzo/a.";
  if (!gruppo_catechismo) errori.gruppo_catechismo = "Indica il gruppo di catechismo.";
  if (!Number.isInteger(numero_genitori) || numero_genitori < 0 || numero_genitori > 4)
    errori.numero_genitori = "Indica quanti genitori parteciperanno.";
  if (!TEL_RE.test(telefono)) errori.telefono = "Inserisci un numero di telefono valido.";
  if (!EMAIL_RE.test(email)) errori.email = "Inserisci un indirizzo email valido.";

  return {
    dati: { nome_bambino, gruppo_catechismo, numero_genitori, telefono, email },
    valori: { nome_bambino, gruppo_catechismo, numero_genitori: genitoriRaw, telefono, email } as Record<string, string>,
    errori,
  };
}
