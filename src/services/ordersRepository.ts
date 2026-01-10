import { Order } from '../models/Order';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from './storageService';

/**
 * Репозиторий для работы с заказами
 */
class OrdersRepository {
  private readonly storageKey = STORAGE_KEYS.ORDERS;

  /**
   * Загрузить все заказы
   */
  getAll(): Order[] {
    return loadFromStorage<Order[]>(this.storageKey, []);
  }

  /**
   * Сохранить все заказы
   */
  saveAll(orders: Order[]): void {
    saveToStorage(this.storageKey, orders);
  }

  /**
   * Добавить заказ
   */
  add(order: Order): void {
    const orders = this.getAll();
    orders.push(order);
    this.saveAll(orders);
  }

  /**
   * Обновить заказ
   */
  update(order: Order): void {
    const orders = this.getAll();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      orders[index] = { ...order, updatedAt: new Date().toISOString() };
      this.saveAll(orders);
    }
  }

  /**
   * Удалить заказ
   */
  delete(orderId: string): void {
    const orders = this.getAll();
    const filtered = orders.filter((o) => o.id !== orderId);
    this.saveAll(filtered);
  }

  /**
   * Найти заказ по ID
   */
  findById(orderId: string): Order | undefined {
    const orders = this.getAll();
    return orders.find((o) => o.id === orderId);
  }

  /**
   * Найти заказы по столу
   */
  findByTableId(tableId: string): Order[] {
    const orders = this.getAll();
    return orders.filter((o) => o.tableId === tableId);
  }

  /**
   * Найти заказы по VIP-кабине
   */
  findByVipCabinId(vipCabinId: string): Order[] {
    const orders = this.getAll();
    return orders.filter((o) => o.vipCabinId === vipCabinId);
  }

  /**
   * Получить активные заказы (не завершенные)
   */
  getActiveOrders(): Order[] {
    const orders = this.getAll();
    return orders.filter(
      (o) => !['paid', 'cancelled'].includes(o.status)
    );
  }
}

export const ordersRepository = new OrdersRepository();

