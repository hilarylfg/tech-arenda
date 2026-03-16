'use client'

import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/session-context'
import { cn } from '@/lib/utils'
import {
	ChevronDown,
	LayoutDashboard,
	LogOut,
	Menu,
	Settings,
	Truck,
	X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const navLinks = [
	{ href: '/catalog', label: 'Каталог' },
	{ href: '/#about', label: 'О компании' },
	{ href: '/#contacts', label: 'Контакты' }
]

export function Header() {
	const { user: session, status, refresh } = useSession()
	const router = useRouter()
	const pathname = usePathname()
	const [mobileOpen, setMobileOpen] = useState(false)
	const [userMenuOpen, setUserMenuOpen] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	const isAdmin = session?.role === 'ADMIN'

	// Закрываем мобильное меню при смене маршрута
	useEffect(() => {
		setMobileOpen(false)
		setUserMenuOpen(false)
	}, [pathname])

	// Закрываем десктопное меню при клике вне его
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (
				menuRef.current &&
				!menuRef.current.contains(e.target as Node)
			) {
				setUserMenuOpen(false)
			}
		}
		if (userMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () =>
			document.removeEventListener('mousedown', handleClickOutside)
	}, [userMenuOpen])

	const handleSignOut = async () => {
		setUserMenuOpen(false)
		await fetch('/api/auth/logout', { method: 'POST' })
		await refresh()
		router.push('/')
		router.refresh()
	}

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
						{status === 'loading' ? (
							// Скелетон пока сессия загружается
							<div className='hidden md:flex items-center gap-2'>
								<div className='h-8 w-8 rounded-full bg-stone-200 animate-pulse' />
								<div className='h-4 w-24 rounded bg-stone-200 animate-pulse' />
							</div>
						) : session ? (
							// Пользовательское меню
							<div
								className='relative hidden md:block'
								ref={menuRef}
							>
								<button
									onClick={() =>
										setUserMenuOpen(!userMenuOpen)
									}
									className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors'
								>
									<div className='h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold'>
										{session.firstName?.[0]}
										{session.lastName?.[0]}
									</div>
									<span className='max-w-32 truncate'>
										{session.firstName} {session.lastName}
									</span>
									<ChevronDown
										className={cn(
											'h-4 w-4 transition-transform duration-200',
											userMenuOpen && 'rotate-180'
										)}
									/>
								</button>

								{userMenuOpen && (
									<div className='absolute right-0 top-full mt-1 w-56 rounded-xl border border-stone-200 bg-white shadow-lg py-1 z-50 animate-fade-in'>
										<div className='px-4 py-2 border-b border-stone-100'>
											<p className='text-sm font-medium text-stone-900'>
												{session.firstName}{' '}
												{session.lastName}
											</p>
											<p className='text-xs text-stone-500'>
												{session.email}
											</p>
										</div>
										<Link
											href='/dashboard'
											className='flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors'
										>
											<LayoutDashboard className='h-4 w-4' />
											Личный кабинет
										</Link>
										{isAdmin && (
											<Link
												href='/admin'
												className='flex items-center gap-2 px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors'
											>
												<Settings className='h-4 w-4' />
												Панель администратора
											</Link>
										)}
										<div className='border-t border-stone-100 mt-1 pt-1'>
											<button
												onClick={handleSignOut}
												className='flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
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
				<div className='md:hidden border-t border-stone-200 bg-white px-4 py-3 space-y-2 animate-fade-in'>
					{navLinks.map(link => (
						<Link
							key={link.href}
							href={link.href}
							className='block py-2 text-sm font-medium text-stone-700 hover:text-amber-600 transition-colors'
						>
							{link.label}
						</Link>
					))}
					<div className='border-t border-stone-100 pt-2 mt-2'>
						{status === 'loading' ? (
							<div className='flex items-center gap-2 py-2'>
								<div className='h-6 w-6 rounded-full bg-stone-200 animate-pulse' />
								<div className='h-4 w-28 rounded bg-stone-200 animate-pulse' />
							</div>
						) : session ? (
							<div className='space-y-1'>
								<div className='flex items-center gap-2 py-2'>
									<div className='h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold'>
										{session.firstName?.[0]}
										{session.lastName?.[0]}
									</div>
									<div>
										<p className='text-sm font-medium text-stone-900'>
											{session.firstName}{' '}
											{session.lastName}
										</p>
										<p className='text-xs text-stone-400'>
											{session.email}
										</p>
									</div>
								</div>
								<Link
									href='/dashboard'
									className='flex items-center gap-2 py-2 text-sm text-stone-700 hover:text-amber-600 transition-colors'
								>
									<LayoutDashboard className='h-4 w-4' />
									Личный кабинет
								</Link>
								{isAdmin && (
									<Link
										href='/admin'
										className='flex items-center gap-2 py-2 text-sm text-amber-600'
									>
										<Settings className='h-4 w-4' />
										Администрирование
									</Link>
								)}
								<button
									onClick={handleSignOut}
									className='flex items-center gap-2 py-2 text-sm text-red-600 hover:text-red-700 transition-colors'
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
