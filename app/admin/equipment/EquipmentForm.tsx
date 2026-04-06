'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateSlug } from '@/lib/utils'
import { createEquipmentSchema } from '@/lib/validations/equipment'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

type FormValues = z.input<typeof createEquipmentSchema>
type FormData = z.output<typeof createEquipmentSchema>

interface Category {
	id: string
	name: string
}

interface EquipmentFormProps {
	categories: Category[]
	defaultValues?: Partial<FormValues>
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
		setValue,
		watch,
		formState: { errors, isSubmitting }
	} = useForm<FormValues, unknown, FormData>({
		resolver: zodResolver(createEquipmentSchema),
		defaultValues: defaultValues ?? {
			status: 'AVAILABLE',
			images: [],
			specifications: {},
			minRentHours: 4
		}
	})

	const nameValue = watch('name')

	function handleGenerateSlug() {
		if (nameValue) {
			setValue('slug', generateSlug(nameValue), { shouldValidate: true })
		}
	}

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
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Ошибка сохранения')
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
						label='Название'
						placeholder='Экскаватор Caterpillar 320'
						{...register('name')}
						required
						error={errors.name?.message}
					/>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Slug (URL-имя){' '}
							<span className='text-red-500'>*</span>
						</label>
						<div className='flex gap-2'>
							<input
								{...register('slug')}
								placeholder='excavator-caterpillar-320'
								className='flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
							/>
							<button
								type='button'
								onClick={handleGenerateSlug}
								className='px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap'
							>
								Из названия
							</button>
						</div>
						{errors.slug && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.slug.message}
							</p>
						)}
					</div>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Категория <span className='text-red-500'>*</span>
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
					<Input
						label='Краткое описание'
						placeholder='Мощный гусеничный экскаватор для земляных работ'
						{...register('shortDescription')}
						error={errors.shortDescription?.message}
					/>
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Описание <span className='text-red-500'>*</span>
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
					<div>
						<label className='block text-sm font-medium text-stone-700 mb-1'>
							Изображения (URL через запятую){' '}
							<span className='text-red-500'>*</span>
						</label>
						<input
							placeholder='https://example.com/photo1.jpg, https://example.com/photo2.jpg'
							defaultValue={
								defaultValues?.images?.join(', ') ?? ''
							}
							onChange={e => {
								const urls = e.target.value
									.split(',')
									.map(s => s.trim())
									.filter(Boolean)
								setValue('images', urls, {
									shouldValidate: true
								})
							}}
							className='w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500'
						/>
						{errors.images && (
							<p className='mt-1 text-xs text-red-500'>
								{errors.images.message ??
									errors.images.root?.message}
							</p>
						)}
					</div>
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>
						Цены и условия
					</h3>
				</div>
				<div className='px-5 py-4 space-y-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
						<Input
							label='Цена/час (₽)'
							type='number'
							min={0}
							{...register('pricePerHour')}
							error={errors.pricePerHour?.message}
						/>
						<Input
							label='Цена/день (₽)'
							type='number'
							min={0}
							{...register('pricePerDay')}
							required
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
					<Input
						label='Минимальное время аренды (часов)'
						type='number'
						min={1}
						max={72}
						{...register('minRentHours')}
						error={errors.minRentHours?.message}
					/>
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>
						Характеристики и местоположение
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
						required
						error={errors.location?.message}
					/>
					<Input
						label='Широта'
						type='number'
						step='0.0001'
						placeholder='55.7558'
						{...register('latitude')}
					/>
					<Input
						label='Долгота'
						type='number'
						step='0.0001'
						placeholder='37.6173'
						{...register('longitude')}
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
