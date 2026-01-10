import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { 
  tablesRepository, 
  vipCabinsRepository, 
  dishesRepository, 
  categoriesRepository,
  ordersRepository 
} from '../services';
import { Table } from '../models/Table';
import { VipCabin } from '../models/VipCabin';
import { Dish, Category } from '../models';
import { Order, OrderItem, OrderStatus } from '../models/Order';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Страница управления заказами
 */
const OrdersPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [vipCabins, setVipCabins] = useState<VipCabin[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<VipCabin | null>(null);
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [showDishSelector, setShowDishSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderNotes, setOrderNotes] = useState('');

  // Загрузка данных
  useEffect(() => {
    setTables(tablesRepository.getAll());
    setVipCabins(vipCabinsRepository.getAll());
    setDishes(dishesRepository.getAll());
    setCategories(categoriesRepository.getAll());
    setOrders(ordersRepository.getActiveOrders());
  }, []);

  // Фильтрация блюд
  const availableDishes = dishes.filter((d) => d.isAvailable);
  const filteredDishes = selectedCategory === 'all' 
    ? availableDishes 
    : availableDishes.filter((d) => d.categoryId === selectedCategory);

  // Выбор стола/кабины для заказа
  const handleSelectTable = (table: Table) => {
    setSelectedTable(table);
    setSelectedCabin(null);
    setCurrentOrderItems([]);
    setOrderNotes('');
  };

  const handleSelectCabin = (cabin: VipCabin) => {
    setSelectedCabin(cabin);
    setSelectedTable(null);
    setCurrentOrderItems([]);
    setOrderNotes('');
  };

  // Добавление блюда в заказ
  const handleAddDish = (dish: Dish) => {
    const existingItem = currentOrderItems.find((item) => item.dishId === dish.id);
    
    if (existingItem) {
      // Увеличиваем количество
      setCurrentOrderItems(
        currentOrderItems.map((item) =>
          item.dishId === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Добавляем новое блюдо
      const newItem: OrderItem = {
        dishId: dish.id,
        dishName: dish.name,
        quantity: 1,
        price: dish.price,
      };
      setCurrentOrderItems([...currentOrderItems, newItem]);
    }
    setShowDishSelector(false);
  };

  // Изменение количества блюда
  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      setCurrentOrderItems(currentOrderItems.filter((item) => item.dishId !== dishId));
    } else {
      setCurrentOrderItems(
        currentOrderItems.map((item) =>
          item.dishId === dishId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Создание заказа
  const handleCreateOrder = () => {
    if (currentOrderItems.length === 0) {
      alert('Добавьте хотя бы одно блюдо в заказ');
      return;
    }

    if (!selectedTable && !selectedCabin) {
      alert('Выберите стол или VIP-кабину');
      return;
    }

    const totalAmount = currentOrderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: selectedTable?.id,
      vipCabinId: selectedCabin?.id,
      items: currentOrderItems,
      status: 'new',
      totalAmount,
      notes: orderNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ordersRepository.add(newOrder);
    setOrders(ordersRepository.getActiveOrders());

    // Обновляем статус стола/кабины
    if (selectedTable) {
      const updatedTable: Table = {
        ...selectedTable,
        status: 'occupied',
        currentOrderId: newOrder.id,
        updatedAt: new Date().toISOString(),
      };
      tablesRepository.update(updatedTable);
      setTables(tablesRepository.getAll());
    }

    if (selectedCabin) {
      const updatedCabin: VipCabin = {
        ...selectedCabin,
        status: 'occupied',
        currentOrderId: newOrder.id,
        updatedAt: new Date().toISOString(),
      };
      vipCabinsRepository.update(updatedCabin);
      setVipCabins(vipCabinsRepository.getAll());
    }

    // Сброс формы
    setSelectedTable(null);
    setSelectedCabin(null);
    setCurrentOrderItems([]);
    setOrderNotes('');
  };

  // Обновление статуса заказа
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const order = ordersRepository.findById(orderId);
    if (order) {
      const updatedOrder: Order = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      };
      ordersRepository.update(updatedOrder);
      setOrders(ordersRepository.getActiveOrders());
    }
  };

  // Отмена создания заказа
  const handleCancelOrder = () => {
    setSelectedTable(null);
    setSelectedCabin(null);
    setCurrentOrderItems([]);
    setOrderNotes('');
    setShowDishSelector(false);
  };

  const totalPrice = currentOrderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Заказы</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Левая колонка: Выбор стола/кабины и создание заказа */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Создать заказ
              </h2>

              {/* Выбор стола */}
              {!selectedTable && !selectedCabin && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Столы:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {tables
                        .filter((t) => t.status === 'free' || t.status === 'occupied')
                        .map((table) => (
                          <button
                            key={table.id}
                            onClick={() => handleSelectTable(table)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 touch-manipulation"
                          >
                            {table.name}
                          </button>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">VIP-кабины:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {vipCabins
                        .filter((c) => c.status === 'free' || c.status === 'occupied')
                        .map((cabin) => (
                          <button
                            key={cabin.id}
                            onClick={() => handleSelectCabin(cabin)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 touch-manipulation"
                          >
                            {cabin.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Выбранный стол/кабина */}
              {(selectedTable || selectedCabin) && (
                <div className="mb-4">
                  <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                    <span className="font-medium text-gray-900">
                      {selectedTable ? `Стол: ${selectedTable.name}` : `VIP-кабина: ${selectedCabin?.name}`}
                    </span>
                    <button
                      onClick={handleCancelOrder}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Изменить
                    </button>
                  </div>
                </div>
              )}

              {/* Список блюд в заказе */}
              {currentOrderItems.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Блюда в заказе:</h3>
                  {currentOrderItems.map((item) => (
                    <div
                      key={item.dishId}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.dishName}</div>
                        <div className="text-sm text-gray-600">
                          {item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.dishId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-gray-700 font-medium touch-manipulation"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.dishId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 text-gray-700 font-medium touch-manipulation"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Итого:</span>
                      <span className="text-xl font-bold text-gray-900">{totalPrice} ₽</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Кнопка добавления блюд */}
              {(selectedTable || selectedCabin) && (
                <div className="mb-4">
                  <Button
                    onClick={() => setShowDishSelector(!showDishSelector)}
                    variant="secondary"
                    size="md"
                  >
                    {showDishSelector ? 'Скрыть меню' : '+ Добавить блюдо'}
                  </Button>
                </div>
              )}

              {/* Селектор блюд */}
              {showDishSelector && (
                <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                  {/* Фильтр по категориям */}
                  <div className="mb-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="all">Все категории</option>
                      {categories
                        .filter((c) => c.isActive)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Список блюд */}
                  <div className="space-y-2">
                    {filteredDishes.map((dish) => (
                      <button
                        key={dish.id}
                        onClick={() => handleAddDish(dish)}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 touch-manipulation"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{dish.name}</div>
                            {dish.description && (
                              <div className="text-sm text-gray-600 mt-1">
                                {dish.description}
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-gray-900 ml-4">
                            {dish.price} ₽
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Заметки к заказу */}
              {(selectedTable || selectedCabin) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заметки к заказу:
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Особые пожелания клиента..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Кнопка создания заказа */}
              {(selectedTable || selectedCabin) && currentOrderItems.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={handleCreateOrder} variant="primary" size="md" className="flex-1">
                    Создать заказ
                  </Button>
                  <Button onClick={handleCancelOrder} variant="secondary" size="md">
                    Отмена
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Правая колонка: Активные заказы */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Активные заказы ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Нет активных заказов</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const table = order.tableId
                      ? tables.find((t) => t.id === order.tableId)
                      : null;
                    const cabin = order.vipCabinId
                      ? vipCabins.find((c) => c.id === order.vipCabinId)
                      : null;

                    return (
                      <div
                        key={order.id}
                        className="p-4 bg-white border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {table ? `Стол ${table.name}` : `VIP ${cabin?.name}`}
                            </div>
                            <div className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {order.totalAmount} ₽
                          </div>
                        </div>

                        <div className="mb-3 space-y-1">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-700 flex justify-between"
                            >
                              <span>
                                {item.quantity}× {item.dishName}
                              </span>
                              <span>{item.price * item.quantity} ₽</span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <div className="mb-3 text-sm text-gray-600 italic">
                            {order.notes}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="new">Новый</option>
                            <option value="in_progress">В работе</option>
                            <option value="ready">Готов</option>
                            <option value="served">Подано</option>
                            <option value="paid">Оплачено</option>
                            <option value="cancelled">Отменено</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
