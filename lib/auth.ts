/**
 * Full NextAuth configuration — Node.js runtime only.
 * Extended from authConfig; adds the Credentials provider with Prisma + bcrypt.
 * NEVER import this file from middleware.ts.
 */
import { authConfig } from '@/auth.config'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Пароль', type: 'password' }
			},
			async authorize(credentials) {
				const validated = loginSchema.safeParse(credentials)
				if (!validated.success) return null

				const { email, password } = validated.data

				const user = await prisma.user.findUnique({ where: { email } })
				if (!user) return null

				const passwordMatch = await bcrypt.compare(
					password,
					user.passwordHash
				)
				if (!passwordMatch) return null

				return {
					id: user.id,
					email: user.email,
					name: `${user.firstName} ${user.lastName}`,
					role: user.role,
					firstName: user.firstName,
					lastName: user.lastName
				}
			}
		})
	]
})
