import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import TablesPage from './pages/TablesPage';
import VipCabinsPage from './pages/VipCabinsPage';
import ReservationsPage from './pages/ReservationsPage';
import MenuPage from './pages/MenuPage';
import EditDishPage from './pages/EditDishPage';
import SearchDishPage from './pages/SearchDishPage';
import ManageMenuPage from './pages/ManageMenuPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';

/**
 * Конфигурация маршрутов приложения
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TablesPage />,
      },
      {
        path: 'tables',
        element: <TablesPage />,
      },
      {
        path: 'vip-cabins',
        element: <VipCabinsPage />,
      },
      {
        path: 'reservations',
        element: <ReservationsPage />,
      },
      {
        path: 'menu',
        element: <MenuPage />,
      },
      {
        path: 'menu/edit/:id',
        element: <EditDishPage />,
      },
      {
        path: 'search',
        element: <SearchDishPage />,
      },
      {
        path: 'manage-menu',
        element: <ManageMenuPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

