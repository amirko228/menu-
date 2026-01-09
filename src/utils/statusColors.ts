import { TableStatus } from '../models/Table';
import { VipCabinStatus } from '../models/VipCabin';

/**
 * Утилиты для получения цветов статусов столов
 */
export const getTableStatusColor = (status: TableStatus): string => {
  const colors: Record<TableStatus, string> = {
    free: 'bg-green-500', // Свободен - зеленый
    occupied: 'bg-red-500', // Занят - красный
    reserved: 'bg-blue-500', // Забронирован - синий
    waiting_payment: 'bg-yellow-500', // Ожидает оплату - желтый
    closed: 'bg-gray-400', // Закрыт - серый
  };
  return colors[status];
};

/**
 * Утилиты для получения цветов статусов VIP-кабин
 */
export const getVipCabinStatusColor = (status: VipCabinStatus): string => {
  const colors: Record<VipCabinStatus, string> = {
    free: 'bg-green-500', // Свободна - зеленый
    occupied: 'bg-red-500', // Занята - красный
    reserved: 'bg-blue-500', // Забронирована - синий
    maintenance: 'bg-gray-400', // Обслуживание - серый
  };
  return colors[status];
};

/**
 * Получение текста статуса стола на русском
 */
export const getTableStatusText = (status: TableStatus): string => {
  const texts: Record<TableStatus, string> = {
    free: 'Свободен',
    occupied: 'Занят',
    reserved: 'Забронирован',
    waiting_payment: 'Ожидает оплату',
    closed: 'Закрыт',
  };
  return texts[status];
};

/**
 * Получение текста статуса VIP-кабины на русском
 */
export const getVipCabinStatusText = (status: VipCabinStatus): string => {
  const texts: Record<VipCabinStatus, string> = {
    free: 'Свободна',
    occupied: 'Занята',
    reserved: 'Забронирована',
    maintenance: 'Обслуживание',
  };
  return texts[status];
};

