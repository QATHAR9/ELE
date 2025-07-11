import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product, Sale, StockMovement, DashboardStats } from '../types';

interface InventoryContextType {
  products: Product[];
  sales: Sale[];
  stockMovements: StockMovement[];
  dashboardStats: DashboardStats;
  getMonthlyRevenue: () => { month: string; revenue: number }[];
  getMostSoldProducts: () => { product: string; quantity: number; revenue: number }[];
  generateExcelReport: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addSale: (productId: string, quantity: number, soldBy: string) => boolean;
  addStock: (productId: string, quantity: number, performedBy: string) => void;
  getLowStockProducts: () => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Black Suit',
    category: 'Suits',
    buyingPrice: 8000,
    sellingPrice: 12000,
    margin: 4000,
    stock: 5,
    stockThreshold: 10,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Leather Dress Shoes',
    category: 'Shoes',
    buyingPrice: 4000,
    sellingPrice: 6500,
    margin: 2500,
    stock: 15,
    stockThreshold: 8,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Silk Tie Collection',
    category: 'Accessories',
    buyingPrice: 800,
    sellingPrice: 1500,
    margin: 700,
    stock: 3,
    stockThreshold: 12,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

const mockSales: Sale[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Classic Black Suit',
    quantity: 2,
    unitPrice: 12000,
    totalAmount: 24000,
    soldBy: 'Mike Johnson',
    saleDate: new Date('2024-12-01'),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Leather Dress Shoes',
    quantity: 3,
    unitPrice: 6500,
    totalAmount: 19500,
    soldBy: 'Mike Johnson',
    saleDate: new Date('2024-12-15'),
  },
  {
    id: '3',
    productId: '1',
    productName: 'Classic Black Suit',
    quantity: 1,
    unitPrice: 12000,
    totalAmount: 12000,
    soldBy: 'Jane Smith',
    saleDate: new Date('2024-11-20'),
  },
  {
    id: '4',
    productId: '3',
    productName: 'Silk Tie Collection',
    quantity: 5,
    unitPrice: 1500,
    totalAmount: 7500,
    soldBy: 'Mike Johnson',
    saleDate: new Date('2024-11-10'),
  },
  {
    id: '5',
    productId: '2',
    productName: 'Leather Dress Shoes',
    quantity: 2,
    unitPrice: 6500,
    totalAmount: 13000,
    soldBy: 'Jane Smith',
    saleDate: new Date('2024-10-25'),
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      margin: productData.sellingPrice - productData.buyingPrice,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => {
      if (product.id === id) {
        const updated = { ...product, ...updates, updatedAt: new Date() };
        if (updates.buyingPrice || updates.sellingPrice) {
          updated.margin = updated.sellingPrice - updated.buyingPrice;
        }
        return updated;
      }
      return product;
    }));
  };

  const addSale = (productId: string, quantity: number, soldBy: string): boolean => {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock < quantity) {
      return false;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      quantity,
      unitPrice: product.sellingPrice,
      totalAmount: product.sellingPrice * quantity,
      soldBy,
      saleDate: new Date(),
    };

    setSales(prev => [...prev, newSale]);
    
    // Update stock
    updateProduct(productId, { stock: product.stock - quantity });
    
    // Add stock movement
    const movement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type: 'sale',
      quantity: -quantity,
      previousStock: product.stock,
      newStock: product.stock - quantity,
      performedBy: soldBy,
      date: new Date(),
    };
    setStockMovements(prev => [...prev, movement]);

    return true;
  };

  const addStock = (productId: string, quantity: number, performedBy: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const movement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type: 'stock_in',
      quantity,
      previousStock: product.stock,
      newStock: product.stock + quantity,
      performedBy,
      date: new Date(),
    };

    setStockMovements(prev => [...prev, movement]);
    updateProduct(productId, { stock: product.stock + quantity });
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => product.stock <= product.stockThreshold);
  };

  const getMonthlyRevenue = () => {
    const monthlyData: { [key: string]: number } = {};
    
    sales.forEach(sale => {
      const monthKey = sale.saleDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + sale.totalAmount;
    });

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const getMostSoldProducts = () => {
    const productSales: { [key: string]: { quantity: number; revenue: number; name: string } } = {};
    
    sales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { 
          quantity: 0, 
          revenue: 0, 
          name: sale.productName 
        };
      }
      productSales[sale.productId].quantity += sale.quantity;
      productSales[sale.productId].revenue += sale.totalAmount;
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({
        product: data.name,
        quantity: data.quantity,
        revenue: data.revenue
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const generateExcelReport = async () => {
    // Dynamic import to avoid bundling issues
    const XLSX = await import('xlsx');
    
    // Sales data
    const salesData = sales.map(sale => ({
      'Sale ID': sale.id,
      'Product': sale.productName,
      'Quantity': sale.quantity,
      'Unit Price (KSh)': sale.unitPrice,
      'Total Amount (KSh)': sale.totalAmount,
      'Sold By': sale.soldBy,
      'Date': sale.saleDate.toLocaleDateString(),
    }));

    // Products data
    const productsData = products.map(product => ({
      'Product Name': product.name,
      'Category': product.category,
      'Buying Price (KSh)': product.buyingPrice,
      'Selling Price (KSh)': product.sellingPrice,
      'Margin (KSh)': product.margin,
      'Current Stock': product.stock,
      'Stock Threshold': product.stockThreshold,
    }));

    // Monthly revenue data
    const monthlyRevenue = getMonthlyRevenue().map(item => ({
      'Month': item.month,
      'Revenue (KSh)': item.revenue,
    }));

    // Most sold products
    const mostSoldProducts = getMostSoldProducts().map(item => ({
      'Product': item.product,
      'Quantity Sold': item.quantity,
      'Revenue (KSh)': item.revenue,
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add worksheets
    const salesWs = XLSX.utils.json_to_sheet(salesData);
    const productsWs = XLSX.utils.json_to_sheet(productsData);
    const monthlyWs = XLSX.utils.json_to_sheet(monthlyRevenue);
    const topProductsWs = XLSX.utils.json_to_sheet(mostSoldProducts);
    
    XLSX.utils.book_append_sheet(wb, salesWs, 'Sales');
    XLSX.utils.book_append_sheet(wb, productsWs, 'Products');
    XLSX.utils.book_append_sheet(wb, monthlyWs, 'Monthly Revenue');
    XLSX.utils.book_append_sheet(wb, topProductsWs, 'Top Products');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `Gents_Elegante_Report_${date}.xlsx`;
    
    // Save file
    XLSX.writeFile(wb, filename);
  };

  const dashboardStats: DashboardStats = {
    totalProducts: products.length,
    lowStockProducts: getLowStockProducts().length,
    totalSales: sales.reduce((sum, sale) => sum + sale.totalAmount, 0),
    totalProfit: sales.reduce((sum, sale) => {
      const product = products.find(p => p.id === sale.productId);
      return sum + (product ? product.margin * sale.quantity : 0);
    }, 0),
    todaySales: sales
      .filter(sale => sale.saleDate.toDateString() === new Date().toDateString())
      .reduce((sum, sale) => sum + sale.totalAmount, 0),
    todayProfit: sales
      .filter(sale => sale.saleDate.toDateString() === new Date().toDateString())
      .reduce((sum, sale) => {
        const product = products.find(p => p.id === sale.productId);
        return sum + (product ? product.margin * sale.quantity : 0);
      }, 0),
  };

  return (
    <InventoryContext.Provider value={{
      products,
      sales,
      stockMovements,
      dashboardStats,
      getMonthlyRevenue,
      getMostSoldProducts,
      generateExcelReport,
      addProduct,
      updateProduct,
      addSale,
      addStock,
      getLowStockProducts,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}