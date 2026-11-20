"use client";

import Link from "next/link";
import { useActionState } from "react";
import { modificaIscrizione, type StatoModifica } from "../../actions";
import { ANNATE } from "@/lib/evento";

type Iscrizione = { id: number; nome: string; cognome: string; annata: number; cena: boolean; animatore: boolean; allergie: string | null };

export default function ModificaForm({ iscrizione: i }: { iscrizione: Iscrizione }) {
  const [stato, azione, inCorso] = useActionState(modificaIscrizione.bind(null, i.id), { ok: false } as StatoModifica);
  const err = stato.errori ?? {};
  return (
    <form action={azione} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      <div className="campo">
        <label htmlFor="nome">Nome</label>
        <input id="nome" name="nome" defaultValue={i.nome} required aria-invalid={!!err.nome} />
        {err.nome && <span className="errore">{err.nome}</span>}
      </div>
      <div className="campo">
        <label htmlFor="cognome">Cognome</label>
        <input id="cognome" name="cognome" defaultValue={i.cognome} required aria-invalid={!!err.cognome} />
        {err.cognome && <span className="errore">{err.cognome}</span>}
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
      <div className="campo">
        <label htmlFor="allergie">Intolleranze o allergie alimentari</label>
        <textarea id="allergie" name="allergie" defaultValue={i.allergie ?? ""} rows={2} maxLength={500} />
      </div>
      <div className="campo campo-check">
        <input id="animatore" name="animatore" type="checkbox" defaultChecked={i.animatore} />
        <label htmlFor="animatore">Animatore</label>
      </div>
      <div className="azioni-testa">
        <button className="btn" disabled={inCorso}>{inCorso ? "Salvataggio…" : "Salva le modifiche"}</button>
        <Link className="btn btn-secondario" href="/admin">Annulla</Link>
      </div>
    </form>
  );
}
