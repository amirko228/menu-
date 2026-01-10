import { Outlet } from 'react-router-dom';
import InstallPWA from './InstallPWA';

/**
 * Базовый layout для всех страниц
 */
const Layout = () => {
  return (
    <>
      <Outlet />
      <InstallPWA />
    </>
  );
};

export default Layout;

