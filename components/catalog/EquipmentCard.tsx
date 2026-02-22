import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import type { EquipmentWithCategory } from '@/types'
import { EQUIPMENT_STATUS_LABELS } from '@/types'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface EquipmentCardProps {
	equipment: EquipmentWithCategory
}

/** Определяем вариант бейджа по статусу */
function getStatusBadgeVariant(
	status: string
): 'success' | 'info' | 'warning' | 'error' {
	switch (status) {
		case 'AVAILABLE':
			return 'success'
		case 'RENTED':
			return 'info'
		case 'MAINTENANCE':
			return 'warning'
		case 'UNAVAILABLE':
			return 'error'
		default:
			return 'success'
	}
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
	const {
		id,
		slug,
		name,
		shortDescription,
		images,
		pricePerDay,
		status,
		category,
		location
	} = equipment

	const imageUrl = images[0] ?? '/images/equipment-placeholder.jpg'

	return (
		<article className='group rounded-xl border border-stone-200 bg-white overflow-hidden hover:shadow-md transition-all duration-300'>
			{/* Изображение */}
			<div className='relative h-48 overflow-hidden bg-stone-100'>
				<Image
					src={imageUrl}
					alt={name}
					fill
					sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
					className='object-cover group-hover:scale-105 transition-transform duration-500'
				/>
				{/* Статус поверх изображения */}
				<div className='absolute top-3 left-3'>
					<Badge variant={getStatusBadgeVariant(status)}>
						{EQUIPMENT_STATUS_LABELS[status]}
					</Badge>
				</div>
				{/* Категория */}
				<div className='absolute top-3 right-3'>
					<span className='rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
						{category.name}
					</span>
				</div>
			</div>

			{/* Контент */}
			<div className='p-4'>
				<h3 className='font-semibold text-stone-900 text-base leading-snug mb-1 line-clamp-1'>
					{name}
				</h3>

				{shortDescription && (
					<p className='text-sm text-stone-500 mb-3 line-clamp-2'>
						{shortDescription}
					</p>
				)}

				{/* Местоположение */}
				<div className='flex items-center gap-1 text-xs text-stone-400 mb-3'>
					<MapPin className='h-3 w-3 shrink-0' />
					<span className='truncate'>{location}</span>
				</div>

				{/* Цена и кнопка */}
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-lg font-bold text-stone-900'>
							{formatPrice(Number(pricePerDay))}
						</p>
						<p className='text-xs text-stone-400'>в сутки</p>
					</div>
					<Button
						variant='outline'
						size='sm'
						asChild
					>
						<Link href={`/catalog/${slug || id}`}>Подробнее</Link>
					</Button>
				</div>
			</div>
		</article>
	)
}
