import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { dishesRepository, categoriesRepository } from '../services';
import { Dish, Category } from '../models';

/**
 * Страница поиска блюд
 */
const SearchDishPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    setDishes(dishesRepository.getAll());
    setCategories(categoriesRepository.getAll());
  }, []);

  // Фильтрация блюд
  const filteredDishes = useMemo(() => {
    let filtered = [...dishes];

    // Фильтр по категории
    if (selectedCategoryId !== 'all') {
      filtered = filtered.filter((dish) => dish.categoryId === selectedCategoryId);
    }

    // Фильтр по названию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((dish) =>
        dish.name.toLowerCase().includes(query) ||
        dish.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategoryId, dishes]);

  // Получение категории по ID
  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Поиск блюда</h1>
        
        {/* Панель фильтров */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Поле поиска */}
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Поиск по названию или составу
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите название блюда или ингредиент..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Фильтр по категориям */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategoryId === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Все категории
              </button>
              {categories
                .filter((cat) => cat.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      selectedCategoryId === category.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon && <span>{category.icon}</span>}
                    {category.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Результаты поиска */}
        <div className="mb-4">
          <p className="text-gray-600">
            Найдено блюд: <span className="font-semibold">{filteredDishes.length}</span>
          </p>
        </div>

        {/* Список блюд */}
        {filteredDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDishes.map((dish) => {
              const category = getCategoryById(dish.categoryId);
              return (
                <div
                  key={dish.id}
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
                >
                  {/* Категория */}
                  {category && (
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon && <span>{category.icon}</span>}
                      <span className="text-xs text-gray-500">{category.name}</span>
                    </div>
                  )}

                  {/* Название */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {dish.name}
                  </h3>

                  {/* Цена */}
                  <div className="mb-3">
                    <span className="text-xl font-bold text-amber-600">
                      {dish.price} ₽
                    </span>
                  </div>

                  {/* Состав (описание) */}
                  {dish.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">{dish.description}</p>
                    </div>
                  )}

                  {/* Аллергены */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                      {dish.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Статус доступности */}
                  {!dish.isAvailable && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                        Недоступно
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-600 text-lg">
              Блюда не найдены
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchDishPage;

