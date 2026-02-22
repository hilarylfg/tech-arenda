// Расширение типов NextAuth для поддержки ролей и дополнительных полей
import type { DefaultJWT, DefaultSession } from 'next-auth'

// Тип роли пользователя
export type UserRole = 'CLIENT' | 'ADMIN'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			role: UserRole
			firstName: string
			lastName: string
		} & DefaultSession['user']
	}

	interface User {
		role?: UserRole
		firstName?: string
		lastName?: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id?: string
		role?: UserRole
		firstName?: string
		lastName?: string
	}
}
