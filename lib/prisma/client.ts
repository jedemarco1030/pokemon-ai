import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Force BIGINT to be parsed as Number to avoid BigInt conversion issues in JS
pg.types.setTypeParser(20, (val) => parseInt(val, 10));

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn("DATABASE_URL is not defined in environment variables. Falling back to default PrismaClient.");
    return new PrismaClient();
  }

  try {
    // Standard Prisma setup for Vercel/Serverless
    if (process.env.NODE_ENV === "production") {
        // Many serverless environments prefer the standard client if not using specific pooling needs
        // that require the pg adapter. However, if the project is set up for PrismaPg, we'll try to stick to it.
        console.log("Initializing Prisma with Pg adapter in production");
    }

    const connectionString = databaseUrl.replace('sslmode=require', 'sslmode=disable');
    const pool = new pg.Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : {
        rejectUnauthorized: false
      }
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("Failed to initialize Prisma with adapter:", error instanceof Error ? error.message : error);
    return new PrismaClient();
  }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
