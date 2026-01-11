import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import ReservationTableCard from '../components/ReservationTableCard';
import ReservationVipCabinCard from '../components/ReservationVipCabinCard';
import ReservationForm from '../components/ReservationForm';
import { tablesRepository, vipCabinsRepository, reservationsRepository } from '../services';
import { Table, TableStatus } from '../models/Table';
import { VipCabin, VipCabinStatus } from '../models/VipCabin';
import { Reservation } from '../models/Reservation';

/**
 * Страница управления бронированиями
 */
const ReservationsPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [vipCabins, setVipCabins] = useState<VipCabin[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    setTables(tablesRepository.getAll());
    setVipCabins(vipCabinsRepository.getAll());
    setReservations(reservationsRepository.getAll());
  }, []);
  const [showReservationForm, setShowReservationForm] = useState<{
    type: 'table' | 'vip_cabin';
    id: string;
    name: string;
  } | null>(null);

  // Обработка бронирования стола
  const handleReserveTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (table) {
      setShowReservationForm({
        type: 'table',
        id: tableId,
        name: table.name,
      });
    }
  };

  // Обработка бронирования VIP-кабины
  const handleReserveCabin = (cabinId: string) => {
    const cabin = vipCabins.find((c) => c.id === cabinId);
    if (cabin) {
      setShowReservationForm({
        type: 'vip_cabin',
        id: cabinId,
        name: cabin.name,
      });
    }
  };

  // Подтверждение бронирования
  const handleConfirmReservation = (timeString: string) => {
    if (!showReservationForm) return;

    const [date, time] = timeString.split(' ');
    const reservationId = `res-${Date.now()}`;

    // Создаем бронирование
    const newReservation: Reservation = {
      id: reservationId,
      type: showReservationForm.type,
      tableId: showReservationForm.type === 'table' ? showReservationForm.id : undefined,
      vipCabinId: showReservationForm.type === 'vip_cabin' ? showReservationForm.id : undefined,
      guestName: 'Гость',
      guestPhone: '',
      numberOfGuests: 2,
      reservationDate: date,
      reservationTime: time,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Сохраняем бронирование
    reservationsRepository.add(newReservation);
    setReservations(reservationsRepository.getAll());

    // Обновляем статус стола/кабины
    if (showReservationForm.type === 'table') {
      const table = tables.find((t) => t.id === showReservationForm.id);
      if (table) {
        const updatedTable: Table = {
          ...table,
          status: 'reserved' as TableStatus,
          currentReservationId: reservationId,
          updatedAt: new Date().toISOString(),
        };
        tablesRepository.update(updatedTable);
        setTables(tablesRepository.getAll());
      }
    } else {
      const cabin = vipCabins.find((c) => c.id === showReservationForm.id);
      if (cabin) {
        const updatedCabin: VipCabin = {
          ...cabin,
          status: 'reserved' as VipCabinStatus,
          currentReservationId: reservationId,
          updatedAt: new Date().toISOString(),
        };
        vipCabinsRepository.update(updatedCabin);
        setVipCabins(vipCabinsRepository.getAll());
      }
    }

    setShowReservationForm(null);
  };

  // Освобождение стола
  const handleFreeTable = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.currentReservationId) return;

    // Обновляем статус бронирования
    const reservation = reservationsRepository.findById(table.currentReservationId);
    if (reservation) {
      const updatedReservation: Reservation = {
        ...reservation,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      reservationsRepository.update(updatedReservation);
      setReservations(reservationsRepository.getAll());
    }

    // Обновляем статус стола
    const updatedTable: Table = {
      ...table,
      status: 'free' as TableStatus,
      currentReservationId: undefined,
      updatedAt: new Date().toISOString(),
    };
    tablesRepository.update(updatedTable);
    setTables(tablesRepository.getAll());
  };

  // Освобождение VIP-кабины
  const handleFreeCabin = (cabinId: string) => {
    const cabin = vipCabins.find((c) => c.id === cabinId);
    if (!cabin || !cabin.currentReservationId) return;

    // Обновляем статус бронирования
    const reservation = reservationsRepository.findById(cabin.currentReservationId);
    if (reservation) {
      const updatedReservation: Reservation = {
        ...reservation,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      reservationsRepository.update(updatedReservation);
      setReservations(reservationsRepository.getAll());
    }

    // Обновляем статус кабины
    const updatedCabin: VipCabin = {
      ...cabin,
      status: 'free' as VipCabinStatus,
      currentReservationId: undefined,
      updatedAt: new Date().toISOString(),
    };
    vipCabinsRepository.update(updatedCabin);
    setVipCabins(vipCabinsRepository.getAll());
  };

  // Получение времени бронирования
  const getReservationTime = (type: 'table' | 'vip_cabin', id: string): string | undefined => {
    const item = type === 'table' 
      ? tables.find((t) => t.id === id)
      : vipCabins.find((c) => c.id === id);
    
    if (!item || !item.currentReservationId) return undefined;

    const reservation = reservations.find((r) => r.id === item.currentReservationId);
    if (reservation && reservation.status !== 'cancelled' && reservation.status !== 'completed') {
      return `${reservation.reservationDate} ${reservation.reservationTime}`;
    }
    return undefined;
  };

  // Группировка столов по расположению
  const tablesByLocation = useMemo(() => {
    const grouped: Record<string, Table[]> = {};
    tables.forEach((table) => {
      const location = table.location || 'Другое';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(table);
    });
    return grouped;
  }, [tables]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight mb-6">Бронирование</h1>

        {/* Столы */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Столы</h2>
          {Object.entries(tablesByLocation).map(([location, locationTables]) => (
            <div key={location} className="mb-6">
              <h3 className="text-base font-medium text-slate-700 mb-3">{location}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {(locationTables as Table[]).map((table) => (
                  <ReservationTableCard
                    key={table.id}
                    table={table}
                    reservationTime={getReservationTime('table', table.id)}
                    onReserve={() => handleReserveTable(table.id)}
                    onFree={() => handleFreeTable(table.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* VIP-кабины */}
        <section>
          <h2 className="text-lg font-medium text-slate-900 mb-4">VIP-кабины</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {vipCabins.map((cabin: VipCabin) => (
              <ReservationVipCabinCard
                key={cabin.id}
                cabin={cabin}
                reservationTime={getReservationTime('vip_cabin', cabin.id)}
                onReserve={() => handleReserveCabin(cabin.id)}
                onFree={() => handleFreeCabin(cabin.id)}
              />
            ))}
          </div>
        </section>

        {/* Форма бронирования */}
        {showReservationForm && (
          <ReservationForm
            itemName={showReservationForm.name}
            itemType={showReservationForm.type}
            onConfirm={handleConfirmReservation}
            onCancel={() => setShowReservationForm(null)}
          />
        )}
      </main>
    </div>
  );
};

export default ReservationsPage;


