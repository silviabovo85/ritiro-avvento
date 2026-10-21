import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getAdmin } from "@/lib/supabase";
import { aggiungiAdmin, esci, rimuoviAdmin } from "./actions";
import EliminaIscrizione from "./EliminaIscrizione";

export const dynamic = "force-dynamic";

type Iscrizione = {
  id: number;
  created_at: string;
  nome_bambino: string;
  gruppo_catechismo: string;
  numero_genitori: number;
  telefono: string;
  email: string;
};

const dataOra = new Intl.DateTimeFormat("it-IT", {
  dateStyle: "short", timeStyle: "short", timeZone: "Europe/Rome",
});

export default async function Admin() {
  const admin = await getAdmin();
  if (!admin) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    redirect(user ? "/admin/login?errore=non-autorizzato" : "/admin/login");
  }

  const { data } = await admin.supabase
    .from("iscrizioni")
    .select("id, created_at, nome_bambino, gruppo_catechismo, numero_genitori, telefono, email")
    .order("created_at", { ascending: true });
  const iscrizioni = (data ?? []) as Iscrizione[];
  const genitori = iscrizioni.reduce((tot, i) => tot + i.numero_genitori, 0);

  const admins = admin.role === "superadmin"
    ? ((await admin.supabase.from("admins").select("email, role").order("role", { ascending: false }).order("email")).data ?? [])
    : [];

  return (
    <section className="contenitore sezione">
      <div className="admin-testa">
        <div>
          <p className="etichetta">Area riservata · {admin.role === "superadmin" ? "Super admin" : "Admin"}</p>
          <h1 className="titolo-pagina">Iscrizioni al ritiro di Avvento</h1>
          <p className="nota">Collegato come {admin.email}</p>
        </div>
        <div className="azioni-testa">
          <Link className="btn btn-secondario" href="/admin/nuova-password">Cambia password</Link>
          <form action={esci}><button className="btn btn-secondario">Esci</button></form>
        </div>
      </div>

      <div className="riepilogo">
        <div><span className="numero">{iscrizioni.length}</span><span>ragazzi iscritti</span></div>
        <div><span className="numero">{genitori}</span><span>genitori</span></div>
        <div><span className="numero">{iscrizioni.length + genitori}</span><span>partecipanti totali</span></div>
        <a className="btn" href="/admin/export">Scarica il file Excel ↓</a>
      </div>

      <div className="tabella-scroll">
        <table className="tabella">
          <thead>
            <tr>
              <th>#</th><th>Ragazzo/a</th><th>Gruppo</th><th>Genitori</th><th>Telefono</th><th>Email</th><th>Data</th><th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {iscrizioni.length === 0 && (
              <tr><td colSpan={8} className="vuoto">Nessuna iscrizione ancora.</td></tr>
            )}
            {iscrizioni.map((i, n) => (
              <tr key={i.id}>
                <td>{n + 1}</td>
                <td>{i.nome_bambino}</td>
                <td>{i.gruppo_catechismo}</td>
                <td>{i.numero_genitori}</td>
                <td><a href={`tel:${i.telefono}`}>{i.telefono}</a></td>
                <td><a href={`mailto:${i.email}`}>{i.email}</a></td>
                <td>{dataOra.format(new Date(i.created_at))}</td>
                <td>
                  <div className="azioni-riga">
                    {admin.role === "superadmin" && <Link href={`/admin/iscrizioni/${i.id}`}>Modifica</Link>}
                    <EliminaIscrizione id={i.id} nome={i.nome_bambino} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {admin.role === "superadmin" && (
        <div className="scheda gestione-admin">
          <p className="etichetta">Super admin</p>
          <h2>Amministratori</h2>
          <p className="nota">
            Gli admin possono vedere, cancellare e scaricare le iscrizioni, ma non modificarle. Dopo che li hai
            aggiunti, vanno su &quot;Area riservata&quot; → &quot;Primo accesso&quot;, scelgono la loro password e
            confermano l&apos;email.
          </p>
          <ul className="lista-admin">
            {admins.map((a) => (
              <li key={a.email}>
                <span>{a.email} <em>{a.role === "superadmin" ? "super admin" : "admin"}</em></span>
                {a.role === "admin" && (
                  <form action={rimuoviAdmin}>
                    <input type="hidden" name="email" value={a.email} />
                    <button className="link-rimuovi">Rimuovi</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          <form action={aggiungiAdmin} className="form-in-linea">
            <label htmlFor="nuovo-admin" className="sr">Email del nuovo admin</label>
            <input id="nuovo-admin" name="email" type="email" required placeholder="email@esempio.it" />
            <button className="btn">Aggiungi admin</button>
          </form>
        </div>
      )}
    </section>
  );
}
