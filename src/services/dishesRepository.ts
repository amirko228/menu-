import { Dish } from '../models/Dish';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';
import { mockDishes } from '../data/mockData';

/**
 * Репозиторий для работы с блюдами
 */
class DishesRepository {
  private readonly storageKey = STORAGE_KEYS.DISHES;

  /**
   * Загрузить все блюда
   */
  getAll(): Dish[] {
    const dishes = loadFromStorage<Dish[]>(this.storageKey, []);
    // Если данных нет, возвращаем mock-данные
    if (dishes.length === 0) {
      this.saveAll(mockDishes);
      return mockDishes;
    }
    return dishes;
  }

  /**
   * Сохранить все блюда
   */
  saveAll(dishes: Dish[]): void {
    saveToStorage(this.storageKey, dishes);
  }

  /**
   * Добавить блюдо
   */
  add(dish: Dish): void {
    const dishes = this.getAll();
    dishes.push(dish);
    this.saveAll(dishes);
  }

  /**
   * Обновить блюдо
   */
  update(dish: Dish): void {
    const dishes = this.getAll();
    const index = dishes.findIndex((d) => d.id === dish.id);
    if (index !== -1) {
      dishes[index] = { ...dish, updatedAt: new Date().toISOString() };
      this.saveAll(dishes);
    }
  }

  /**
   * Удалить блюдо
   */
  delete(dishId: string): void {
    const dishes = this.getAll();
    const filtered = dishes.filter((d) => d.id !== dishId);
    this.saveAll(filtered);
  }

  /**
   * Найти блюдо по ID
   */
  findById(dishId: string): Dish | undefined {
    const dishes = this.getAll();
    return dishes.find((d) => d.id === dishId);
  }
}

export const dishesRepository = new DishesRepository();

