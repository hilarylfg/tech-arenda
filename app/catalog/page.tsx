import { prisma } from '@/lib/prisma'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { CatalogClient } from './CatalogClient'

export const metadata: Metadata = {
	title: 'Каталог спецтехники',
	description:
		'Полный каталог строительной техники в аренду. Фильтрация по типу, цене и наличию.'
}

export default async function CatalogPage({
	searchParams
}: {
	searchParams: Promise<{ categoryId?: string }>
}) {
	const { categoryId } = await searchParams

	const categories = await prisma.category.findMany({
		orderBy: { sortOrder: 'asc' }
	})

	return (
		<div className='min-h-screen bg-stone-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Хлебные крошки */}
				<nav className='flex items-center gap-1 text-sm text-stone-500 mb-6'>
					<Link
						href='/'
						className='hover:text-stone-700 transition-colors'
					>
						Главная
					</Link>
					<ChevronRight className='h-3.5 w-3.5' />
					<span className='text-stone-900 font-medium'>Каталог</span>
				</nav>

				{/* Заголовок */}
				<div className='mb-8'>
					<h1 className='text-3xl font-bold text-stone-900 mb-2'>
						Каталог спецтехники
					</h1>
					<p className='text-stone-500'>
						Выберите технику для аренды и оформите заявку онлайн
					</p>
				</div>

				{/* Клиентская часть с фильтрами и списком */}
				<Suspense
					fallback={<div className='text-stone-400'>Загрузка...</div>}
				>
					<CatalogClient
						categories={categories}
						initialCategoryId={categoryId ?? ''}
					/>
				</Suspense>
			</div>
		</div>
	)
}
