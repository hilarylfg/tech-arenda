/**
 * Middleware — runs in Edge runtime.
 * Uses only Edge-safe authConfig (no Prisma, no bcrypt, no Node.js modules).
 */
import { authConfig } from '@/auth.config'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth(req => {
	const { nextUrl, auth: session } = req
	const isLoggedIn = !!session?.user

	const isProtectedRoute =
		nextUrl.pathname.startsWith('/dashboard') ||
		nextUrl.pathname.startsWith('/api/orders')

	const isAdminRoute =
		nextUrl.pathname.startsWith('/admin') ||
		nextUrl.pathname.startsWith('/api/admin')

	const isAuthRoute =
		nextUrl.pathname.startsWith('/login') ||
		nextUrl.pathname.startsWith('/register')

	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL('/dashboard', nextUrl))
	}

	if (isProtectedRoute && !isLoggedIn) {
		const callbackUrl = encodeURIComponent(nextUrl.pathname)
		return NextResponse.redirect(
			new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
		)
	}

	if (isAdminRoute) {
		if (!isLoggedIn) {
			return NextResponse.redirect(new URL('/login', nextUrl))
		}
		if (session?.user?.role !== 'ADMIN') {
			return NextResponse.redirect(new URL('/dashboard', nextUrl))
		}
	}

	return NextResponse.next()
})

export const config = {
	matcher: [
		'/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
	]
}
