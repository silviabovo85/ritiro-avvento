import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";
  // Solo percorsi interni, per non trasformare il callback in un redirect aperto
  const destinazione = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${destinazione}`);
  }
  return NextResponse.redirect(`${origin}/admin/login?errore=link`);
}
