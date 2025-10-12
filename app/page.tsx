import Link from "next/link";

export default function Page() {
  return (
    <div className="grid gap-12 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative">
            <div className="text-8xl mb-4">🎓</div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4">
              Teaching Report Generator
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Tạo báo cáo giảng dạy chuyên nghiệp dễ dàng, nhanh chóng và hiệu
              quả
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            className="btn-primary text-xl px-10 py-5 shadow-2xl hover:shadow-blue-500/50"
            href="/builder"
          >
            <span className="text-2xl mr-2">🚀</span>
            Tạo báo cáo ngay
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
        {[
          {
            icon: "⚡",
            title: "Nhanh chóng",
            desc: "Chỉ 3 bước đơn giản để hoàn thành báo cáo tuần",
            color: "from-yellow-400 to-amber-400",
            bg: "from-yellow-50 to-amber-50",
          },
          {
            icon: "🎨",
            title: "Đẹp mắt",
            desc: "Template được thiết kế chuyên nghiệp, dễ đọc và in ấn",
            color: "from-pink-400 to-rose-400",
            bg: "from-pink-50 to-rose-50",
          },
          {
            icon: "💡",
            title: "Dễ sử dụng",
            desc: "Giao diện thân thiện, không cần đào tạo phức tạp",
            color: "from-blue-400 to-cyan-400",
            bg: "from-blue-50 to-cyan-50",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className={`card bg-gradient-to-br ${feature.bg} border-2 hover:scale-105 transition-transform duration-300 cursor-pointer`}
          >
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-4xl mb-4 shadow-lg`}
            >
              {feature.icon}
            </div>
            <h3 className="font-bold text-2xl mb-3 text-slate-800">
              {feature.title}
            </h3>
            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="card max-w-5xl mx-auto w-full bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          <span className="text-4xl mr-2">📚</span>
          Cách sử dụng
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              icon: "📋",
              title: "Nhập thông tin",
              desc: "Điền tên giảng viên và thời gian báo cáo",
            },
            {
              step: "2",
              icon: "✏️",
              title: "Thêm hoạt động",
              desc: "Nhập các buổi giảng dạy trong tuần",
            },
            {
              step: "3",
              icon: "🎉",
              title: "Xuất báo cáo",
              desc: "In PDF hoặc chia sẻ trực tuyến",
            },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-full font-bold text-3xl mb-4 shadow-xl">
                {s.step}
              </div>
              <div className="text-5xl mb-3">{s.icon}</div>
              <h4 className="font-bold text-xl mb-2 text-slate-800">
                {s.title}
              </h4>
              <p className="text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Cards */}
      <section className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <Link
          href="/builder"
          className="card bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:scale-105 transition-all duration-300 p-8"
        >
          <div className="flex items-start gap-6">
            <div className="text-7xl">✏️</div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-3 text-slate-800">
                Bắt đầu tạo báo cáo
              </h3>
              <p className="text-slate-600 text-lg mb-4 leading-relaxed">
                Nhập thông tin trực tiếp vào form, dễ dàng và nhanh chóng. Phù
                hợp cho giáo viên tạo báo cáo hàng tuần.
              </p>
              <span className="inline-flex items-center gap-2 text-green-600 font-bold text-lg">
                Tạo ngay <span>→</span>
              </span>
            </div>
          </div>
        </Link>

        <Link
          href="/upload"
          className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 hover:scale-105 transition-all duration-300 p-8"
        >
          <div className="flex items-start gap-6">
            <div className="text-7xl">📊</div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-3 text-slate-800">
                Import từ Excel
              </h3>
              <p className="text-slate-600 text-lg mb-4 leading-relaxed">
                Đã có sẵn dữ liệu trong Excel? Tải lên và chuyển đổi tự động
                sang báo cáo đẹp mắt.
              </p>
              <span className="inline-flex items-center gap-2 text-purple-600 font-bold text-lg">
                Tải file lên <span>→</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Benefits */}
      <section className="card max-w-5xl mx-auto w-full bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
        <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
          <span className="text-4xl mr-2">💎</span>
          Lợi ích
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "⏰",
              title: "Tiết kiệm thời gian",
              desc: "Giảm thời gian làm báo cáo từ 30 phút xuống còn 5 phút",
            },
            {
              icon: "📊",
              title: "Dữ liệu chính xác",
              desc: "Tự động tính toán tổng giờ, không lo sai sót",
            },
            {
              icon: "🖨️",
              title: "In ấn dễ dàng",
              desc: "Định dạng chuẩn A4, sẵn sàng in hoặc lưu PDF",
            },
            {
              icon: "♻️",
              title: "Tái sử dụng",
              desc: "Lưu template, dùng lại nhiều lần cho các tuần sau",
            },
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-4">
              <div className="text-4xl">{benefit.icon}</div>
              <div>
                <h4 className="font-bold text-xl mb-2 text-slate-800">
                  {benefit.title}
                </h4>
                <p className="text-slate-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
