import { useState } from 'react';

interface ReservationFormProps {
  itemName: string;
  itemType: 'table' | 'vip_cabin';
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

/**
 * Форма для установки времени бронирования
 */
const ReservationForm = ({ itemName, itemType, onConfirm, onCancel }: ReservationFormProps) => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(`${date} ${time}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Бронирование {itemType === 'table' ? 'стола' : 'VIP-кабины'}
        </h2>
        <p className="text-gray-600 mb-4">
          <span className="font-semibold">{itemName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Время <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Забронировать
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

export default ReservationForm;

