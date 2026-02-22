import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import OrderCancelButton from './OrderCancelButton'

export default async function OrdersPage() {
	const session = await auth()
	if (!session?.user?.id) redirect('/login')

	const orders = await prisma.order.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: 'desc' },
		include: {
			items: {
				include: {
					equipment: { include: { category: true } }
				}
			}
		}
	})

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-lg font-semibold text-stone-900'>
					Мои заявки
				</h2>
				<span className='text-sm text-stone-500'>
					{orders.length} заявок
				</span>
			</div>

			{orders.length === 0 ? (
				<div className='bg-white rounded-xl border border-stone-200 py-16 text-center'>
					<ClipboardList className='mx-auto h-12 w-12 text-stone-300 mb-3' />
					<p className='text-stone-500 mb-4'>У вас ещё нет заявок</p>
					<Link
						href='/catalog'
						className='inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold hover:bg-amber-600 transition-colors'
					>
						Перейти в каталог
					</Link>
				</div>
			) : (
				<ul className='space-y-3'>
					{orders.map(order => {
						const firstItem = order.items[0]
						const statusColor =
							ORDER_STATUS_COLORS[
								order.status as keyof typeof ORDER_STATUS_COLORS
							] ?? 'bg-stone-100 text-stone-600'
						const statusLabel =
							ORDER_STATUS_LABELS[
								order.status as keyof typeof ORDER_STATUS_LABELS
							] ?? order.status

						return (
							<li
								key={order.id}
								className='bg-white rounded-xl border border-stone-200 overflow-hidden'
							>
								<div className='px-5 py-4'>
									<div className='flex items-start justify-between gap-3'>
										<div className='min-w-0'>
											<div className='flex items-center gap-2 mb-1'>
												<span
													className={
														'inline-flex px-2 py-0.5 rounded-full text-xs font-medium ' +
														statusColor
													}
												>
													{statusLabel}
												</span>
												<span className='text-xs text-stone-400'>
													#
													{order.id
														.slice(-8)
														.toUpperCase()}
												</span>
											</div>
											<p className='font-semibold text-stone-900 truncate'>
												{firstItem?.equipment.name ??
													'—'}
												{order.items.length > 1 && (
													<span className='text-stone-400 font-normal'>
														{' '}
														и ещё{' '}
														{order.items.length -
															1}{' '}
														ед.
													</span>
												)}
											</p>
											<p className='text-sm text-stone-500 mt-0.5'>
												{formatDate(order.startDate)} —{' '}
												{formatDate(order.endDate)}
											</p>
										</div>
										<div className='shrink-0 text-right'>
											<p className='text-lg font-bold text-stone-900'>
												{formatPrice(order.totalAmount)}
											</p>
											<p className='text-xs text-stone-400 mt-0.5'>
												{new Date(
													order.createdAt
												).toLocaleDateString('ru-RU')}
											</p>
										</div>
									</div>

									{order.items.length > 0 && (
										<div className='mt-3 pt-3 border-t border-stone-100 space-y-1.5'>
											{order.items.map(item => (
												<div
													key={item.id}
													className='flex items-center justify-between text-sm'
												>
													<div className='flex items-center gap-2 min-w-0'>
														<span className='text-stone-400 shrink-0'>
															{item.quantity}
															&times;
														</span>
														<span className='text-stone-700 truncate'>
															{
																item.equipment
																	.name
															}
														</span>
														<span className='text-stone-400 text-xs shrink-0'>
															{
																item.equipment
																	.category
																	.name
															}
														</span>
													</div>
													<span className='text-stone-600 font-medium shrink-0 ml-2'>
														{formatPrice(
															item.price
														)}
														/день
													</span>
												</div>
											))}
										</div>
									)}

									<div className='mt-3 flex items-center gap-3'>
										<Link
											href={
												'/dashboard/orders/' + order.id
											}
											className='text-sm text-amber-600 hover:text-amber-700 font-medium'
										>
											Подробнее
										</Link>
										{(order.status === 'PENDING' ||
											order.status === 'CONFIRMED') && (
											<OrderCancelButton
												orderId={order.id}
											/>
										)}
									</div>
								</div>
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}
