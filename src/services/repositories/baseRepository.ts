/**
 * Базовый репозиторий с поддержкой LocalStorage и API
 */

export interface Repository<T> {
  getAll(): T[];
  saveAll(items: T[]): void;
  add(item: T): void;
  update(item: T): void;
  delete(id: string): void;
  findById(id: string): T | undefined;
}

/**
 * Абстракция для источника данных
 * Позволяет легко переключиться с LocalStorage на API
 */
export interface DataSource<T> {
  loadAll(): Promise<T[]>;
  saveAll(items: T[]): Promise<void>;
  add(item: T): Promise<void>;
  update(item: T): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | undefined>;
}

