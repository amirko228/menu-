/**
 * Позиция в заказе (одно блюдо)
 */
export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string; // Название блюда (для быстрого доступа)
  price: number; // Цена за единицу
  quantity: number; // Количество
  notes?: string; // Заметки к позиции (без лука, острое и т.д.)
  createdAt: string;
}

