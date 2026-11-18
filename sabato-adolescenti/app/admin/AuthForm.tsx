"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { StatoAuth } from "./login/actions";

type Campo = { name: string; label: string; type: string; autoComplete: string };

export default function AuthForm({ azione, campi, pulsante, dopoOk }: {
  azione: (prev: StatoAuth, formData: FormData) => Promise<StatoAuth>;
  campi: Campo[];
  pulsante: string;
  dopoOk?: { href: string; testo: string };
}) {
  const [stato, invia, inCorso] = useActionState(azione, { ok: false });

  if (stato.ok) {
    return (
      <div className="esito esito-ok" role="status">
        <p>{stato.messaggio}</p>
        {dopoOk && <Link className="btn" href={dopoOk.href}>{dopoOk.testo}</Link>}
      </div>
    );
  }

  return (
    <form action={invia} className="form">
      {stato.messaggio && <p className="esito esito-errore" role="alert">{stato.messaggio}</p>}
      {campi.map((c) => (
        <div className="campo" key={c.name}>
          <label htmlFor={c.name}>{c.label}</label>
          <input id={c.name} name={c.name} type={c.type} autoComplete={c.autoComplete} required
            minLength={c.type === "password" && c.autoComplete === "new-password" ? 8 : undefined}
            defaultValue={c.name === "email" ? stato.email : undefined} />
        </div>
      ))}
      <button className="btn" disabled={inCorso}>{inCorso ? "Attendere…" : pulsante}</button>
    </form>
  );
}
