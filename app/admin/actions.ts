"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getAdmin } from "@/lib/supabase";
import { leggiIscrizione, type Errori } from "@/lib/validazione";

export async function esci() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function aggiungiAdmin(formData: FormData) {
  const admin = await getAdmin();
  if (admin?.role !== "superadmin") return;
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const { error } = await admin.supabase.from("admins").insert({ email, role: "admin" });
  if (error && error.code !== "23505") console.error("Errore aggiunta admin", error);
  revalidatePath("/admin");
}

export async function rimuoviAdmin(formData: FormData) {
  const admin = await getAdmin();
  if (admin?.role !== "superadmin") return;
  const email = String(formData.get("email") ?? "");
  await admin.supabase.from("admins").delete().eq("email", email).eq("role", "admin");
  revalidatePath("/admin");
}

export async function eliminaIscrizione(formData: FormData) {
  const admin = await getAdmin();
  if (!admin) return;
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  const { error } = await admin.supabase.from("iscrizioni").delete().eq("id", id);
  if (error) console.error("Errore cancellazione iscrizione", error);
  revalidatePath("/admin");
}

export type StatoModifica = { ok: boolean; messaggio?: string; errori?: Errori };

export async function modificaIscrizione(id: number, _prev: StatoModifica, formData: FormData): Promise<StatoModifica> {
  const admin = await getAdmin();
  if (admin?.role !== "superadmin") return { ok: false, messaggio: "Solo il super admin può modificare le iscrizioni." };
  const { dati, errori } = leggiIscrizione(formData);
  if (Object.keys(errori).length) return { ok: false, errori, messaggio: "Controlla i campi evidenziati." };
  const { error } = await admin.supabase.from("iscrizioni").update(dati).eq("id", id);
  if (error) {
    console.error("Errore modifica iscrizione", error);
    return { ok: false, messaggio: "Non è stato possibile salvare le modifiche." };
  }
  revalidatePath("/admin");
  redirect("/admin");
}
