import { clearSessionCookie } from '@/lib/session'
import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 */
export async function POST() {
	const response = NextResponse.json({ success: true })
	clearSessionCookie(response)
	return response
}
