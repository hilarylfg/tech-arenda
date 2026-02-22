import { PrismaClient } from '@prisma/client'
// optional: use Prisma Postgres adapter for direct connection
// (see https://stackoverflow.com/questions/79845075 and user suggestion)
import { PrismaPg } from '@prisma/adapter-pg'

// Синглтон для Prisma Client, чтобы избежать множества соединений в режиме разработки
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL ?? ''
})

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		// pass adapter via any to avoid strict TS type issues
		// this enables a direct Postgres adapter connection
		// or use `accelerateUrl` instead if preferred
		...({ adapter } as any),
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'error', 'warn']
				: ['error']
	} as any)

if (process.env.NODE_ENV !== 'production') {
	globalForPrisma.prisma = prisma
}
