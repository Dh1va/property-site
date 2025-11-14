import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Menu } from 'lucide-react';

export default function SellerLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('name');
    navigate('/seller/login');
  };
  return (
    <div className="flex">
      <Sidebar role="seller" />
      <div className="flex-1 min-h-screen">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3"><button className="md:hidden p-2 rounded border"><Menu className="w-4 h-4"/></button><h1 className="text-lg font-semibold">Seller</h1></div>
          <div><button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white">Logout</button></div>
        </header>
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  );
}
