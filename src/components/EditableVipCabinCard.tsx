import { VipCabin } from '../models/VipCabin';
import { getVipCabinStatusColor, getVipCabinStatusText } from '../utils/statusColors';
import { useTouchDrag } from '../hooks/useTouchDrag';
import { VipIcon, EditIcon, TrashIcon } from './icons/Icons';

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

  // Touch drag для мобильных устройств
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchDrag(
    (id) => {
      // Для touch событий просто вызываем onDragStart с минимальными данными
      // Создаем минимальный объект события
      const syntheticEvent = {
        dataTransfer: {
          effectAllowed: 'move' as DataTransfer['effectAllowed'],
          setData: () => {},
        },
      } as unknown as React.DragEvent;
      onDragStart(syntheticEvent, id);
    },
    onDragEnd,
    onDrop
  );

  return (
    <div
      draggable={isEditMode}
      data-drag-id={cabin.id}
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
      onTouchStart={isEditMode ? (e) => handleTouchStart(e, cabin.id) : undefined}
      onTouchMove={isEditMode ? handleTouchMove : undefined}
      onTouchEnd={isEditMode ? handleTouchEnd : undefined}
      onClick={onClick}
      className={`
        relative bg-white rounded-xl p-5
        transition-all
        border ${isEditMode ? 'border-violet-300 cursor-move' : 'border-slate-200'}
        ${isEditMode ? 'hover:border-violet-400' : 'hover:border-slate-300'}
        min-w-[160px] min-h-[140px] flex flex-col items-center justify-center
        ${isEditMode ? '' : 'cursor-pointer'}
      `}
    >
      {/* Индикатор статуса */}
      <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${statusColor.split(' ')[0]}`} />

      {/* Кнопки редактирования/удаления в режиме редактирования */}
      {isEditMode && (
        <div className="absolute top-3 left-3 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cabin.id);
            }}
            className="p-1.5 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 border border-sky-200 transition-colors"
            title="Редактировать"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cabin.id);
            }}
            className="p-1.5 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 border border-rose-200 transition-colors"
            title="Удалить"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Иконка VIP */}
      <div className="mb-2 text-amber-500">
        <VipIcon className="w-6 h-6" />
      </div>

      {/* Название кабины */}
      <h3 className="text-base font-semibold text-slate-900 mb-2">{cabin.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2.5 py-1 rounded-md border font-medium mb-2 ${statusColor}`}
      >
        {statusText}
      </span>

      {/* Вместимость */}
      <div className="text-sm text-slate-600">
        <span className="font-medium">{cabin.capacity}</span> мест
      </div>

      {/* Стоимость за час, если указана */}
      {cabin.pricePerHour && (
        <div className="text-xs text-slate-500 mt-1">{cabin.pricePerHour} ₽/час</div>
      )}

      {/* Индикатор drag в режиме редактирования */}
      {isEditMode && (
        <div className="absolute bottom-2 text-xs text-slate-400">Перетащите</div>
      )}
    </div>
  );
};

export default EditableVipCabinCard;

