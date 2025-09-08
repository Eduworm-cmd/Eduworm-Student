import Header from '../Header/Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
