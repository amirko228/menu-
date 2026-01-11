import { OrderStatus } from '../models/Order';

/**
 * Получить цвет для статуса заказа
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'new':
      return 'bg-sky-100 text-sky-700 border-sky-200';
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'ready':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'served':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    case 'paid':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'cancelled':
      return 'bg-rose-100 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

/**
 * Получить текст для статуса заказа
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'new':
      return 'Новый';
    case 'in_progress':
      return 'Готовится';
    case 'ready':
      return 'Готов';
    case 'served':
      return 'Подано';
    case 'paid':
      return 'Оплачено';
    case 'cancelled':
      return 'Отменено';
    default:
      return 'Неизвестно';
  }
};

