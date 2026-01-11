import { Dish } from '../models/Dish';

interface DishCardProps {
  dish: Dish;
}

/**
 * Карточка блюда в меню
 */
const DishCard = ({ dish }: DishCardProps) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base font-semibold text-slate-900">{dish.name}</h3>
          <span className="text-lg font-semibold text-slate-900 ml-4">
            {dish.price} ₽
          </span>
        </div>

        {dish.description && (
          <p className="text-sm text-slate-600 mb-2">{dish.description}</p>
        )}

        {dish.allergens && dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
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

        {!dish.isAvailable && (
          <span className="inline-block mt-2 text-xs px-2 py-1 bg-rose-50 text-rose-700 rounded-md border border-rose-200">
            Недоступно
          </span>
        )}
      </div>
    </div>
  );
};

export default DishCard;

