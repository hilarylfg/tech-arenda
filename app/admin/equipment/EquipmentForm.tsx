'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createEquipmentSchema } from '@/lib/validations/equipment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type FormData = z.infer<typeof createEquipmentSchema>

interface Category {
	id: string
	name: string
}

interface EquipmentFormProps {
	categories: Category[]
	defaultValues?: Partial<FormData>
	equipmentId?: string
}

const STATUS_OPTIONS = [
	{ value: 'AVAILABLE', label: 'Доступна' },
	{ value: 'RENTED', label: 'Арендована' },
	{ value: 'MAINTENANCE', label: 'Обслуживание' },
	{ value: 'UNAVAILABLE', label: 'Недоступна' }
]

export default function EquipmentForm({
	categories,
	defaultValues,
	equipmentId
}: EquipmentFormProps) {
	const router = useRouter()
	const [error, setError] = useState('')
	const isEdit = Boolean(equipmentId)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<FormData>({
		resolver: zodResolver(createEquipmentSchema),
		defaultValues: defaultValues ?? {
			status: 'AVAILABLE',
			images: [],
			specifications: {}
		}
	})

	async function onSubmit(data: FormData) {
		setError('')
		try {
			const url = isEdit
				? `/api/admin/equipment/${equipmentId}`
				: '/api/admin/equipment'
			const method = isEdit ? 'PATCH' : 'POST'
			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Ошибка сохранения')
			router.push('/admin/equipment')
			router.refresh()
		} catch (e: any) {
			setError(e.message)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-5'
		>
			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>
						Основные данные
					</h3>
				</div>
				<div className='px-5 py-4 space-y-4'>
					<Input
						label='Название *'
						placeholder='Экскаватор Caterpillar 320'
						{...register('name')}
						error={errors.name?.message}
					/>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Категория *
						</label>
						<select
							{...register('categoryId')}
							className='w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
						>
							<option value=''>Выберите категорию</option>
							{categories.map(cat => (
								<option
									key={cat.id}
									value={cat.id}
								>
									{cat.name}
								</option>
							))}
						</select>
						{errors.categoryId && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.categoryId.message}
							</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Описание *
						</label>
						<textarea
							{...register('description')}
							rows={4}
							placeholder='Подробное описание техники...'
							className='w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none'
						/>
						{errors.description && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.description.message}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>Цены</h3>
				</div>
				<div className='px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4'>
					<Input
						label='Цена/день (₽) *'
						type='number'
						min={0}
						{...register('pricePerDay')}
						error={errors.pricePerDay?.message}
					/>
					<Input
						label='Цена/неделю (₽)'
						type='number'
						min={0}
						{...register('pricePerWeek')}
						error={errors.pricePerWeek?.message}
					/>
					<Input
						label='Цена/месяц (₽)'
						type='number'
						min={0}
						{...register('pricePerMonth')}
						error={errors.pricePerMonth?.message}
					/>
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>
						Характеристики
					</h3>
				</div>
				<div className='px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<Input
						label='Производитель'
						placeholder='Caterpillar'
						{...register('manufacturer')}
					/>
					<Input
						label='Модель'
						placeholder='320'
						{...register('model')}
					/>
					<Input
						label='Год выпуска'
						type='number'
						min={1980}
						{...register('year')}
					/>
					<Input
						label='Местонахождение'
						placeholder='г. Москва, склад №1'
						{...register('location')}
					/>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Статус
						</label>
						<select
							{...register('status')}
							className='w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
						>
							{STATUS_OPTIONS.map(opt => (
								<option
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{error && (
				<div className='px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700'>
					{error}
				</div>
			)}

			<div className='flex items-center gap-3'>
				<Button
					type='submit'
					loading={isSubmitting}
				>
					{isEdit ? 'Сохранить изменения' : 'Добавить технику'}
				</Button>
				<Button
					type='button'
					variant='outline'
					onClick={() => router.push('/admin/equipment')}
				>
					Отмена
				</Button>
			</div>
		</form>
	)
}
