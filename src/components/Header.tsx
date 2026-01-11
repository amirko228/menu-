import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, OrdersIcon, MenuIcon, SearchIcon, CalendarIcon, SettingsIcon } from './icons/Icons';

/**
 * Минималистичная верхняя панель с навигацией
 */
const Header = () => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Схема зала', icon: HomeIcon },
    { to: '/orders', label: 'Заказы', icon: OrdersIcon },
    { to: '/menu', label: 'Меню', icon: MenuIcon },
    { to: '/search', label: 'Поиск', icon: SearchIcon },
    { to: '/reservations', label: 'Брони', icon: CalendarIcon },
    { to: '/manage-menu', label: 'Управление', icon: SettingsIcon },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-lg sm:text-xl font-medium text-slate-900 tracking-tight">
            Ресторан &quot;Вкусная Еда&quot;
          </h1>

          <nav className="flex gap-1 flex-wrap">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              const Icon = link.icon;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                    min-h-[40px] flex items-center justify-center gap-2
                    touch-manipulation active:scale-[0.97]
                    ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
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

