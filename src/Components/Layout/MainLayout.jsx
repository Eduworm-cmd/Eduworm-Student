import React from 'react'
import Header from '../Header/Header'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <div className="">
        <Header />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout
