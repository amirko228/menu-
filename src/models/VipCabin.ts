/**
 * Статус VIP-кабины
 */
export type VipCabinStatus = 'free' | 'occupied' | 'reserved' | 'maintenance';

/**
 * Модель VIP-кабины
 */
export interface VipCabin {
  id: string;
  name: string; // Название кабины, например "Кабина 1" или "Президентская"
  status: VipCabinStatus;
  capacity: number; // Максимальное количество гостей
  pricePerHour?: number; // Стоимость аренды за час (если применимо)
  amenities?: string[]; // Удобства (кондиционер, караоке, проектор и т.д.)
  location?: string; // Расположение кабины
  currentOrderId?: string; // ID активного заказа
  currentReservationId?: string; // ID текущей брони
  notes?: string; // Заметки
  createdAt: string;
  updatedAt: string;
}

