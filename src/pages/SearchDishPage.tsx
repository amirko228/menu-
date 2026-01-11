import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { SearchIcon } from '../components/icons/Icons';
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
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight mb-6">Поиск блюда</h1>
        
        {/* Панель фильтров */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-slate-200">
          {/* Поле поиска */}
          <div className="mb-4">
            <label htmlFor="search" className="block text-sm font-medium text-slate-700 mb-2">
              Поиск по названию или составу
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите название блюда или ингредиент..."
                className="w-full px-4 py-3 pl-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-slate-400 bg-white text-slate-900"
              />
              <SearchIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Фильтр по категориям */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Категория
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategoryId === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
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
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedCategoryId === category.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
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
          <p className="text-slate-600 text-sm">
            Найдено блюд: <span className="font-medium">{filteredDishes.length}</span>
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
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-all"
                >
                  {/* Категория */}
                  {category && (
                    <div className="flex items-center gap-2 mb-2">
                      {category.icon && <span className="text-sm">{category.icon}</span>}
                      <span className="text-xs text-slate-500 uppercase tracking-wide">{category.name}</span>
                    </div>
                  )}

                  {/* Название */}
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {dish.name}
                  </h3>

                  {/* Цена */}
                  <div className="mb-3">
                    <span className="text-lg font-semibold text-slate-900">
                      {dish.price} ₽
                    </span>
                  </div>

                  {/* Состав (описание) */}
                  {dish.description && (
                    <div className="mb-3">
                      <p className="text-sm text-slate-600">{dish.description}</p>
                    </div>
                  )}

                  {/* Аллергены */}
                  {dish.allergens && dish.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100">
                      {dish.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-200"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Статус доступности */}
                  {!dish.isAvailable && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-xs px-2 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
                        Недоступно
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
            <SearchIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-700 text-base font-medium">
              Блюда не найдены
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Попробуйте изменить параметры поиска
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchDishPage;

