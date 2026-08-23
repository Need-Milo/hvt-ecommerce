# Ecommerce-HVT Backend — Express MVC + Prisma + MySQL

## Stack

- Express (MVC: routes → controllers → models)
- **Prisma ORM** (`prisma/schema.prisma`)
- MySQL

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Hoặc:

```bash
npm run db:setup
```

## `.env`

```env
DATABASE_URL="mysql://root:root@localhost:3306/ecommerce_hvt"
JWT_SECRET="change-me-in-production"
PORT=5000
```

## Xem DB bằng Prisma Studio

```bash
npx prisma studio
```

Mở UI tại `http://localhost:5555` — xem/sửa bảng trực quan, dễ hơn Workbench cho demo.

## Cấu trúc

```text
config/db.js          # PrismaClient + connectDB
prisma/schema.prisma  # Models ORM
models/               # Dùng prisma.* thay vì SQL thuần
controllers/
routes/
```
