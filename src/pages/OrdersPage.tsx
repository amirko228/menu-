import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import OrderForm from '../components/OrderForm';
import { Order, OrderStatus } from '../models/Order';
import { Table } from '../models/Table';
import { VipCabin } from '../models/VipCabin';
import { Dish } from '../models/Dish';
import {
  ordersRepository,
  tablesRepository,
  vipCabinsRepository,
  dishesRepository,
} from '../services';

/**
 * Страница управления заказами
 */
const OrdersPage = () => {
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [vipCabins, setVipCabins] = useState<VipCabin[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>();
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [initialTableId, setInitialTableId] = useState<string | undefined>();
  const [initialVipCabinId, setInitialVipCabinId] = useState<string | undefined>();

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  // Обработка параметров из навигации
  useEffect(() => {
    try {
      if (!location) return;
      
      const state = location.state as { orderId?: string; tableId?: string; vipCabinId?: string } | null | undefined;
      if (state) {
        if (state.orderId) {
          // Открываем существующий заказ
          try {
            const order = ordersRepository.findById(state.orderId);
            if (order) {
              setEditingOrder(order);
              setShowOrderForm(true);
            }
          } catch (e) {
            console.error('Error loading order:', e);
          }
        } else if (state.tableId || state.vipCabinId) {
          // Создаем новый заказ с предвыбранным столом/кабиной
          setEditingOrder(undefined);
          setInitialTableId(state.tableId);
          setInitialVipCabinId(state.vipCabinId);
          setShowOrderForm(true);
        }
        // Очищаем state после использования
        try {
          window.history.replaceState({}, document.title);
        } catch (e) {
          // Игнорируем ошибки истории
        }
      }
    } catch (e) {
      console.warn('Error processing location state:', e);
    }
  }, [location]);

  const loadData = () => {
    try {
      setOrders(ordersRepository.getAll());
      setTables(tablesRepository.getAll());
      setVipCabins(vipCabinsRepository.getAll());
      setDishes(dishesRepository.getAll());
    } catch (error) {
      console.error('Error loading data:', error);
      // Устанавливаем пустые массивы в случае ошибки
      setOrders([]);
      setTables([]);
      setVipCabins([]);
      setDishes([]);
    }
  };

  // Фильтрация заказов
  const filteredOrders = orders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  );

  // Сортировка: сначала активные заказы, потом по дате создания
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const activeStatuses: OrderStatus[] = ['new', 'in_progress', 'ready', 'served'];
    const aIsActive = activeStatuses.includes(a.status);
    const bIsActive = activeStatuses.includes(b.status);

    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Создание нового заказа
  const handleCreateOrder = () => {
    setEditingOrder(undefined);
    setInitialTableId(undefined);
    setInitialVipCabinId(undefined);
    setShowOrderForm(true);
  };

  // Редактирование заказа
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
  };

  // Сохранение заказа
  const handleSaveOrder = (order: Order) => {
    if (editingOrder) {
      ordersRepository.update(order);
    } else {
      ordersRepository.create(order);
    }
    loadData();
    setShowOrderForm(false);
    setEditingOrder(undefined);
    setInitialTableId(undefined);
    setInitialVipCabinId(undefined);
  };

  // Изменение статуса заказа
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    ordersRepository.updateStatus(orderId, status);
    loadData();
  };

  // Удаление заказа
  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      ordersRepository.delete(orderId);
      loadData();
    }
  };

  // Статистика
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'paid' && o.status !== 'cancelled'
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* Заголовок и статистика */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Заказы
            </h1>
            <button
              onClick={handleCreateOrder}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors shadow-md active:scale-[0.97]"
            >
              + Новый заказ
            </button>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Активных заказов</div>
              <div className="text-2xl font-bold text-gray-900">
                {activeOrdersCount}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Всего заказов</div>
              <div className="text-2xl font-bold text-gray-900">
                {orders.length}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-200 col-span-2 sm:col-span-1">
              <div className="text-sm text-gray-600 mb-1">Выручка (оплачено)</div>
              <div className="text-2xl font-bold text-amber-600">
                {totalRevenue} ₽
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilterStatus('new')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'new'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Новые
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'in_progress'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Готовятся
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'ready'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Готовы
            </button>
            <button
              onClick={() => setFilterStatus('served')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'served'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Подано
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'paid'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              Оплачено
            </button>
          </div>
        </div>

        {/* Список заказов */}
        {sortedOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border-2 border-gray-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Нет заказов
            </h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all'
                ? 'Создайте первый заказ, нажав кнопку "Новый заказ"'
                : 'Нет заказов с выбранным статусом'}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={handleCreateOrder}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
              >
                + Создать заказ
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedOrders.map((order) => (
              <div key={order.id} className="relative">
                <OrderCard
                  order={order}
                  onClick={() => handleEditOrder(order)}
                  onStatusChange={handleStatusChange}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOrder(order.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold opacity-0 hover:opacity-100 transition-opacity"
                  title="Удалить заказ"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Форма создания/редактирования заказа */}
      {showOrderForm && (
        <OrderForm
          order={editingOrder}
          tables={tables}
          vipCabins={vipCabins}
          dishes={dishes}
          initialTableId={initialTableId}
          initialVipCabinId={initialVipCabinId}
          onSave={handleSaveOrder}
          onCancel={() => {
            setShowOrderForm(false);
            setEditingOrder(undefined);
            setInitialTableId(undefined);
            setInitialVipCabinId(undefined);
          }}
        />
      )}
    </div>
  );
};

export default OrdersPage;
