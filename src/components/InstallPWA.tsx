import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Компонент для установки PWA на мобильных устройствах
 */
const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Проверка, установлено ли приложение
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Проверка, был ли баннер показан ранее
    const bannerShown = localStorage.getItem('pwa-banner-shown');
    if (bannerShown) {
      return;
    }

    // Показываем баннер через 3 секунды после загрузки
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    // Обработчик события beforeinstallprompt (Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Проверка установки после события appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      localStorage.setItem('pwa-banner-shown', 'true');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Chrome/Edge - показываем встроенный промпт
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowBanner(false);
      }
      
      setDeferredPrompt(null);
      localStorage.setItem('pwa-banner-shown', 'true');
    } else {
      // Для других браузеров показываем инструкции
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);

      if (isIOS) {
        alert(
          'Для установки:\n' +
          '1. Нажмите кнопку "Поделиться" (квадрат со стрелкой)\n' +
          '2. Выберите "На экран «Домой»"\n' +
          '3. Подтвердите установку'
        );
      } else if (isAndroid) {
        alert(
          'Для установки:\n' +
          '1. Откройте меню браузера (три точки)\n' +
          '2. Выберите "Добавить на главный экран" или "Установить приложение"\n' +
          '3. Подтвердите установку'
        );
      }
      localStorage.setItem('pwa-banner-shown', 'true');
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-shown', 'true');
  };

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-amber-300 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white text-2xl">
              📱
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Установить приложение</h3>
              <p className="text-xs text-gray-600">Работайте офлайн и быстрее</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Установить
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;

