import { TableStatus } from '../models/Table';
import { VipCabinStatus } from '../models/VipCabin';

/**
 * Утилиты для получения цветов статусов столов
 */
export const getTableStatusColor = (status: TableStatus): string => {
  const colors: Record<TableStatus, string> = {
    free: 'bg-emerald-100 text-emerald-700 border-emerald-200', // Свободен - спокойный зеленый
    occupied: 'bg-rose-100 text-rose-700 border-rose-200', // Занят - спокойный розовый
    reserved: 'bg-sky-100 text-sky-700 border-sky-200', // Забронирован - спокойный голубой
    waiting_payment: 'bg-amber-100 text-amber-700 border-amber-200', // Ожидает оплату - спокойный янтарный
    closed: 'bg-slate-100 text-slate-600 border-slate-200', // Закрыт - спокойный серый
  };
  return colors[status];
};

/**
 * Утилиты для получения цветов статусов VIP-кабин
 */
export const getVipCabinStatusColor = (status: VipCabinStatus): string => {
  const colors: Record<VipCabinStatus, string> = {
    free: 'bg-emerald-100 text-emerald-700 border-emerald-200', // Свободна - спокойный зеленый
    occupied: 'bg-rose-100 text-rose-700 border-rose-200', // Занята - спокойный розовый
    reserved: 'bg-sky-100 text-sky-700 border-sky-200', // Забронирована - спокойный голубой
    maintenance: 'bg-slate-100 text-slate-600 border-slate-200', // Обслуживание - спокойный серый
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

