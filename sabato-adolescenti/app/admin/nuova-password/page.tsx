import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AuthForm from "../AuthForm";
import { CONFERMA, NUOVA } from "../campi";
import { nuovaPassword } from "../login/actions";

export const dynamic = "force-dynamic";

export default async function NuovaPassword() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata</p>
        <h1 className="titolo-pagina">Nuova password</h1>
        <p className="nota">Account: {user.email}</p>
        <AuthForm azione={nuovaPassword} campi={[NUOVA, CONFERMA]} pulsante="Salva la password"
          dopoOk={{ href: "/admin", testo: "Vai al pannello" }} />
        <p className="link-auth"><Link href="/admin">← Torna al pannello</Link></p>
      </div>
    </section>
  );
}
