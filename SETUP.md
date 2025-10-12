# 🚀 Setup Database & Authentication

## ✅ Đã hoàn thành:

1. ✅ Cài đặt NextAuth.js + Prisma + bcryptjs
2. ✅ Tạo database schema (User + Activity models)
3. ✅ Setup NextAuth API routes
4. ✅ Tạo Login & Register pages
5. ✅ Tạo Activities CRUD API routes
6. ✅ Add authentication middleware

## 📝 Bước tiếp theo - Setup Database:

### **Option 1: Vercel Postgres (Khuyến nghị - Miễn phí)**

1. **Tạo Vercel Postgres Database:**
   - Truy cập: https://vercel.com/dashboard
   - Click **Storage** → **Create Database**
   - Chọn **Postgres**
   - Chọn region gần nhất
   - Click **Create**

2. **Copy DATABASE_URL:**
   - Trong Vercel Dashboard → Storage → Your Database
   - Tab **Settings** → Copy **DATABASE_URL**

3. **Add Environment Variables:**
   - Project Settings → Environment Variables
   - Add:
     ```
     DATABASE_URL=<paste_from_vercel>
     NEXTAUTH_SECRET=<generate_random_string>
     NEXTAUTH_URL=https://your-app.vercel.app
     ```

4. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **Run migration:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

6. **Redeploy:**
   ```bash
   git add .
   git commit -m "Add database & auth"
   git push
   ```

### **Option 2: Local Development**

1. **Install PostgreSQL:**
   - Mac: `brew install postgresql`
   - Or download from: https://www.postgresql.org/download/

2. **Create database:**
   ```bash
   psql postgres
   CREATE DATABASE teaching_report;
   \q
   ```

3. **Create `.env` file:**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/teaching_report"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Start dev server:**
   ```bash
   yarn dev
   ```

## 🎯 Cách sử dụng:

### **1. Đăng ký tài khoản:**
- Truy cập: `http://localhost:3000/register`
- Điền thông tin: Tên, Email, Mật khẩu
- Click "Tạo Tài Khoản"

### **2. Đăng nhập:**
- Truy cập: `http://localhost:3000/login`
- Nhập Email & Mật khẩu
- Click "Đăng Nhập"

### **3. Sử dụng Builder:**
- Sau khi đăng nhập → tự động chuyển đến `/builder`
- Thêm activities như bình thường
- **Data tự động lưu vào database!** 🎉

## 📊 Database Schema:

### **User Model:**
```prisma
model User {
  id         String     @id @default(cuid())
  email      String     @unique
  name       String
  password   String
  activities Activity[]
}
```

### **Activity Model:**
```prisma
model Activity {
  id             String   @id @default(cuid())
  userId         String
  date           DateTime
  schoolName     String
  session        String
  period         String
  className      String[]
  lessonName     String
  ta             String?
  classStatus    String?
  selfEvaluation String?
  taComment      String?
  
  user User @relation(...)
}
```

## 🔐 Authentication Flow:

```
User → Register → Hash Password → Save to DB
     → Login → Verify Password → Create Session (JWT)
     → Access /builder → Middleware Check Session
     → CRUD Activities → Check User Ownership
```

## 🚀 Deploy to Vercel:

```bash
# 1. Commit changes
git add .
git commit -m "Add authentication & database"
git push

# 2. Vercel auto-deploy

# 3. Add environment variables in Vercel Dashboard

# 4. Run migrations
npx prisma migrate deploy
```

## 📝 Next Steps:

⚠️ **QUAN TRỌNG:** Cần setup DATABASE_URL trước khi deploy!

1. Setup Vercel Postgres (miễn phí)
2. Add environment variables
3. Run migrations
4. Test authentication flow

## 🎉 Features:

- ✅ User authentication (Register/Login)
- ✅ Per-user data isolation
- ✅ Secure password hashing (bcrypt)
- ✅ JWT sessions
- ✅ Protected routes (middleware)
- ✅ Activities CRUD with database
- ✅ Beautiful UI với Ant Design

Enjoy! 🚀✨

