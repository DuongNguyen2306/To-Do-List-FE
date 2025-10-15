# Todo App - Frontend

Frontend ReactJS cho ứng dụng quản lý task với Next.js, TypeScript, TailwindCSS và kết nối với backend Node.js + Express + MongoDB.

## Tính năng

- ✅ Đăng ký và đăng nhập với Formik + Yup validation
- ✅ Quản lý token tự động (JWT + RefreshToken)
- ✅ CRUD operations cho Task (Create, Read, Update, Delete)
- ✅ Xóa mềm và xóa cứng task
- ✅ Tìm kiếm và lọc task
- ✅ Giao diện hiện đại với TailwindCSS
- ✅ Protected routes
- ✅ Auto refresh token khi hết hạn

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. File `.env.local` đã được tạo với API URL:
```env
NEXT_PUBLIC_API_URL=https://to-do-list-vsb8.onrender.com
```

3. Chạy development server:
```bash
npm run dev
```

## API Endpoints

Frontend đã được kết nối với API đã deploy:

**Base URL:** `https://to-do-list-vsb8.onrender.com`

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/tasks` - Lấy danh sách task (hỗ trợ query params)
- `POST /api/tasks` - Tạo task mới (hỗ trợ đầy đủ fields)
- `PUT /api/tasks/:id` - Cập nhật task
- `DELETE /api/tasks/:id` - Xóa mềm task
- `DELETE /api/tasks/:id/hard` - Xóa cứng task
- `POST /api/tasks/:id/restore` - Khôi phục task

## Cấu trúc thư mục

```
app/
├── dashboard/          # Trang quản lý task
├── login/             # Trang đăng nhập
├── register/          # Trang đăng ký
└── page.tsx           # Trang chính (redirect)

components/
├── Navbar.tsx         # Navigation bar
├── TaskModal.tsx      # Modal thêm/sửa task
├── TaskItem.tsx       # Component hiển thị task
└── ProtectedRoute.tsx # Bảo vệ route

contexts/
└── AuthContext.tsx    # Context quản lý authentication

lib/
└── axiosInstance.ts   # Axios instance với auto refresh token
```

## Sử dụng

1. Truy cập `http://localhost:3000`
2. Đăng ký tài khoản mới hoặc đăng nhập
3. Quản lý task của bạn với đầy đủ tính năng CRUD

## 🚀 **Tính năng mới được hỗ trợ:**

- ✅ **Status management**: "To do", "In progress", "On approval", "Done"
- ✅ **Priority levels**: "low", "medium", "high" 
- ✅ **Project organization**: Gán task vào project
- ✅ **Tags system**: Gắn tags cho task
- ✅ **Due dates**: Đặt hạn deadline
- ✅ **Reminders**: Thiết lập nhắc nhở
- ✅ **Search & Filter**: Tìm kiếm và lọc task
- ✅ **Soft/Hard delete**: Xóa mềm và xóa cứng
- ✅ **Restore**: Khôi phục task đã xóa

Frontend đã sẵn sàng để sử dụng với API đã deploy! 🎉
