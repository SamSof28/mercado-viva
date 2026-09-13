import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const POSLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div className="pl-sidebar-width">
        <main className="w-full pt-16 bg-surface min-h-screen px-gutter-desktop py-space-6">
          <div className="flex flex-col w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
