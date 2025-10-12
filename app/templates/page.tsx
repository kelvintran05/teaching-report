import mapping from "@/sample_mapping.json";

export default function TemplatesPage() {
  return (
    <div className="grid gap-6 py-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-2">
          📋 Templates & Schema
        </h1>
        <p className="text-slate-400">Xem cấu trúc dữ liệu và mapping mẫu</p>
      </div>

      <section className="card">
        <h2 className="section-title">🗺️ Schema chuẩn & Mapping</h2>
        <p className="text-slate-300 mb-6">
          Dưới đây là ví dụ Mapping tự động sinh từ file mẫu của bạn (có thể
          chỉnh sửa sau).
        </p>
        <div className="bg-slate-900/80 border border-slate-700 rounded-xl overflow-hidden">
          <pre className="p-4 text-xs overflow-auto max-h-[500px] leading-relaxed">
            <code className="text-cyan-300">
              {JSON.stringify(mapping, null, 2)}
            </code>
          </pre>
        </div>
      </section>

      <section className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <h2 className="section-title">📝 Gợi ý trường chuẩn</h2>
        <p className="text-slate-300 mb-4">
          Các trường dữ liệu được khuyến nghị (có thể tùy biến theo nhu cầu):
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { field: "date", desc: "Ngày thực hiện hoạt động", icon: "📅" },
            {
              field: "teacher",
              desc: "Tên giảng viên/người phụ trách",
              icon: "👤",
            },
            {
              field: "course / class / grade",
              desc: "Lớp học hoặc khóa học",
              icon: "🏫",
            },
            {
              field: "topic / activity",
              desc: "Chủ đề hoặc nội dung hoạt động",
              icon: "📖",
            },
            { field: "hours", desc: "Số giờ giảng dạy", icon: "⏱️" },
            { field: "notes", desc: "Ghi chú bổ sung", icon: "📝" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <code className="text-indigo-400 font-semibold">
                    {item.field}
                  </code>
                  <p className="text-sm text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-blue-300">
              Tip: Tùy chỉnh Template
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-3">
              Bạn có thể tùy chỉnh template Handlebars trong thư mục{" "}
              <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">
                report-templates/
              </code>{" "}
              để thay đổi giao diện báo cáo theo ý muốn.
            </p>
            <p className="text-slate-400 text-sm">
              Tham khảo file{" "}
              <code className="px-2 py-1 bg-slate-800 rounded text-cyan-400">
                teaching-weekly.hbs
              </code>{" "}
              để xem cấu trúc mẫu.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
