import { Table } from '../models/Table';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';
import { mockTables } from '../data/mockData';

/**
 * Репозиторий для работы со столами
 */
class TablesRepository {
  private readonly storageKey = STORAGE_KEYS.TABLES;

  /**
   * Загрузить все столы
   */
  getAll(): Table[] {
    const tables = loadFromStorage<Table[]>(this.storageKey, []);
    // Если данных нет, возвращаем mock-данные
    if (tables.length === 0) {
      this.saveAll(mockTables);
      return mockTables;
    }
    return tables;
  }

  /**
   * Сохранить все столы
   */
  saveAll(tables: Table[]): void {
    saveToStorage(this.storageKey, tables);
  }

  /**
   * Добавить стол
   */
  add(table: Table): void {
    const tables = this.getAll();
    tables.push(table);
    this.saveAll(tables);
  }

  /**
   * Обновить стол
   */
  update(table: Table): void {
    const tables = this.getAll();
    const index = tables.findIndex((t) => t.id === table.id);
    if (index !== -1) {
      tables[index] = { ...table, updatedAt: new Date().toISOString() };
      this.saveAll(tables);
    }
  }

  /**
   * Удалить стол
   */
  delete(tableId: string): void {
    const tables = this.getAll();
    const filtered = tables.filter((t) => t.id !== tableId);
    this.saveAll(filtered);
  }

  /**
   * Найти стол по ID
   */
  findById(tableId: string): Table | undefined {
    const tables = this.getAll();
    return tables.find((t) => t.id === tableId);
  }
}

export const tablesRepository = new TablesRepository();

