import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDB() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
  console.log("MySQL connected successfully (Prisma)");
}

export async function disconnectDB() {
  await prisma.$disconnect();
}

export default prisma;
