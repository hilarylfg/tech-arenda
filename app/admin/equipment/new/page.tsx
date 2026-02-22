import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import EquipmentForm from '../EquipmentForm'

export default async function NewEquipmentPage() {
	const session = await auth()
	if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

	const categories = await prisma.category.findMany({
		orderBy: { name: 'asc' }
	})

	return (
		<div className='space-y-4'>
			<Link
				href='/admin/equipment'
				className='inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700'
			>
				<ArrowLeft className='h-4 w-4' />
				Назад к списку
			</Link>
			<h2 className='text-lg font-semibold text-stone-900'>
				Добавить технику
			</h2>
			<EquipmentForm categories={categories} />
		</div>
	)
}
