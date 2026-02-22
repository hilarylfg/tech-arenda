import { auth } from '@/lib/auth'
import { ChevronRight, ShieldAlert } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminNav from './AdminNav'

export const metadata: Metadata = {
	title: 'Панель администратора | СпецАренда'
}

export default async function AdminLayout({
	children
}: {
	children: React.ReactNode
}) {
	const session = await auth()
	if (!session?.user) redirect('/login')
	if (session.user.role !== 'ADMIN') {
		return (
			<div className='min-h-screen bg-stone-50 flex items-center justify-center px-4'>
				<div className='text-center'>
					<ShieldAlert className='mx-auto h-12 w-12 text-red-400 mb-4' />
					<h1 className='text-xl font-bold text-stone-900 mb-2'>
						Доступ запрещён
					</h1>
					<p className='text-stone-500 mb-6'>
						У вас нет прав для доступа к панели администратора
					</p>
					<Link
						href='/dashboard'
						className='px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors'
					>
						Личный кабинет
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-stone-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='mb-6'>
					<nav className='flex items-center gap-1 text-sm text-stone-500 mb-3'>
						<Link
							href='/'
							className='hover:text-stone-700'
						>
							Главная
						</Link>
						<ChevronRight className='h-3.5 w-3.5' />
						<span className='text-stone-900 font-medium'>
							Администратор
						</span>
					</nav>
					<h1 className='text-2xl font-bold text-stone-900'>
						Панель администратора
					</h1>
				</div>

				<div className='flex flex-col sm:flex-row gap-6'>
					<aside className='sm:w-56 shrink-0'>
						<AdminNav />
					</aside>
					<div className='flex-1 min-w-0'>{children}</div>
				</div>
			</div>
		</div>
	)
}
