"use client";

import { useActionState } from "react";
import { iscrivi, type StatoForm } from "./actions";

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
        <p>Vi aspettiamo sabato 28 novembre alle 16.00.</p>
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
        <label htmlFor="nome_bambino">Nome e cognome del ragazzo/a *</label>
        <input id="nome_bambino" name="nome_bambino" defaultValue={v.nome_bambino} autoComplete="off" required maxLength={120}
          aria-invalid={!!err.nome_bambino} />
        {err.nome_bambino && <span className="errore">{err.nome_bambino}</span>}
      </div>

      <div className="campo">
        <label htmlFor="gruppo_catechismo">Gruppo di catechismo *</label>
        <input id="gruppo_catechismo" name="gruppo_catechismo" defaultValue={v.gruppo_catechismo} required maxLength={120}
          placeholder="Es. 1ª media, gruppo di Maria" aria-invalid={!!err.gruppo_catechismo} />
        {err.gruppo_catechismo && <span className="errore">{err.gruppo_catechismo}</span>}
      </div>

      <div className="campo">
        <label htmlFor="numero_genitori">Numero di genitori partecipanti *</label>
        <select id="numero_genitori" name="numero_genitori" defaultValue={v.numero_genitori ?? ""} required
          aria-invalid={!!err.numero_genitori}>
          <option value="" disabled>Seleziona</option>
          <option value="0">Nessuno</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        {err.numero_genitori && <span className="errore">{err.numero_genitori}</span>}
      </div>

      <div className="riga">
        <div className="campo">
          <label htmlFor="telefono">Numero di telefono *</label>
          <input id="telefono" name="telefono" defaultValue={v.telefono} type="tel" autoComplete="tel" required
            aria-invalid={!!err.telefono} />
          {err.telefono && <span className="errore">{err.telefono}</span>}
        </div>
        <div className="campo">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" defaultValue={v.email} type="email" autoComplete="email" required
            aria-invalid={!!err.email} />
          {err.email && <span className="errore">{err.email}</span>}
        </div>
      </div>

      <div className="trappola" aria-hidden="true">
        <label htmlFor="sito_web">Non compilare</label>
        <input id="sito_web" name="sito_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="campo campo-check">
        <input id="consenso_privacy" name="consenso_privacy" type="checkbox" defaultChecked={v.consenso_privacy === "on"} required />
        <label htmlFor="consenso_privacy">
          Acconsento al trattamento dei dati personali da parte della Parrocchia San Pietro Apostolo
          per la sola organizzazione del ritiro. *
        </label>
      </div>
      {err.consenso_privacy && <span className="errore">{err.consenso_privacy}</span>}

      <button type="submit" className="btn" disabled={inCorso}>
        {inCorso ? "Invio in corso…" : "Invia l'iscrizione"}
      </button>
    </form>
  );
}
