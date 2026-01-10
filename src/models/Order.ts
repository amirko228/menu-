import { OrderItem } from './OrderItem';

/**
 * Статус заказа
 */
export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'served' | 'paid' | 'cancelled';

/**
 * Модель заказа
 */
export interface Order {
  id: string;
  tableId?: string; // ID стола (если заказ для стола)
  tableName?: string; // Название стола (для быстрого доступа)
  vipCabinId?: string; // ID VIP-кабины (если заказ для кабины)
  vipCabinName?: string; // Название VIP-кабины (для быстрого доступа)
  items: OrderItem[]; // Позиции заказа
  status: OrderStatus;
  totalAmount: number; // Общая сумма заказа
  notes?: string; // Заметки официанта к заказу
  waiterName?: string; // Имя официанта
  createdAt: string;
  updatedAt: string;
  servedAt?: string; // Время подачи
  paidAt?: string; // Время оплаты
}

