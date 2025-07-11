import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@gentselegante.com',
    role: 'super_admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'manager@gentselegante.com',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'sales@gentselegante.com',
    role: 'sales_staff',
    createdAt: new Date(),
  },
];

// Mock credentials for demo
const mockCredentials = [
  { email: 'admin@gentselegante.com', password: 'admin123' },
  { email: 'manager@gentselegante.com', password: 'manager123' },
  { email: 'sales@gentselegante.com', password: 'sales123' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login validation
    const validCredential = mockCredentials.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (validCredential) {
      const user = mockUsers.find(u => u.email === email);
      setCurrentUser(user || null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const user = mockUsers.find(u => u.role === role);
    setCurrentUser(user || null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}