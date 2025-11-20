// Uncomment if using SQLite
// import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate";
// import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// const adapter = new PrismaBetterSqlite3({
//   url: process.env.DATABASE_URL!,
// });

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log: ["error"],
//     adapter,
//   }).$extends(withAccelerate());

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Comment if using SQLite
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
