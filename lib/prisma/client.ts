import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Force BIGINT to be parsed as Number to avoid BigInt conversion issues in JS
pg.types.setTypeParser(20, (val) => parseInt(val, 10));

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const connectionString = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=disable');
  const pool = new pg.Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : {
      rejectUnauthorized: false
    }
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
