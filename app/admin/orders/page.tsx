import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import { redirect } from 'next/navigation'
import AdminOrderStatusSelect from './AdminOrderStatusSelect'

export default async function AdminOrdersPage() {
	const session = await getSession()
	if (session?.role !== 'ADMIN') redirect('/dashboard')

	const orders = await prisma.order.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			user: {
				select: {
					firstName: true,
					lastName: true,
					email: true,
					phone: true
				}
			},
			items: {
				include: { equipment: { select: { name: true } } },
				take: 1
			}
		}
	})

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-lg font-semibold text-stone-900'>
						Все заявки
					</h2>
					<p className='text-sm text-stone-500'>
						{orders.length} заявок
					</p>
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-stone-100 text-left'>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									№
								</th>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Клиент
								</th>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Техника
								</th>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Период
								</th>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Сумма
								</th>
								<th className='px-4 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Статус
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-stone-100'>
							{orders.map(order => {
								const statusColor =
									ORDER_STATUS_COLORS[
										order.status as keyof typeof ORDER_STATUS_COLORS
									] ?? 'bg-stone-100 text-stone-600'
								const statusLabel =
									ORDER_STATUS_LABELS[
										order.status as keyof typeof ORDER_STATUS_LABELS
									] ?? order.status
								return (
									<tr
										key={order.id}
										className='hover:bg-stone-50 align-middle'
									>
										<td className='px-4 py-3 font-mono text-xs text-stone-400'>
											{order.id.slice(-8).toUpperCase()}
										</td>
										<td className='px-4 py-3'>
											<p className='font-medium text-stone-900'>
												{order.user.firstName}{' '}
												{order.user.lastName}
											</p>
											<p className='text-xs text-stone-400'>
												{order.user.phone ??
													order.user.email}
											</p>
										</td>
										<td className='px-4 py-3 text-stone-700 max-w-[140px] truncate'>
											{order.items[0]?.equipment.name ??
												'—'}
										</td>
										<td className='px-4 py-3 text-stone-600 whitespace-nowrap'>
											{formatDate(order.startDate)} —{' '}
											{formatDate(order.endDate)}
										</td>
										<td className='px-4 py-3 font-semibold text-stone-900 whitespace-nowrap'>
											{formatPrice(order.totalAmount)}
										</td>
										<td className='px-4 py-3'>
											<AdminOrderStatusSelect
												orderId={order.id}
												currentStatus={order.status}
												statusLabel={statusLabel}
												statusColor={statusColor}
											/>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
				{orders.length === 0 && (
					<div className='py-12 text-center text-stone-400'>
						<p>Заявок нет</p>
					</div>
				)}
			</div>
		</div>
	)
}
