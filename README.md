# Library Management

Một ứng dụng quản lý thư viện giúp theo dõi sách, độc giả, mượn trả, v.v.

## 📘 Mô tả

- Cho phép quản lý **sách**: thêm, sửa, xóa, tìm kiếm
- Quản lý **độc giả**: thông tin cá nhân, tra cứu
- Quản lý **mượn – trả**: lưu lịch sử, tính trạng sách
- Báo cáo / thống kê (nếu có)
- Giao diện (frontend) + backend + database (tuỳ dự án bạn dùng)

## ⚙️ Công nghệ sử dụng

Liệt kê các công nghệ, thư viện chính mà dự án sử dụng, ví dụ:

| Thành phần | Công nghệ / thư viện |
|------------|-----------------------|
| Ngôn ngữ / framework backend | TypeScript / Node.js / Express / NestJS / … |
| Cơ sở dữ liệu | MySQL / PostgreSQL / MongoDB / SQLite / … |
| ORM / Data Layer | TypeORM / Sequelize / Mongoose / Prisma / … |
| Frontend | React / Vue / Angular / … |
| Quản lý trạng thái | Redux / Vuex / Context API / … |
| Giao diện & style | Tailwind CSS / Bootstrap / SCSS / … |

> **Lưu ý**: hãy cập nhật bảng trên cho đúng với dự án của bạn.

## 🚀 Cài đặt & chạy

Dưới đây là các bước để cài đặt và chạy dự án trên máy local:

```bash
# Clone repository
git clone https://github.com/khoadd879/library-management.git
cd library-management

# Cài dependencies
npm install
# hoặc nếu bạn dùng yarn
# yarn install

# Thiết lập biến môi trường
cp .env.example .env
# Chỉnh sửa file .env với thông tin database, port, v.v.

# Khởi động ứng dụng
npm run dev
# hoặc
npm start
