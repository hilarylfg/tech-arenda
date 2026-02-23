/**
 * Ядро кастомной аутентификации — Edge-safe (использует только jose).
 * Работает как в Node.js runtime (API routes), так и в Edge runtime (middleware).
 */
import type { SessionUser } from '@/types/auth'
import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'auth_session'
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 дней в секундах

function getSecret(): Uint8Array {
	const secret = process.env.AUTH_SECRET
	if (!secret) throw new Error('AUTH_SECRET не задан в переменных окружения')
	return new TextEncoder().encode(secret)
}

/** Создать подписанный JWT (HS256) */
export async function createSessionToken(user: SessionUser): Promise<string> {
	return new SignJWT({ ...user })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('30d')
		.sign(getSecret())
}

/**
 * Верифицировать токен → SessionUser | null
 * Работает в Edge runtime (нет зависимостей от Node.js).
 */
export async function verifySessionToken(
	token: string
): Promise<SessionUser | null> {
	try {
		const { payload } = await jwtVerify(token, getSecret())

		if (
			typeof payload.id !== 'string' ||
			typeof payload.email !== 'string' ||
			typeof payload.role !== 'string' ||
			typeof payload.firstName !== 'string' ||
			typeof payload.lastName !== 'string'
		) {
			return null
		}

		return {
			id: payload.id,
			email: payload.email,
			role: payload.role as SessionUser['role'],
			firstName: payload.firstName,
			lastName: payload.lastName
		}
	} catch {
		// Истёкший, подделанный или некорректный токен
		return null
	}
}

/**
 * Получить текущую сессию в Server Component / Route Handler (Node.js runtime).
 * НЕ вызывать из middleware — там нет next/headers.
 */
export async function getSession(): Promise<SessionUser | null> {
	const cookieStore = await cookies()
	const token = cookieStore.get(SESSION_COOKIE)?.value
	if (!token) return null
	return verifySessionToken(token)
}

/** Установить HttpOnly-cookie с токеном на объекте NextResponse */
export function setSessionCookie(response: NextResponse, token: string): void {
	response.cookies.set(SESSION_COOKIE, token, {
		httpOnly: true, // защита от XSS
		secure: process.env.NODE_ENV === 'production', // HTTPS в prod
		sameSite: 'strict', // защита от CSRF
		maxAge: COOKIE_MAX_AGE,
		path: '/'
	})
}

/** Очистить cookie (logout) */
export function clearSessionCookie(response: NextResponse): void {
	response.cookies.set(SESSION_COOKIE, '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 0,
		path: '/'
	})
}
