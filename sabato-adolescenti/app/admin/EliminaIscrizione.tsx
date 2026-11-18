"use client";

import { eliminaIscrizione } from "./actions";

export default function EliminaIscrizione({ id, nome }: { id: number; nome: string }) {
  return (
    <form action={eliminaIscrizione}
      onSubmit={(e) => { if (!confirm(`Eliminare l'iscrizione di ${nome}? L'operazione non si può annullare.`)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button className="link-rimuovi">Elimina</button>
    </form>
  );
}
