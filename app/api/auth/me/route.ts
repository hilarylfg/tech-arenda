export const runtime = 'nodejs'

import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

/**
 * GET /api/auth/me
 * Возвращает данные текущего пользователя (для клиентского SessionContext).
 */
export async function GET() {
	const session = await getSession()
	if (!session) {
		return NextResponse.json({ data: null }, { status: 200 })
	}
	return NextResponse.json({ data: session }, { status: 200 })
}
