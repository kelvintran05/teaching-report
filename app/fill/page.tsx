"use client";

import { useEffect, useState } from "react";

type ExampleData = {
  week_range: string;
  teacher: string;
  generated_at: string;
  total_hours: number;
  items: Array<{
    date: string;
    class: string;
    topic: string;
    hours: number;
    notes?: string;
  }>;
};

const sample: ExampleData = {
  week_range: "29/09 - 03/10/2025",
  teacher: "Huỳnh Thị Hoàng Anh",
  generated_at: new Date().toLocaleString("vi-VN"),
  total_hours: 8,
  items: [
    {
      date: "29/09",
      class: "Lớp 1A",
      topic: "Luyện đọc - Bài 3",
      hours: 2,
      notes: "",
    },
    {
      date: "30/09",
      class: "Lớp 1B",
      topic: "Toán - Số 1-5",
      hours: 2,
      notes: "",
    },
    {
      date: "02/10",
      class: "Lớp 2A",
      topic: "Chính tả - Ôn tập",
      hours: 2,
      notes: "Bài kiểm tra ngắn",
    },
    {
      date: "03/10",
      class: "Lớp 2B",
      topic: "Toán - So sánh số",
      hours: 2,
      notes: "",
    },
  ],
};

export default function FillPage() {
  const [template, setTemplate] = useState("teaching-weekly");
  const [jsonStr, setJsonStr] = useState(JSON.stringify(sample, null, 2));
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFill() {
    setError(null);
    setHtml(null);
    let data: any;
    try {
      data = JSON.parse(jsonStr);
    } catch (e: any) {
      setError("JSON không hợp lệ: " + e.message);
      return;
    }

    try {
      const res = await fetch("/api/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateName: template, data }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(j.error || res.statusText);
      }
      const text = await res.text();
      setHtml(text);
    } catch (e: any) {
      setError(e.message);
    }
  }

  function downloadHTML() {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${template}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function printPDF() {
    // Open in new window and trigger print (user can save as PDF)
    if (!html) return;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print(); // User chooses "Save as PDF"
    }
  }

  return (
    <div className="grid gap-6 py-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          📋 Xuất Report từ JSON
        </h1>
        <p className="text-slate-400">
          Test template với dữ liệu JSON tùy chỉnh
        </p>
      </div>

      <section className="card">
        <h2 className="section-title">⚙️ Cấu hình Template</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="label">📄 Template</label>
              <select
                className="input w-full"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="teaching-weekly">teaching-weekly.hbs</option>
              </select>
            </div>

            <div>
              <label className="label">📝 Dữ liệu JSON</label>
              <textarea
                className="input min-h-[320px] font-mono text-xs w-full"
                value={jsonStr}
                onChange={(e) => setJsonStr(e.target.value)}
                placeholder="Nhập dữ liệu JSON..."
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-primary flex-1" onClick={handleFill}>
                ✨ Fill Template
              </button>
              <button
                className="btn-secondary"
                onClick={downloadHTML}
                disabled={!html}
              >
                💾 Tải HTML
              </button>
              <button
                className="btn-success"
                onClick={printPDF}
                disabled={!html}
              >
                🖨️ In PDF
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300">❌ {error}</p>
              </div>
            )}
          </div>

          <div>
            <label className="label">👁️ Preview</label>
            <div className="border-2 border-slate-700 rounded-xl overflow-hidden bg-white text-black min-h-[400px] shadow-2xl">
              {html ? (
                <iframe srcDoc={html} className="w-full h-[520px]" />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center h-[400px]">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-slate-400 text-lg mb-2">Chưa có preview</p>
                  <p className="text-slate-500 text-sm">
                    Nhấn "Fill Template" để xem kết quả
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="card bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-300">
              Gợi ý kết nối từ Excel → JSON
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sau khi parse Excel ở trang{" "}
              <a
                className="underline text-indigo-400 hover:text-indigo-300 transition-colors"
                href="/upload"
              >
                /upload
              </a>
              , bạn có thể map các cột sang schema của template (ví dụ:{" "}
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                date
              </code>
              ,
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                class
              </code>
              ,
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                topic
              </code>
              ,
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                hours
              </code>
              ,
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                notes
              </code>
              ) và tạo JSON để đưa vào đây.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
