import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import { dishesRepository, categoriesRepository } from '../services';
import { Dish, Category } from '../models';

/**
 * Страница управления меню
 */
const MenuPage = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Загрузка данных при монтировании
  useEffect(() => {
    setDishes(dishesRepository.getAll());
    setCategories(categoriesRepository.getAll());
  }, []);

  // Группируем блюда по категориям
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

  // Сортируем категории по sortOrder
  const sortedCategories = useMemo(() => {
    return [...categories]
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Меню</h1>
        </div>
        
        {sortedCategories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            dishes={dishesByCategory[category.id] || []}
          />
        ))}
      </main>
    </div>
  );
};

export default MenuPage;

