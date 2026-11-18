import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (toSet) => {
          try {
            toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Chiamato da un Server Component: il middleware aggiorna la sessione.
          }
        },
      },
    },
  );
}

export type Ruolo = "superadmin" | "admin";

/** Restituisce l'utente collegato e il suo ruolo, oppure null se non e' un admin. */
export async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const { data } = await supabase
    .from("admins")
    .select("email, role")
    .eq("email", user.email.toLowerCase())
    .maybeSingle();
  if (!data) return null;
  return { supabase, email: data.email as string, role: data.role as Ruolo };
}
