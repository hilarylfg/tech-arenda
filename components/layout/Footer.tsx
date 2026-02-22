import { Clock, Mail, MapPin, Phone, Truck } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
	return (
		<footer className='bg-stone-900 text-stone-300'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Логотип и описание */}
					<div className='col-span-1 md:col-span-2'>
						<Link
							href='/'
							className='flex items-center gap-2 font-bold text-xl text-white mb-3'
						>
							<Truck className='h-6 w-6 text-amber-500' />
							<span>СпецТехАренда</span>
						</Link>
						<p className='text-sm leading-relaxed text-stone-400 mb-4'>
							Профессиональная аренда строительной спецтехники для
							вашего проекта. Современный парк машин, опытные
							операторы, гибкие условия.
						</p>
						<div className='flex gap-3'>
							{/* Ссылки на соцсети */}
							<a
								href='#'
								className='h-9 w-9 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-amber-500 hover:text-stone-900 transition-colors'
								aria-label='ВКонтакте'
							>
								<span className='text-xs font-bold'>VK</span>
							</a>
							<a
								href='#'
								className='h-9 w-9 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-amber-500 hover:text-stone-900 transition-colors'
								aria-label='Telegram'
							>
								<span className='text-xs font-bold'>TG</span>
							</a>
						</div>
					</div>

					{/* Навигация */}
					<div>
						<h3 className='font-semibold text-white mb-4'>
							Разделы
						</h3>
						<ul className='space-y-2'>
							{[
								{ href: '/catalog', label: 'Каталог техники' },
								{ href: '/#about', label: 'О компании' },
								{
									href: '/#advantages',
									label: 'Наши преимущества'
								},
								{ href: '/#contacts', label: 'Контакты' },
								{ href: '/dashboard', label: 'Личный кабинет' }
							].map(link => (
								<li key={link.href}>
									<Link
										href={link.href}
										className='text-sm text-stone-400 hover:text-amber-400 transition-colors'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Контакты */}
					<div id='contacts'>
						<h3 className='font-semibold text-white mb-4'>
							Контакты
						</h3>
						<ul className='space-y-3'>
							<li className='flex items-start gap-2 text-sm text-stone-400'>
								<Phone className='h-4 w-4 mt-0.5 text-amber-500 shrink-0' />
								<div>
									<a
										href='tel:+78001234567'
										className='hover:text-amber-400 transition-colors'
									>
										8 (800) 123-45-67
									</a>
									<p className='text-xs text-stone-500'>
										Бесплатно по России
									</p>
								</div>
							</li>
							<li className='flex items-center gap-2 text-sm text-stone-400'>
								<Mail className='h-4 w-4 text-amber-500 shrink-0' />
								<a
									href='mailto:info@spectechaenda.ru'
									className='hover:text-amber-400 transition-colors'
								>
									info@spectechaenda.ru
								</a>
							</li>
							<li className='flex items-start gap-2 text-sm text-stone-400'>
								<MapPin className='h-4 w-4 mt-0.5 text-amber-500 shrink-0' />
								<span>г. Москва, ул. Строителей, д. 15</span>
							</li>
							<li className='flex items-start gap-2 text-sm text-stone-400'>
								<Clock className='h-4 w-4 mt-0.5 text-amber-500 shrink-0' />
								<div>
									<p>Пн–Пт: 8:00–20:00</p>
									<p>Сб–Вс: 9:00–18:00</p>
								</div>
							</li>
						</ul>
					</div>
				</div>

				{/* Нижняя полоса */}
				<div className='border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
					<p className='text-xs text-stone-500'>
						© {new Date().getFullYear()} СпецТехАренда. Все права
						защищены.
					</p>
					<div className='flex gap-4'>
						<a
							href='#'
							className='text-xs text-stone-500 hover:text-stone-300 transition-colors'
						>
							Политика конфиденциальности
						</a>
						<a
							href='#'
							className='text-xs text-stone-500 hover:text-stone-300 transition-colors'
						>
							Условия использования
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
