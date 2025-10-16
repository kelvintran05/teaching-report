# Environment Variables cho Vercel Production

## Các biến cần thiết:

### 1. NextAuth Configuration

```
NEXTAUTH_SECRET=VnQN2meeT227TSymIT6bzh08Rv0EgZKMSjce6fihKc=
NEXTAUTH_URL=https://your-app-name.vercel.app
```

### 2. Database Configuration

```
DATABASE_URL=file:./dev.db
```

### 3. Node Environment

```
NODE_ENV=production
```

## Cách thêm vào Vercel:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `teaching-report`
3. Vào **Settings** → **Environment Variables**
4. Thêm từng biến với:
   - **Environment:** Production, Preview, Development
   - **Value:** Copy từ trên

## Troubleshooting:

### Nếu vẫn bị lỗi "Server configuration":
1. **Check Vercel Logs:**
   - Vào Vercel Dashboard → Project → Functions tab
   - Xem logs để tìm lỗi cụ thể

2. **Common Issues:**
   - Missing NEXTAUTH_SECRET
   - Wrong NEXTAUTH_URL (phải match với domain Vercel)
   - Database connection timeout
   - Prisma client not generated

3. **Quick Fix:**
   - Redeploy sau khi thêm environment variables
   - Check build logs trong Vercel Dashboard

## Lưu ý:

- Thay `your-app-name` bằng tên thực của app trên Vercel
- Secret key đã được generate sẵn, có thể dùng luôn
- Sau khi thêm xong, Vercel sẽ tự động redeploy
- Nếu vẫn lỗi, check Vercel logs để debug
