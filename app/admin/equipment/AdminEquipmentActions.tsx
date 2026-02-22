'use client'

import { Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminEquipmentActions({ id }: { id: string }) {
	const [deleting, setDeleting] = useState(false)
	const router = useRouter()

	async function handleDelete() {
		if (!confirm('Удалить технику? Это действие нельзя отменить.')) return
		setDeleting(true)
		try {
			const res = await fetch(`/api/admin/equipment/${id}`, {
				method: 'DELETE'
			})
			if (res.ok) {
				router.refresh()
			} else {
				const data = await res.json()
				alert(data.error ?? 'Не удалось удалить')
			}
		} finally {
			setDeleting(false)
		}
	}

	return (
		<div className='flex items-center justify-end gap-2'>
			<Link
				href={`/admin/equipment/${id}/edit`}
				className='p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors'
				title='Редактировать'
			>
				<Pencil className='h-4 w-4' />
			</Link>
			<button
				onClick={handleDelete}
				disabled={deleting}
				className='p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50'
				title='Удалить'
			>
				<Trash2 className='h-4 w-4' />
			</button>
		</div>
	)
}
