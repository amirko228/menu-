import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';

interface ReservationVipCabinCardProps {
  cabin: VipCabin;
  reservationTime?: string;
  onReserve: () => void;
  onFree: () => void;
}

/**
 * Карточка VIP-кабины для страницы бронирования
 */
const ReservationVipCabinCard = ({
  cabin,
  reservationTime,
  onReserve,
  onFree,
}: ReservationVipCabinCardProps) => {
  const statusColor = getVipCabinStatusColor(cabin.status);
  const statusText = getVipCabinStatusText(cabin.status);
  const isReserved = cabin.status === 'reserved';

  return (
    <div
      className={`
        relative bg-white rounded-lg border border-gray-200 p-4
        transition-all hover:border-gray-300 hover:shadow-sm
        min-w-[180px] min-h-[180px] flex flex-col
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColor}`} />

      {/* Иконка VIP */}
      <div className="text-2xl mb-2 text-center">⭐</div>

      {/* Название кабины */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{cabin.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2 text-center`}
      >
        {statusText}
      </span>

      {/* Время брони, если забронирована */}
      {isReserved && reservationTime && (
        <div className="text-xs text-purple-600 font-medium mb-2 text-center">
          {reservationTime}
        </div>
      )}

      {/* Вместимость */}
      <div className="text-sm text-gray-700 mb-2 text-center">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>

      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-gray-500 mb-3 text-center">
          {cabin.pricePerHour} ₽/час
        </div>
      )}

      {/* Кнопки управления */}
      <div className="flex gap-2 mt-auto">
        {!isReserved ? (
          <button
            onClick={onReserve}
            className="flex-1 px-3 py-2 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors font-medium"
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

export default ReservationVipCabinCard;

