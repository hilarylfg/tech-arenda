import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { createOrderSchema } from '@/lib/validations/order'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/orders
 * Получение списка заявок текущего пользователя
 */
export async function GET(_req: NextRequest) {
	try {
		const session = await getSession()
		if (!session?.id) {
			return NextResponse.json(
				{ success: false, error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const orders = await prisma.order.findMany({
			where: { userId: session.id },
			include: {
				items: {
					include: {
						equipment: {
							select: {
								id: true,
								name: true,
								slug: true,
								images: true,
								category: { select: { name: true } }
							}
						}
					}
				}
			},
			orderBy: { createdAt: 'desc' }
		})

		return NextResponse.json({ success: true, data: orders })
	} catch (error) {
		console.error('[ORDERS GET] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/orders
 * Создание новой заявки на аренду
 */
export async function POST(req: NextRequest) {
	try {
		const session = await getSession()
		if (!session?.id) {
			return NextResponse.json(
				{ success: false, error: 'Необходима авторизация' },
				{ status: 401 }
			)
		}

		const body = await req.json()

		// Валидируем входные данные
		const validated = createOrderSchema.safeParse(body)
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

		const { equipmentId, startDate, endDate, comment } = validated.data

		// Проверяем что дата окончания позже даты начала
		const start = new Date(startDate)
		const end = new Date(endDate)
		if (end <= start) {
			return NextResponse.json(
				{
					success: false,
					error: 'Дата окончания должна быть позже даты начала'
				},
				{ status: 400 }
			)
		}

		// Получаем технику
		const equipment = await prisma.equipment.findUnique({
			where: { id: equipmentId }
		})

		if (!equipment) {
			return NextResponse.json(
				{ success: false, error: 'Техника не найдена' },
				{ status: 404 }
			)
		}

		if (equipment.status !== 'AVAILABLE') {
			return NextResponse.json(
				{
					success: false,
					error: 'Данная техника недоступна для аренды'
				},
				{ status: 400 }
			)
		}

		// Получаем данные пользователя
		const user = await prisma.user.findUnique({
			where: { id: session.id }
		})

		if (!user) {
			return NextResponse.json(
				{ success: false, error: 'Пользователь не найден' },
				{ status: 404 }
			)
		}

		// Вычисляем количество дней и стоимость
		const diffMs = end.getTime() - start.getTime()
		const daysCount = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
		const pricePerDay = Number(equipment.pricePerDay)

		// Применяем скидку за неделю если есть
		let subtotal: number
		if (equipment.pricePerWeek && daysCount >= 7) {
			const weeks = Math.floor(daysCount / 7)
			const remainingDays = daysCount % 7
			subtotal =
				weeks * Number(equipment.pricePerWeek) +
				remainingDays * pricePerDay
		} else {
			subtotal = daysCount * pricePerDay
		}

		// Создаем заявку в транзакции
		const order = await prisma.order.create({
			data: {
				userId: session.id,
				contactPhone: user.phone,
				totalAmount: subtotal,
				comment: comment || null,
				status: 'PENDING',
				startDate: start,
				endDate: end,
				items: {
					create: {
						equipmentId,
						price: pricePerDay,
						quantity: daysCount
					}
				}
			},
			include: {
				items: {
					include: {
						equipment: {
							select: { id: true, name: true, images: true }
						}
					}
				}
			}
		})

		return NextResponse.json(
			{
				success: true,
				message: 'Заявка успешно создана',
				data: order
			},
			{ status: 201 }
		)
	} catch (error) {
		console.error('[ORDERS POST] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
