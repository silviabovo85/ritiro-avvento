import Link from "next/link";
import AuthForm from "../AuthForm";
import { EMAIL, PASSWORD } from "../campi";
import { accedi } from "./actions";

export default async function Login({ searchParams }: { searchParams: Promise<{ errore?: string }> }) {
  const { errore } = await searchParams;
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata</p>
        <h1 className="titolo-pagina">Accesso amministratori</h1>
        {errore === "non-autorizzato" && (
          <p className="esito esito-errore">Questo indirizzo non è abilitato all&apos;area riservata.</p>
        )}
        {errore === "link" && (
          <p className="esito esito-errore">Il link non è valido o è scaduto. Richiedine uno nuovo.</p>
        )}
        <AuthForm azione={accedi} campi={[EMAIL, PASSWORD]} pulsante="Accedi" />
        <p className="link-auth">
          <Link href="/admin/primo-accesso">Primo accesso? Crea la tua password</Link>
          <Link href="/admin/password-dimenticata">Password dimenticata?</Link>
        </p>
      </div>
    </section>
  );
}
