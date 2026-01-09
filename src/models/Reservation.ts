/**
 * Статус бронирования
 */
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

/**
 * Тип бронирования (стол или VIP-кабина)
 */
export type ReservationType = 'table' | 'vip_cabin';

/**
 * Модель бронирования
 */
export interface Reservation {
  id: string;
  type: ReservationType;
  tableId?: string; // ID стола (если type === 'table')
  vipCabinId?: string; // ID VIP-кабины (если type === 'vip_cabin')
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  numberOfGuests: number;
  reservationDate: string; // ISO date string
  reservationTime: string; // Время бронирования (HH:mm)
  duration?: number; // Длительность в минутах (для VIP-кабин)
  status: ReservationStatus;
  specialRequests?: string; // Особые пожелания гостей
  notes?: string; // Заметки официанта/администратора
  createdAt: string;
  updatedAt: string;
}

