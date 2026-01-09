import { Link, useLocation } from 'react-router-dom';

/**
 * Минималистичная верхняя панель с навигацией
 */
const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Схема зала', icon: '🏠' },
    { to: '/menu', label: 'Меню', icon: '📋' },
    { to: '/search', label: 'Поиск', icon: '🔍' },
    { to: '/reservations', label: 'Брони', icon: '📅' },
    { to: '/manage-menu', label: 'Управление', icon: '⚙️' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Ресторан &quot;Вкусная Еда&quot;
          </h1>

          <nav className="flex gap-1 flex-wrap">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium
                    min-h-[40px] flex items-center justify-center gap-1.5
                    touch-manipulation active:scale-[0.97]
                    ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

