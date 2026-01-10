import { useState } from 'react';
import { Order, OrderItem } from '../models/Order';
import { Dish } from '../models/Dish';
import { Table } from '../models/Table';
import { VipCabin } from '../models/VipCabin';
import { dishesRepository } from '../services';

interface OrderFormProps {
  order?: Order;
  tables: Table[];
  vipCabins: VipCabin[];
  dishes: Dish[];
  initialTableId?: string;
  initialVipCabinId?: string;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

/**
 * Форма создания/редактирования заказа
 */
const OrderForm = ({
  order,
  tables,
  vipCabins,
  dishes,
  initialTableId,
  initialVipCabinId,
  onSave,
  onCancel,
}: OrderFormProps) => {
  const [selectedTableId, setSelectedTableId] = useState<string>(
    order?.tableId || initialTableId || ''
  );
  const [selectedVipCabinId, setSelectedVipCabinId] = useState<string>(
    order?.vipCabinId || initialVipCabinId || ''
  );
  const [items, setItems] = useState<OrderItem[]>(order?.items || []);
  const [notes, setNotes] = useState<string>(order?.notes || '');
  const [status, setStatus] = useState<Order['status']>(order?.status || 'new');
  const [showDishSelector, setShowDishSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация доступных блюд
  const availableDishes = (dishes || []).filter(
    (dish) =>
      dish?.isAvailable !== false &&
      (searchQuery === '' ||
        dish?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Вычисление общей суммы
  const totalAmount = (items || []).reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  // Добавление блюда в заказ
  const handleAddDish = (dish: Dish) => {
    const existingItem = items.find((item) => item.dishId === dish.id);
    if (existingItem) {
      // Увеличиваем количество
      setItems(
        items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Добавляем новую позицию
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dishId: dish.id,
        dishName: dish.name,
        price: dish.price,
        quantity: 1,
        createdAt: new Date().toISOString(),
      };
      setItems([...items, newItem]);
    }
    setShowDishSelector(false);
    setSearchQuery('');
  };

  // Изменение количества позиции
  const handleQuantityChange = (itemId: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) {
            return null; // Удаляем, если количество <= 0
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item): item is OrderItem => item !== null)
    );
  };

  // Удаление позиции
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  // Сохранение заказа
  const handleSave = () => {
    if (!selectedTableId && !selectedVipCabinId) {
      alert('Выберите стол или VIP-кабину');
      return;
    }

    if (items.length === 0) {
      alert('Добавьте хотя бы одно блюдо в заказ');
      return;
    }

    const selectedTable = tables.find((t) => t.id === selectedTableId);
    const selectedVipCabin = vipCabins.find((c) => c.id === selectedVipCabinId);

    const orderData: Order = {
      id: order?.id || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tableId: selectedTableId || undefined,
      tableName: selectedTable?.name,
      vipCabinId: selectedVipCabinId || undefined,
      vipCabinName: selectedVipCabin?.name,
      items,
      status,
      totalAmount,
      notes: notes || undefined,
      createdAt: order?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(orderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {order ? 'Редактировать заказ' : 'Новый заказ'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Выбор стола/кабины */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Стол или VIP-кабина
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select
                  value={selectedTableId}
                  onChange={(e) => {
                    setSelectedTableId(e.target.value);
                    setSelectedVipCabinId('');
                  }}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                >
                  <option value="">Выберите стол</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedVipCabinId}
                  onChange={(e) => {
                    setSelectedVipCabinId(e.target.value);
                    setSelectedTableId('');
                  }}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                >
                  <option value="">Выберите VIP-кабину</option>
                  {vipCabins.map((cabin) => (
                    <option key={cabin.id} value={cabin.id}>
                      {cabin.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Статус (только при редактировании) */}
          {order && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="new">Новый</option>
                <option value="in_progress">Готовится</option>
                <option value="ready">Готов</option>
                <option value="served">Подано</option>
                <option value="paid">Оплачено</option>
                <option value="cancelled">Отменено</option>
              </select>
            </div>
          )}

          {/* Позиции заказа */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Позиции заказа ({items.length})
              </label>
              <button
                onClick={() => setShowDishSelector(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                + Добавить блюдо
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Нет позиций в заказе
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {item.dishName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Заметки */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Заметки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация о заказе..."
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Итоговая сумма */}
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">
                Итого:
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {totalAmount} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
          >
            {order ? 'Сохранить' : 'Создать заказ'}
          </button>
        </div>
      </div>

      {/* Модальное окно выбора блюд */}
      {showDishSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Выберите блюдо</h3>
              <button
                onClick={() => {
                  setShowDishSelector(false);
                  setSearchQuery('');
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск блюда..."
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableDishes.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Блюда не найдены
                </div>
              ) : (
                <div className="space-y-2">
                  {availableDishes.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleAddDish(dish)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors border-2 border-transparent hover:border-amber-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {dish.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {dish.price} ₽
                          </div>
                        </div>
                        <span className="text-amber-500 text-xl">+</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;

