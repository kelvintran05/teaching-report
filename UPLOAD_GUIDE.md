# 📤 Hướng Dẫn Upload File Excel

## 🎯 **Tính năng Upload File Excel**

Tính năng này cho phép bạn **import hàng loạt** các hoạt động giảng dạy từ file Excel, tiết kiệm thời gian thay vì nhập thủ công từng hoạt động một.

---

## 📋 **Cách sử dụng**

### **Bước 1: Tải Template Excel Mẫu**

1. Vào trang **Tạo báo cáo** (`/builder`)
2. Ở phần **"Thêm hoạt động mới"**, click nút **📋 Template**
3. File `Template_Import_Hoat_Dong.xlsx` sẽ được tải về

### **Bước 2: Điền Dữ Liệu vào Template**

Mở file Excel vừa tải về và điền thông tin theo các cột:

| Cột | Tên Cột | Mô tả | Ví dụ |
|-----|---------|-------|-------|
| A | **Ngày** | Ngày giảng dạy (DD/MM/YYYY) | `10/10/2024` |
| B | **Trường** | Tên trường | `TH Đinh Bộ Lĩnh` |
| C | **Buổi** | Buổi học | `Sáng` hoặc `Chiều` |
| D | **Tiết** | Tiết học | `1`, `2`, `3`... |
| E | **Lớp** | Tên lớp (có thể nhiều lớp, cách nhau bởi dấu phẩy) | `2/1,2/2` hoặc `1/12` |
| F | **Tên bài** | Tên bài giảng | `Toán - Phép cộng trong phạm vi 20` |
| G | **Trợ giảng** | Tên trợ giảng | `Ngọc An` hoặc để trống |
| H | **Tình hình tiết học** | Tình hình lớp học, cơ sở vật chất | `Tình hình cơ sở vật chất: Ti vi sử dụng bình thường` |
| I | **Tự đánh giá** | Tự đánh giá của giáo viên | `Học sinh tham gia tích cực` |
| J | **Nhận xét TA** | Nhận xét về trợ giảng | `Trợ giảng biết việc, bao quát lớp` |

### **Bước 3: Upload File**

1. Sau khi điền xong dữ liệu, **lưu file Excel**
2. Quay lại trang **Tạo báo cáo**
3. Click nút **📤 Upload** (bên cạnh nút Template)
4. Chọn file Excel vừa điền
5. Hệ thống sẽ tự động đọc và import dữ liệu

---

## ✅ **Kết quả**

- ✅ Tất cả hoạt động trong file Excel sẽ được **tự động thêm** vào danh sách
- ✅ Thông báo thành công: `📥 Đã import thành công X hoạt động từ file Excel!`
- ✅ Dữ liệu sẽ hiển thị trong **Bảng danh sách hoạt động**
- ✅ Bạn có thể **chỉnh sửa** hoặc **xóa** từng hoạt động nếu cần

---

## 📝 **Lưu ý quan trọng**

### **1. Định dạng ngày tháng**

File Excel hỗ trợ nhiều định dạng ngày:
- ✅ `10/10/2024` (DD/MM/YYYY)
- ✅ `2024-10-10` (YYYY-MM-DD)
- ✅ Excel date serial number (tự động convert)

### **2. Nhiều lớp cùng lúc**

Để nhập nhiều lớp cho một hoạt động, cách nhau bởi **dấu phẩy** hoặc **dấu chấm phẩy**:
- ✅ `2/1,2/2` → 2 lớp
- ✅ `1/12;1/13;1/14` → 3 lớp
- ✅ `1/17` → 1 lớp

### **3. Các trường bắt buộc**

Để import thành công, **bắt buộc phải có** các cột:
- ⚠️ **Ngày**
- ⚠️ **Trường**
- ⚠️ **Buổi**
- ⚠️ **Tên bài**

Các cột khác có thể để trống.

### **4. Tên cột linh hoạt**

Hệ thống hỗ trợ nhiều tên cột (tiếng Việt và tiếng Anh):
- `Ngày` / `Date` / `date`
- `Trường` / `School` / `schoolName`
- `Buổi` / `Session` / `session`
- `Tên bài` / `Lesson` / `lessonName`
- ...và các biến thể khác

### **5. Xử lý lỗi**

Nếu có dòng nào không hợp lệ (thiếu thông tin bắt buộc), dòng đó sẽ bị **bỏ qua** và các dòng còn lại vẫn được import.

---

## 🎨 **Ví dụ File Template**

```excel
| Ngày       | Trường            | Buổi   | Tiết | Lớp      | Tên bài                          | Trợ giảng | ...
|------------|-------------------|--------|------|----------|----------------------------------|-----------|
| 10/10/2024 | TH Đinh Bộ Lĩnh   | Sáng   | 1    | 2/1,2/2  | Toán - Phép cộng trong phạm vi 20| Ngọc An   |
| 11/10/2024 | TH Huỳnh Văn Chính| Chiều  | 3    | 1/12     | Tiếng Việt - Luyện đọc          | Yến Nhi   |
```

---

## 🚀 **Tips & Tricks**

### **1. Import nhiều tuần cùng lúc**

Bạn có thể điền dữ liệu cho **nhiều tuần** trong cùng một file Excel và upload một lần.

### **2. Sao chép từ file cũ**

Nếu bạn có báo cáo tuần trước, có thể:
1. Mở file báo cáo cũ đã xuất
2. Copy các dòng cần thiết
3. Paste vào file template mới
4. Upload lại

### **3. Kết hợp nhập liệu**

Bạn có thể:
- Upload file Excel để nhập hàng loạt
- Sau đó thêm/sửa từng hoạt động riêng lẻ bằng form

### **4. Upload nhiều lần**

Bạn có thể upload file Excel **nhiều lần**. Các hoạt động mới sẽ được **thêm vào** danh sách hiện có (không bị ghi đè).

---

## ❓ **Troubleshooting**

### **Lỗi: "File Excel không có dữ liệu!"**

**Nguyên nhân:** File Excel trống hoặc không có dòng dữ liệu nào (chỉ có header).

**Giải pháp:** Thêm ít nhất 1 dòng dữ liệu vào file.

---

### **Lỗi: "Không thể đọc dữ liệu từ file!"**

**Nguyên nhân:** Thiếu các cột bắt buộc hoặc định dạng không đúng.

**Giải pháp:**
1. Sử dụng file Template chính thức (tải từ nút 📋 Template)
2. Đảm bảo có đủ các cột: `Ngày`, `Trường`, `Buổi`, `Tên bài`
3. Kiểm tra định dạng ngày tháng

---

### **Lỗi: "Có lỗi khi đọc file Excel"**

**Nguyên nhân:** File bị lỗi hoặc không phải định dạng Excel hợp lệ.

**Giải pháp:**
1. Chỉ upload file `.xlsx` hoặc `.xls`
2. Tải lại file Template và thử lại
3. Đảm bảo file không bị corrupt

---

## 💡 **Best Practices**

1. ✅ **Luôn dùng Template chính thức** để tránh lỗi tên cột
2. ✅ **Kiểm tra dữ liệu** trước khi upload
3. ✅ **Backup dữ liệu** quan trọng
4. ✅ **Test với 1-2 dòng** trước khi import hàng loạt
5. ✅ **Xem trước bảng** sau khi upload để đảm bảo dữ liệu đúng

---

## 🎉 **Lợi ích**

- ⚡ **Tiết kiệm thời gian**: Import hàng chục hoạt động trong vài giây
- 📊 **Dễ quản lý**: Sử dụng Excel quen thuộc
- 🔄 **Linh hoạt**: Kết hợp upload + nhập thủ công
- ✏️ **Có thể chỉnh sửa**: Sau khi import vẫn có thể sửa từng item
- 📥 **Tái sử dụng**: Lưu file Excel để import cho các tuần sau

---

**Chúc bạn sử dụng tính năng thành công!** 🚀✨

