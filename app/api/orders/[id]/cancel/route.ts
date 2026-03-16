import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/orders/[id]/cancel
 * Отмена заявки (только если статус PENDING)
 */
export async function POST(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getSession()
		if (!session?.id) {
			return NextResponse.json(
				{ success: false, error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const { id } = await params

		const order = await prisma.order.findUnique({
			where: { id }
		})

		if (!order) {
			return NextResponse.json(
				{ success: false, error: 'Заявка не найдена' },
				{ status: 404 }
			)
		}

		// Проверяем владельца
		if (order.userId !== session.id) {
			return NextResponse.json(
				{ success: false, error: 'Доступ запрещён' },
				{ status: 403 }
			)
		}

		// Можно отменить только заявки в статусе PENDING или CONFIRMED
		if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
			return NextResponse.json(
				{
					success: false,
					error: 'Можно отменить только заявки в статусе «На рассмотрении» или «Подтверждено»'
				},
				{ status: 400 }
			)
		}

		// Обновляем статус заявки
		const updatedOrder = await prisma.order.update({
			where: { id },
			data: { status: 'CANCELLED' }
		})

		return NextResponse.json({
			success: true,
			message: 'Заявка успешно отменена',
			data: updatedOrder
		})
	} catch (error) {
		console.error('[ORDERS/ID/CANCEL] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
