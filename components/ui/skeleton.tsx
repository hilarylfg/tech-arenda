import { cn } from '@/lib/utils'
import * as React from 'react'

/** Скелетон для загрузки контента */
function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn('animate-pulse rounded-lg bg-stone-200', className)}
			{...props}
		/>
	)
}

/** Скелетон карточки техники */
function EquipmentCardSkeleton() {
	return (
		<div className='rounded-xl border border-stone-200 bg-white overflow-hidden'>
			<Skeleton className='h-48 w-full rounded-none' />
			<div className='p-4 space-y-3'>
				<Skeleton className='h-4 w-3/4' />
				<Skeleton className='h-3 w-1/2' />
				<div className='flex justify-between items-center pt-1'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-8 w-28' />
				</div>
			</div>
		</div>
	)
}

/** Скелетон строки таблицы */
function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
	return (
		<tr>
			{Array.from({ length: cols }).map((_, i) => (
				<td
					key={i}
					className='px-4 py-3'
				>
					<Skeleton className='h-4 w-full' />
				</td>
			))}
		</tr>
	)
}

export { EquipmentCardSkeleton, Skeleton, TableRowSkeleton }
