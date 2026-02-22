'use client'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import type { Category } from '@prisma/client'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useCallback, useState } from 'react'

interface Filters {
	search: string
	categoryId: string
	sortBy: string
	minPrice: string
	maxPrice: string
}

interface EquipmentFiltersProps {
	categories: Category[]
	filters: Filters
	onFiltersChange: (filters: Filters) => void
}

export function EquipmentFilters({
	categories,
	filters,
	onFiltersChange
}: EquipmentFiltersProps) {
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleChange = useCallback(
		(key: keyof Filters, value: string) => {
			onFiltersChange({ ...filters, [key]: value })
		},
		[filters, onFiltersChange]
	)

	const handleReset = useCallback(() => {
		onFiltersChange({
			search: '',
			categoryId: '',
			sortBy: 'nameAsc',
			minPrice: '',
			maxPrice: ''
		})
	}, [onFiltersChange])

	const hasActiveFilters =
		filters.categoryId ||
		filters.minPrice ||
		filters.maxPrice ||
		filters.search

	const filterContent = (
		<div className='space-y-5'>
			{/* Поиск */}
			<div>
				<label className='block text-sm font-medium text-stone-700 mb-1.5'>
					Поиск
				</label>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400' />
					<input
						type='text'
						placeholder='Название техники...'
						value={filters.search}
						onChange={e => handleChange('search', e.target.value)}
						className='w-full h-10 pl-9 pr-3 rounded-lg border border-stone-300 text-sm
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
              placeholder:text-stone-400 transition-colors'
					/>
					{filters.search && (
						<button
							onClick={() => handleChange('search', '')}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600'
						>
							<X className='h-3.5 w-3.5' />
						</button>
					)}
				</div>
			</div>

			{/* Категория */}
			<div>
				<label className='block text-sm font-medium text-stone-700 mb-1.5'>
					Категория
				</label>
				<Select
					value={filters.categoryId || 'all'}
					onValueChange={v =>
						handleChange('categoryId', v === 'all' ? '' : v)
					}
				>
					<SelectTrigger>
						<SelectValue placeholder='Все категории' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Все категории</SelectItem>
						{categories.map(cat => (
							<SelectItem
								key={cat.id}
								value={cat.id}
							>
								{cat.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Диапазон цен */}
			<div>
				<label className='block text-sm font-medium text-stone-700 mb-1.5'>
					Цена в сутки (₽)
				</label>
				<div className='flex items-center gap-2'>
					<input
						type='number'
						placeholder='От'
						value={filters.minPrice}
						onChange={e => handleChange('minPrice', e.target.value)}
						className='w-full h-10 px-3 rounded-lg border border-stone-300 text-sm
              focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400'
						min='0'
					/>
					<span className='text-stone-400 text-sm'>—</span>
					<input
						type='number'
						placeholder='До'
						value={filters.maxPrice}
						onChange={e => handleChange('maxPrice', e.target.value)}
						className='w-full h-10 px-3 rounded-lg border border-stone-300 text-sm
              focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400'
						min='0'
					/>
				</div>
			</div>

			{/* Сортировка */}
			<div>
				<label className='block text-sm font-medium text-stone-700 mb-1.5'>
					Сортировка
				</label>
				<Select
					value={filters.sortBy}
					onValueChange={v => handleChange('sortBy', v)}
				>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='nameAsc'>
							По названию (А–Я)
						</SelectItem>
						<SelectItem value='nameDesc'>
							По названию (Я–А)
						</SelectItem>
						<SelectItem value='priceAsc'>
							По цене (возр.)
						</SelectItem>
						<SelectItem value='priceDesc'>
							По цене (убыв.)
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Сброс фильтров */}
			{hasActiveFilters && (
				<Button
					variant='ghost'
					size='sm'
					onClick={handleReset}
					className='w-full text-red-600 hover:text-red-700 hover:bg-red-50'
				>
					<X className='h-4 w-4 mr-1' />
					Сбросить фильтры
				</Button>
			)}
		</div>
	)

	return (
		<>
			{/* Кнопка открытия на мобильном */}
			<div className='lg:hidden mb-4'>
				<Button
					variant='outline'
					onClick={() => setMobileOpen(!mobileOpen)}
					className='gap-2'
				>
					<SlidersHorizontal className='h-4 w-4' />
					Фильтры
					{hasActiveFilters && (
						<span className='ml-1 h-5 w-5 rounded-full bg-amber-500 text-stone-900 text-xs font-bold flex items-center justify-center'>
							!
						</span>
					)}
				</Button>
			</div>

			{/* Мобильные фильтры */}
			{mobileOpen && (
				<div className='lg:hidden mb-6 rounded-xl border border-stone-200 bg-white p-4'>
					{filterContent}
				</div>
			)}

			{/* Десктопные фильтры (всегда видны) */}
			<aside className='hidden lg:block w-64 shrink-0'>
				<div className='sticky top-24 rounded-xl border border-stone-200 bg-white p-5'>
					<h2 className='font-semibold text-stone-900 mb-4 flex items-center gap-2'>
						<SlidersHorizontal className='h-4 w-4' />
						Фильтры
					</h2>
					{filterContent}
				</div>
			</aside>
		</>
	)
}
