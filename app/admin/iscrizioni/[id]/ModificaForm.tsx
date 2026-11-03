"use client";

import Link from "next/link";
import { useActionState } from "react";
import { modificaIscrizione, type StatoModifica } from "../../actions";

type Iscrizione = { id: number; nome_bambino: string; gruppo_catechismo: string; numero_genitori: number; fratelli_7_piu: number; fratelli_sotto_7: number };

export default function ModificaForm({ iscrizione: i }: { iscrizione: Iscrizione }) {
  const [stato, azione, inCorso] = useActionState(modificaIscrizione.bind(null, i.id), { ok: false } as StatoModifica);
  const err = stato.errori ?? {};
  const campo = (name: "nome_bambino" | "gruppo_catechismo", label: string) => (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} defaultValue={i[name]} required aria-invalid={!!err[name]} />
      {err[name] && <span className="errore">{err[name]}</span>}
    </div>
  );
  const tendina = (name: "numero_genitori" | "fratelli_7_piu" | "fratelli_sotto_7", label: string, max: number) => (
    <div className="campo">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={String(i[name])}>
        {Array.from({ length: max + 1 }, (_, n) => <option key={n} value={n}>{n === 0 ? "Nessuno" : n}</option>)}
      </select>
      {err[name] && <span className="errore">{err[name]}</span>}
    </div>
  );
  return (
    <form action={azione} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      {campo("nome_bambino", "Nome e cognome del ragazzo/a")}
      {campo("gruppo_catechismo", "Gruppo di catechismo")}
      {tendina("numero_genitori", "Numero di genitori partecipanti", 4)}
      {tendina("fratelli_7_piu", "Fratelli dai 7 anni in su", 10)}
      {tendina("fratelli_sotto_7", "Fratelli sotto i 7 anni", 10)}
      <div className="azioni-testa">
        <button className="btn" disabled={inCorso}>{inCorso ? "Salvataggio…" : "Salva le modifiche"}</button>
        <Link className="btn btn-secondario" href="/admin">Annulla</Link>
      </div>
    </form>
  );
}
