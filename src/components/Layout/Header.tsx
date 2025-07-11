import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { getLowStockProducts } = useInventory();
  const lowStockCount = getLowStockProducts().length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-elegant-black">{title}</h1>
          <p className="text-gray-600">Manage your inventory efficiently</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-600 hover:text-elegant-black transition-colors">
              <Bell size={20} />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {lowStockCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}