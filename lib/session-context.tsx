'use client'

/**
 * Клиентский контекст сессии — заменяет SessionProvider + useSession из next-auth/react.
 * Загружает сессию с /api/auth/me при монтировании, предоставляет useSession() хук.
 */
import type { SessionUser } from '@/types/auth'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

type SessionContextValue = {
	user: SessionUser | null
	status: SessionStatus
	/** Принудительно перезагрузить сессию с сервера (например, после обновления профиля) */
	refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue>({
	user: null,
	status: 'loading',
	refresh: async () => {}
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<SessionUser | null>(null)
	const [status, setStatus] = useState<SessionStatus>('loading')

	const fetchSession = useCallback(async () => {
		try {
			const res = await fetch('/api/auth/me', { cache: 'no-store' })
			if (res.ok) {
				const { data } = await res.json()
				setUser(data ?? null)
				setStatus(data ? 'authenticated' : 'unauthenticated')
			} else {
				setUser(null)
				setStatus('unauthenticated')
			}
		} catch {
			setUser(null)
			setStatus('unauthenticated')
		}
	}, [])

	useEffect(() => {
		fetchSession()
	}, [fetchSession])

	return (
		<SessionContext.Provider
			value={{ user, status, refresh: fetchSession }}
		>
			{children}
		</SessionContext.Provider>
	)
}

/** Аналог useSession() из next-auth/react */
export function useSession(): SessionContextValue {
	return useContext(SessionContext)
}
