import React from 'react';
import { Package, TrendingUp, ShoppingCart, AlertTriangle, Download, BarChart3 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './StatsCard';

export default function Dashboard() {
  const { 
    dashboardStats, 
    getLowStockProducts, 
    sales, 
    getMonthlyRevenue, 
    getMostSoldProducts, 
    generateExcelReport 
  } = useInventory();
  const { currentUser } = useAuth();
  const lowStockProducts = getLowStockProducts();

  const canViewProfits = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  
  const monthlyRevenue = getMonthlyRevenue();
  const mostSoldProducts = getMostSoldProducts();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={dashboardStats.totalProducts}
          icon={Package}
          color="default"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={dashboardStats.lowStockProducts}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Today's Sales"
          value={dashboardStats.todaySales}
          icon={ShoppingCart}
          color="green"
        />
        {canViewProfits && (
          <StatsCard
            title="Today's Profit"
            value={dashboardStats.todayProfit}
            icon={TrendingUp}
            color="gold"
          />
        )}
      </div>

      {/* Super Admin Analytics */}
      {isSuperAdmin && (
        <>
          {/* Analytics Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-elegant-black flex items-center">
              <BarChart3 className="mr-2" size={20} />
              Analytics & Reports
            </h3>
            <button
              onClick={generateExcelReport}
              className="btn-secondary flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Generate Excel Report</span>
            </button>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="card">
            <h4 className="text-lg font-semibold text-elegant-black mb-4">Monthly Revenue</h4>
            <div className="space-y-3">
              {monthlyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gold-50 rounded-lg">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-gold-700 font-bold">KSh {item.revenue.toLocaleString()}</span>
                </div>
              ))}
              {monthlyRevenue.length === 0 && (
                <p className="text-gray-500 text-center py-4">No revenue data available</p>
              )}
            </div>
          </div>

          {/* Most Sold Products */}
          <div className="card">
            <h4 className="text-lg font-semibold text-elegant-black mb-4">Top Selling Products</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="text-left py-3 px-4">Rank</th>
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Quantity Sold</th>
                    <th className="text-left py-3 px-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mostSoldProducts.map((product, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${
                          index === 0 ? 'bg-gold-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{product.product}</td>
                      <td className="py-3 px-4">{product.quantity} units</td>
                      <td className="py-3 px-4 text-green-600 font-semibold">
                        KSh {product.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mostSoldProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sales data available</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-elegant-black mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={20} />
            Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-elegant-black">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">{product.stock} units left</p>
                  <p className="text-sm text-gray-600">Threshold: {product.stockThreshold}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="card">
        <h3 className="text-lg font-semibold text-elegant-black mb-4">Recent Sales</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Amount</th>
                {canViewProfits && <th className="text-left py-3 px-4">Profit</th>}
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className="border-b border-gray-200">
                  <td className="py-3 px-4 font-medium">{sale.productName}</td>
                  <td className="py-3 px-4">{sale.quantity}</td>
                  <td className="py-3 px-4">KSh {sale.totalAmount.toLocaleString()}</td>
                  {canViewProfits && (
                    <td className="py-3 px-4 text-green-600">
                      KSh {(sale.totalAmount - (sale.unitPrice * 0.67 * sale.quantity)).toLocaleString()}
                    </td>
                  )}
                  <td className="py-3 px-4 text-gray-600">
                    {sale.saleDate.toLocaleDateString()}
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