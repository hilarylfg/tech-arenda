import { z } from 'zod'

// Валидация номера телефона (российский формат +7/8)
const phoneRegex =
	/^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/

// ==================== СХЕМЫ АВТОРИЗАЦИИ ====================

/** Схема входа */
export const loginSchema = z.object({
	email: z
		.string()
		.email('Некорректный формат email')
		.min(1, 'Email обязателен'),
	password: z.string().min(8, 'Пароль должен содержать минимум 8 символов')
})

export type LoginInput = z.infer<typeof loginSchema>

/** Схема регистрации */
export const registerSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'Имя должно содержать минимум 2 символа')
			.max(50, 'Имя слишком длинное'),
		lastName: z
			.string()
			.min(2, 'Фамилия должна содержать минимум 2 символа')
			.max(50, 'Фамилия слишком длинная'),
		email: z
			.string()
			.email('Некорректный формат email')
			.min(1, 'Email обязателен'),
		phone: z
			.string()
			.regex(phoneRegex, 'Некорректный формат телефона (+7XXXXXXXXXX)'),
		password: z
			.string()
			.min(8, 'Пароль должен содержать минимум 8 символов')
			.max(100, 'Пароль слишком длинный')
			.regex(
				/^(?=.*[a-zA-Z])(?=.*\d)/,
				'Пароль должен содержать буквы и цифры'
			),
		confirmPassword: z.string(),
		companyName: z
			.string()
			.max(200, 'Название компании слишком длинное')
			.optional(),
		inn: z
			.string()
			.regex(/^\d{10,12}$/, 'ИНН должен содержать 10 или 12 цифр')
			.optional()
			.or(z.literal(''))
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export type RegisterInput = z.infer<typeof registerSchema>

/** Схема обновления профиля */
export const updateProfileSchema = z.object({
	firstName: z
		.string()
		.min(2, 'Имя должно содержать минимум 2 символа')
		.max(50),
	lastName: z
		.string()
		.min(2, 'Фамилия должна содержать минимум 2 символа')
		.max(50),
	phone: z.string().regex(phoneRegex, 'Некорректный формат телефона'),
	companyName: z.string().max(200).optional(),
	inn: z
		.string()
		.regex(/^\d{10,12}$/, 'ИНН должен содержать 10 или 12 цифр')
		.optional()
		.or(z.literal(''))
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

/** Схема изменения пароля */
export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Введите текущий пароль'),
		newPassword: z
			.string()
			.min(8, 'Новый пароль должен содержать минимум 8 символов')
			.regex(
				/^(?=.*[a-zA-Z])(?=.*\d)/,
				'Пароль должен содержать буквы и цифры'
			),
		confirmPassword: z.string()
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword']
	})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
