import { Order, OrderStatus } from '../models/Order';
import { getOrderStatusColor, getOrderStatusText } from '../utils/orderStatusColors';
import { TableIcon, VipIcon, TrashIcon } from './icons/Icons';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  onDelete?: () => void;
}

/**
 * Карточка заказа
 */
const OrderCard = ({ order, onClick, onStatusChange, onDelete }: OrderCardProps) => {
  const statusColor = getOrderStatusColor(order.status);
  const statusText = getOrderStatusText(order.status);

  const locationName = order.tableName || order.vipCabinName || 'Не указано';
  const LocationIcon = order.tableName ? TableIcon : order.vipCabinName ? VipIcon : null;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {LocationIcon && <LocationIcon className="w-4 h-4 text-slate-400" />}
            <h3 className="font-semibold text-slate-900 text-base">{locationName}</h3>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            #{order.id.slice(-8)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColor}`}>
            {statusText}
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Вы уверены, что хотите удалить этот заказ?')) {
                  onDelete();
                }
              }}
              className="w-7 h-7 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-600 rounded-lg flex items-center justify-center transition-colors border border-rose-200"
              title="Удалить заказ"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-slate-700">
              {item.dishName} × {item.quantity}
            </span>
            <span className="font-medium text-slate-900">
              {item.price * item.quantity} ₽
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="text-xs text-slate-500">
            +{order.items.length - 3} позиций
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-lg font-semibold text-slate-900">
          {order.totalAmount} ₽
        </div>
        {onStatusChange && (
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
          >
            <option value="new">Новый</option>
            <option value="in_progress">Готовится</option>
            <option value="ready">Готов</option>
            <option value="served">Подано</option>
            <option value="paid">Оплачено</option>
            <option value="cancelled">Отменено</option>
          </select>
        )}
      </div>

      {order.notes && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-xs text-slate-500 italic">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

