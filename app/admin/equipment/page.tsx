import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminEquipmentActions from './AdminEquipmentActions'

const STATUS_LABELS: Record<string, string> = {
	AVAILABLE: 'Доступна',
	RENTED: 'Арендована',
	MAINTENANCE: 'Обслуживание',
	UNAVAILABLE: 'Недоступна'
}
const STATUS_COLORS: Record<string, string> = {
	AVAILABLE: 'bg-green-100 text-green-700',
	RENTED: 'bg-blue-100 text-blue-700',
	MAINTENANCE: 'bg-yellow-100 text-yellow-700',
	UNAVAILABLE: 'bg-stone-100 text-stone-500'
}

export default async function AdminEquipmentPage() {
	const session = await auth()
	if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

	const equipment = await prisma.equipment.findMany({
		orderBy: { createdAt: 'desc' },
		include: { category: true }
	})

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-lg font-semibold text-stone-900'>
						Техника
					</h2>
					<p className='text-sm text-stone-500'>
						{equipment.length} единиц
					</p>
				</div>
				<Link
					href='/admin/equipment/new'
					className='inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors'
				>
					<Plus className='h-4 w-4' />
					Добавить
				</Link>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-stone-100 text-left'>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Название
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Категория
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Цена/день
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Статус
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide text-right'>
									Действия
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-stone-100'>
							{equipment.map(item => (
								<tr
									key={item.id}
									className='hover:bg-stone-50'
								>
									<td className='px-5 py-3'>
										<p className='font-medium text-stone-900'>
											{item.name}
										</p>
										{item.manufacturer && (
											<p className='text-xs text-stone-400'>
												{item.manufacturer} {item.model}
											</p>
										)}
									</td>
									<td className='px-5 py-3 text-stone-600'>
										{item.category.name}
									</td>
									<td className='px-5 py-3 font-medium text-stone-900'>
										{formatPrice(item.pricePerDay)}
									</td>
									<td className='px-5 py-3'>
										<span
											className={
												'inline-flex px-2 py-0.5 rounded-full text-xs font-medium ' +
												(STATUS_COLORS[item.status] ??
													'bg-stone-100 text-stone-500')
											}
										>
											{STATUS_LABELS[item.status] ??
												item.status}
										</span>
									</td>
									<td className='px-5 py-3 text-right'>
										<AdminEquipmentActions id={item.id} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{equipment.length === 0 && (
					<div className='py-12 text-center text-stone-400'>
						<p>Техника не добавлена</p>
					</div>
				)}
			</div>
		</div>
	)
}
