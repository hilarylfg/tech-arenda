import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations',
		// Seed command for `prisma db seed` (uses ts-node with a dedicated tsconfig)
		seed: 'ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts'
	},
	datasource: {
		url: env('DATABASE_URL')
	}
})
