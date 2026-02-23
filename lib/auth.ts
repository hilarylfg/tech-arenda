/**
 * Реэкспорт для обратной совместимости.
 * Все серверные компоненты и route handlers используют getSession().
 */
export { getSession } from '@/lib/session'
export type { SessionUser } from '@/types/auth'
