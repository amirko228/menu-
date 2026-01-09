import { Reservation } from '../models/Reservation';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';

/**
 * Репозиторий для работы с бронированиями
 */
class ReservationsRepository {
  private readonly storageKey = STORAGE_KEYS.RESERVATIONS;

  /**
   * Загрузить все бронирования
   */
  getAll(): Reservation[] {
    return loadFromStorage<Reservation[]>(this.storageKey, []);
  }

  /**
   * Сохранить все бронирования
   */
  saveAll(reservations: Reservation[]): void {
    saveToStorage(this.storageKey, reservations);
  }

  /**
   * Добавить бронирование
   */
  add(reservation: Reservation): void {
    const reservations = this.getAll();
    reservations.push(reservation);
    this.saveAll(reservations);
  }

  /**
   * Обновить бронирование
   */
  update(reservation: Reservation): void {
    const reservations = this.getAll();
    const index = reservations.findIndex((r) => r.id === reservation.id);
    if (index !== -1) {
      reservations[index] = { ...reservation, updatedAt: new Date().toISOString() };
      this.saveAll(reservations);
    }
  }

  /**
   * Удалить бронирование
   */
  delete(reservationId: string): void {
    const reservations = this.getAll();
    const filtered = reservations.filter((r) => r.id !== reservationId);
    this.saveAll(filtered);
  }

  /**
   * Найти бронирование по ID
   */
  findById(reservationId: string): Reservation | undefined {
    const reservations = this.getAll();
    return reservations.find((r) => r.id === reservationId);
  }

  /**
   * Найти бронирования по ID стола или VIP-кабины
   */
  findByTableId(tableId: string): Reservation | undefined {
    const reservations = this.getAll();
    return reservations.find((r) => r.tableId === tableId && r.status !== 'completed' && r.status !== 'cancelled');
  }

  findByVipCabinId(cabinId: string): Reservation | undefined {
    const reservations = this.getAll();
    return reservations.find((r) => r.vipCabinId === cabinId && r.status !== 'completed' && r.status !== 'cancelled');
  }
}

export const reservationsRepository = new ReservationsRepository();

