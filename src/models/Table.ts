/**
 * Статус стола
 */
export type TableStatus = 'free' | 'occupied' | 'reserved' | 'waiting_payment' | 'closed';

/**
 * Модель стола
 */
export interface Table {
  id: string;
  name: string; // Номер/название стола, например "Стол 5"
  status: TableStatus;
  capacity: number; // Количество мест
  location?: string; // Расположение стола (зал, терраса и т.д.)
  currentOrderId?: string; // ID активного заказа
  currentReservationId?: string; // ID текущей брони
  notes?: string; // Заметки официанта
  createdAt: string;
  updatedAt: string;
}

