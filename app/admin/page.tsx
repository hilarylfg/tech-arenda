import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ClipboardList, TrendingUp, Truck, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
	const session = await getSession()
	if (session?.role !== 'ADMIN') redirect('/dashboard')

	const [
		totalEquipment,
		availableEquipment,
		totalOrders,
		pendingOrders,
		totalUsers,
		revenueResult,
		recentOrders
	] = await Promise.all([
		prisma.equipment.count(),
		prisma.equipment.count({ where: { status: 'AVAILABLE' } }),
		prisma.order.count(),
		prisma.order.count({
			where: { status: { in: ['PENDING', 'CONFIRMED'] } }
		}),
		prisma.user.count({ where: { role: 'CLIENT' } }),
		prisma.order.aggregate({
			where: { status: { in: ['COMPLETED', 'ACTIVE'] } },
			_sum: { totalAmount: true }
		}),
		prisma.order.findMany({
			take: 8,
			orderBy: { createdAt: 'desc' },
			include: {
				user: {
					select: { firstName: true, lastName: true, email: true }
				},
				items: {
					include: { equipment: { select: { name: true } } },
					take: 1
				}
			}
		})
	])

	const revenue = revenueResult._sum.totalAmount ?? 0

	const stats = [
		{
			label: 'Техника',
			value: totalEquipment,
			sub: `${availableEquipment} доступно`,
			icon: Truck,
			color: 'text-amber-600 bg-amber-50'
		},
		{
			label: 'Заявки',
			value: totalOrders,
			sub: `${pendingOrders} в обработке`,
			icon: ClipboardList,
			color: 'text-blue-600 bg-blue-50'
		},
		{
			label: 'Клиенты',
			value: totalUsers,
			sub: 'зарегистрировано',
			icon: Users,
			color: 'text-purple-600 bg-purple-50'
		},
		{
			label: 'Выручка',
			value: formatPrice(revenue),
			sub: 'завершённые заявки',
			icon: TrendingUp,
			color: 'text-green-600 bg-green-50'
		}
	]

	const STATUS_LABELS: Record<string, string> = {
		PENDING: 'Ожидает',
		CONFIRMED: 'Подтверждена',
		ACTIVE: 'Активна',
		COMPLETED: 'Завершена',
		CANCELLED: 'Отменена'
	}
	const STATUS_COLORS: Record<string, string> = {
		PENDING: 'bg-yellow-100 text-yellow-700',
		CONFIRMED: 'bg-blue-100 text-blue-700',
		ACTIVE: 'bg-green-100 text-green-700',
		COMPLETED: 'bg-stone-100 text-stone-600',
		CANCELLED: 'bg-red-100 text-red-600'
	}

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{stats.map(s => (
					<div
						key={s.label}
						className='bg-white rounded-xl border border-stone-200 p-4'
					>
						<div
							className={'inline-flex p-2 rounded-lg ' + s.color}
						>
							<s.icon className='h-5 w-5' />
						</div>
						<p className='mt-3 text-2xl font-bold text-stone-900'>
							{s.value}
						</p>
						<p className='text-sm text-stone-500'>{s.label}</p>
						<p className='text-xs text-stone-400 mt-0.5'>{s.sub}</p>
					</div>
				))}
			</div>

			<div className='bg-white rounded-xl border border-stone-200'>
				<div className='px-5 py-4 border-b border-stone-100'>
					<h2 className='font-semibold text-stone-900'>
						Последние заявки
					</h2>
				</div>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead>
							<tr className='border-b border-stone-100 text-left'>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									№
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Клиент
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Техника
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide'>
									Статус
								</th>
								<th className='px-5 py-3 text-xs font-medium text-stone-400 uppercase tracking-wide text-right'>
									Сумма
								</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-stone-100'>
							{recentOrders.map(order => (
								<tr
									key={order.id}
									className='hover:bg-stone-50'
								>
									<td className='px-5 py-3 font-mono text-stone-400 text-xs'>
										{order.id.slice(-8).toUpperCase()}
									</td>
									<td className='px-5 py-3 text-stone-700'>
										{order.user.firstName}{' '}
										{order.user.lastName}
										<span className='block text-xs text-stone-400'>
											{order.user.email}
										</span>
									</td>
									<td className='px-5 py-3 text-stone-700 truncate max-w-[160px]'>
										{order.items[0]?.equipment.name ?? '—'}
									</td>
									<td className='px-5 py-3'>
										<span
											className={
												'inline-flex px-2 py-0.5 rounded-full text-xs font-medium ' +
												(STATUS_COLORS[order.status] ??
													'bg-stone-100 text-stone-600')
											}
										>
											{STATUS_LABELS[order.status] ??
												order.status}
										</span>
									</td>
									<td className='px-5 py-3 text-right font-semibold text-stone-900'>
										{formatPrice(order.totalAmount)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
