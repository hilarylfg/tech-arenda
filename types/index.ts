// Общие TypeScript интерфейсы проекта

import type {
	Category,
	Equipment,
	EquipmentStatus,
	Order,
	OrderItem,
	OrderStatus,
	User
} from '@prisma/client'

// ==================== КАТАЛОГ ТЕХНИКИ ====================

/** Карточка техники с категорией */
export type EquipmentWithCategory = Equipment & {
	category: Category
}

/** Полная информация о технике */
export type EquipmentDetail = Equipment & {
	category: Category
	orders: OrderItem[]
}

/** Параметры фильтрации каталога */
export interface CatalogFilters {
	categoryId?: string
	status?: EquipmentStatus
	minPrice?: number
	maxPrice?: number
	search?: string
	sortBy?: 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc'
	page?: number
	pageSize?: number
}

/** Результат запроса каталога */
export interface CatalogResult {
	equipment: EquipmentWithCategory[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

// ==================== ЗАЯВКИ ====================

/** Заявка с позициями и техникой */
export type OrderWithItems = Order & {
	items: (OrderItem & {
		equipment: Equipment
	})[]
}

/** Данные для создания заявки */
export interface CreateOrderInput {
	equipmentId: string
	startDate: string
	endDate: string
	comment?: string
}

// ==================== ПОЛЬЗОВАТЕЛЬ ====================

/** Публичные данные пользователя (без пароля) */
export type SafeUser = Omit<User, 'passwordHash'>

/** Данные для обновления профиля */
export interface UpdateProfileInput {
	firstName: string
	lastName: string
	phone: string
	companyName?: string
	inn?: string
}

// ==================== АДМИНИСТРАТИВНАЯ ПАНЕЛЬ ====================

/** Статистика для дашборда */
export interface AdminStats {
	totalEquipment: number
	availableEquipment: number
	totalOrders: number
	pendingOrders: number
	activeOrders: number
	totalRevenue: number
	monthRevenue: number
}

// ==================== API ОТВЕТЫ ====================

/** Стандартный ответ API */
export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

// ==================== ФОРМАТТЕРЫ ====================

/** Метки статуса заявки */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
	PENDING: 'На рассмотрении',
	CONFIRMED: 'Подтверждено',
	ACTIVE: 'Активная аренда',
	COMPLETED: 'Завершено',
	CANCELLED: 'Отменено'
}

/** Цвета статуса заявки */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
	PENDING: 'bg-yellow-100 text-yellow-800',
	CONFIRMED: 'bg-blue-100 text-blue-800',
	ACTIVE: 'bg-green-100 text-green-800',
	COMPLETED: 'bg-gray-100 text-gray-800',
	CANCELLED: 'bg-red-100 text-red-800'
}

/** Метки статуса техники */
export const EQUIPMENT_STATUS_LABELS: Record<EquipmentStatus, string> = {
	AVAILABLE: 'Доступна',
	RENTED: 'В аренде',
	MAINTENANCE: 'На обслуживании',
	UNAVAILABLE: 'Недоступна'
}

/** Цвета статуса техники */
export const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, string> = {
	AVAILABLE: 'bg-green-100 text-green-800',
	RENTED: 'bg-blue-100 text-blue-800',
	MAINTENANCE: 'bg-yellow-100 text-yellow-800',
	UNAVAILABLE: 'bg-red-100 text-red-800'
}
