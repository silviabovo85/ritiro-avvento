"use client";

import { useActionState } from "react";
import { inviaLink, type StatoLogin } from "./actions";

export default function LoginForm() {
  const [stato, azione, inCorso] = useActionState(inviaLink, { ok: false } as StatoLogin);
  if (stato.ok) return <p className="esito esito-ok" role="status">{stato.messaggio}</p>;
  return (
    <form action={azione} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      <div className="campo">
        <label htmlFor="email">La tua email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <button className="btn" disabled={inCorso}>{inCorso ? "Invio…" : "Ricevi il link di accesso"}</button>
    </form>
  );
}
