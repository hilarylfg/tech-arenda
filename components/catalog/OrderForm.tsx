'use client'

import { Button } from '@/components/ui/button'
import { calculateDays, calculateRentalCost, formatPrice } from '@/lib/utils'
import type { Equipment } from '@prisma/client'
import { Calculator, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface OrderFormProps {
	equipment: Equipment
	userId: string
}

interface FormData {
	startDate: string
	endDate: string
	comment: string
}

export function OrderForm({ equipment }: OrderFormProps) {
	const router = useRouter()
	const [submitting, setSubmitting] = useState(false)
	const [success, setSuccess] = useState(false)
	const [error, setError] = useState<string>('')

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors }
	} = useForm<FormData>()

	const startDate = watch('startDate')
	const endDate = watch('endDate')

	// Вычисляем стоимость при изменении дат
	const days = startDate && endDate ? calculateDays(startDate, endDate) : 0
	const totalCost =
		days > 0
			? calculateRentalCost(
					days,
					Number(equipment.pricePerDay),
					equipment.pricePerWeek
						? Number(equipment.pricePerWeek)
						: null
				)
			: 0

	const today = new Date().toISOString().split('T')[0]

	const onSubmit = async (data: FormData) => {
		if (days <= 0) {
			setError('Дата окончания должна быть позже даты начала')
			return
		}

		setSubmitting(true)
		setError('')

		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					equipmentId: equipment.id,
					startDate: data.startDate,
					endDate: data.endDate,
					comment: data.comment
				})
			})

			const json = await res.json()

			if (!res.ok) {
				setError(json.error ?? 'Ошибка при создании заявки')
				return
			}

			setSuccess(true)
			setTimeout(() => {
				router.push('/dashboard/orders')
			}, 2000)
		} catch {
			setError('Сетевая ошибка. Попробуйте ещё раз.')
		} finally {
			setSubmitting(false)
		}
	}

	if (success) {
		return (
			<div className='rounded-xl bg-green-50 border border-green-200 p-5 text-center'>
				<div className='h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3'>
					<span className='text-white text-xl'>✓</span>
				</div>
				<p className='font-semibold text-green-800'>
					Заявка отправлена!
				</p>
				<p className='text-sm text-green-600 mt-1'>
					Перенаправляем в личный кабинет...
				</p>
			</div>
		)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4'
		>
			<h3 className='font-medium text-stone-900 flex items-center gap-2'>
				<Calendar className='h-4 w-4 text-amber-500' />
				Оформить заявку
			</h3>

			{error && (
				<div className='rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700'>
					{error}
				</div>
			)}

			{/* Дата начала */}
			<div className='space-y-1'>
				<label className='block text-sm font-medium text-stone-700'>
					Дата начала <span className='text-red-500'>*</span>
				</label>
				<input
					type='date'
					{...register('startDate', {
						required: 'Укажите дату начала'
					})}
					min={today}
					className='w-full h-10 px-3 rounded-lg border border-stone-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
				/>
				{errors.startDate && (
					<p className='text-xs text-red-600'>
						{errors.startDate.message}
					</p>
				)}
			</div>

			{/* Дата окончания */}
			<div className='space-y-1'>
				<label className='block text-sm font-medium text-stone-700'>
					Дата окончания <span className='text-red-500'>*</span>
				</label>
				<input
					type='date'
					{...register('endDate', {
						required: 'Укажите дату окончания'
					})}
					min={startDate ?? today}
					className='w-full h-10 px-3 rounded-lg border border-stone-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500'
				/>
				{errors.endDate && (
					<p className='text-xs text-red-600'>
						{errors.endDate.message}
					</p>
				)}
			</div>

			{/* Калькулятор стоимости */}
			{days > 0 && (
				<div className='rounded-lg bg-amber-50 border border-amber-200 p-3'>
					<div className='flex items-center gap-1.5 mb-2'>
						<Calculator className='h-4 w-4 text-amber-600' />
						<span className='text-sm font-medium text-amber-800'>
							Расчёт стоимости
						</span>
					</div>
					<div className='space-y-1 text-sm'>
						<div className='flex justify-between text-stone-600'>
							<span>Количество дней:</span>
							<span className='font-medium'>{days}</span>
						</div>
						<div className='flex justify-between text-stone-600'>
							<span>Цена в сутки:</span>
							<span>
								{formatPrice(Number(equipment.pricePerDay))}
							</span>
						</div>
						{equipment.pricePerWeek && days >= 7 && (
							<p className='text-xs text-green-600'>
								✓ Применена недельная скидка
							</p>
						)}
						<div className='flex justify-between font-bold text-stone-900 border-t border-amber-200 pt-1 mt-1'>
							<span>Итого:</span>
							<span className='text-amber-600'>
								{formatPrice(totalCost)}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Комментарий */}
			<div className='space-y-1'>
				<label className='block text-sm font-medium text-stone-700'>
					Комментарий
				</label>
				<textarea
					{...register('comment')}
					rows={2}
					placeholder='Дополнительные пожелания...'
					className='w-full px-3 py-2 rounded-lg border border-stone-300 text-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
            placeholder:text-stone-400'
				/>
			</div>

			<Button
				type='submit'
				className='w-full'
				loading={submitting}
				disabled={!startDate || !endDate || days <= 0}
			>
				Отправить заявку
			</Button>
		</form>
	)
}
