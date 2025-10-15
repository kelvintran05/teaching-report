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

## Cách thêm vào Vercel:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `teaching-report`
3. Vào **Settings** → **Environment Variables**
4. Thêm từng biến với:
   - **Environment:** Production, Preview, Development
   - **Value:** Copy từ trên

## Lưu ý:
- Thay `your-app-name` bằng tên thực của app trên Vercel
- Secret key đã được generate sẵn, có thể dùng luôn
- Sau khi thêm xong, Vercel sẽ tự động redeploy
