import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'
import * as React from 'react'

const buttonVariants = cva(
	// Базовые стили кнопки
	'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			variant: {
				default:
					'bg-amber-500 text-stone-900 hover:bg-amber-400 active:bg-amber-600 shadow-sm',
				destructive: 'bg-red-600 text-white hover:bg-red-500 shadow-sm',
				outline:
					'border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 hover:border-stone-400',
				secondary:
					'bg-stone-800 text-white hover:bg-stone-700 shadow-sm',
				ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
				link: 'text-amber-600 underline-offset-4 hover:underline p-0 h-auto'
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				default: 'h-10 px-4 py-2',
				lg: 'h-12 px-6 text-base',
				xl: 'h-14 px-8 text-lg',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

function Button({
	className,
	variant = 'default',
	size = 'default',
	asChild = false,
	loading,
	children,
	disabled,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
		loading?: boolean
	}) {
	const Comp = asChild ? Slot.Root : 'button'
	return (
		<Comp
			data-slot='button'
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			disabled={disabled || loading}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					{loading && <Loader2 className='h-4 w-4 animate-spin' />}
					{children}
				</>
			)}
		</Comp>
	)
}
export { Button, buttonVariants }
