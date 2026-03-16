import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import EquipmentForm from '../../EquipmentForm'

export default async function EditEquipmentPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const session = await getSession()
	if (session?.role !== 'ADMIN') redirect('/dashboard')

	const { id } = await params
	const [equipment, categories] = await Promise.all([
		prisma.equipment.findUnique({ where: { id } }),
		prisma.category.findMany({ orderBy: { name: 'asc' } })
	])

	if (!equipment) notFound()

	const defaultValues = {
		name: equipment.name,
		slug: equipment.slug,
		description: equipment.description,
		shortDescription: equipment.shortDescription ?? undefined,
		categoryId: equipment.categoryId,
		images: equipment.images,
		pricePerHour: equipment.pricePerHour
			? Number(equipment.pricePerHour)
			: undefined,
		pricePerDay: Number(equipment.pricePerDay),
		pricePerWeek: equipment.pricePerWeek
			? Number(equipment.pricePerWeek)
			: undefined,
		pricePerMonth: equipment.pricePerMonth
			? Number(equipment.pricePerMonth)
			: undefined,
		minRentHours: equipment.minRentHours,
		status: equipment.status as
			| 'AVAILABLE'
			| 'RENTED'
			| 'MAINTENANCE'
			| 'UNAVAILABLE',
		manufacturer: equipment.manufacturer ?? undefined,
		model: equipment.model ?? undefined,
		year: equipment.year ?? undefined,
		location: equipment.location ?? undefined,
		latitude: equipment.latitude ?? undefined,
		longitude: equipment.longitude ?? undefined
	}

	return (
		<div className='space-y-4'>
			<Link
				href='/admin/equipment'
				className='inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700'
			>
				<ArrowLeft className='h-4 w-4' />
				Назад к списку
			</Link>
			<h2 className='text-lg font-semibold text-stone-900'>
				Редактировать: {equipment.name}
			</h2>
			<EquipmentForm
				categories={categories}
				defaultValues={defaultValues}
				equipmentId={id}
			/>
		</div>
	)
}
