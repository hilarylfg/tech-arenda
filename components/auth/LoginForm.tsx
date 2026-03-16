'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from '@/lib/session-context'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { refresh } = useSession()
	const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

	const [showPassword, setShowPassword] = useState(false)
	const [authError, setAuthError] = useState<string>('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema)
	})

	const onSubmit = async (data: LoginInput) => {
		setAuthError('')
		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			if (!res.ok) {
				setAuthError('Неверный email или пароль')
				return
			}
			await refresh()
			router.push(callbackUrl)
			router.refresh()
		} catch {
			setAuthError('Ошибка сети. Попробуйте ещё раз')
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4'
		>
			{/* Ошибка авторизации */}
			{authError && (
				<div className='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'>
					{authError}
				</div>
			)}

			{/* Email */}
			<Input
				{...register('email')}
				type='email'
				label='Email'
				placeholder='your@email.com'
				required
				autoComplete='email'
				error={errors.email?.message}
			/>

			{/* Пароль */}
			<div className='space-y-1.5'>
				<label className='block text-sm font-medium text-stone-700'>
					Пароль <span className='text-red-500 ml-1'>*</span>
				</label>
				<div className='relative'>
					<input
						{...register('password')}
						type={showPassword ? 'text' : 'password'}
						placeholder='Введите пароль'
						autoComplete='current-password'
						className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm pr-10
              placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-colors
              ${
					errors.password
						? 'border-red-500 focus:ring-red-500'
						: 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
				}`}
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600'
					>
						{showPassword ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>
				{errors.password && (
					<p className='text-xs text-red-600'>
						{errors.password.message}
					</p>
				)}
			</div>

			{/* Кнопка входа */}
			<Button
				type='submit'
				className='w-full'
				size='lg'
				loading={isSubmitting}
			>
				<LogIn className='h-4 w-4' />
				Войти
			</Button>

			{/* Ссылка на регистрацию */}
			<p className='text-center text-sm text-stone-500'>
				Нет аккаунта?{' '}
				<Link
					href='/register'
					className='font-medium text-amber-600 hover:text-amber-700 hover:underline'
				>
					Зарегистрироваться
				</Link>
			</p>
		</form>
	)
}
