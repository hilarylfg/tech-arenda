import { cn } from '@/lib/utils'
import * as React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string
	label?: string
	hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, label, hint, id, ...props }, ref) => {
		const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

		return (
			<div className='space-y-1.5'>
				{label && (
					<label
						htmlFor={inputId}
						className='block text-sm font-medium text-stone-700'
					>
						{label}
						{props.required && (
							<span className='text-red-500 ml-1'>*</span>
						)}
					</label>
				)}
				<input
					id={inputId}
					type={type}
					className={cn(
						'flex h-10 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm',
						'placeholder:text-stone-400',
						'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
						'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-stone-50',
						'transition-colors duration-200',
						error &&
							'border-red-500 focus:ring-red-500 focus:border-red-500',
						className
					)}
					ref={ref}
					{...props}
				/>
				{hint && !error && (
					<p className='text-xs text-stone-500'>{hint}</p>
				)}
				{error && <p className='text-xs text-red-600'>{error}</p>}
			</div>
		)
	}
)

Input.displayName = 'Input'

export { Input }
