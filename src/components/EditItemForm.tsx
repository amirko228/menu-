import { useState, useEffect } from 'react';

interface EditItemFormProps {
  type: 'table' | 'vip_cabin';
  item: {
    id: string;
    name: string;
    capacity: number;
    location?: string;
    pricePerHour?: number;
  };
  onSave: (data: {
    name: string;
    capacity: number;
    location?: string;
    pricePerHour?: number;
  }) => void;
  onCancel: () => void;
}

/**
 * Форма редактирования стола или VIP-кабины
 */
const EditItemForm = ({ type, item, onSave, onCancel }: EditItemFormProps) => {
  const [formData, setFormData] = useState({
    name: item.name,
    capacity: item.capacity,
    location: item.location || '',
    pricePerHour: item.pricePerHour || 0,
  });

  useEffect(() => {
    setFormData({
      name: item.name,
      capacity: item.capacity,
      location: item.location || '',
      pricePerHour: item.pricePerHour || 0,
    });
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Редактировать {type === 'table' ? 'стол' : 'VIP-кабину'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество мест <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max={type === 'table' ? '20' : '50'}
              required
            />
          </div>

          {type === 'table' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Расположение
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Зал">Зал</option>
                <option value="Терраса">Терраса</option>
                <option value="VIP">VIP</option>
                <option value="Другое">Другое</option>
              </select>
            </div>
          )}

          {type === 'vip_cabin' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Стоимость за час (₽)
                </label>
                <input
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerHour: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Расположение
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                type === 'table'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;

