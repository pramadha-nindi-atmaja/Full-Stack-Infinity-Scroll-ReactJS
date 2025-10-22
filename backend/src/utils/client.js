import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton
 * Ensures only one PrismaClient instance is created (especially during hot reload)
 */
const globalForPrisma = globalThis;

/**
 * Recommended logging:
 * - minimal in production
 * - detailed in development
 */
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// Prevent multiple instances during development (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown on process termination
 */
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  console.log("🔌 Prisma disconnected gracefully");
});

export default prisma;
