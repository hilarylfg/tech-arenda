import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * Middleware для защиты маршрутов.
 * Проверяет JWT токен и перенаправляет незарегистрированных пользователей.
 */
export default auth(req => {
	const { nextUrl, auth: session } = req
	const isLoggedIn = !!session?.user

	// Маршруты, требующие авторизации
	const isProtectedRoute =
		nextUrl.pathname.startsWith('/dashboard') ||
		nextUrl.pathname.startsWith('/api/orders')

	// Маршруты только для администраторов
	const isAdminRoute =
		nextUrl.pathname.startsWith('/admin') ||
		nextUrl.pathname.startsWith('/api/admin')

	// Страницы аутентификации (редиректим если уже залогинен)
	const isAuthRoute =
		nextUrl.pathname.startsWith('/login') ||
		nextUrl.pathname.startsWith('/register')

	// Уже авторизованный пользователь пытается зайти на страницу входа
	if (isAuthRoute && isLoggedIn) {
		return NextResponse.redirect(new URL('/dashboard', nextUrl))
	}

	// Незарегистрированный пользователь пытается получить доступ к защищенному маршруту
	if (isProtectedRoute && !isLoggedIn) {
		const callbackUrl = encodeURIComponent(nextUrl.pathname)
		return NextResponse.redirect(
			new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
		)
	}

	// Проверка прав администратора
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
	// Middleware применяется ко всем маршрутам кроме статики и API Next.js
	matcher: [
		'/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
	]
}
