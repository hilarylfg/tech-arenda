import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { updateOrderStatusSchema } from '@/lib/validations/order'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdmin() {
	const session = await getSession()
	if (!session?.id || session.role !== 'ADMIN') return null
	return session
}

/**
 * PATCH /api/admin/orders/[id]
 * Изменение статуса заявки администратором
 */
export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await checkAdmin()
	if (!session) {
		return NextResponse.json(
			{ success: false, error: 'Доступ запрещён' },
			{ status: 403 }
		)
	}

	try {
		const { id } = await params
		const body = await req.json()
		const validated = updateOrderStatusSchema.safeParse(body)

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

		const order = await prisma.order.update({
			where: { id },
			data: { status: validated.data.status }
		})

		return NextResponse.json({ success: true, data: order })
	} catch (error) {
		console.error('[ADMIN/ORDERS/ID PATCH] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
