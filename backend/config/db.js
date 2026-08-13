import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectDB() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("MySQL connected successfully");
    return true;
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
    throw error;
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}

export { prisma };
export default prisma;
