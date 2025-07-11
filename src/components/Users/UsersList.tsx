import React, { useState } from 'react';
import { Plus, Edit, Shield, User, Crown } from 'lucide-react';
import { UserRole } from '../../types';

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@gentselegante.com',
    role: 'super_admin' as UserRole,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'manager@gentselegante.com',
    role: 'admin' as UserRole,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'sales@gentselegante.com',
    role: 'sales_staff' as UserRole,
    createdAt: new Date('2024-01-03'),
  },
];

export default function UsersList() {
  const [users] = useState(mockUsers);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="text-gold-500" size={18} />;
      case 'admin':
        return <Shield className="text-blue-500" size={18} />;
      case 'sales_staff':
        return <User className="text-green-500" size={18} />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (role) {
      case 'super_admin':
        return `${baseClasses} bg-gold-100 text-gold-800`;
      case 'admin':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'sales_staff':
        return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-elegant-black">Users</h2>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-elegant-black">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadge(user.role)}>
                        {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-gold-600 hover:text-gold-700 transition-colors">
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}