import { Category } from '../models/Category';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';
import { mockCategories } from '../data/mockData';

/**
 * Репозиторий для работы с категориями
 */
class CategoriesRepository {
  private readonly storageKey = STORAGE_KEYS.CATEGORIES;

  /**
   * Загрузить все категории
   */
  getAll(): Category[] {
    const categories = loadFromStorage<Category[]>(this.storageKey, []);
    // Если данных нет, возвращаем mock-данные
    if (categories.length === 0) {
      this.saveAll(mockCategories);
      return mockCategories;
    }
    return categories;
  }

  /**
   * Сохранить все категории
   */
  saveAll(categories: Category[]): void {
    saveToStorage(this.storageKey, categories);
  }

  /**
   * Добавить категорию
   */
  add(category: Category): void {
    const categories = this.getAll();
    categories.push(category);
    this.saveAll(categories);
  }

  /**
   * Обновить категорию
   */
  update(category: Category): void {
    const categories = this.getAll();
    const index = categories.findIndex((c) => c.id === category.id);
    if (index !== -1) {
      categories[index] = { ...category, updatedAt: new Date().toISOString() };
      this.saveAll(categories);
    }
  }

  /**
   * Удалить категорию
   */
  delete(categoryId: string): void {
    const categories = this.getAll();
    const filtered = categories.filter((c) => c.id !== categoryId);
    this.saveAll(filtered);
  }

  /**
   * Найти категорию по ID
   */
  findById(categoryId: string): Category | undefined {
    const categories = this.getAll();
    return categories.find((c) => c.id === categoryId);
  }
}

export const categoriesRepository = new CategoriesRepository();

