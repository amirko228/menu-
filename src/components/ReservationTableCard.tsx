import { Table } from '../models/Table';
import { getTableStatusColor, getTableStatusText } from '../utils/statusColors';

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
        relative bg-white rounded-lg border border-gray-200 p-4
        transition-all hover:border-gray-300 hover:shadow-sm
        min-w-[160px] min-h-[160px] flex flex-col
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColor}`} />

      {/* Номер стола */}
      <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{table.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2 text-center`}
      >
        {statusText}
      </span>

      {/* Время брони, если забронирован */}
      {isReserved && reservationTime && (
        <div className="text-xs text-blue-600 font-medium mb-2 text-center">
          {reservationTime}
        </div>
      )}

      {/* Вместимость */}
      <div className="text-sm text-gray-600 mb-3 text-center">
        <span className="font-medium">{table.capacity}</span> мест
      </div>

      {/* Расположение */}
      {table.location && (
        <div className="text-xs text-gray-500 mb-3 text-center">{table.location}</div>
      )}

      {/* Кнопки управления */}
      <div className="flex gap-2 mt-auto">
        {!isReserved ? (
          <button
            onClick={onReserve}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Забронировать
          </button>
        ) : (
          <button
            onClick={onFree}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Освободить
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationTableCard;

