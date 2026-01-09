import { useState, useEffect } from 'react';

/**
 * Хук для загрузки данных с обработкой состояния загрузки и ошибок
 */
export function useDataLoader<T>(
  loadFn: () => T[],
  dependencies: unknown[] = []
): {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  reload: () => void;
} {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedData = loadFn();
      setData(loadedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Ошибка загрузки данных'));
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    reload: loadData,
  };
}

