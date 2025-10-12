"use client";

import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleParse() {
    if (!file) return;
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/parse", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="grid gap-6 py-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
          📤 Upload & Parse Excel
        </h1>
        <p className="text-slate-400">
          Tải lên file Excel và chuyển đổi thành JSON
        </p>
      </div>

      <section className="card">
        <h2 className="section-title">📁 Upload File</h2>

        <div className="space-y-6">
          <div>
            <label className="label">📊 Chọn file Excel</label>
            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls"
                className="input w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            {file && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
                <p className="text-sm text-emerald-300">
                  ✓ Đã chọn: <span className="font-semibold">{file.name}</span>{" "}
                  ({(file.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>

          <div>
            <button
              className="btn-primary w-full text-lg py-3"
              onClick={handleParse}
              disabled={!file}
            >
              🔄 Parse File
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300">❌ {error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-emerald-400">
                  ✅ Kết quả Parse
                </h3>
                <button
                  className="btn-secondary text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(result, null, 2)
                    );
                  }}
                >
                  📋 Copy JSON
                </button>
              </div>

              <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
                <pre className="overflow-auto max-h-[500px] p-4 text-xs leading-relaxed">
                  <code className="text-emerald-300">
                    {JSON.stringify(result, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="card bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">📌</div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-yellow-300">
              Hướng dẫn sử dụng
            </h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>
                  Chọn file Excel (.xlsx hoặc .xls) từ máy tính của bạn
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>
                  Nhấn nút "Parse File" để chuyển đổi dữ liệu sang JSON
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400">•</span>
                <span>
                  Sao chép JSON và sử dụng trong trang{" "}
                  <a
                    href="/fill"
                    className="underline text-indigo-400 hover:text-indigo-300"
                  >
                    Fill
                  </a>{" "}
                  hoặc{" "}
                  <a
                    href="/builder"
                    className="underline text-indigo-400 hover:text-indigo-300"
                  >
                    Builder
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
