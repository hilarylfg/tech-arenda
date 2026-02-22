import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/lib/validations/auth'
import type { UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
	// Секретный ключ для подписи JWT (из переменной окружения AUTH_SECRET)
	secret: process.env.AUTH_SECRET,

	// Используем JWT стратегию (без хранения сессий в БД)
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 дней
	},

	// Настройка страниц аутентификации
	pages: {
		signIn: '/login',
		error: '/login'
	},

	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Пароль', type: 'password' }
			},

			async authorize(credentials) {
				// Валидируем входные данные
				const validated = loginSchema.safeParse(credentials)
				if (!validated.success) return null

				const { email, password } = validated.data

				// Ищем пользователя в БД
				const user = await prisma.user.findUnique({
					where: { email }
				})

				if (!user) return null

				// Проверяем пароль
				const passwordMatch = await bcrypt.compare(
					password,
					user.passwordHash
				)
				if (!passwordMatch) return null

				// Возвращаем данные пользователя для JWT
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
	],

	callbacks: {
		// Добавляем доп. данные в JWT токен
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.role = user.role as UserRole
				token.firstName = user.firstName as string
				token.lastName = user.lastName as string
			}
			return token
		},

		// Добавляем доп. данные в объект сессии
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string
				session.user.role = token.role as UserRole
				session.user.firstName = token.firstName as string
				session.user.lastName = token.lastName as string
			}
			return session
		}
	}
})
