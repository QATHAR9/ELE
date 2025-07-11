import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'sales_staff'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['super_admin', 'admin'] },
    { id: 'stock-in', label: 'Stock In', icon: TrendingUp, roles: ['super_admin', 'admin'] },
    { id: 'sales', label: 'Sales', icon: ShoppingCart, roles: ['super_admin', 'admin', 'sales_staff'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['super_admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['super_admin', 'admin', 'sales_staff'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <div className="w-64 bg-elegant-black text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          <span className="text-gold-500">Gents</span> by Elegante
        </h1>
        <p className="text-gray-400 text-sm mt-1">Inventory Management</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {currentUser?.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-gray-400 text-sm capitalize">
              {currentUser?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-gold-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}