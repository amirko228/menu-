/**
 * Константы приложения
 */

// Размеры для touch-устройств (официанты часто используют планшеты)
export const TOUCH_TARGET_SIZE = {
  MIN_HEIGHT: 44, // Минимальная высота для удобного нажатия
  MIN_WIDTH: 44,
  BUTTON_PADDING: 16, // Отступы для кнопок
};

// Цвета статусов
export const STATUS_COLORS = {
  FREE: 'bg-green-500',
  OCCUPIED: 'bg-red-500',
  RESERVED: 'bg-blue-500',
  WAITING_PAYMENT: 'bg-yellow-500',
  CLOSED: 'bg-gray-400',
  MAINTENANCE: 'bg-gray-400',
} as const;

// Таймауты
export const TIMEOUTS = {
  AUTO_SAVE: 1000, // Автосохранение через 1 секунду после изменения
  DEBOUNCE: 300, // Debounce для поиска
} as const;

