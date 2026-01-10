import { Order, OrderStatus } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
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
   * Найти заказ по ID
   */
  findById(orderId: string): Order | undefined {
    const orders = this.getAll();
    return orders.find((o) => o.id === orderId);
  }

  /**
   * Найти активные заказы (не оплаченные и не отмененные)
   */
  getActiveOrders(): Order[] {
    const orders = this.getAll();
    return orders.filter(
      (o) => o.status !== 'paid' && o.status !== 'cancelled'
    );
  }

  /**
   * Найти заказы по столу
   */
  getByTableId(tableId: string): Order[] {
    const orders = this.getAll();
    return orders.filter((o) => o.tableId === tableId);
  }

  /**
   * Найти заказы по VIP-кабине
   */
  getByVipCabinId(vipCabinId: string): Order[] {
    const orders = this.getAll();
    return orders.filter((o) => o.vipCabinId === vipCabinId);
  }

  /**
   * Найти активный заказ для стола
   */
  getActiveOrderByTableId(tableId: string): Order | undefined {
    const orders = this.getActiveOrders();
    return orders.find((o) => o.tableId === tableId);
  }

  /**
   * Найти активный заказ для VIP-кабины
   */
  getActiveOrderByVipCabinId(vipCabinId: string): Order | undefined {
    const orders = this.getActiveOrders();
    return orders.find((o) => o.vipCabinId === vipCabinId);
  }

  /**
   * Создать новый заказ
   */
  create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getAll();
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    this.saveAll(orders);
    return newOrder;
  }

  /**
   * Обновить заказ
   */
  update(order: Order): void {
    const orders = this.getAll();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      // Пересчитываем общую сумму
      const totalAmount = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      orders[index] = {
        ...order,
        totalAmount,
        updatedAt: new Date().toISOString(),
      };
      this.saveAll(orders);
    }
  }

  /**
   * Добавить позицию в заказ
   */
  addItem(orderId: string, item: Omit<OrderItem, 'id' | 'createdAt'>): void {
    const order = this.findById(orderId);
    if (!order) return;

    const newItem: OrderItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    order.items.push(newItem);
    this.update(order);
  }

  /**
   * Обновить позицию в заказе
   */
  updateItem(orderId: string, itemId: string, updates: Partial<OrderItem>): void {
    const order = this.findById(orderId);
    if (!order) return;

    const itemIndex = order.items.findIndex((i) => i.id === itemId);
    if (itemIndex !== -1) {
      order.items[itemIndex] = {
        ...order.items[itemIndex],
        ...updates,
      };
      this.update(order);
    }
  }

  /**
   * Удалить позицию из заказа
   */
  removeItem(orderId: string, itemId: string): void {
    const order = this.findById(orderId);
    if (!order) return;

    order.items = order.items.filter((i) => i.id !== itemId);
    this.update(order);
  }

  /**
   * Изменить статус заказа
   */
  updateStatus(orderId: string, status: OrderStatus): void {
    const order = this.findById(orderId);
    if (!order) return;

    order.status = status;
    
    if (status === 'served') {
      order.servedAt = new Date().toISOString();
    }
    
    if (status === 'paid') {
      order.paidAt = new Date().toISOString();
    }

    this.update(order);
  }

  /**
   * Удалить заказ
   */
  delete(orderId: string): void {
    const orders = this.getAll();
    const filtered = orders.filter((o) => o.id !== orderId);
    this.saveAll(filtered);
  }
}

export const ordersRepository = new OrdersRepository();

