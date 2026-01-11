import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';
import { VipIcon, OrderNoteIcon } from './icons/Icons';

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
        relative bg-white rounded-xl border ${hasActiveOrder ? 'border-amber-300 shadow-sm' : 'border-slate-200'} p-5 cursor-pointer
        transition-all hover:border-slate-300 hover:shadow-sm active:scale-[0.99]
        min-w-[160px] min-h-[140px] flex flex-col items-center justify-center
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${statusColor.split(' ')[0]}`} />
      
      {/* Индикатор активного заказа */}
      {hasActiveOrder && (
        <div className="absolute top-3 left-3 bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1 border border-amber-200">
          <OrderNoteIcon className="w-3 h-3" />
        </div>
      )}
      
      {/* Иконка VIP */}
      <div className="mb-2 text-amber-500">
        <VipIcon className="w-6 h-6" />
      </div>
      
      {/* Название кабины */}
      <h3 className="text-base font-semibold text-slate-900 mb-2">{cabin.name}</h3>
      
      {/* Статус */}
      <span className={`text-xs px-2.5 py-1 rounded-md border font-medium mb-2 ${statusColor}`}>
        {statusText}
      </span>
      
      {/* Вместимость */}
      <div className="text-sm text-slate-600">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>
      
      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-slate-500 mt-1">
          {cabin.pricePerHour} ₽/час
        </div>
      )}
    </div>
  );
};

export default VipCabinCard;

