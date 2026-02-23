'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function RegisterForm() {
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const [serverError, setServerError] = useState<string>('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema)
	})

	const onSubmit = async (data: RegisterInput) => {
		setServerError('')

		try {
			// Отправляем регистрационный запрос
			const res = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})

			const json = await res.json()

			if (!res.ok) {
				setServerError(json.error ?? 'Ошибка при регистрации')
				return
			}

			// Автоматически входим после регистрации
			const loginRes = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: data.email,
					password: data.password
				})
			})

			if (!loginRes.ok) {
				// Если вход не удался — перенаправляем на страницу входа
				router.push('/login?registered=1')
				return
			}

			router.push('/dashboard')
			router.refresh()
		} catch {
			setServerError('Сетевая ошибка. Попробуйте ещё раз.')
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4'
		>
			{/* Серверная ошибка */}
			{serverError && (
				<div className='rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700'>
					{serverError}
				</div>
			)}

			{/* ФИО */}
			<div className='grid grid-cols-2 gap-3'>
				<Input
					{...register('firstName')}
					label='Имя'
					placeholder='Иван'
					required
					error={errors.firstName?.message}
				/>
				<Input
					{...register('lastName')}
					label='Фамилия'
					placeholder='Иванов'
					required
					error={errors.lastName?.message}
				/>
			</div>

			{/* Email */}
			<Input
				{...register('email')}
				type='email'
				label='Email'
				placeholder='ivan@example.com'
				required
				autoComplete='email'
				error={errors.email?.message}
			/>

			{/* Телефон */}
			<Input
				{...register('phone')}
				type='tel'
				label='Телефон'
				placeholder='+7 (999) 123-45-67'
				required
				autoComplete='tel'
				hint='Формат: +7XXXXXXXXXX или 8XXXXXXXXXX'
				error={errors.phone?.message}
			/>

			{/* Название компании (опционально) */}
			<Input
				{...register('companyName')}
				label='Название компании'
				placeholder='ООО «Стройгрупп»'
				hint='Необязательно — для юридических лиц'
				error={errors.companyName?.message}
			/>

			{/* ИНН (опционально) */}
			<Input
				{...register('inn')}
				label='ИНН'
				placeholder='1234567890'
				hint='Необязательно — 10 или 12 цифр'
				error={errors.inn?.message}
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
						placeholder='Минимум 8 символов'
						autoComplete='new-password'
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

			{/* Подтверждение пароля */}
			<div className='space-y-1.5'>
				<label className='block text-sm font-medium text-stone-700'>
					Подтверждение пароля{' '}
					<span className='text-red-500 ml-1'>*</span>
				</label>
				<div className='relative'>
					<input
						{...register('confirmPassword')}
						type={showConfirm ? 'text' : 'password'}
						placeholder='Повторите пароль'
						autoComplete='new-password'
						className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm pr-10
              placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-colors
              ${
					errors.confirmPassword
						? 'border-red-500 focus:ring-red-500'
						: 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
				}`}
					/>
					<button
						type='button'
						onClick={() => setShowConfirm(!showConfirm)}
						className='absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600'
					>
						{showConfirm ? (
							<EyeOff className='h-4 w-4' />
						) : (
							<Eye className='h-4 w-4' />
						)}
					</button>
				</div>
				{errors.confirmPassword && (
					<p className='text-xs text-red-600'>
						{errors.confirmPassword.message}
					</p>
				)}
			</div>

			{/* Кнопка регистрации */}
			<Button
				type='submit'
				className='w-full'
				size='lg'
				loading={isSubmitting}
			>
				<UserPlus className='h-4 w-4' />
				Создать аккаунт
			</Button>

			{/* Ссылка на вход */}
			<p className='text-center text-sm text-stone-500'>
				Уже есть аккаунт?{' '}
				<Link
					href='/login'
					className='font-medium text-amber-600 hover:text-amber-700 hover:underline'
				>
					Войти
				</Link>
			</p>
		</form>
	)
}
