# Ecommerce Backend — MVC + MySQL

## Cấu trúc

```text
backend/
├── config/
│   └── db.js                 # Connect MySQL (Prisma Client)
├── database/
│   ├── schema.sql            # SQL tạo DB + tables
│   └── createDatabase.js     # Script chạy schema.sql
├── models/                   # Model (truy vấn DB)
├── controllers/              # Controller (xử lý request)
├── routes/                   # Route (map URL → controller)
├── middleware/
├── utils/
├── prisma/
│   ├── schema.prisma         # Prisma schema (ORM)
│   └── seed.js
└── server.js                 # Entry point
```

## Luồng MVC

```text
Request → routes → controllers → models → MySQL
                         ↓
                     Response
```

## Setup

1. Chạy MySQL:

```bash
npm run db:up
```

2. Tạo database + tables:

```bash
npm run db:create
```

3. Generate Prisma client + seed:

```bash
npm run prisma:generate
npm run prisma:seed
```

Hoặc một lệnh:

```bash
npm run db:setup
```

4. Chạy server:

```bash
npm run dev
```

Server sẽ gọi `connectDB()` khi start.

## `.env`

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecommerce"
JWT_SECRET="change-me-in-production"
PORT=5000
```

## Tài khoản seed

- `admin@shop.com` / `admin123`
- `user@shop.com` / `user123`
