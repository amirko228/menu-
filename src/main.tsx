import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/index.css';

// PWA Service Worker регистрация
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('Service Worker зарегистрирован:', registration.scope);
        
        // Проверяем обновления при загрузке страницы
        registration.update();
        
        // Проверяем обновления каждые 30 секунд
        setInterval(() => {
          registration.update();
        }, 30000);

        // Обработка обновления Service Worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Новый Service Worker установлен, перезагружаем страницу
              console.log('Новая версия доступна, перезагрузка...');
              window.location.reload();
            }
          });
        });

        // Слушаем сообщения от Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SW_UPDATED') {
            console.log('Service Worker обновлен, перезагрузка...');
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.error('Ошибка регистрации Service Worker:', error);
      });

    // Обработка контроллера Service Worker
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('Service Worker контроллер изменился, перезагрузка...');
        window.location.reload();
      }
    });
  });
}

// Обработка ошибок рендеринга
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
);

// Глобальная обработка ошибок
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

