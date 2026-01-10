/**
 * Модель заказа
 */

export type OrderStatus = 'new' | 'in_progress' | 'ready' | 'served' | 'paid' | 'cancelled';

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  tableId?: string;
  vipCabinId?: string;
  waiterName?: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

