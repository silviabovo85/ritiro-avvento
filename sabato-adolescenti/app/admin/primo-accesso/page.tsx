import Link from "next/link";
import AuthForm from "../AuthForm";
import { CONFERMA, EMAIL, NUOVA } from "../campi";
import { primoAccesso } from "../login/actions";

export default function PrimoAccesso() {
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata</p>
        <h1 className="titolo-pagina">Primo accesso</h1>
        <p className="nota">
          Usa l&apos;email con cui il super admin ti ha abilitato e scegli una password. Riceverai
          un&apos;email per confermare l&apos;indirizzo.
        </p>
        <AuthForm azione={primoAccesso} campi={[EMAIL, NUOVA, CONFERMA]} pulsante="Crea la password" />
        <p className="link-auth"><Link href="/admin/login">← Torna all&apos;accesso</Link></p>
      </div>
    </section>
  );
}
