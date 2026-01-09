/**
 * Типы для API запросов
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Базовый интерфейс для API клиента
 */
export interface ApiClient {
  get<T>(url: string): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

