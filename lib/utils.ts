import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Утилита для объединения CSS классов Tailwind */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

/** Форматирование цены в рублях */
export function formatPrice(
	price: number | string | { toFixed: (n: number) => string }
): string {
	const numPrice =
		typeof price === 'object' ? parseFloat(price.toFixed(2)) : Number(price)
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(numPrice)
}

/** Форматирование даты в русском формате */
export function formatDate(date: Date | string): string {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(new Date(date))
}

/** Форматирование даты и времени */
export function formatDateTime(date: Date | string): string {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(new Date(date))
}

/** Форматирование телефона */
export function formatPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, '')
	if (cleaned.length === 11) {
		return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
	}
	return phone
}

/** Вычисление количества дней между датами */
export function calculateDays(
	startDate: Date | string,
	endDate: Date | string
): number {
	const start = new Date(startDate)
	const end = new Date(endDate)
	const diffMs = end.getTime() - start.getTime()
	return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

/** Вычисление стоимости аренды */
export function calculateRentalCost(
	days: number,
	pricePerDay: number,
	pricePerWeek?: number | null
): number {
	if (pricePerWeek && days >= 7) {
		const weeks = Math.floor(days / 7)
		const remainingDays = days % 7
		return weeks * pricePerWeek + remainingDays * pricePerDay
	}
	return days * pricePerDay
}

/** Генерация slug из строки */
export function generateSlug(str: string): string {
	const translitMap: Record<string, string> = {
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		ё: 'yo',
		ж: 'zh',
		з: 'z',
		и: 'i',
		й: 'y',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'h',
		ц: 'ts',
		ч: 'ch',
		ш: 'sh',
		щ: 'sch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya'
	}

	return str
		.toLowerCase()
		.split('')
		.map(char => translitMap[char] ?? char)
		.join('')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

/** Обрезка текста до заданной длины */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text
	return text.slice(0, maxLength).trim() + '...'
}

/** Форматирование числа с разрядами */
export function formatNumber(num: number): string {
	return new Intl.NumberFormat('ru-RU').format(num)
}
