import Link from "next/link";
import AuthForm from "../AuthForm";
import { EMAIL } from "../campi";
import { recuperaPassword } from "../login/actions";

export default function PasswordDimenticata() {
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata</p>
        <h1 className="titolo-pagina">Password dimenticata</h1>
        <p className="nota">Ti invieremo un link per scegliere una nuova password.</p>
        <AuthForm azione={recuperaPassword} campi={[EMAIL]} pulsante="Invia il link" />
        <p className="link-auth"><Link href="/admin/login">← Torna all&apos;accesso</Link></p>
      </div>
    </section>
  );
}
