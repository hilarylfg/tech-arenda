'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function OrderCancelButton({ orderId }: { orderId: string }) {
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function handleCancel() {
		if (!confirm('Вы уверены, что хотите отменить заявку?')) return
		setLoading(true)
		try {
			const res = await fetch(`/api/orders/${orderId}/cancel`, {
				method: 'POST'
			})
			if (res.ok) {
				router.refresh()
			} else {
				const data = await res.json()
				alert(data.error ?? 'Не удалось отменить заявку')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<button
			onClick={handleCancel}
			disabled={loading}
			className='text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50'
		>
			{loading ? 'Отмена...' : 'Отменить'}
		</button>
	)
}
