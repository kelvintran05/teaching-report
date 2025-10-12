"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-blue-200 bg-white/80 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-600 text-sm flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span>
              © {year} Teaching Report - Hệ thống báo cáo giảng dạy hiện đại
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="/"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Trang chủ
            </a>
            <a
              href="/builder"
              className="text-slate-600 hover:text-blue-600 transition-colors font-medium"
            >
              Tạo báo cáo
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
