interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * Компонент отображения ошибки
 */
const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-800 font-medium">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Попробовать снова
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

