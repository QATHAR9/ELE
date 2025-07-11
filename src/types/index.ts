export type UserRole = 'super_admin' | 'admin' | 'sales_staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  sellingPrice: number;
  margin: number;
  stock: number;
  stockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  soldBy: string;
  saleDate: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  performedBy: string;
  date: Date;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalSales: number;
  totalProfit: number;
  todaySales: number;
  todayProfit: number;
}