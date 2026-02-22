'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfileSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type FormData = z.infer<typeof updateProfileSchema>

export default function ProfilePage() {
	const { data: session, update } = useSession()
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [errorMsg, setErrorMsg] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<FormData>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			firstName: (session?.user as any)?.firstName ?? '',
			lastName: (session?.user as any)?.lastName ?? '',
			phone: (session?.user as any)?.phone ?? ''
		}
	})

	async function onSubmit(data: FormData) {
		setStatus('loading')
		setErrorMsg('')
		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Ошибка сохранения')
			await update({ ...session, user: { ...session?.user, ...data } })
			setStatus('success')
		} catch (e: any) {
			setErrorMsg(e.message)
			setStatus('error')
		}
	}

	return (
		<div className='space-y-5'>
			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h2 className='font-semibold text-stone-900'>
						Личные данные
					</h2>
				</div>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='px-5 py-4 space-y-4'
				>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
						<Input
							label='Имя'
							{...register('firstName')}
							error={errors.firstName?.message}
						/>
						<Input
							label='Фамилия'
							{...register('lastName')}
							error={errors.lastName?.message}
						/>
					</div>
					<Input
						label='Телефон'
						type='tel'
						placeholder='+7 (900) 000-00-00'
						{...register('phone')}
						error={errors.phone?.message}
					/>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Email
						</label>
						<input
							type='email'
							value={session?.user?.email ?? ''}
							disabled
							className='w-full px-3 py-2 border border-stone-200 rounded-lg bg-stone-50 text-stone-400 text-sm'
						/>
						<p className='mt-1 text-xs text-stone-400'>
							Email нельзя изменить
						</p>
					</div>

					{status === 'success' && (
						<div className='flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg'>
							<CheckCircle2 className='h-4 w-4 shrink-0' />
							Данные успешно сохранены
						</div>
					)}
					{status === 'error' && (
						<div className='flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg'>
							<AlertCircle className='h-4 w-4 shrink-0' />
							{errorMsg}
						</div>
					)}

					<Button
						type='submit'
						loading={status === 'loading'}
					>
						Сохранить изменения
					</Button>
				</form>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h2 className='font-semibold text-stone-900'>
						Смена пароля
					</h2>
				</div>
				<div className='px-5 py-4'>
					<ChangePasswordForm />
				</div>
			</div>
		</div>
	)
}

function ChangePasswordForm() {
	const [fields, setFields] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	})
	const [status, setStatus] = useState<
		'idle' | 'loading' | 'success' | 'error'
	>('idle')
	const [errorMsg, setErrorMsg] = useState('')

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (fields.newPassword !== fields.confirmPassword) {
			setErrorMsg('Пароли не совпадают')
			setStatus('error')
			return
		}
		setStatus('loading')
		setErrorMsg('')
		try {
			const res = await fetch('/api/profile/password', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					currentPassword: fields.currentPassword,
					newPassword: fields.newPassword
				})
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Ошибка смены пароля')
			setStatus('success')
			setFields({
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
			})
		} catch (e: any) {
			setErrorMsg(e.message)
			setStatus('error')
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-4'
		>
			<Input
				label='Текущий пароль'
				type='password'
				value={fields.currentPassword}
				onChange={e =>
					setFields(p => ({ ...p, currentPassword: e.target.value }))
				}
				required
			/>
			<Input
				label='Новый пароль'
				type='password'
				value={fields.newPassword}
				onChange={e =>
					setFields(p => ({ ...p, newPassword: e.target.value }))
				}
				required
			/>
			<Input
				label='Подтвердите новый пароль'
				type='password'
				value={fields.confirmPassword}
				onChange={e =>
					setFields(p => ({ ...p, confirmPassword: e.target.value }))
				}
				required
			/>

			{status === 'success' && (
				<div className='flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg'>
					<CheckCircle2 className='h-4 w-4 shrink-0' />
					Пароль успешно изменён
				</div>
			)}
			{status === 'error' && (
				<div className='flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg'>
					<AlertCircle className='h-4 w-4 shrink-0' />
					{errorMsg}
				</div>
			)}

			<Button
				type='submit'
				loading={status === 'loading'}
			>
				Изменить пароль
			</Button>
		</form>
	)
}
