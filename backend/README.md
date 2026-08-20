# Ecommerce-HVT Backend — MySQL SQL trực tiếp

Backend Express theo MVC, dùng `mysql2/promise` và câu SQL trực tiếp; không dùng ORM.

## Chuẩn bị database

```bash
npm run db:create
npm run db:seed
npm run dev
```

Hoặc dùng một lệnh:

```bash
npm run db:setup
```

## Cấu hình `.env`

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecommerce_hvt"
JWT_SECRET="change-me-in-production"
PORT=5000
```

Schema MySQL nằm ở `database/schema.sql`; dữ liệu mẫu SQL nằm ở `database/seed.js`.
