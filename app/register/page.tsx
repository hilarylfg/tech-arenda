import { RegisterForm } from '@/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Регистрация',
	description: 'Создайте аккаунт для аренды строительной спецтехники'
}

export default function RegisterPage() {
	return (
		<div className='min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50'>
			<div className='w-full max-w-lg'>
				{/* Логотип */}
				<div className='text-center mb-8'>
					<h1 className='mt-4 text-2xl font-bold text-stone-900'>
						Создать аккаунт
					</h1>
					<p className='mt-2 text-sm text-stone-500'>
						Зарегистрируйтесь для оформления заявок на аренду
					</p>
				</div>

				{/* Форма */}
				<div className='bg-white rounded-2xl border border-stone-200 shadow-sm p-8'>
					<RegisterForm />
				</div>
			</div>
		</div>
	)
}
