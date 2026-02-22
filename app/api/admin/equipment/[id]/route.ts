export const runtime = 'nodejs'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateEquipmentSchema } from '@/lib/validations/equipment'
import { NextRequest, NextResponse } from 'next/server'

async function checkAdmin() {
	const session = await auth()
	if (!session?.user?.id || session.user.role !== 'ADMIN') return null
	return session
}

/**
 * PATCH /api/admin/equipment/[id]
 * Обновление техники
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
		const validated = updateEquipmentSchema.safeParse(body)

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

		const equipment = await prisma.equipment.update({
			where: { id },
			data: {
				...validated.data,
				specifications: validated.data.specifications
					? (validated.data.specifications as Record<string, string>)
					: undefined
			},
			include: { category: true }
		})

		return NextResponse.json({ success: true, data: equipment })
	} catch (error) {
		console.error('[ADMIN/EQUIPMENT/ID PATCH] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}

/**
 * DELETE /api/admin/equipment/[id]
 * Удаление техники
 */
export async function DELETE(
	_req: NextRequest,
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
		await prisma.equipment.delete({ where: { id } })
		return NextResponse.json({ success: true, message: 'Техника удалена' })
	} catch (error) {
		console.error('[ADMIN/EQUIPMENT/ID DELETE] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
