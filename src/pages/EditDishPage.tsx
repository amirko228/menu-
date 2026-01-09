import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mockDishes } from '../data/mockData';

/**
 * Страница редактирования блюда
 */
const EditDishPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const dish = mockDishes.find((d) => d.id === id);

  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Блюдо не найдено</p>
            <button
              onClick={() => navigate('/menu')}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Вернуться в меню
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Редактирование блюда
            </h1>
            <button
              onClick={() => navigate('/menu')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              ← Назад
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название
              </label>
              <input
                type="text"
                defaultValue={dish.name}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание
              </label>
              <textarea
                defaultValue={dish.description}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Цена (₽)
              </label>
              <input
                type="number"
                defaultValue={dish.price}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                readOnly
              />
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Форма редактирования будет реализована на следующих этапах
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditDishPage;
