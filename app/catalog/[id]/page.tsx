import { OrderForm } from '@/components/catalog/OrderForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { EQUIPMENT_STATUS_LABELS } from '@/types'
import {
	ArrowLeft,
	Calendar,
	ChevronRight,
	Clock,
	MapPin,
	Truck
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface EquipmentPageProps {
	params: Promise<{ id: string }>
}

export async function generateMetadata({
	params
}: EquipmentPageProps): Promise<Metadata> {
	const { id } = await params
	const equipment = await prisma.equipment.findFirst({
		where: { OR: [{ id }, { slug: id }] }
	})

	if (!equipment) return { title: 'Техника не найдена' }

	return {
		title: equipment.name,
		description:
			equipment.shortDescription ?? equipment.description.slice(0, 160)
	}
}

export default async function EquipmentPage({ params }: EquipmentPageProps) {
	const { id } = await params

	const [equipment, session] = await Promise.all([
		prisma.equipment.findFirst({
			where: { OR: [{ id }, { slug: id }] },
			include: { category: true }
		}),
		getSession()
	])

	if (!equipment) notFound()

	const specs = equipment.specifications as Record<string, string>
	const isAvailable = equipment.status === 'AVAILABLE'

	const statusVariantMap: Record<
		string,
		'success' | 'info' | 'warning' | 'error'
	> = {
		AVAILABLE: 'success',
		RENTED: 'info',
		MAINTENANCE: 'warning',
		UNAVAILABLE: 'error'
	}

	return (
		<div className='min-h-screen bg-stone-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Хлебные крошки */}
				<nav className='flex items-center gap-1 text-sm text-stone-500 mb-6 flex-wrap'>
					<Link
						href='/'
						className='hover:text-stone-700'
					>
						Главная
					</Link>
					<ChevronRight className='h-3.5 w-3.5' />
					<Link
						href='/catalog'
						className='hover:text-stone-700'
					>
						Каталог
					</Link>
					<ChevronRight className='h-3.5 w-3.5' />
					<Link
						href={`/catalog?categoryId=${equipment.categoryId}`}
						className='hover:text-stone-700'
					>
						{equipment.category.name}
					</Link>
					<ChevronRight className='h-3.5 w-3.5' />
					<span className='text-stone-900 font-medium truncate max-w-48'>
						{equipment.name}
					</span>
				</nav>

				{/* Кнопка назад */}
				<Button
					variant='ghost'
					size='sm'
					asChild
					className='mb-4 -ml-2'
				>
					<Link href='/catalog'>
						<ArrowLeft className='h-4 w-4' />
						Назад к каталогу
					</Link>
				</Button>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Левая колонка — фото и описание */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Галерея */}
						<div className='rounded-2xl overflow-hidden bg-stone-200 aspect-video'>
							{equipment.images[0] ? (
								<img
									src={equipment.images[0]}
									alt={equipment.name}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<Truck className='h-24 w-24 text-stone-400' />
								</div>
							)}
						</div>

						{/* Миниатюры */}
						{equipment.images.length > 1 && (
							<div className='grid grid-cols-4 gap-2'>
								{equipment.images.slice(1, 5).map((img, i) => (
									<div
										key={i}
										className='rounded-lg overflow-hidden aspect-video bg-stone-200'
									>
										<img
											src={img}
											alt={`${equipment.name} ${i + 2}`}
											className='w-full h-full object-cover'
										/>
									</div>
								))}
							</div>
						)}

						{/* Описание */}
						<div className='bg-white rounded-2xl border border-stone-200 p-6'>
							<div className='flex items-start justify-between gap-4 mb-4'>
								<div>
									<span className='text-sm text-stone-400'>
										{equipment.category.name}
									</span>
									<h1 className='text-2xl font-bold text-stone-900 mt-0.5'>
										{equipment.name}
									</h1>
								</div>
								<Badge
									variant={
										statusVariantMap[equipment.status] ??
										'gray'
									}
								>
									{EQUIPMENT_STATUS_LABELS[equipment.status]}
								</Badge>
							</div>

							{equipment.shortDescription && (
								<p className='text-stone-600 font-medium mb-4'>
									{equipment.shortDescription}
								</p>
							)}

							<p className='text-stone-500 leading-relaxed whitespace-pre-wrap'>
								{equipment.description}
							</p>
						</div>

						{/* Технические характеристики */}
						{Object.keys(specs).length > 0 && (
							<div className='bg-white rounded-2xl border border-stone-200 p-6'>
								<h2 className='text-lg font-semibold text-stone-900 mb-4'>
									Технические характеристики
								</h2>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
									{Object.entries(specs).map(
										([key, value]) => (
											<div
												key={key}
												className='flex justify-between py-2 border-b border-stone-100 last:border-0'
											>
												<span className='text-sm text-stone-500'>
													{key}
												</span>
												<span className='text-sm font-medium text-stone-900'>
													{value}
												</span>
											</div>
										)
									)}
								</div>
							</div>
						)}

						{/* Местоположение */}
						<div className='bg-white rounded-2xl border border-stone-200 p-6'>
							<h2 className='text-lg font-semibold text-stone-900 mb-3 flex items-center gap-2'>
								<MapPin className='h-5 w-5 text-amber-500' />
								Местоположение
							</h2>
							<p className='text-stone-600'>
								{equipment.location}
							</p>
							{equipment.latitude && equipment.longitude && (
								<p className='text-xs text-stone-400 mt-1'>
									Координаты: {equipment.latitude.toFixed(4)},{' '}
									{equipment.longitude.toFixed(4)}
								</p>
							)}
						</div>
					</div>

					{/* Правая колонка — цены и заказ */}
					<div className='space-y-4'>
						{/* Блок цен */}
						<div className='bg-white rounded-2xl border border-stone-200 p-6 sticky top-24'>
							<h2 className='text-lg font-semibold text-stone-900 mb-4'>
								Стоимость аренды
							</h2>

							<div className='space-y-3 mb-6'>
								{equipment.pricePerHour != null && (
									<div className='flex justify-between items-center py-2 border-b border-stone-100'>
										<div className='flex items-center gap-2 text-stone-600'>
											<Clock className='h-4 w-4 text-stone-400' />
											<span className='text-sm'>
												В час
											</span>
										</div>
										<span className='font-semibold text-stone-900'>
											{formatPrice(
												Number(equipment.pricePerHour)
											)}
										</span>
									</div>
								)}

								<div className='flex justify-between items-center py-2 border-b border-stone-100'>
									<div className='flex items-center gap-2 text-stone-600'>
										<Calendar className='h-4 w-4 text-amber-500' />
										<span className='text-sm font-medium'>
											В сутки
										</span>
									</div>
									<span className='text-xl font-bold text-amber-600'>
										{formatPrice(
											Number(equipment.pricePerDay)
										)}
									</span>
								</div>

								{equipment.pricePerWeek && (
									<div className='flex justify-between items-center py-2'>
										<div className='flex items-center gap-2 text-stone-600'>
											<Calendar className='h-4 w-4 text-stone-400' />
											<span className='text-sm'>
												В неделю
											</span>
										</div>
										<div className='text-right'>
											<span className='font-semibold text-stone-900'>
												{formatPrice(
													Number(
														equipment.pricePerWeek
													)
												)}
											</span>
											<p className='text-xs text-green-600'>
												Выгоднее
											</p>
										</div>
									</div>
								)}
							</div>

							{equipment.minRentHours != null &&
								equipment.minRentHours > 0 && (
									<div className='text-xs text-stone-400 mb-4 flex items-center gap-1'>
										<Clock className='h-3 w-3' />
										Минимальное время аренды:{' '}
										{equipment.minRentHours} ч.
									</div>
								)}

							{/* Форма заказа или CTA */}
							{isAvailable ? (
								session ? (
									<OrderForm
										equipment={{
											id: equipment.id,
											pricePerDay: Number(
												equipment.pricePerDay
											),
											pricePerWeek:
												equipment.pricePerWeek != null
													? Number(
															equipment.pricePerWeek
														)
													: null
										}}
										userId={session.id}
									/>
								) : (
									<div className='space-y-3'>
										<p className='text-sm text-stone-500 text-center'>
											Для оформления заявки необходима
											авторизация
										</p>
										<Button
											className='w-full'
											asChild
										>
											<Link
												href={`/login?callbackUrl=/catalog/${equipment.slug || equipment.id}`}
											>
												Войти и заказать
											</Link>
										</Button>
										<Button
											variant='outline'
											className='w-full'
											asChild
										>
											<Link href='/register'>
												Зарегистрироваться
											</Link>
										</Button>
									</div>
								)
							) : (
								<div className='rounded-lg bg-stone-50 border border-stone-200 p-4 text-center'>
									<p className='text-sm text-stone-500'>
										Эта техника сейчас недоступна для аренды
									</p>
									<Button
										variant='outline'
										className='mt-3 w-full'
										asChild
									>
										<Link href='/catalog'>
											Посмотреть другую
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
