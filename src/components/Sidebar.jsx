import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusSquare, Users } from 'lucide-react';

export default function Sidebar({ role = 'seller' }) {
  const adminMenu = [
    { key: 'properties', label: 'All Properties', to: '/admin/properties', icon: <Home className="w-5 h-5" /> },
    { key: 'add', label: 'Add Property', to: '/admin/add', icon: <PlusSquare className="w-5 h-5" /> },
    { key: 'sellers', label: 'Manage Sellers', to: '/admin/sellers', icon: <Users className="w-5 h-5" /> },
  ];
  const sellerMenu = [
    { key: 'my-properties', label: 'My Properties', to: '/seller/properties', icon: <Home className="w-5 h-5" /> },
    { key: 'add', label: 'Add Property', to: '/seller/add', icon: <PlusSquare className="w-5 h-5" /> },
  ];
  const menu = role === 'admin' ? adminMenu : sellerMenu;

  return (
    <aside className="w-72 min-h-screen bg-white border-r p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">{role === 'admin' ? 'Admin' : 'Seller'} Dashboard</h2>
        <p className="text-sm text-gray-500">Quick links</p>
      </div>

      <nav className="space-y-1">
        {menu.map(item => (
          <Link key={item.key} to={item.to} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 text-xs text-gray-500">Role: {role}</div>
    </aside>
  );
}
