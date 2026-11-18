"use client";

import Link from "next/link";
import { useActionState } from "react";
import { modificaIscrizione, type StatoModifica } from "../../actions";
import { ANNATE } from "@/lib/evento";

type Iscrizione = { id: number; nome_cognome: string; annata: number; cena: boolean };

export default function ModificaForm({ iscrizione: i }: { iscrizione: Iscrizione }) {
  const [stato, azione, inCorso] = useActionState(modificaIscrizione.bind(null, i.id), { ok: false } as StatoModifica);
  const err = stato.errori ?? {};
  return (
    <form action={azione} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      <div className="campo">
        <label htmlFor="nome_cognome">Nome e cognome</label>
        <input id="nome_cognome" name="nome_cognome" defaultValue={i.nome_cognome} required aria-invalid={!!err.nome_cognome} />
        {err.nome_cognome && <span className="errore">{err.nome_cognome}</span>}
      </div>
      <div className="campo">
        <label htmlFor="annata">Annata</label>
        <select id="annata" name="annata" defaultValue={String(i.annata)}>
          {ANNATE.map((a) => <option key={a.anno} value={a.anno}>{a.anno} ({a.classe})</option>)}
        </select>
        {err.annata && <span className="errore">{err.annata}</span>}
      </div>
      <div className="campo">
        <label htmlFor="cena">Viene a cena</label>
        <select id="cena" name="cena" defaultValue={i.cena ? "si" : "no"}>
          <option value="si">Sì</option>
          <option value="no">No</option>
        </select>
        {err.cena && <span className="errore">{err.cena}</span>}
      </div>
      <div className="azioni-testa">
        <button className="btn" disabled={inCorso}>{inCorso ? "Salvataggio…" : "Salva le modifiche"}</button>
        <Link className="btn btn-secondario" href="/admin">Annulla</Link>
      </div>
    </form>
  );
}
