"use client";

import { useActionState } from "react";
import { iscrivi, type StatoForm } from "./actions";
import { ANNATE } from "@/lib/evento";

const iniziale: StatoForm = { ok: false };

export default function FormIscrizione() {
  const [stato, azione, inCorso] = useActionState(iscrivi, iniziale);
  const err = stato.errori ?? {};
  const v = stato.valori ?? {};

  if (stato.ok && stato.messaggio) {
    return (
      <div className="esito esito-ok" role="status">
        <p className="esito-titolo">✦ Iscrizione ricevuta</p>
        <p>{stato.messaggio}</p>
        <p>Ti aspettiamo sabato 28 novembre alle 20.00.</p>
        <button type="button" className="btn btn-secondario" onClick={() => location.reload()}>
          Iscrivi un altro ragazzo/a
        </button>
      </div>
    );
  }

  return (
    <form key={stato.tentativo ?? 0} action={azione} className="form" noValidate>
      {stato.messaggio && !stato.ok && (
        <p className="esito esito-errore" role="alert">{stato.messaggio}</p>
      )}

      <div className="campo">
        <label htmlFor="nome_cognome">Nome e cognome *</label>
        <input id="nome_cognome" name="nome_cognome" defaultValue={v.nome_cognome} autoComplete="name" required maxLength={120}
          aria-invalid={!!err.nome_cognome} />
        {err.nome_cognome && <span className="errore">{err.nome_cognome}</span>}
      </div>

      <div className="campo">
        <label htmlFor="annata">Annata *</label>
        <select id="annata" name="annata" defaultValue={v.annata ?? ""} required aria-invalid={!!err.annata}>
          <option value="" disabled>Seleziona l&apos;anno di nascita</option>
          {ANNATE.map((a) => <option key={a.anno} value={a.anno}>{a.anno} ({a.classe})</option>)}
        </select>
        {err.annata && <span className="errore">{err.annata}</span>}
      </div>

      <fieldset className="campo scelta" aria-invalid={!!err.cena}>
        <legend>Vengo a cena *</legend>
        <div className="scelta-opzioni">
          <label><input type="radio" name="cena" value="si" defaultChecked={v.cena === "si"} required /> Sì</label>
          <label><input type="radio" name="cena" value="no" defaultChecked={v.cena === "no"} /> No</label>
        </div>
        {err.cena && <span className="errore">{err.cena}</span>}
      </fieldset>

      <div className="trappola" aria-hidden="true">
        <label htmlFor="sito_web">Non compilare</label>
        <input id="sito_web" name="sito_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo campo-check">
        <input id="consenso_privacy" name="consenso_privacy" type="checkbox" defaultChecked={v.consenso_privacy === "on"} required />
        <label htmlFor="consenso_privacy">
          Acconsento al trattamento dei dati personali da parte della Parrocchia San Pietro Apostolo
          per la sola organizzazione della serata. *
        </label>
      </div>
      {err.consenso_privacy && <span className="errore">{err.consenso_privacy}</span>}

      <button type="submit" className="btn" disabled={inCorso}>
        {inCorso ? "Invio in corso…" : "Invia l'iscrizione"}
      </button>
    </form>
  );
}
