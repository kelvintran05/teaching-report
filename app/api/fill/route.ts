import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import Handlebars from "handlebars";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateName, data } = body as { templateName: string; data: any };
    if (!templateName || !data) {
      return NextResponse.json({ error: "Missing templateName or data" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "report-templates", `${templateName}.hbs`);
    const tplStr = await fs.readFile(filePath, "utf8");
    const compile = Handlebars.compile(tplStr, { noEscape: true });
    const html = compile(data);

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "Fill error" }, { status: 500 });
  }
}
