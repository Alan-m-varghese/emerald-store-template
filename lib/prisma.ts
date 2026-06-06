import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

function getPrismaClient(): PrismaClient {
  if (typeof window !== "undefined") {
    return {} as PrismaClient;
  }
  if (!prismaInstance) {
    try {
      if (process.env.NODE_ENV !== "production") {
        if (!globalForPrisma.prisma) {
          globalForPrisma.prisma = new PrismaClient();
        }
        prismaInstance = globalForPrisma.prisma;
      } else {
        prismaInstance = new PrismaClient();
      }
    } catch (e) {
      console.warn("Failed to initialize live Prisma Client: ", e);
      // Return a dummy client to avoid throwing at module load time
      return {} as PrismaClient;
    }
  }
  return prismaInstance || ({} as PrismaClient);
}

// Export db as a lazy Proxy delegating calls to getPrismaClient()
export const db = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  }
});
