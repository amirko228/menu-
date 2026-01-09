import { Table } from '../models/Table';
import { getTableStatusColor, getTableStatusText } from '../utils/statusColors';

interface EditableTableCardProps {
  table: Table;
  isEditMode: boolean;
  onDragStart: (e: React.DragEvent, tableId: string) => void;
  onDragEnd: () => void;
  onEdit: (tableId: string) => void;
  onDelete: (tableId: string) => void;
  onDrop: (tableId: string) => void;
  onClick?: () => void;
}

/**
 * Редактируемая карточка стола с drag & drop
 */
const EditableTableCard = ({
  table,
  isEditMode,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onDrop,
  onClick,
}: EditableTableCardProps) => {
  const statusColor = getTableStatusColor(table.status);
  const statusText = getTableStatusText(table.status);

  return (
    <div
      draggable={isEditMode}
      onDragStart={(e) => onDragStart(e, table.id)}
      onDragEnd={onDragEnd}
      onDragOver={isEditMode ? (e) => e.preventDefault() : undefined}
      onDrop={
        isEditMode
          ? (e) => {
              e.preventDefault();
              e.stopPropagation(); // чтобы контейнер не обрабатывал drop и не отправлял в конец
              onDrop(table.id);
            }
          : undefined
      }
      onClick={onClick}
      className={`
        relative bg-white rounded-xl shadow-md p-4
        transition-all hover:shadow-lg
        border-2 ${isEditMode ? 'border-blue-300 cursor-move' : 'border-transparent'}
        ${isEditMode ? 'hover:border-blue-500' : 'hover:border-amber-300'}
        min-w-[140px] min-h-[120px] flex flex-col items-center justify-center
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
              onEdit(table.id);
            }}
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(table.id);
            }}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      )}

      {/* Название стола */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{table.name}</h3>

      {/* Статус */}
      <span
        className={`text-xs px-2 py-1 rounded-full ${statusColor} text-white font-medium mb-2`}
      >
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

      {/* Индикатор drag в режиме редактирования */}
      {isEditMode && (
        <div className="absolute bottom-2 text-xs text-gray-400">Перетащите</div>
      )}
    </div>
  );
};

export default EditableTableCard;

