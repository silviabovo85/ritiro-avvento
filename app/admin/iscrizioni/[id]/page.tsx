import { notFound, redirect } from "next/navigation";
import { getAdmin } from "@/lib/supabase";
import ModificaForm from "./ModificaForm";

export const dynamic = "force-dynamic";

export default async function ModificaIscrizione({ params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (admin?.role !== "superadmin") redirect("/admin");
  const { id } = await params;
  const { data } = await admin.supabase
    .from("iscrizioni")
    .select("id, nome_bambino, gruppo_catechismo, numero_genitori, telefono, email")
    .eq("id", Number(id))
    .maybeSingle();
  if (!data) notFound();
  return (
    <section className="contenitore sezione stretta">
      <div className="scheda">
        <p className="etichetta">Area riservata · Super admin</p>
        <h1 className="titolo-pagina">Modifica iscrizione</h1>
        <ModificaForm iscrizione={data} />
      </div>
    </section>
  );
}
