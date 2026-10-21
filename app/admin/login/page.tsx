import LoginForm from "./LoginForm";

export default async function Login({ searchParams }: { searchParams: Promise<{ errore?: string }> }) {
  const { errore } = await searchParams;
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata</p>
        <h1 className="titolo-pagina">Accesso amministratori</h1>
        <p className="nota">Inserisci la tua email: riceverai un link per entrare, senza password.</p>
        {errore === "non-autorizzato" && (
          <p className="esito esito-errore">Questo indirizzo non è abilitato all&apos;area riservata.</p>
        )}
        {errore === "link" && (
          <p className="esito esito-errore">Il link non è valido o è scaduto. Richiedine uno nuovo.</p>
        )}
        <LoginForm />
      </div>
    </section>
  );
}
