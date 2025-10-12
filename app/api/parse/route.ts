import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return new NextResponse("No file", { status: 400 });
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const wb = XLSX.read(buf, { type: "buffer" });
    const sheets = wb.SheetNames;

    // Heuristic: get first sheet as primary
    const ws = wb.Sheets[sheets[0]];
    // Try to find first non-empty row as header by scanning
    // Convert with header:1 to raw 2D array
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
    let headerRowIdx = rows.findIndex(r => r.some((c:string)=> String(c||"" ).trim() !== ""));
    if (headerRowIdx < 0) headerRowIdx = 0;
    const header = rows[headerRowIdx].map((h:any)=> String(h||"").trim());

    // Build objects from next non-empty lines until a blank block
    const bodyRows = rows.slice(headerRowIdx + 1);
    const data: Record<string, any>[] = [];
    for (const r of bodyRows) {
      const hasAny = r.some((c:string)=> String(c||"").trim() !== "");
      if (!hasAny) continue;
      const obj: Record<string, any> = {};
      for (let i=0; i<header.length; i++) {
        const key = header[i] || `col_${i+1}`;
        obj[key] = r[i] ?? "";
      }
      data.push(obj);
    }

    // Build a simple slug mapping
    const slug = (s:string)=> (s||"")
      .normalize("NFD").replace(/\p{Diacritic}/gu, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

    const mapping: Record<string,string> = {};
    for (const h of header) {
      mapping[h || "(empty)"] = slug(h || "");
    }

    return NextResponse.json({
      sheets,
      headerRowIdx,
      header,
      mapping,
      preview: data.slice(0, 10),
      count: data.length
    });
  } catch (e:any) {
    return new NextResponse(e?.message || "Parse error", { status: 500 });
  }
}
