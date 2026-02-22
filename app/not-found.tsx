import { Construction } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
	return (
		<div className='min-h-[60vh] flex items-center justify-center px-4'>
			<div className='text-center'>
				<div className='flex justify-center mb-6'>
					<div className='bg-amber-50 p-6 rounded-full'>
						<Construction className='h-16 w-16 text-amber-500' />
					</div>
				</div>
				<h1 className='text-6xl font-bold text-stone-900 mb-3'>404</h1>
				<h2 className='text-xl font-semibold text-stone-700 mb-2'>
					Страница не найдена
				</h2>
				<p className='text-stone-500 mb-8 max-w-md mx-auto'>
					Запрашиваемая страница не существует или была перемещена.
				</p>
				<div className='flex flex-col sm:flex-row gap-3 justify-center'>
					<Link
						href='/'
						className='px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors'
					>
						На главную
					</Link>
					<Link
						href='/catalog'
						className='px-6 py-3 bg-white text-stone-700 border border-stone-300 rounded-xl font-semibold hover:bg-stone-50 transition-colors'
					>
						Каталог техники
					</Link>
				</div>
			</div>
		</div>
	)
}
