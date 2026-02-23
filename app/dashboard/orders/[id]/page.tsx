import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatPrice } from '@/lib/utils'
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/types'
import { ArrowLeft, Calendar, Phone } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import OrderCancelButton from '../OrderCancelButton'

export default async function OrderDetailPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	const session = await getSession()
	if (!session?.id) redirect('/login')

	const { id } = await params

	const order = await prisma.order.findUnique({
		where: { id },
		include: {
			items: {
				include: {
					equipment: { include: { category: true } }
				}
			},
			user: {
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					phone: true
				}
			}
		}
	})

	if (!order || order.userId !== session.id) notFound()

	const statusColor =
		ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ??
		'bg-stone-100 text-stone-600'
	const statusLabel =
		ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ??
		order.status

	const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED'

	return (
		<div className='space-y-5'>
			<div className='flex items-center gap-3'>
				<Link
					href='/dashboard/orders'
					className='flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700'
				>
					<ArrowLeft className='h-4 w-4' />
					Назад
				</Link>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100 flex items-center justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<h2 className='font-semibold text-stone-900'>
								Заявка #{order.id.slice(-8).toUpperCase()}
							</h2>
							<span
								className={
									'inline-flex px-2 py-0.5 rounded-full text-xs font-medium ' +
									statusColor
								}
							>
								{statusLabel}
							</span>
						</div>
						<p className='text-sm text-stone-500 mt-0.5'>
							Создана{' '}
							{new Date(order.createdAt).toLocaleDateString(
								'ru-RU'
							)}
						</p>
					</div>
					{canCancel && <OrderCancelButton orderId={order.id} />}
				</div>

				<div className='px-5 py-4 space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div>
							<p className='text-xs text-stone-400 uppercase tracking-wide mb-1'>
								Период аренды
							</p>
							<div className='flex items-center gap-2 text-stone-700'>
								<Calendar className='h-4 w-4 text-stone-400' />
								<span>
									{formatDate(order.startDate)} —{' '}
									{formatDate(order.endDate)}
								</span>
							</div>
						</div>
						<div>
							<p className='text-xs text-stone-400 uppercase tracking-wide mb-1'>
								Итого
							</p>
							<p className='text-xl font-bold text-stone-900'>
								{formatPrice(order.totalAmount)}
							</p>
						</div>
					</div>

					{order.contactPhone && (
						<div>
							<p className='text-xs text-stone-400 uppercase tracking-wide mb-1'>
								Контакт
							</p>
							<div className='flex items-center gap-2 text-stone-700'>
								<Phone className='h-4 w-4 text-stone-400' />
								<span>{order.contactPhone}</span>
							</div>
						</div>
					)}

					{order.comment && (
						<div>
							<p className='text-xs text-stone-400 uppercase tracking-wide mb-1'>
								Комментарий
							</p>
							<p className='text-stone-700'>{order.comment}</p>
						</div>
					)}
				</div>
			</div>

			<div className='bg-white rounded-xl border border-stone-200 overflow-hidden'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h3 className='font-semibold text-stone-900'>
						Состав заявки
					</h3>
				</div>
				<ul className='divide-y divide-stone-100'>
					{order.items.map(item => (
						<li
							key={item.id}
							className='px-5 py-4'
						>
							<div className='flex items-start justify-between gap-3'>
								<div>
									<Link
										href={'/catalog/' + item.equipment.id}
										className='font-medium text-stone-900 hover:text-amber-600'
									>
										{item.equipment.name}
									</Link>
									<p className='text-sm text-stone-500 mt-0.5'>
										{item.equipment.category.name}
										{item.equipment.manufacturer &&
											` · ${item.equipment.manufacturer}`}
									</p>
								</div>
								<div className='text-right shrink-0'>
									<p className='font-semibold text-stone-900'>
										{formatPrice(
											item.price * item.quantity
										)}
										/день
									</p>
									{item.quantity > 1 && (
										<p className='text-xs text-stone-400'>
											{item.quantity} ед. ×{' '}
											{formatPrice(item.price)}
										</p>
									)}
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
