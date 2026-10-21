"use client";

import Link from "next/link";
import { useActionState } from "react";
import { modificaIscrizione, type StatoModifica } from "../../actions";

type Iscrizione = { id: number; nome_bambino: string; gruppo_catechismo: string; numero_genitori: number; telefono: string; email: string };

export default function ModificaForm({ iscrizione: i }: { iscrizione: Iscrizione }) {
  const [stato, azione, inCorso] = useActionState(modificaIscrizione.bind(null, i.id), { ok: false } as StatoModifica);
  const err = stato.errori ?? {};
  const campo = (name: keyof Iscrizione & keyof typeof err, label: string, type = "text") => (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={String(i[name])} required aria-invalid={!!err[name]} />
      {err[name] && <span className="errore">{err[name]}</span>}
    </div>
  );
  return (
    <form action={azione} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      {campo("nome_bambino", "Nome e cognome del ragazzo/a")}
      {campo("gruppo_catechismo", "Gruppo di catechismo")}
      <div className="campo">
        <label htmlFor="numero_genitori">Numero di genitori partecipanti</label>
        <select id="numero_genitori" name="numero_genitori" defaultValue={String(i.numero_genitori)}>
          {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? "Nessuno" : n}</option>)}
        </select>
      </div>
      {campo("telefono", "Numero di telefono", "tel")}
      {campo("email", "Email", "email")}
      <div className="azioni-testa">
        <button className="btn" disabled={inCorso}>{inCorso ? "Salvataggio…" : "Salva le modifiche"}</button>
        <Link className="btn btn-secondario" href="/admin">Annulla</Link>
      </div>
    </form>
  );
}
