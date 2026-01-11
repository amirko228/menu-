import { Table } from '../models/Table';
import { getTableStatusColor, getTableStatusText } from '../utils/statusColors';
import { TableIcon } from './icons/Icons';

interface ReservationTableCardProps {
  table: Table;
  reservationTime?: string;
  onReserve: () => void;
  onFree: () => void;
}

/**
 * Карточка стола для страницы бронирования
 */
const ReservationTableCard = ({
  table,
  reservationTime,
  onReserve,
  onFree,
}: ReservationTableCardProps) => {
  const statusColor = getTableStatusColor(table.status);
  const statusText = getTableStatusText(table.status);
  const isReserved = table.status === 'reserved';

  return (
    <div
      className={`
        relative bg-white rounded-xl border border-slate-200 p-4
        transition-all hover:border-slate-300
        min-w-[160px] min-h-[160px] flex flex-col
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${statusColor.split(' ')[0]}`} />

      {/* Иконка стола */}
      <div className="mb-2 text-slate-400 flex justify-center">
        <TableIcon className="w-5 h-5" />
      </div>

      {/* Номер стола */}
      <h3 className="text-base font-semibold text-slate-900 mb-2 text-center">{table.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2.5 py-1 rounded-md border font-medium mb-2 text-center ${statusColor}`}
      >
        {statusText}
      </span>

      {/* Время брони, если забронирован */}
      {isReserved && reservationTime && (
        <div className="text-xs text-sky-600 font-medium mb-2 text-center">
          {reservationTime}
        </div>
      )}

      {/* Вместимость */}
      <div className="text-sm text-slate-600 mb-3 text-center">
        <span className="font-medium">{table.capacity}</span> мест
      </div>

      {/* Расположение */}
      {table.location && (
        <div className="text-xs text-slate-500 mb-3 text-center">{table.location}</div>
      )}

      {/* Кнопки управления */}
      <div className="flex gap-2 mt-auto">
        {!isReserved ? (
          <button
            type="button"
            onClick={onReserve}
            className="flex-1 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-800 transition-colors font-medium cursor-pointer"
          >
            Забронировать
          </button>
        ) : (
          <button
            type="button"
            onClick={onFree}
            className="flex-1 px-3 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors font-medium cursor-pointer"
          >
            Освободить
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationTableCard;

