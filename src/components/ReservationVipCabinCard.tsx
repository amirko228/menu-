import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';
import { VipIcon } from './icons/Icons';

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
        relative bg-white rounded-xl border border-slate-200 p-4
        transition-all hover:border-slate-300
        min-w-[180px] min-h-[180px] flex flex-col
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${statusColor.split(' ')[0]}`} />

      {/* Иконка VIP */}
      <div className="mb-2 text-amber-500 flex justify-center">
        <VipIcon className="w-5 h-5" />
      </div>

      {/* Название кабины */}
      <h3 className="text-base font-semibold text-slate-900 mb-2 text-center">{cabin.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2.5 py-1 rounded-md border font-medium mb-2 text-center ${statusColor}`}
      >
        {statusText}
      </span>

      {/* Время брони, если забронирована */}
      {isReserved && reservationTime && (
        <div className="text-xs text-sky-600 font-medium mb-2 text-center">
          {reservationTime}
        </div>
      )}

      {/* Вместимость */}
      <div className="text-sm text-slate-600 mb-2 text-center">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>

      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-slate-500 mb-3 text-center">
          {cabin.pricePerHour} ₽/час
        </div>
      )}

      {/* Кнопки управления */}
      <div className="flex gap-2 mt-auto">
        {!isReserved ? (
          <button
            onClick={onReserve}
            className="flex-1 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Забронировать
          </button>
        ) : (
          <button
            onClick={onFree}
            className="flex-1 px-3 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Освободить
          </button>
        )}
      </div>
    </div>
  );
};

export default ReservationVipCabinCard;

