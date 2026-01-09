import { Category, Dish } from '../models';
import DishCard from './DishCard';

interface CategorySectionProps {
  category: Category;
  dishes: Dish[];
}

/**
 * Секция категории с блюдами
 */
const CategorySection = ({ category, dishes }: CategorySectionProps) => {
  if (dishes.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        {category.icon && <span className="text-3xl">{category.icon}</span>}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
          {category.description && (
            <p className="text-sm text-gray-600">{category.description}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

