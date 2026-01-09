import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { Dish, Category } from '../models';
import { dishesRepository, categoriesRepository } from '../services';

/**
 * Страница управления меню (CRUD операции)
 */
const ManageMenuPage = () => {
  // Состояние для блюд и категорий
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    setDishes(dishesRepository.getAll());
    setCategories(categoriesRepository.getAll());
  }, []);

  // Состояние для формы блюда
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });

  // Состояние для формы категории
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: '',
  });

  // Состояние для модальных окон
  const [showDishModal, setShowDishModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteDishConfirm, setShowDeleteDishConfirm] = useState<string | null>(null);
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState<string | null>(null);

  // Группировка блюд по категориям
  const dishesByCategory = useMemo(() => {
    const grouped: Record<string, Dish[]> = {};
    dishes.forEach((dish) => {
      if (!grouped[dish.categoryId]) {
        grouped[dish.categoryId] = [];
      }
      grouped[dish.categoryId].push(dish);
    });
    return grouped;
  }, [dishes]);

  // Открытие формы добавления блюда
  const handleAddDish = () => {
    setEditingDish(null);
    setDishForm({
      name: '',
      description: '',
      price: '',
      categoryId: categories[0]?.id || '',
    });
    setShowDishModal(true);
  };

  // Открытие формы редактирования блюда
  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      description: dish.description || '',
      price: dish.price.toString(),
      categoryId: dish.categoryId,
    });
    setShowDishModal(true);
  };

  // Сохранение блюда
  const handleSaveDish = () => {
    if (!dishForm.name.trim() || !dishForm.price || !dishForm.categoryId) {
      alert('Заполните все обязательные поля');
      return;
    }

    const price = parseFloat(dishForm.price);
    if (isNaN(price) || price <= 0) {
      alert('Введите корректную цену');
      return;
    }

    if (editingDish) {
      // Редактирование
      const updatedDish: Dish = {
        ...editingDish,
        name: dishForm.name.trim(),
        description: dishForm.description.trim() || undefined,
        price,
        categoryId: dishForm.categoryId,
        updatedAt: new Date().toISOString(),
      };
      dishesRepository.update(updatedDish);
      setDishes(dishesRepository.getAll());
    } else {
      // Добавление
      const newDish: Dish = {
        id: `dish-${Date.now()}`,
        name: dishForm.name.trim(),
        description: dishForm.description.trim() || undefined,
        price,
        categoryId: dishForm.categoryId,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dishesRepository.add(newDish);
      setDishes(dishesRepository.getAll());
    }

    setShowDishModal(false);
    setEditingDish(null);
    setDishForm({ name: '', description: '', price: '', categoryId: '' });
  };

  // Удаление блюда
  const handleDeleteDish = (dishId: string) => {
    dishesRepository.delete(dishId);
    setDishes(dishesRepository.getAll());
    setShowDeleteDishConfirm(null);
  };

  // Открытие формы добавления категории
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      icon: '',
    });
    setShowCategoryModal(true);
  };

  // Открытие формы редактирования категории
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
    });
    setShowCategoryModal(true);
  };

  // Сохранение категории
  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      alert('Введите название категории');
      return;
    }

    if (editingCategory) {
      // Редактирование
      const updatedCategory: Category = {
        ...editingCategory,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        icon: categoryForm.icon.trim() || undefined,
        updatedAt: new Date().toISOString(),
      };
      categoriesRepository.update(updatedCategory);
      setCategories(categoriesRepository.getAll());
    } else {
      // Добавление
      const maxSortOrder = Math.max(...categories.map((c) => c.sortOrder), 0);
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() || undefined,
        icon: categoryForm.icon.trim() || undefined,
        sortOrder: maxSortOrder + 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      categoriesRepository.add(newCategory);
      setCategories(categoriesRepository.getAll());
    }

    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', icon: '' });
  };

  // Удаление категории
  const handleDeleteCategory = (categoryId: string) => {
    // Проверка, есть ли блюда в категории
    const dishesInCategory = dishes.filter((dish) => dish.categoryId === categoryId);
    if (dishesInCategory.length > 0) {
      alert(
        `Нельзя удалить категорию, в которой есть блюда (${dishesInCategory.length} шт.). Сначала удалите или переместите блюда.`
      );
      setShowDeleteCategoryConfirm(null);
      return;
    }

    categoriesRepository.delete(categoryId);
    setCategories(categoriesRepository.getAll());
    setShowDeleteCategoryConfirm(null);
  };

  // Получение категории по ID
  const getCategoryById = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId);
  };

  // Сортировка категорий
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Управление меню</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAddDish}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              + Добавить блюдо
            </button>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              + Добавить категорию
            </button>
          </div>
        </div>

        {/* Управление категориями */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Категории</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedCategories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {category.icon && <span className="text-2xl">{category.icon}</span>}
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Редактировать"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteCategoryConfirm(category.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Удалить"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  Блюд в категории: {dishesByCategory[category.id]?.length || 0}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Список блюд */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Блюда</h2>
          {sortedCategories.map((category) => {
            const categoryDishes = dishesByCategory[category.id] || [];
            if (categoryDishes.length === 0) return null;

            return (
              <div key={category.id} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {category.icon && <span className="text-xl">{category.icon}</span>}
                  <h3 className="text-lg font-semibold text-gray-700">{category.name}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{dish.name}</h4>
                          <p className="text-lg font-semibold text-gray-900 mb-2">{dish.price} ₽</p>
                          {dish.description && (
                            <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEditDish(dish)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            title="Редактировать"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => setShowDeleteDishConfirm(dish.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Удалить"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">В стоп-листе</span>
                        <button
                          onClick={() => {
                            const updatedDish: Dish = {
                              ...dish,
                              isAvailable: !dish.isAvailable,
                              updatedAt: new Date().toISOString(),
                            };
                            dishesRepository.update(updatedDish);
                            setDishes(dishesRepository.getAll());
                          }}
                          className={`px-2 py-1 text-xs rounded-full border ${
                            dish.isAvailable
                              ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              : 'bg-gray-900 text-white border-gray-900'
                          }`}
                        >
                          {dish.isAvailable ? 'Нет' : 'Да'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Модальное окно формы блюда */}
        {showDishModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editingDish ? 'Редактировать блюдо' : 'Добавить блюдо'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Категория <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dishForm.categoryId}
                      onChange={(e) => setDishForm({ ...dishForm, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    >
                      <option value="">Выберите категорию</option>
                      {sortedCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dishForm.name}
                      onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Введите название блюда"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Цена (₽) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={dishForm.price}
                      onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Состав (описание)
                    </label>
                    <textarea
                      value={dishForm.description}
                      onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Опишите состав блюда"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleSaveDish}
                    className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setShowDishModal(false);
                      setEditingDish(null);
                      setDishForm({ name: '', description: '', price: '', categoryId: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно формы категории */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Введите название категории"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Описание
                    </label>
                    <input
                      type="text"
                      value={categoryForm.description}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, description: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Краткое описание категории"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Иконка (emoji)
                    </label>
                    <input
                      type="text"
                      value={categoryForm.icon}
                      onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="🥗"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={handleSaveCategory}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                      setCategoryForm({ name: '', description: '', icon: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Подтверждение удаления блюда */}
        {showDeleteDishConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Удалить блюдо?</h3>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите удалить это блюдо? Это действие нельзя отменить.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteDish(showDeleteDishConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Удалить
                </button>
                <button
                  onClick={() => setShowDeleteDishConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Подтверждение удаления категории */}
        {showDeleteCategoryConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Удалить категорию?</h3>
              <p className="text-gray-600 mb-6">
                Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDeleteCategory(showDeleteCategoryConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Удалить
                </button>
                <button
                  onClick={() => setShowDeleteCategoryConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageMenuPage;

