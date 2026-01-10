import { Order, OrderStatus } from '../models/Order';
import { getOrderStatusColor, getOrderStatusText } from '../utils/orderStatusColors';

interface OrderCardProps {
  order: Order;
  onClick?: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

/**
 * Карточка заказа
 */
const OrderCard = ({ order, onClick, onStatusChange }: OrderCardProps) => {
  const statusColor = getOrderStatusColor(order.status);
  const statusText = getOrderStatusText(order.status);

  const locationName = order.tableName || order.vipCabinName || 'Не указано';
  const locationIcon = order.tableName ? '🪑' : order.vipCabinName ? '⭐' : '❓';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-200 hover:border-amber-300 transition-all cursor-pointer active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{locationIcon}</span>
            <h3 className="font-bold text-gray-900 text-lg">{locationName}</h3>
          </div>
          <p className="text-sm text-gray-600">
            Заказ #{order.id.slice(-8)}
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor} text-white`}>
          {statusText}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-gray-700">
              {item.dishName} × {item.quantity}
            </span>
            <span className="font-semibold text-gray-900">
              {item.price * item.quantity} ₽
            </span>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="text-xs text-gray-500">
            +{order.items.length - 3} позиций
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-lg font-bold text-gray-900">
          {order.totalAmount} ₽
        </div>
        {onStatusChange && (
          <select
            value={order.status}
            onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderCard;

