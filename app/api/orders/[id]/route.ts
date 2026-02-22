import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/orders/[id]
 * Получение детальной информации о заявке
 */
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await auth()
		if (!session?.user?.id) {
			return NextResponse.json(
				{ success: false, error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const { id } = await params

		const order = await prisma.order.findUnique({
			where: { id },
			include: {
				items: {
					include: {
						equipment: {
							include: { category: true }
						}
					}
				},
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true,
						phone: true
					}
				}
			}
		})

		if (!order) {
			return NextResponse.json(
				{ success: false, error: 'Заявка не найдена' },
				{ status: 404 }
			)
		}

		// Проверяем что заявка принадлежит пользователю (или пользователь - администратор)
		if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
			return NextResponse.json(
				{ success: false, error: 'Доступ запрещён' },
				{ status: 403 }
			)
		}

		return NextResponse.json({ success: true, data: order })
	} catch (error) {
		console.error('[ORDERS/ID GET] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
