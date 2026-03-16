'use client'

import { EquipmentFilters } from '@/components/catalog/EquipmentFilters'
import { Button } from '@/components/ui/button'
import { EquipmentCardSkeleton } from '@/components/ui/skeleton'
import { formatPrice } from '@/lib/utils'
import { EQUIPMENT_STATUS_LABELS } from '@/types'
import type { Category } from '@prisma/client'
import {
	ChevronLeft,
	ChevronRight,
	Grid3X3,
	List,
	MapPin,
	Search
} from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

interface Equipment {
	id: string
	name: string
	slug: string
	shortDescription: string | null
	images: string[]
	pricePerDay: number
	status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE'
	location: string
	category: { id: string; name: string; slug: string }
}

interface CatalogResult {
	equipment: Equipment[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

interface Filters {
	search: string
	categoryId: string
	sortBy: string
	minPrice: string
	maxPrice: string
}

interface CatalogClientProps {
	categories: Category[]
	initialCategoryId?: string
}

export function CatalogClient({
	categories,
	initialCategoryId = ''
}: CatalogClientProps) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [filters, setFilters] = useState<Filters>({
		search: searchParams.get('search') ?? '',
		categoryId: initialCategoryId || (searchParams.get('categoryId') ?? ''),
		sortBy: searchParams.get('sortBy') ?? 'nameAsc',
		minPrice: searchParams.get('minPrice') ?? '',
		maxPrice: searchParams.get('maxPrice') ?? ''
	})

	const [page, setPage] = useState(1)
	const [view, setView] = useState<'grid' | 'list'>('grid')
	const [result, setResult] = useState<CatalogResult | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchEquipment = useCallback(async () => {
		setLoading(true)
		try {
			const params = new URLSearchParams()
			if (filters.search) params.set('search', filters.search)
			if (filters.categoryId) params.set('categoryId', filters.categoryId)
			if (filters.sortBy) params.set('sortBy', filters.sortBy)
			if (filters.minPrice) params.set('minPrice', filters.minPrice)
			if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
			params.set('page', String(page))
			params.set('pageSize', '12')

			const res = await fetch(`/api/catalog?${params.toString()}`)
			const json = await res.json()

			if (json.success) {
				setResult(json.data)
			}
		} catch (error) {
			console.error('Ошибка загрузки каталога:', error)
		} finally {
			setLoading(false)
		}
	}, [filters, page])

	useEffect(() => {
		setPage(1)
	}, [filters])

	useEffect(() => {
		fetchEquipment()
	}, [fetchEquipment])

	const getStatusBadgeClass = (status: string): string => {
		switch (status) {
			case 'AVAILABLE':
				return 'bg-green-100 text-green-800'
			case 'RENTED':
				return 'bg-blue-100 text-blue-800'
			case 'MAINTENANCE':
				return 'bg-yellow-100 text-yellow-800'
			default:
				return 'bg-red-100 text-red-800'
		}
	}

	return (
		<div className='flex gap-8'>
			{/* Фильтры */}
			<EquipmentFilters
				categories={categories}
				filters={filters}
				onFiltersChange={setFilters}
			/>

			{/* Основной контент */}
			<div className='flex-1 min-w-0'>
				{/* Панель управления */}
				<div className='flex items-center justify-between mb-6 gap-4'>
					<p className='text-sm text-stone-500'>
						{loading
							? 'Загрузка...'
							: `Найдено: ${result?.total ?? 0} единиц`}
					</p>
					<div className='flex items-center gap-2'>
						{/* Вид */}
						<div className='flex items-center border border-stone-300 rounded-lg overflow-hidden'>
							<button
								onClick={() => setView('grid')}
								className={`p-2 transition-colors ${
									view === 'grid'
										? 'bg-amber-500 text-stone-900'
										: 'text-stone-400 hover:bg-stone-100'
								}`}
								title='Сетка'
							>
								<Grid3X3 className='h-4 w-4' />
							</button>
							<button
								onClick={() => setView('list')}
								className={`p-2 transition-colors ${
									view === 'list'
										? 'bg-amber-500 text-stone-900'
										: 'text-stone-400 hover:bg-stone-100'
								}`}
								title='Список'
							>
								<List className='h-4 w-4' />
							</button>
						</div>
					</div>
				</div>

				{/* Карточки */}
				{loading ? (
					<div
						className={
							view === 'grid'
								? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
								: 'space-y-4'
						}
					>
						{Array.from({ length: 6 }).map((_, i) => (
							<EquipmentCardSkeleton key={i} />
						))}
					</div>
				) : result?.equipment.length === 0 ? (
					<div className='text-center py-20'>
						<div className='inline-flex p-4 rounded-full bg-stone-100 mb-4'>
							<Search className='h-10 w-10 text-stone-400' />
						</div>
						<h3 className='text-lg font-semibold text-stone-700 mb-2'>
							Ничего не найдено
						</h3>
						<p className='text-stone-500 mb-6 max-w-sm mx-auto'>
							По вашему запросу нет подходящей техники. Попробуйте
							изменить условия фильтрации.
						</p>
						<Button
							variant='outline'
							onClick={() =>
								setFilters({
									search: '',
									categoryId: '',
									sortBy: 'nameAsc',
									minPrice: '',
									maxPrice: ''
								})
							}
						>
							Сбросить все фильтры
						</Button>
					</div>
				) : (
					<>
						<div
							className={
								view === 'grid'
									? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
									: 'space-y-4'
							}
						>
							{result?.equipment.map(eq =>
								view === 'grid' ? (
									<article
										key={eq.id}
										className='group rounded-xl border border-stone-200 bg-white overflow-hidden hover:shadow-md transition-all'
									>
										<div className='relative h-44 bg-stone-100 overflow-hidden'>
											{eq.images[0] ? (
												<img
													src={eq.images[0]}
													alt={eq.name}
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-stone-300'>
													<Search className='h-12 w-12' />
												</div>
											)}
											<span
												className={`absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(eq.status)}`}
											>
												{
													EQUIPMENT_STATUS_LABELS[
														eq.status
													]
												}
											</span>
											<span className='absolute top-3 right-3 text-xs text-white bg-black/50 px-2 py-0.5 rounded-full'>
												{eq.category.name}
											</span>
										</div>
										<div className='p-4'>
											<h3 className='font-semibold text-stone-900 line-clamp-1 mb-1'>
												{eq.name}
											</h3>
											{eq.shortDescription && (
												<p className='text-xs text-stone-500 line-clamp-2 mb-2'>
													{eq.shortDescription}
												</p>
											)}
											{eq.location && (
												<p className='text-xs text-stone-400 flex items-center gap-1 mb-3'>
													<MapPin className='h-3 w-3 shrink-0' />
													<span className='truncate'>
														{eq.location}
													</span>
												</p>
											)}
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-lg font-bold text-stone-900'>
														{formatPrice(
															Number(
																eq.pricePerDay
															)
														)}
													</p>
													<p className='text-xs text-stone-400'>
														в сутки
													</p>
												</div>
												<Button
													variant='outline'
													size='sm'
													asChild
												>
													<Link
														href={`/catalog/${eq.slug || eq.id}`}
													>
														Подробнее
													</Link>
												</Button>
											</div>
										</div>
									</article>
								) : (
									<article
										key={eq.id}
										className='flex gap-4 rounded-xl border border-stone-200 bg-white p-4 hover:shadow-sm transition-all'
									>
										<div className='w-32 h-24 rounded-lg bg-stone-100 overflow-hidden shrink-0'>
											{eq.images[0] ? (
												<img
													src={eq.images[0]}
													alt={eq.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center'>
													<Search className='h-8 w-8 text-stone-300' />
												</div>
											)}
										</div>
										<div className='flex-1 min-w-0'>
											<div className='flex items-start justify-between gap-2'>
												<div>
													<span className='text-xs text-stone-400'>
														{eq.category.name}
													</span>
													<h3 className='font-semibold text-stone-900 line-clamp-1'>
														{eq.name}
													</h3>
												</div>
												<span
													className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${getStatusBadgeClass(eq.status)}`}
												>
													{
														EQUIPMENT_STATUS_LABELS[
															eq.status
														]
													}
												</span>
											</div>
											{eq.shortDescription && (
												<p className='text-xs text-stone-500 mt-1 line-clamp-2'>
													{eq.shortDescription}
												</p>
											)}
											<div className='flex items-center justify-between mt-2'>
												<p className='font-bold text-stone-900'>
													{formatPrice(
														Number(eq.pricePerDay)
													)}{' '}
													<span className='text-xs font-normal text-stone-400'>
														/ сутки
													</span>
												</p>
												<Button
													variant='outline'
													size='sm'
													asChild
												>
													<Link
														href={`/catalog/${eq.slug || eq.id}`}
													>
														Подробнее
													</Link>
												</Button>
											</div>
										</div>
									</article>
								)
							)}
						</div>

						{/* Пагинация */}
						{result && result.totalPages > 1 && (
							<div className='flex items-center justify-center gap-2 mt-8'>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage(p => Math.max(1, p - 1))
									}
									disabled={page === 1}
								>
									<ChevronLeft className='h-4 w-4' />
								</Button>
								<span className='text-sm text-stone-600'>
									Страница {page} из {result.totalPages}
								</span>
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setPage(p =>
											Math.min(result.totalPages, p + 1)
										)
									}
									disabled={page === result.totalPages}
								>
									<ChevronRight className='h-4 w-4' />
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
