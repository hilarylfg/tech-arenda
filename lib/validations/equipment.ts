import { z } from 'zod'

// ==================== СХЕМЫ ТЕХНИКИ ====================

/** Схема создания техники */
export const createEquipmentSchema = z.object({
	name: z
		.string()
		.min(2, 'Название должно содержать минимум 2 символа')
		.max(200, 'Название слишком длинное'),
	slug: z
		.string()
		.min(2)
		.max(200)
		.regex(
			/^[a-z0-9-]+$/,
			'Slug может содержать только строчные буквы, цифры и дефисы'
		),
	categoryId: z.string().min(1, 'Выберите категорию'),
	description: z.string().min(10, 'Описание слишком короткое'),
	shortDescription: z
		.string()
		.max(300, 'Краткое описание слишком длинное')
		.optional(),
	images: z
		.array(z.string().url('Некорректный URL изображения'))
		.min(1, 'Добавьте хотя бы одно фото'),
	pricePerHour: z.coerce
		.number()
		.positive('Цена должна быть положительной')
		.max(999999, 'Цена слишком высокая')
		.optional(),
	pricePerDay: z.coerce
		.number()
		.positive('Цена должна быть положительной')
		.max(999999, 'Цена слишком высокая'),
	pricePerWeek: z.coerce
		.number()
		.positive('Цена должна быть положительной')
		.max(999999)
		.optional(),
	pricePerMonth: z.coerce
		.number()
		.positive('Цена должна быть положительной')
		.max(999999)
		.optional(),
	minRentHours: z.coerce.number().int().min(1).max(72).default(4),
	specifications: z.record(z.string(), z.string()).default({}),
	manufacturer: z.string().max(200).optional(),
	model: z.string().max(200).optional(),
	year: z.coerce.number().int().min(1980).max(2030).optional(),
	location: z.string().min(5, 'Введите адрес местонахождения'),
	latitude: z.coerce.number().optional(),
	longitude: z.coerce.number().optional(),
	status: z
		.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE'])
		.default('AVAILABLE')
})

export type CreateEquipmentInput = z.infer<typeof createEquipmentSchema>

/** Схема обновления техники (все поля опциональны) */
export const updateEquipmentSchema = createEquipmentSchema.partial()
export type UpdateEquipmentInput = z.infer<typeof updateEquipmentSchema>

/** Схема создания категории */
export const createCategorySchema = z.object({
	name: z.string().min(2).max(100),
	slug: z
		.string()
		.min(2)
		.max(100)
		.regex(
			/^[a-z0-9-]+$/,
			'Slug может содержать только строчные буквы, цифры и дефисы'
		),
	description: z.string().max(500).optional(),
	imageUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
	iconName: z.string().max(50).optional(),
	sortOrder: z.coerce.number().int().default(0)
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

/** Схема фильтров каталога */
export const catalogFiltersSchema = z.object({
	categoryId: z.string().optional(),
	status: z
		.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE', 'UNAVAILABLE'])
		.optional(),
	minPrice: z.preprocess(
		val => (val === undefined || val === '' ? undefined : Number(val)),
		z.number().optional()
	),
	maxPrice: z.preprocess(
		val => (val === undefined || val === '' ? undefined : Number(val)),
		z.number().optional()
	),
	search: z.string().optional(),
	sortBy: z
		.enum(['priceAsc', 'priceDesc', 'nameAsc', 'nameDesc'])
		.default('nameAsc'),
	page: z.preprocess(
		val => (val === undefined || val === '' ? 1 : Number(val)),
		z.number().int().min(1).default(1)
	),
	pageSize: z.preprocess(
		val => (val === undefined || val === '' ? 12 : Number(val)),
		z.number().int().min(1).max(50).default(12)
	)
})

export type CatalogFiltersInput = z.infer<typeof catalogFiltersSchema>
