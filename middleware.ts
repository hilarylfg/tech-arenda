/**
 * Middleware — Edge runtime.
 * Использует только jose (Edge-safe), без next-auth, без Prisma, без Node.js модулей.
 */
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
	const { nextUrl } = req
	const token = req.cookies.get(SESSION_COOKIE)?.value
	const session = token ? await verifySessionToken(token) : null
	const isLoggedIn = !!session

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
		if (session?.role !== 'ADMIN') {
			return NextResponse.redirect(new URL('/dashboard', nextUrl))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		// Исключаем статику, изображения и публичные маршруты
		'/((?!api/auth|api/register|api/catalog|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
	]
}
