import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';

interface VipCabinCardProps {
  cabin: VipCabin;
  onClick?: () => void;
  hasActiveOrder?: boolean;
}

/**
 * Карточка VIP-кабины для визуальной схемы зала
 */
const VipCabinCard = ({ cabin, onClick, hasActiveOrder }: VipCabinCardProps) => {
  const statusColor = getVipCabinStatusColor(cabin.status);
  const statusText = getVipCabinStatusText(cabin.status);

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border-2 ${hasActiveOrder ? 'border-amber-400 shadow-md' : 'border-gray-200'} p-4 cursor-pointer
        transition-all hover:border-amber-300 hover:shadow-md active:scale-[0.99]
        min-w-[160px] min-h-[140px] flex flex-col items-center justify-center
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColor}`} />
      
      {/* Индикатор активного заказа */}
      {hasActiveOrder && (
        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          📝
        </div>
      )}
      
      {/* Иконка VIP */}
      <div className="text-2xl mb-2">⭐</div>
      
      {/* Название кабины */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{cabin.name}</h3>
      
      {/* Статус */}
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2`}>
        {statusText}
      </span>
      
      {/* Вместимость */}
      <div className="text-sm text-gray-700">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>
      
      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-gray-500 mt-1">
          {cabin.pricePerHour} ₽/час
        </div>
      )}
    </div>
  );
};

export default VipCabinCard;

