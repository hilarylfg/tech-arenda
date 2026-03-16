import { LoginForm } from '@/components/auth/LoginForm'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
	title: 'Вход в систему',
	description:
		'Войдите в личный кабинет для управления заявками на аренду спецтехники'
}

export default function LoginPage() {
	return (
		<div className='min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-stone-50'>
			<div className='w-full max-w-md'>
				{/* Логотип */}
				<div className='text-center mb-8'>
					<h1 className='mt-4 text-2xl font-bold text-stone-900'>
						Вход в систему
					</h1>
					<p className='mt-2 text-sm text-stone-500'>
						Введите данные для входа в личный кабинет
					</p>
				</div>

				{/* Форма */}
				<div className='bg-white rounded-2xl border border-stone-200 shadow-sm p-8'>
					<Suspense>
						<LoginForm />
					</Suspense>
				</div>
			</div>
		</div>
	)
}
