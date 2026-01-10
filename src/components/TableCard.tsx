import { Table } from '../models/Table';
import { getTableStatusColor, getTableStatusText } from '../utils/statusColors';

interface TableCardProps {
  table: Table;
  onClick?: () => void;
  hasActiveOrder?: boolean;
}

/**
 * Карточка стола для визуальной схемы зала
 */
const TableCard = ({ table, onClick, hasActiveOrder }: TableCardProps) => {
  const statusColor = getTableStatusColor(table.status);
  const statusText = getTableStatusText(table.status);

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-lg border-2 ${hasActiveOrder ? 'border-amber-400 shadow-md' : 'border-gray-200'} p-4 cursor-pointer
        transition-all hover:border-amber-300 hover:shadow-md active:scale-[0.99]
        min-w-[140px] min-h-[120px] flex flex-col items-center justify-center
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
      
      {/* Название стола */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{table.name}</h3>
      
      {/* Статус */}
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2`}>
        {statusText}
      </span>
      
      {/* Вместимость */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{table.capacity}</span> мест
      </div>
      
      {/* Расположение, если указано */}
      {table.location && (
        <div className="text-xs text-gray-500 mt-1">{table.location}</div>
      )}
    </div>
  );
};

export default TableCard;

