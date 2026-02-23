export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { createSessionToken, setSessionCookie } from '@/lib/session'
import { loginSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Хэш-заглушка для защиты от timing-атак:
 * bcrypt.compare выполняется всегда, даже если пользователь не найден,
 * чтобы злоумышленник не мог определить существование email по времени ответа.
 */
const DUMMY_HASH =
	'$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/o3vR2Je9K'

/**
 * POST /api/auth/login
 */
export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const validated = loginSchema.safeParse(body)

		if (!validated.success) {
			return NextResponse.json(
				{ success: false, error: 'Неверный email или пароль' },
				{ status: 401 }
			)
		}

		const { email, password } = validated.data
		const user = await prisma.user.findUnique({ where: { email } })

		const hashToCompare = user?.password ?? DUMMY_HASH
		const passwordMatch = await bcrypt.compare(password, hashToCompare)

		if (!user || !passwordMatch) {
			return NextResponse.json(
				{ success: false, error: 'Неверный email или пароль' },
				{ status: 401 }
			)
		}

		const token = await createSessionToken({
			id: user.id,
			email: user.email,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName
		})

		const response = NextResponse.json({ success: true })
		setSessionCookie(response, token)
		return response
	} catch {
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
