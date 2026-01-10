import { OrderStatus } from '../models/Order';

/**
 * Получить цвет для статуса заказа
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'new':
      return 'bg-blue-500';
    case 'in_progress':
      return 'bg-yellow-500';
    case 'ready':
      return 'bg-green-500';
    case 'served':
      return 'bg-purple-500';
    case 'paid':
      return 'bg-gray-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
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

