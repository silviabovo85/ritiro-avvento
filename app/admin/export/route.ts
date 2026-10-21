import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.redirect(new URL("/admin/login", request.url));

  const { data, error } = await admin.supabase
    .from("iscrizioni")
    .select("created_at, nome_bambino, gruppo_catechismo, numero_genitori, telefono, email")
    .order("created_at", { ascending: true });
  if (error) return new NextResponse("Errore nel recupero delle iscrizioni", { status: 500 });

  const wb = new ExcelJS.Workbook();
  wb.creator = "Parrocchia San Pietro Apostolo";
  const ws = wb.addWorksheet("Iscrizioni");
  ws.columns = [
    { header: "N.", key: "n", width: 6 },
    { header: "Nome e cognome ragazzo/a", key: "nome_bambino", width: 32 },
    { header: "Gruppo di catechismo", key: "gruppo_catechismo", width: 26 },
    { header: "Genitori partecipanti", key: "numero_genitori", width: 20 },
    { header: "Telefono", key: "telefono", width: 18 },
    { header: "Email", key: "email", width: 32 },
    { header: "Data iscrizione", key: "data", width: 20 },
  ];
  (data ?? []).forEach((r, i) => {
    // Data in ora italiana, come testo per evitare conversioni di fuso in Excel
    const data = new Date(r.created_at).toLocaleString("it-IT", { timeZone: "Europe/Rome" });
    ws.addRow({ n: i + 1, ...r, data });
  });
  const totGenitori = (data ?? []).reduce((t, r) => t + r.numero_genitori, 0);
  ws.addRow({});
  ws.addRow({ nome_bambino: `Totale ragazzi: ${data?.length ?? 0}`, numero_genitori: totGenitori }).font = { bold: true };

  const testa = ws.getRow(1);
  testa.font = { bold: true, color: { argb: "FFFFFFFF" } };
  testa.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF193764" } };
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.autoFilter = { from: "A1", to: "G1" };

  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="iscrizioni-ritiro-avvento-2026.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
