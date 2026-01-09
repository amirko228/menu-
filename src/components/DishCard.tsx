import { Dish } from '../models/Dish';

interface DishCardProps {
  dish: Dish;
}

/**
 * Карточка блюда в меню
 */
const DishCard = ({ dish }: DishCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{dish.name}</h3>
          <span className="text-xl font-semibold text-gray-900 ml-4">
            {dish.price} ₽
          </span>
        </div>

        {dish.description && (
          <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
        )}

        {dish.allergens && dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dish.allergens.map((allergen, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
              >
                {allergen}
              </span>
            ))}
          </div>
        )}

        {!dish.isAvailable && (
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
            Недоступно
          </span>
        )}
      </div>
    </div>
  );
};

export default DishCard;

