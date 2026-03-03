import { prisma } from '@/lib/prisma'
import { catalogFiltersSchema } from '@/lib/validations/equipment'
import type { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/catalog
 * Получение списка техники с фильтрацией, поиском и пагинацией
 */
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)

		// Парсим и валидируем параметры запроса
		const params = catalogFiltersSchema.safeParse({
			categoryId: searchParams.get('categoryId') ?? undefined,
			status: searchParams.get('status') ?? undefined,
			minPrice: searchParams.get('minPrice') ?? undefined,
			maxPrice: searchParams.get('maxPrice') ?? undefined,
			search: searchParams.get('search') ?? undefined,
			sortBy: searchParams.get('sortBy') ?? undefined,
			page: searchParams.get('page') ?? undefined,
			pageSize: searchParams.get('pageSize') ?? undefined
		})

		if (!params.success) {
			console.error('[CATALOG] Ошибка валидации:', params.error.flatten())
			return NextResponse.json(
				{ success: false, error: 'Некорректные параметры запроса', details: params.error.flatten() },
				{ status: 400 }
			)
		}

		const {
			categoryId,
			status,
			minPrice,
			maxPrice,
			search,
			sortBy,
			page,
			pageSize
		} = params.data

		// Строим условия фильтрации
		const where: Prisma.EquipmentWhereInput = {}

		if (categoryId) where.categoryId = categoryId
		if (status) where.status = status

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.pricePerDay = {}
			if (minPrice !== undefined)
				where.pricePerDay = {
					...(where.pricePerDay as object),
					gte: minPrice
				}
			if (maxPrice !== undefined)
				where.pricePerDay = {
					...(where.pricePerDay as object),
					lte: maxPrice
				}
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } }
			]
		}

		// Сортировка
		const orderBy: Prisma.EquipmentOrderByWithRelationInput = (() => {
			switch (sortBy) {
				case 'priceAsc':
					return { pricePerDay: 'asc' }
				case 'priceDesc':
					return { pricePerDay: 'desc' }
				case 'nameDesc':
					return { name: 'desc' }
				default:
					return { name: 'asc' }
			}
		})()

		// Запрашиваем данные с пагинацией
		const [equipment, total] = await Promise.all([
			prisma.equipment.findMany({
				where,
				orderBy,
				skip: (page - 1) * pageSize,
				take: pageSize,
				include: {
					category: {
						select: { id: true, name: true, slug: true }
					}
				}
			}),
			prisma.equipment.count({ where })
		])

		return NextResponse.json({
			success: true,
			data: {
				equipment,
				total,
				page,
				pageSize,
				totalPages: Math.ceil(total / pageSize)
			}
		})
	} catch (error) {
		console.error('[CATALOG] Ошибка:', error)
		return NextResponse.json(
			{ success: false, error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
