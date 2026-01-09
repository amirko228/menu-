import { VipCabin } from '../models/VipCabin';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';
import { mockVipCabins } from '../data/mockData';

/**
 * Репозиторий для работы с VIP-кабинами
 */
class VipCabinsRepository {
  private readonly storageKey = STORAGE_KEYS.VIP_CABINS;

  /**
   * Загрузить все VIP-кабины
   */
  getAll(): VipCabin[] {
    const cabins = loadFromStorage<VipCabin[]>(this.storageKey, []);
    // Если данных нет, возвращаем mock-данные
    if (cabins.length === 0) {
      this.saveAll(mockVipCabins);
      return mockVipCabins;
    }
    return cabins;
  }

  /**
   * Сохранить все VIP-кабины
   */
  saveAll(cabins: VipCabin[]): void {
    saveToStorage(this.storageKey, cabins);
  }

  /**
   * Добавить VIP-кабину
   */
  add(cabin: VipCabin): void {
    const cabins = this.getAll();
    cabins.push(cabin);
    this.saveAll(cabins);
  }

  /**
   * Обновить VIP-кабину
   */
  update(cabin: VipCabin): void {
    const cabins = this.getAll();
    const index = cabins.findIndex((c) => c.id === cabin.id);
    if (index !== -1) {
      cabins[index] = { ...cabin, updatedAt: new Date().toISOString() };
      this.saveAll(cabins);
    }
  }

  /**
   * Удалить VIP-кабину
   */
  delete(cabinId: string): void {
    const cabins = this.getAll();
    const filtered = cabins.filter((c) => c.id !== cabinId);
    this.saveAll(filtered);
  }

  /**
   * Найти VIP-кабину по ID
   */
  findById(cabinId: string): VipCabin | undefined {
    const cabins = this.getAll();
    return cabins.find((c) => c.id === cabinId);
  }
}

export const vipCabinsRepository = new VipCabinsRepository();

