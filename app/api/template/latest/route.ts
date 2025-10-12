import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function GET() {
  try {
    const p = path.join(process.cwd(), "report-templates", "meta", "latest.json");
    const data = await fs.readFile(p, "utf8");
    return new NextResponse(data, { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "Not found" }, { status: 404 });
  }
}
