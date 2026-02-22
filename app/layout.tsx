import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		default: 'СпецТехАренда — аренда строительной спецтехники',
		template: '%s | СпецТехАренда'
	},
	description:
		'Профессиональная аренда строительной спецтехники: экскаваторы, краны, погрузчики, бульдозеры. Современный парк машин, конкурентные цены.',
	keywords: [
		'аренда спецтехники',
		'экскаватор',
		'кран',
		'погрузчик',
		'бульдозер',
		'строительство'
	]
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<SessionProvider>
					<Header />
					<main className='flex-1'>{children}</main>
					<Footer />
				</SessionProvider>
			</body>
		</html>
	)
}
