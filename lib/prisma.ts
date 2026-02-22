import { PrismaClient } from '@prisma/client'
// optional: use Prisma Postgres adapter for direct connection
// (see https://stackoverflow.com/questions/79845075 and user suggestion)
// (adapter import removed) 

// Синглтон для Prisma Client, чтобы избежать множества соединений в режиме разработки
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}


export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	})

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}
