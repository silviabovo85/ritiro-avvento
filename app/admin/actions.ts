"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, getAdmin } from "@/lib/supabase";

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
