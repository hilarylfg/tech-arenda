'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	ChevronDown,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	Truck,
	User,
	X
} from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
	{ href: '/catalog', label: 'Каталог' },
	{ href: '/#about', label: 'О компании' },
	{ href: '/#contacts', label: 'Контакты' }
]

export function Header() {
	const { data: session } = useSession()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)

	const isAdmin = session?.user?.role === 'ADMIN'

	return (
		<header className='sticky top-0 z-50 w-full border-b border-stone-200 bg-white/95 backdrop-blur-sm shadow-sm'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					{/* Логотип */}
					<Link
						href='/'
						className='flex items-center gap-2 font-bold text-xl text-stone-900 hover:text-amber-600 transition-colors'
					>
						<Truck className='h-6 w-6 text-amber-500' />
						<span>СпецТехАренда</span>
					</Link>

					{/* Навигация (десктоп) */}
					<nav className='hidden md:flex items-center gap-6'>
						{navLinks.map(link => (
							<Link
								key={link.href}
								href={link.href}
								className='text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors'
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* Правая часть */}
					<div className='flex items-center gap-3'>
						{session?.user ? (
							// Пользовательское меню
							<div className='relative hidden md:block'>
								<button
									onClick={() =>
										setUserMenuOpen(!userMenuOpen)
									}
									className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors'
								>
									<div className='h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold'>
										{session.user.firstName?.[0]}
										{session.user.lastName?.[0]}
									</div>
									<span className='max-w-32 truncate'>
										{session.user.firstName}{' '}
										{session.user.lastName}
									</span>
									<ChevronDown
										className={cn(
											'h-4 w-4 transition-transform',
											userMenuOpen && 'rotate-180'
										)}
									/>
								</button>

								{userMenuOpen && (
									<div
										className='absolute right-0 top-full mt-1 w-56 rounded-xl border border-stone-200 bg-white shadow-lg py-1 z-50'
										onMouseLeave={() =>
											setUserMenuOpen(false)
										}
									>
										<div className='px-4 py-2 border-b border-stone-100'>
											<p className='text-sm font-medium text-stone-900'>
												{session.user.firstName}{' '}
												{session.user.lastName}
											</p>
											<p className='text-xs text-stone-500'>
												{session.user.email}
											</p>
										</div>
										<Link
											href='/dashboard'
											className='flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50'
											onClick={() =>
												setUserMenuOpen(false)
											}
										>
											<LayoutDashboard className='h-4 w-4' />
											Личный кабинет
										</Link>
										{isAdmin && (
											<Link
												href='/admin/dashboard'
												className='flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50'
												onClick={() =>
													setUserMenuOpen(false)
												}
											>
												<Settings className='h-4 w-4' />
												Панель администратора
											</Link>
										)}
										<div className='border-t border-stone-100 mt-1 pt-1'>
											<button
												onClick={() =>
													signOut({
														callbackUrl: '/'
													})
												}
												className='flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50'
											>
												<LogOut className='h-4 w-4' />
												Выйти
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							// Кнопки входа
							<div className='hidden md:flex items-center gap-2'>
								<Button
									variant='ghost'
									size='sm'
									asChild
								>
									<Link href='/login'>Войти</Link>
								</Button>
								<Button
									size='sm'
									asChild
								>
									<Link href='/register'>Регистрация</Link>
								</Button>
							</div>
						)}

						{/* Мобильное меню */}
						<button
							onClick={() => setMobileOpen(!mobileOpen)}
							className='md:hidden rounded-lg p-2 text-stone-600 hover:bg-stone-100'
						>
							{mobileOpen ? (
								<X className='h-5 w-5' />
							) : (
								<Menu className='h-5 w-5' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Мобильная навигация */}
			{mobileOpen && (
				<div className='md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2'>
					{navLinks.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className='block py-2 text-sm font-medium text-stone-700 hover:text-amber-600'
							onClick={() => setMobileOpen(false)}
						>
							{link.label}
						</Link>
					))}
					<div className='border-t border-stone-100 pt-2 mt-2'>
						{session?.user ? (
							<div className='space-y-1'>
								<Link
									href='/dashboard'
									className='flex items-center gap-2 py-2 text-sm text-stone-700'
									onClick={() => setMobileOpen(false)}
								>
									<User className='h-4 w-4' />
									{session.user.firstName}{' '}
									{session.user.lastName}
								</Link>
								{isAdmin && (
									<Link
										href='/admin/dashboard'
										className='flex items-center gap-2 py-2 text-sm text-amber-600'
										onClick={() => setMobileOpen(false)}
									>
										<Settings className='h-4 w-4' />
										Администрирование
									</Link>
								)}
								<button
									onClick={() =>
										signOut({ callbackUrl: '/' })
									}
									className='flex items-center gap-2 py-2 text-sm text-red-600'
								>
									<LogOut className='h-4 w-4' />
									Выйти
								</button>
							</div>
						) : (
							<div className='flex gap-2'>
								<Button
									variant='outline'
									size='sm'
									asChild
									className='flex-1'
								>
									<Link href='/login'>Войти</Link>
								</Button>
								<Button
									size='sm'
									asChild
									className='flex-1'
								>
									<Link href='/register'>Регистрация</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	)
}
