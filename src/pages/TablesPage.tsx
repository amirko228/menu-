import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import TableCard from '../components/TableCard';
import VipCabinCard from '../components/VipCabinCard';
import EditableTableCard from '../components/EditableTableCard';
import EditableVipCabinCard from '../components/EditableVipCabinCard';
import AddTableForm from '../components/AddTableForm';
import AddVipCabinForm from '../components/AddVipCabinForm';
import EditItemForm from '../components/EditItemForm';
import { useNavigate } from 'react-router-dom';
import { tablesRepository, vipCabinsRepository, ordersRepository } from '../services';
import { Table, TableStatus } from '../models/Table';
import { VipCabin, VipCabinStatus } from '../models/VipCabin';

/**
 * Главный экран - визуальная схема зала со столами и VIP-кабинами
 */
const TablesPage = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [vipCabins, setVipCabins] = useState<VipCabin[]>([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    setTables(tablesRepository.getAll());
    setVipCabins(vipCabinsRepository.getAll());
  }, []);

  // Обновление данных при изменении заказов (для отображения индикаторов)
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(tablesRepository.getAll());
      setVipCabins(vipCabinsRepository.getAll());
    }, 5000); // Обновляем каждые 5 секунд

    return () => clearInterval(interval);
  }, []);
  const [draggedItem, setDraggedItem] = useState<{ type: 'table' | 'vip_cabin'; id: string } | null>(null);
  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [showAddVipCabinForm, setShowAddVipCabinForm] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: 'table' | 'vip_cabin';
    item: Table | VipCabin;
  } | null>(null);

  const tablesContainerRef = useRef<HTMLDivElement>(null);
  const vipCabinsContainerRef = useRef<HTMLDivElement>(null);

  // Обработка начала перетаскивания стола
  const handleTableDragStart = (e: React.DragEvent, tableId: string) => {
    setDraggedItem({ type: 'table', id: tableId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', tableId);
  };

  // Обработка начала перетаскивания VIP-кабины
  const handleCabinDragStart = (e: React.DragEvent, cabinId: string) => {
    setDraggedItem({ type: 'vip_cabin', id: cabinId });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', cabinId);
  };

  // Обработка окончания перетаскивания
  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Перемещение столов (reorder по карточкам)
  // SWAP перестановка столов
  const handleTableDropOnCard = (targetTableId: string) => {
    if (!draggedItem || draggedItem.type !== 'table' || draggedItem.id === targetTableId) return;

    setTables((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((t) => t.id === draggedItem.id);
      const toIndex = items.findIndex((t) => t.id === targetTableId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];
      tablesRepository.saveAll(items);
      return items;
    });
    setDraggedItem(null);
  };

  // SWAP перестановка VIP-кабин
  const handleCabinDropOnCard = (targetCabinId: string) => {
    if (!draggedItem || draggedItem.type !== 'vip_cabin' || draggedItem.id === targetCabinId) return;

    setVipCabins((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((c) => c.id === draggedItem.id);
      const toIndex = items.findIndex((c) => c.id === targetCabinId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      [items[fromIndex], items[toIndex]] = [items[toIndex], items[fromIndex]];
      vipCabinsRepository.saveAll(items);
      return items;
    });
    setDraggedItem(null);
  };

  // Drop по зоне столов: перенос в конец списка
  const handleTableDropContainer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'table') return;

    setTables((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((t) => t.id === draggedItem.id);
      if (fromIndex === -1) return prev;
      const [moved] = items.splice(fromIndex, 1);
      items.push(moved);
      tablesRepository.saveAll(items);
      return items;
    });
    setDraggedItem(null);
  };

  // Drop по зоне VIP-кабин: перенос в конец списка
  const handleCabinDropContainer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== 'vip_cabin') return;

    setVipCabins((prev) => {
      const items = [...prev];
      const fromIndex = items.findIndex((c) => c.id === draggedItem.id);
      if (fromIndex === -1) return prev;
      const [moved] = items.splice(fromIndex, 1);
      items.push(moved);
      vipCabinsRepository.saveAll(items);
      return items;
    });
    setDraggedItem(null);
  };

  // Добавление стола
  const handleAddTable = (data: { name: string; capacity: number; location: string }) => {
    const newTable: Table = {
      id: `table-${Date.now()}`,
      name: data.name,
      status: 'free' as TableStatus,
      capacity: data.capacity,
      location: data.location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tablesRepository.add(newTable);
    setTables(tablesRepository.getAll());
    setShowAddTableForm(false);
  };

  // Добавление VIP-кабины
  const handleAddVipCabin = (data: {
    name: string;
    capacity: number;
    pricePerHour: number;
    location: string;
  }) => {
    const newCabin: VipCabin = {
      id: `vip-${Date.now()}`,
      name: data.name,
      status: 'free' as VipCabinStatus,
      capacity: data.capacity,
      pricePerHour: data.pricePerHour,
      location: data.location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vipCabinsRepository.add(newCabin);
    setVipCabins(vipCabinsRepository.getAll());
    setShowAddVipCabinForm(false);
  };

  // Редактирование стола или VIP-кабины
  const handleEditItem = (type: 'table' | 'vip_cabin', id: string) => {
    if (type === 'table') {
      const table = tables.find((t) => t.id === id);
      if (table) {
        setEditingItem({ type: 'table', item: table });
      }
    } else {
      const cabin = vipCabins.find((c) => c.id === id);
      if (cabin) {
        setEditingItem({ type: 'vip_cabin', item: cabin });
      }
    }
  };

  // Сохранение изменений
  const handleSaveEdit = (data: {
    name: string;
    capacity: number;
    location?: string;
    pricePerHour?: number;
  }) => {
    if (!editingItem) return;

    if (editingItem.type === 'table') {
      const updatedTable: Table = {
        ...(editingItem.item as Table),
        name: data.name,
        capacity: data.capacity,
        location: data.location,
        updatedAt: new Date().toISOString(),
      };
      tablesRepository.update(updatedTable);
      setTables(tablesRepository.getAll());
    } else {
      const updatedCabin: VipCabin = {
        ...(editingItem.item as VipCabin),
        name: data.name,
        capacity: data.capacity,
        location: data.location,
        pricePerHour: data.pricePerHour,
        updatedAt: new Date().toISOString(),
      };
      vipCabinsRepository.update(updatedCabin);
      setVipCabins(vipCabinsRepository.getAll());
    }

    setEditingItem(null);
  };

  // Удаление стола
  const handleDeleteTable = (tableId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот стол?')) {
      tablesRepository.delete(tableId);
      setTables(tablesRepository.getAll());
    }
  };

  // Удаление VIP-кабины
  const handleDeleteCabin = (cabinId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту VIP-кабину?')) {
      vipCabinsRepository.delete(cabinId);
      setVipCabins(vipCabinsRepository.getAll());
    }
  };

  // Сохранение схемы
  const handleSave = () => {
    tablesRepository.saveAll(tables);
    vipCabinsRepository.saveAll(vipCabins);
    alert('Схема сохранена!');
    setIsEditMode(false);
  };

  const handleTableClick = (tableId: string) => {
    if (!isEditMode) {
      // Проверяем, есть ли активный заказ для этого стола
      const activeOrder = ordersRepository.getActiveOrderByTableId(tableId);
      if (activeOrder) {
        // Переходим на страницу заказов с открытым заказом
        navigate('/orders', { state: { orderId: activeOrder.id } });
      } else {
        // Переходим на страницу заказов для создания нового заказа
        navigate('/orders', { state: { tableId } });
      }
    }
  };

  const handleCabinClick = (cabinId: string) => {
    if (!isEditMode) {
      // Проверяем, есть ли активный заказ для этой кабины
      const activeOrder = ordersRepository.getActiveOrderByVipCabinId(cabinId);
      if (activeOrder) {
        // Переходим на страницу заказов с открытым заказом
        navigate('/orders', { state: { orderId: activeOrder.id } });
      } else {
        // Переходим на страницу заказов для создания нового заказа
        navigate('/orders', { state: { vipCabinId: cabinId } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight">Схема зала</h2>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={() => setShowAddTableForm(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  + Стол
                </button>
                <button
                  onClick={() => setShowAddVipCabinForm(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  + VIP-кабина
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                >
                  Отмена
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Изменить схему
              </button>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
            <p className="text-sky-800 text-sm">
              <strong>Режим редактирования:</strong> Перетаскивайте столы и VIP-кабины для изменения их позиции.
              Используйте кнопки редактирования и удаления на карточках.
            </p>
          </div>
        )}

        {/* Столы */}
        <section className="mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Столы</h3>
          <div
            ref={tablesContainerRef}
            onDrop={isEditMode ? handleTableDropContainer : undefined}
            onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${
              isEditMode ? 'min-h-[200px] border-2 border-dashed border-blue-300 rounded-lg p-4' : ''
            }`}
          >
            {tables.map((table) =>
              isEditMode ? (
                <EditableTableCard
                  key={table.id}
                  table={table}
                  isEditMode={isEditMode}
                  onDragStart={handleTableDragStart}
                  onDragEnd={handleDragEnd}
                  onEdit={(id) => handleEditItem('table', id)}
                  onDelete={handleDeleteTable}
                  onDrop={handleTableDropOnCard}
                  onClick={() => handleTableClick(table.id)}
                />
              ) : (
                <TableCard
                  key={table.id}
                  table={table}
                  onClick={() => handleTableClick(table.id)}
                  hasActiveOrder={!!ordersRepository.getActiveOrderByTableId(table.id)}
                />
              )
            )}
          </div>
        </section>

        {/* VIP-кабины */}
        <section>
          <h3 className="text-lg font-medium text-slate-900 mb-4">VIP-кабины</h3>
          <div
            ref={vipCabinsContainerRef}
            onDrop={isEditMode ? handleCabinDropContainer : undefined}
            onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
            className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${
              isEditMode ? 'min-h-[200px] border-2 border-dashed border-purple-300 rounded-lg p-4' : ''
            }`}
          >
            {vipCabins.map((cabin) =>
              isEditMode ? (
                <EditableVipCabinCard
                  key={cabin.id}
                  cabin={cabin}
                  isEditMode={isEditMode}
                  onDragStart={handleCabinDragStart}
                  onDragEnd={handleDragEnd}
                  onEdit={(id) => handleEditItem('vip_cabin', id)}
                  onDelete={handleDeleteCabin}
                  onDrop={handleCabinDropOnCard}
                  onClick={() => handleCabinClick(cabin.id)}
                />
              ) : (
                <VipCabinCard
                  key={cabin.id}
                  cabin={cabin}
                  onClick={() => handleCabinClick(cabin.id)}
                  hasActiveOrder={!!ordersRepository.getActiveOrderByVipCabinId(cabin.id)}
                />
              )
            )}
          </div>
        </section>

        {/* Формы */}
        {showAddTableForm && (
          <AddTableForm
            onSave={handleAddTable}
            onCancel={() => setShowAddTableForm(false)}
          />
        )}

        {showAddVipCabinForm && (
          <AddVipCabinForm
            onSave={handleAddVipCabin}
            onCancel={() => setShowAddVipCabinForm(false)}
          />
        )}

        {editingItem && (
          <EditItemForm
            type={editingItem.type}
            item={editingItem.item}
            onSave={handleSaveEdit}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </main>
    </div>
  );
};

export default TablesPage;

