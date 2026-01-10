import { ApiClient, ApiResponse } from './types';

/**
 * Базовый API клиент
 * Готов к замене на реальный HTTP клиент (axios, fetch и т.д.)
 */
class BaseApiClient implements ApiClient {
  private readonly _baseURL: string;

  constructor(baseURL: string = '/api') {
    this._baseURL = baseURL;
  }

  async get<T>(_url: string): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    // const response = await fetch(`${this._baseURL}${_url}`);
    // return response.json();
    void this._baseURL; // Зарезервировано для будущего использования
    throw new Error('API client not implemented. Use repositories with LocalStorage.');
  }

  async post<T>(_url: string, _data?: unknown): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    // const response = await fetch(`${this._baseURL}${_url}`, {
    //   method: 'POST',
    //   body: JSON.stringify(_data),
    // });
    // return response.json();
    void this._baseURL; // Зарезервировано для будущего использования
    throw new Error('API client not implemented. Use repositories with LocalStorage.');
  }

  async put<T>(_url: string, _data?: unknown): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    // const response = await fetch(`${this._baseURL}${_url}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(_data),
    // });
    // return response.json();
    void this._baseURL; // Зарезервировано для будущего использования
    throw new Error('API client not implemented. Use LocalStorage.');
  }

  async delete<T>(_url: string): Promise<ApiResponse<T>> {
    // TODO: Заменить на реальный HTTP запрос
    // const response = await fetch(`${this._baseURL}${_url}`, {
    //   method: 'DELETE',
    // });
    // return response.json();
    void this._baseURL; // Зарезервировано для будущего использования
    throw new Error('API client not implemented. Use LocalStorage.');
  }
}

export const apiClient = new BaseApiClient();

