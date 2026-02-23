export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/register
 * Регистрация нового пользователя
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		// Валидируем входные данные
		const validated = registerSchema.safeParse(body)
		if (!validated.success) {
			return NextResponse.json(
				{
					success: false,
					error: 'Ошибка валидации',
					details: validated.error.flatten().fieldErrors
				},
				{ status: 400 }
			)
		}

		const {
			email,
			phone,
			password,
			firstName,
			lastName,
			companyName,
			inn
		} = validated.data

		// Проверяем уникальность email
		const existingEmail = await prisma.user.findUnique({ where: { email } })
		if (existingEmail) {
			return NextResponse.json(
				{
					success: false,
					error: 'Пользователь с таким email уже существует'
				},
				{ status: 409 }
			)
		}

		// Проверяем уникальность телефона
		const existingPhone = await prisma.user.findUnique({ where: { phone } })
		if (existingPhone) {
			return NextResponse.json(
				{
					success: false,
					error: 'Пользователь с таким телефоном уже существует'
				},
				{ status: 409 }
			)
		}

		// Хешируем пароль (12 раундов для надежности)
		const passwordHash = await bcrypt.hash(password, 12)

		// Создаем пользователя
		const user = await prisma.user.create({
			data: {
				email,
				phone,
				password: passwordHash,
				firstName,
				lastName,
				companyName: companyName || null,
				role: 'CLIENT'
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
				role: true,
				createdAt: true
			}
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Регистрация прошла успешно',
				data: user
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('[REGISTER] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
