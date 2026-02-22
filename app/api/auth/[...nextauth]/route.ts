export const runtime = 'nodejs'
import { handlers } from '@/lib/auth'

// Экспортируем обработчики NextAuth для GET и POST запросов
export const { GET, POST } = handlers
