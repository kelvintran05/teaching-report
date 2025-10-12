# Teaching Report (Next.js)

Một bộ khung (scaffold) giúp rút ngắn thời gian làm **báo cáo giảng dạy** từ Excel.

## Tính năng
- Trang **Upload** để tải file Excel và parse nhanh bằng `xlsx`
- Tự nhận diện dòng header cơ bản; sinh **mapping** (slug) cho cột
- Trang **Templates** hiển thị mapping mẫu để chuẩn hoá schema
- UI tối giản bằng Tailwind

## Chạy dự án
```bash
pnpm i   # hoặc npm i / yarn
pnpm dev # chạy localhost:3000
```

## Lộ trình mở rộng
- Trình ánh xạ cột (drag & drop) → schema chuẩn
- Lưu cấu hình mapping theo người dùng/team
- Trang tạo **Report PDF/HTML** từ template (EJS/Handlebars/React-PDF)
- Biểu đồ thống kê (tuần/tháng/quý)
- Tải nhiều sheet, ghép dữ liệu
```
## Xuất template
- Mẫu Handlebars: `report-templates/teaching-weekly.hbs`
- Trang fill: `/fill` — dán JSON → Fill → Tải HTML hoặc In ra PDF.
- API: `POST /api/fill` body `{ templateName: "teaching-weekly", data: {...} }`

## Builder
- Trang `/builder`: nhập **Giảng viên**, chọn **Ngày bắt đầu/kết thúc**, thêm các **dòng hoạt động** (có `date` dạng date picker, `class`, `topic`, `hours`, `notes`).
- Tự tính **tổng số giờ**.
- Nhấn **Fill template** để xem preview & in PDF, hoặc **Tải JSON** để lưu dữ liệu.

### Template mới nhất
- API: `GET /api/template/latest` → trả về danh sách **Trường**, **Lớp** (phụ thuộc), **Buổi**, **Tiết 1-5**, **Trợ giảng**.
- Trang `/builder` sẽ tự tải **template mới nhất** và hiển thị chọn **Trường** → **Lớp (multi-select)**, **Buổi**, **Tiết**, **Trợ giảng (multi-select)**.
- Khi fill template, dữ liệu lớp sẽ join theo nhiều lựa chọn vào cột **Lớp**.
