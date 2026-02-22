import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createEquipmentSchema } from '@/lib/validations/equipment'
import { NextRequest, NextResponse } from 'next/server'

/** Проверка прав администратора */
async function checkAdmin() {
	const session = await auth()
	if (!session?.user?.id || session.user.role !== 'ADMIN') {
		return null
	}
	return session
}

/**
 * GET /api/admin/equipment
 * Получение всей техники для административной панели
 */
export async function GET(req: NextRequest) {
	const session = await checkAdmin()
	if (!session) {
		return NextResponse.json(
			{ success: false, error: 'Доступ запрещён' },
			{ status: 403 }
		)
	}

	try {
		const { searchParams } = new URL(req.url)
		const page = parseInt(searchParams.get('page') ?? '1')
		const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
		const search = searchParams.get('search') ?? undefined

		const where = search
			? { name: { contains: search, mode: 'insensitive' as const } }
			: {}

		const [equipment, total] = await Promise.all([
			prisma.equipment.findMany({
				where,
				include: { category: { select: { name: true } } },
				orderBy: { createdAt: 'desc' },
				skip: (page - 1) * pageSize,
				take: pageSize
			}),
			prisma.equipment.count({ where })
		])

		return NextResponse.json({
			success: true,
			data: { equipment, total, page, pageSize }
		})
	} catch (error) {
		console.error('[ADMIN/EQUIPMENT GET] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}

/**
 * POST /api/admin/equipment
 * Создание новой техники
 */
export async function POST(req: NextRequest) {
	const session = await checkAdmin()
	if (!session) {
		return NextResponse.json(
			{ success: false, error: 'Доступ запрещён' },
			{ status: 403 }
		)
	}

	try {
		const body = await req.json()
		const validated = createEquipmentSchema.safeParse(body)

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

		const equipment = await prisma.equipment.create({
			data: {
				...validated.data,
				specifications: validated.data.specifications as Record<
					string,
					string
				>
			},
			include: { category: true }
		})

		return NextResponse.json(
			{ success: true, data: equipment },
			{ status: 201 }
		)
	} catch (error) {
		console.error('[ADMIN/EQUIPMENT POST] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
