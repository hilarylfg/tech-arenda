import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { EQUIPMENT_STATUS_LABELS } from '@/types'
import {
	ArrowRight,
	ChevronRight,
	Clock,
	HardHat,
	Phone,
	Shield,
	ThumbsUp,
	Truck
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Аренда строительной спецтехники',
	description:
		'Надёжная аренда экскаваторов, кранов, погрузчиков и бульдозеров. Работаем по всей России.'
}

const ADVANTAGES = [
	{
		icon: Shield,
		title: 'Гарантия надёжности',
		description:
			'Весь парк техники регулярно проходит ТО. Страхование включено в стоимость.'
	},
	{
		icon: Clock,
		title: 'Оперативность',
		description:
			'Подтверждение заявки в течение 1 часа. Техника доставляется в удобное время.'
	},
	{
		icon: ThumbsUp,
		title: 'Опытные операторы',
		description: 'Квалифицированные операторы с многолетним опытом работы.'
	},
	{
		icon: Phone,
		title: 'Поддержка 24/7',
		description: 'Круглосуточная техническая поддержка. Решим любой вопрос.'
	}
]

export default async function HomePage() {
	const [categories, featuredEquipment] = await Promise.all([
		prisma.category.findMany({
			orderBy: { sortOrder: 'asc' },
			include: { _count: { select: { equipments: true } } }
		}),
		prisma.equipment.findMany({
			where: { status: 'AVAILABLE' },
			take: 6,
			orderBy: { createdAt: 'desc' },
			include: { category: { select: { name: true } } }
		})
	])

	return (
		<div className='animate-fade-in'>
			{/* Герой */}
			<section className='relative min-h-[80vh] flex items-center bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 overflow-hidden'>
				<div className='absolute top-20 right-10 opacity-10'>
					<Truck className='h-64 w-64 text-amber-400' />
				</div>
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
					<div className='max-w-2xl'>
						<div className='inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/30 px-4 py-1.5 text-sm text-amber-300 mb-6'>
							<HardHat className='h-4 w-4' />
							<span>Профессиональная строительная техника</span>
						</div>
						<h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
							Аренда спецтехники
							<span className='text-amber-400 block'>
								для вашего проекта
							</span>
						</h1>
						<p className='text-lg text-stone-300 mb-8 leading-relaxed'>
							Экскаваторы, краны, погрузчики и бульдозеры ведущих
							производителей. Гибкие условия, опытные операторы,
							страховка включена.
						</p>
						<div className='flex flex-col sm:flex-row gap-4'>
							<Button
								size='xl'
								asChild
							>
								<Link href='/catalog'>
									Арендовать сейчас
									<ArrowRight className='h-5 w-5' />
								</Link>
							</Button>
							<Button
								size='xl'
								variant='outline'
								className='border-white/30 text-white hover:bg-white/10'
								asChild
							>
								<a href='tel:+78001234567'>
									<Phone className='h-5 w-5' />8 (800)
									123-45-67
								</a>
							</Button>
						</div>
						<div className='grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10'>
							{[
								{ value: '50+', label: 'Единиц техники' },
								{ value: '500+', label: 'Проектов' },
								{ value: '24/7', label: 'Поддержка' }
							].map(s => (
								<div key={s.label}>
									<p className='text-2xl font-bold text-amber-400'>
										{s.value}
									</p>
									<p className='text-xs text-stone-400 mt-0.5'>
										{s.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Категории */}
			<section className='py-16 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-10'>
						<h2 className='text-3xl font-bold text-stone-900 mb-3'>
							Категории техники
						</h2>
						<p className='text-stone-500'>
							Выберите нужный тип из нашего каталога
						</p>
					</div>
					{categories.length > 0 ? (
						<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
							{categories.map(cat => (
								<Link
									key={cat.id}
									href={`/catalog?categoryId=${cat.id}`}
									className='group flex flex-col items-center p-6 rounded-xl border border-stone-200
                    bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition-all'
								>
									<span className='text-4xl mb-3'>🚧</span>
									<h3 className='font-semibold text-stone-900 text-sm text-center'>
										{cat.name}
									</h3>
									<p className='text-xs text-stone-400 mt-1'>
										{cat._count.equipments} ед.
									</p>
								</Link>
							))}
						</div>
					) : (
						<p className='text-center text-stone-400 py-8'>
							Данные загружаются...
						</p>
					)}
				</div>
			</section>

			{/* Популярная техника */}
			<section className='py-16 bg-stone-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between mb-10'>
						<div>
							<h2 className='text-3xl font-bold text-stone-900 mb-2'>
								Доступная техника
							</h2>
							<p className='text-stone-500'>
								Готова к аренде прямо сейчас
							</p>
						</div>
						<Button
							variant='outline'
							asChild
							className='hidden sm:flex'
						>
							<Link href='/catalog'>
								Весь каталог{' '}
								<ChevronRight className='h-4 w-4' />
							</Link>
						</Button>
					</div>

					{featuredEquipment.length > 0 ? (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
							{featuredEquipment.map(eq => (
								<Link
									key={eq.id}
									href={`/catalog/${eq.slug || eq.id}`}
									className='group block rounded-xl border border-stone-200 bg-white overflow-hidden hover:shadow-md transition-all'
								>
									<div className='h-44 bg-gradient-to-br from-stone-200 to-stone-300 relative overflow-hidden flex items-center justify-center'>
										{eq.images[0] ? (
											<img
												src={eq.images[0]}
												alt={eq.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
											/>
										) : (
											<Truck className='h-16 w-16 text-stone-400' />
										)}
										<span className='absolute top-3 left-3 rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white'>
											{EQUIPMENT_STATUS_LABELS[
												eq.status
											] ?? 'Доступна'}
										</span>
									</div>
									<div className='p-4'>
										<span className='text-xs text-stone-400'>
											{eq.category.name}
										</span>
										<h3 className='font-semibold text-stone-900 mt-0.5 line-clamp-1'>
											{eq.name}
										</h3>
										<div className='flex items-center justify-between mt-3'>
											<div>
												<p className='text-lg font-bold text-stone-900'>
													{formatPrice(
														Number(eq.pricePerDay)
													)}
												</p>
												<p className='text-xs text-stone-400'>
													в сутки
												</p>
											</div>
											<span className='text-sm text-amber-600 font-medium'>
												Подробнее →
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='text-center py-12'>
							<Truck className='h-12 w-12 text-stone-300 mx-auto mb-3' />
							<p className='text-stone-500'>
								Техника пока не добавлена
							</p>
						</div>
					)}
				</div>
			</section>

			{/* Преимущества */}
			<section
				className='py-16 bg-white'
				id='about'
			>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold text-stone-900 mb-3'>
							Почему выбирают нас
						</h2>
						<p className='text-stone-500 max-w-xl mx-auto'>
							Более 10 лет на рынке. Сотни довольных клиентов по
							всей России.
						</p>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						{ADVANTAGES.map(adv => (
							<div
								key={adv.title}
								className='p-6 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-200 transition-all'
							>
								<div className='h-12 w-12 rounded-xl bg-amber-500 flex items-center justify-center mb-4'>
									<adv.icon className='h-6 w-6 text-stone-900' />
								</div>
								<h3 className='font-semibold text-stone-900 mb-2'>
									{adv.title}
								</h3>
								<p className='text-sm text-stone-500 leading-relaxed'>
									{adv.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className='py-16 bg-amber-500'>
				<div className='max-w-4xl mx-auto px-4 text-center'>
					<h2 className='text-3xl font-bold text-stone-900 mb-4'>
						Готовы начать проект?
					</h2>
					<p className='text-stone-800 text-lg mb-8'>
						Оставьте заявку онлайн или позвоните нам
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Button
							size='xl'
							variant='secondary'
							asChild
						>
							<Link href='/register'>Оставить заявку</Link>
						</Button>
						<Button
							size='xl'
							variant='outline'
							className='border-stone-900/30 hover:bg-stone-900/10'
							asChild
						>
							<a href='tel:+78001234567'>
								<Phone className='h-5 w-5' />
								Позвонить
							</a>
						</Button>
					</div>
				</div>
			</section>
		</div>
	)
}
