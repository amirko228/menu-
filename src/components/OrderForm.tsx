import { useState } from 'react';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Dish } from '../models/Dish';
import { Table } from '../models/Table';
import { VipCabin } from '../models/VipCabin';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-medium text-slate-900 tracking-tight">
            {order ? 'Редактировать заказ' : 'Новый заказ'}
          </h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Выбор стола/кабины */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-slate-900"
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-slate-900"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Статус
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Order['status'])}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-slate-900"
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
              <label className="block text-sm font-medium text-slate-700">
                Позиции заказа ({items.length})
              </label>
              <button
                onClick={() => setShowDishSelector(true)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
              >
                + Добавить блюдо
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                Нет позиций в заказе
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">
                        {item.dishName}
                      </div>
                      <div className="text-sm text-slate-600">
                        {item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-slate-700 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="w-8 h-8 bg-slate-200 hover:bg-slate-300 rounded-lg font-bold text-slate-700 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="ml-2 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-colors"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Заметки
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительная информация о заказе..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 resize-none bg-white text-slate-900"
              rows={3}
            />
          </div>

          {/* Итоговая сумма */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-slate-700">
                Итого:
              </span>
              <span className="text-2xl font-semibold text-slate-900">
                {totalAmount} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="px-6 py-4 border-t border-slate-200 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            {order ? 'Сохранить' : 'Создать заказ'}
          </button>
        </div>
      </div>

      {/* Модальное окно выбора блюд */}
      {showDishSelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900 tracking-tight">Выберите блюдо</h3>
              <button
                onClick={() => {
                  setShowDishSelector(false);
                  setSearchQuery('');
                }}
                className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-4 border-b border-slate-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск блюда..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-slate-900"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {availableDishes.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  Блюда не найдены
                </div>
              ) : (
                <div className="space-y-2">
                  {availableDishes.map((dish) => (
                    <button
                      key={dish.id}
                      onClick={() => handleAddDish(dish)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-slate-900">
                            {dish.name}
                          </div>
                          <div className="text-sm text-slate-600">
                            {dish.price} ₽
                          </div>
                        </div>
                        <span className="text-slate-500 text-xl">+</span>
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

