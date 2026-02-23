export type UserRole = 'CLIENT' | 'ADMIN'

export type SessionUser = {
	id: string
	email: string
	role: UserRole
	firstName: string
	lastName: string
}
