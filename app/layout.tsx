import "./globals.css";
import "antd/dist/reset.css";
import ClientWrapper from "./ClientWrapper";
import Footer from "./Footer";

export const metadata = {
  title: "Teaching Report",
  description: "Rút ngắn thời gian làm báo cáo giảng dạy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-blue-200 shadow-md">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  📚
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Teaching Report
                  </h1>
                  <p className="text-xs text-slate-500">
                    Hệ thống báo cáo giảng dạy
                  </p>
                </div>
              </a>
              <nav className="hidden md:flex items-center gap-2">
                <a
                  href="/"
                  className="px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700 hover:text-blue-600 font-medium"
                >
                  🏠 Trang chủ
                </a>
                <a
                  href="/builder"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all hover:scale-105"
                >
                  ✏️ Tạo báo cáo
                </a>
              </nav>

              {/* Mobile menu button */}
              <button className="md:hidden px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-slate-700">
                ☰
              </button>
            </div>
          </div>
        </header>

        <main className="container flex-1 pb-12">
          <ClientWrapper>{children}</ClientWrapper>
        </main>

        <Footer />
      </body>
    </html>
  );
}
