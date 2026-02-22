/**
 * Edge-safe NextAuth configuration.
 * This file MUST NOT import Prisma, bcryptjs, or any Node.js-only module.
 * It is used by middleware (Edge runtime) and extended in lib/auth.ts (Node runtime).
 */
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	secret: process.env.AUTH_SECRET,
	session: { strategy: 'jwt' as const, maxAge: 30 * 24 * 60 * 60 },
	pages: { signIn: '/login', error: '/login' },
	// Credentials provider is added only in lib/auth.ts (Node runtime)
	providers: [],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role
				token.firstName = user.firstName as string
				token.lastName = user.lastName as string
			}
			return token
		},
		session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string
				session.user.role = token.role as 'CLIENT' | 'ADMIN'
				session.user.firstName = token.firstName as string
				session.user.lastName = token.lastName as string
			}
			return session
		}
	}
} satisfies NextAuthConfig
