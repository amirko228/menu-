/**
 * Модель блюда/напитка в меню
 */
export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number; // Время приготовления в минутах
  allergens?: string[]; // Список аллергенов
  createdAt: string;
  updatedAt: string;
}

