import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';

interface EditableVipCabinCardProps {
  cabin: VipCabin;
  isEditMode: boolean;
  onDragStart: (e: React.DragEvent, cabinId: string) => void;
  onDragEnd: () => void;
  onEdit: (cabinId: string) => void;
  onDelete: (cabinId: string) => void;
  onDrop: (cabinId: string) => void;
  onClick?: () => void;
}

/**
 * Редактируемая карточка VIP-кабины с drag & drop
 */
const EditableVipCabinCard = ({
  cabin,
  isEditMode,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onDrop,
  onClick,
}: EditableVipCabinCardProps) => {
  const statusColor = getVipCabinStatusColor(cabin.status);
  const statusText = getVipCabinStatusText(cabin.status);

  return (
    <div
      draggable={isEditMode}
      onDragStart={(e) => onDragStart(e, cabin.id)}
      onDragEnd={onDragEnd}
      onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
      onDrop={
        isEditMode
          ? (e) => {
              e.preventDefault();
              e.stopPropagation(); // чтобы контейнер не обрабатывал drop и не отправлял в конец
              onDrop(cabin.id);
            }
          : undefined
      }
      onClick={onClick}
      className={`
        relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-md p-4
        transition-all hover:shadow-lg
        border-2 ${isEditMode ? 'border-purple-400 cursor-move' : 'border-purple-200'}
        ${isEditMode ? 'hover:border-purple-600' : 'hover:border-purple-400'}
        min-w-[160px] min-h-[140px] flex flex-col items-center justify-center
        ${isEditMode ? '' : 'cursor-pointer hover:scale-105'}
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${statusColor}`} />

      {/* Кнопки редактирования/удаления в режиме редактирования */}
      {isEditMode && (
        <div className="absolute top-2 left-2 flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cabin.id);
            }}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cabin.id);
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Иконка VIP */}
      <div className="text-2xl mb-2">⭐</div>

      {/* Название кабины */}
      <h3 className="text-lg font-bold text-purple-800 mb-1">{cabin.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2`}
      >
        {statusText}
      </span>

      {/* Вместимость */}
      <div className="text-sm text-purple-700">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>

      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-purple-600 mt-1">{cabin.pricePerHour} ₽/час</div>
      )}

      {/* Индикатор drag в режиме редактирования */}
      {isEditMode && (
        <div className="absolute bottom-2 text-xs text-gray-400">Перетащите</div>
      )}
    </div>
  );
};

export default EditableVipCabinCard;

