import { EquipmentCardSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
			<div className='mb-8'>
				<Skeleton className='h-8 w-64 mb-3' />
				<Skeleton className='h-5 w-96' />
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{Array.from({ length: 8 }).map((_, i) => (
					<EquipmentCardSkeleton key={i} />
				))}
			</div>
		</div>
	)
}
