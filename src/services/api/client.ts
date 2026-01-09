import { ApiClient, ApiResponse, ApiError } from './types';

/**
 * Базовый API клиент
 * Готов к замене на реальный HTTP клиент (axios, fetch и т.д.)
 */
class BaseApiClient implements ApiClient {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    // const response = await fetch(`${this.baseURL}${url}`);
    // return response.json();
    throw new Error('API client not implemented. Use repositories with LocalStorage.');
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    throw new Error('API client not implemented. Use repositories with LocalStorage.');
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    throw new Error('API client not implemented. Use LocalStorage.');
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    throw new Error('API client not implemented. Use LocalStorage.');
  }
}

export const apiClient = new BaseApiClient();

