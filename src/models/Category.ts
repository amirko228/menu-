/**
 * Модель категории меню
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  icon?: string; // Иконка категории (emoji или путь к изображению)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

