import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase";
import { ANNATE } from "@/lib/evento";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", request.url));

  const { data, error } = await admin.supabase
    .from("iscrizioni_adolescenti")
    .select("created_at, nome, cognome, annata, cena, animatore, allergie")
    .order("cognome", { ascending: true })
    .order("nome", { ascending: true });
  if (error) return new NextResponse("Errore nel recupero delle iscrizioni", { status: 500 });

  const wb = new ExcelJS.Workbook();
  wb.creator = "Parrocchia San Pietro Apostolo";
  const ws = wb.addWorksheet("Iscrizioni");
  ws.columns = [
    { header: "N.", key: "n", width: 6 },
    { header: "Cognome", key: "cognome", width: 22 },
    { header: "Nome", key: "nome", width: 20 },
    { header: "Annata", key: "annata", width: 10 },
    { header: "Classe", key: "classe", width: 16 },
    { header: "Viene a cena", key: "cena", width: 14 },
    { header: "Animatore", key: "animatore", width: 12 },
    { header: "Intolleranze / allergie", key: "allergie", width: 36 },
    { header: "Data iscrizione", key: "data", width: 20 },
  ];
  const righe = data ?? [];
  righe.forEach((r, i) => {
    // Data in ora italiana, come testo per evitare conversioni di fuso in Excel
    const data = new Date(r.created_at).toLocaleString("it-IT", { timeZone: "Europe/Rome" });
    const classe = ANNATE.find((a) => a.anno === r.annata)?.classe ?? "";
    ws.addRow({ n: i + 1, cognome: r.cognome, nome: r.nome, annata: r.annata ?? "", classe, cena: r.cena ? "Sì" : "No", animatore: r.animatore ? "Sì" : "No", allergie: r.allergie ?? "", data });
  });
  const aCena = righe.filter((r) => r.cena).length;
  ws.addRow({});
  ws.addRow({ cognome: `Totale iscritti: ${righe.length}`, cena: `A cena: ${aCena}` }).font = { bold: true };

  const testa = ws.getRow(1);
  testa.font = { bold: true, color: { argb: "FFFFFFFF" } };
  testa.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF193764" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: "A1", to: "I1" };

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="iscrizioni-sabato-sera-adolescenti-2026.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
