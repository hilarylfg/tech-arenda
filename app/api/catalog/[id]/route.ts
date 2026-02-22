export const runtime = 'nodejs'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/catalog/[id]
 * Получение детальной информации о технике
 */
export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		// Ищем по id или slug
		const equipment = await prisma.equipment.findFirst({
			where: {
				OR: [{ id }, { slug: id }]
			},
			include: {
				category: true
			}
		})

		if (!equipment) {
			return NextResponse.json(
				{ success: false, error: 'Техника не найдена' },
				{ status: 404 }
			)
		}

		return NextResponse.json({ success: true, data: equipment })
	} catch (error) {
		console.error('[CATALOG/ID] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
