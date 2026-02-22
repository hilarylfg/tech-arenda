export const runtime = 'nodejs'

import { auth } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
	try {
		const session = await auth()
		if (!session?.user?.id) {
			return NextResponse.json(
				{ error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const body = await req.json()
		const parsed = updateProfileSchema.safeParse(body)
		if (!parsed.success) {
			return NextResponse.json(
				{
					error: 'Некорректные данные',
					details: parsed.error.flatten()
				},
				{ status: 400 }
			)
		}

		const user = await prisma.user.update({
			where: { id: session.user.id },
			data: parsed.data,
			select: {
				id: true,
				firstName: true,
				lastName: true,
				email: true,
				phone: true
			}
		})

		return NextResponse.json({ success: true, data: user })
	} catch (error) {
		console.error('[PROFILE PATCH]', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
