import { z } from 'zod'
export const createOrderSchema = z.object({
    equipmentId: z.string().min(1, 'Выберите технику'),
    startDate: z.string().min(1, 'Укажите дату начала аренды'),
    endDate: z.string().min(1, 'Укажите дату окончания аренды'),
    comment: z.string().max(1000, 'Комментарий слишком длинный').optional()
})
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
    comment: z.string().max(500).optional()
})
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>
