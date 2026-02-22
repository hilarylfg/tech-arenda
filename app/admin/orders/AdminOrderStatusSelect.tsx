'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ALL_STATUSES = [
	{ value: 'PENDING', label: 'Ожидает' },
	{ value: 'CONFIRMED', label: 'Подтверждена' },
	{ value: 'ACTIVE', label: 'Активна' },
	{ value: 'COMPLETED', label: 'Завершена' },
	{ value: 'CANCELLED', label: 'Отменена' }
]

interface Props {
	orderId: string
	currentStatus: string
	statusLabel: string
	statusColor: string
}

export default function AdminOrderStatusSelect({
	orderId,
	currentStatus,
	statusLabel,
	statusColor
}: Props) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function handleChange(newStatus: string) {
		if (newStatus === currentStatus) {
			setOpen(false)
			return
		}
		setLoading(true)
		try {
			const res = await fetch(`/api/admin/orders/${orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus })
			})
			if (res.ok) {
				router.refresh()
			} else {
				const data = await res.json()
				alert(data.error ?? 'Ошибка обновления')
			}
		} finally {
			setLoading(false)
			setOpen(false)
		}
	}

	return (
		<div className='relative'>
			<button
				onClick={() => setOpen(p => !p)}
				disabled={loading}
				className={
					'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 ' +
					statusColor
				}
			>
				{loading ? '...' : statusLabel}
				<span className='ml-0.5 opacity-60'>▾</span>
			</button>
			{open && (
				<div className='absolute left-0 top-full mt-1 z-10 bg-white rounded-lg border border-stone-200 shadow-lg py-1 min-w-[160px]'>
					{ALL_STATUSES.map(s => (
						<button
							key={s.value}
							onClick={() => handleChange(s.value)}
							className={
								'w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors ' +
								(s.value === currentStatus
									? 'font-semibold text-amber-600'
									: 'text-stone-700')
							}
						>
							{s.label}
						</button>
					))}
				</div>
			)}
			{open && (
				<div
					className='fixed inset-0 z-9'
					onClick={() => setOpen(false)}
				/>
			)}
		</div>
	)
}
