export const runtime = 'nodejs'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { changePasswordSchema } from '@/lib/validations/auth'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
	try {
		const session = await getSession()
		if (!session?.id) {
			return NextResponse.json(
				{ error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const body = await req.json()
		const parsed = changePasswordSchema.safeParse(body)
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: 'Некорректные данные',
					details: parsed.error.flatten()
				},
				{ status: 400 }
			)
		}

		const user = await prisma.user.findUnique({
			where: { id: session.id },
			select: { password: true }
		})

		if (!user?.password) {
			return NextResponse.json(
				{ error: 'Нет пароля для изменения' },
				{ status: 400 }
			)
		}

		const valid = await bcrypt.compare(
			parsed.data.currentPassword,
			user.password
		)
		if (!valid) {
			return NextResponse.json(
				{ error: 'Неверный текущий пароль' },
				{ status: 400 }
			)
		}

		const hashed = await bcrypt.hash(parsed.data.newPassword, 12)
		await prisma.user.update({
			where: { id: session.id },
			data: { password: hashed }
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('[PROFILE/PASSWORD PATCH]', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
