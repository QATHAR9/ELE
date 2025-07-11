import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import SaleForm from './SaleForm';

export default function SalesList() {
  const { sales } = useInventory();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const canViewProfits = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-elegant-black">Sales</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Sale</span>
        </button>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-4">Sale ID</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Quantity</th>
                <th className="text-left py-3 px-4">Unit Price</th>
                <th className="text-left py-3 px-4">Total Amount</th>
                {canViewProfits && <th className="text-left py-3 px-4">Profit</th>}
                <th className="text-left py-3 px-4">Sold By</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">#{sale.id}</td>
                  <td className="py-3 px-4 font-medium">{sale.productName}</td>
                  <td className="py-3 px-4">{sale.quantity}</td>
                  <td className="py-3 px-4">KSh {sale.unitPrice.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold">KSh {sale.totalAmount.toLocaleString()}</td>
                  {canViewProfits && (
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      KSh {(sale.totalAmount * 0.33).toLocaleString()}
                    </td>
                  )}
                  <td className="py-3 px-4">{sale.soldBy}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {sale.saleDate.toLocaleDateString()} {sale.saleDate.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center py-8">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No sales recorded yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary mt-4"
            >
              Record First Sale
            </button>
          </div>
        )}
      </div>

      {/* Sale Form Modal */}
      {showForm && (
        <SaleForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}