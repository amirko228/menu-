/**
 * Сервис для работы с LocalStorage
 */

const STORAGE_KEYS = {
  DISHES: 'cafe-admin-dishes',
  CATEGORIES: 'cafe-admin-categories',
  TABLES: 'cafe-admin-tables',
  VIP_CABINS: 'cafe-admin-vip-cabins',
  RESERVATIONS: 'cafe-admin-reservations',
} as const;

/**
 * Универсальная функция сохранения в LocalStorage
 */
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка сохранения в LocalStorage (${key}):`, error);
  }
};

/**
 * Универсальная функция загрузки из LocalStorage
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Ошибка загрузки из LocalStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Очистка всех данных из LocalStorage
 */
export const clearStorage = (): void => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export { STORAGE_KEYS };

