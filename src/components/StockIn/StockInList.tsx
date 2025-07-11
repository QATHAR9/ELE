import React, { useState } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import StockInForm from './StockInForm';

export default function StockInList() {
  const { stockMovements } = useInventory();
  const [showForm, setShowForm] = useState(false);

  const stockInMovements = stockMovements.filter(movement => movement.type === 'stock_in');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-elegant-black">Stock In</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Stock</span>
        </button>
      </div>

      {/* Stock In Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Quantity Added</th>
                <th className="text-left py-3 px-4">Previous Stock</th>
                <th className="text-left py-3 px-4">New Stock</th>
                <th className="text-left py-3 px-4">Performed By</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {stockInMovements.map((movement) => (
                <tr key={movement.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{movement.productName}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">+{movement.quantity}</td>
                  <td className="py-3 px-4">{movement.previousStock}</td>
                  <td className="py-3 px-4 font-semibold">{movement.newStock}</td>
                  <td className="py-3 px-4">{movement.performedBy}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {movement.date.toLocaleDateString()} {movement.date.toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stockInMovements.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No stock movements recorded yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-secondary mt-4"
            >
              Add First Stock
            </button>
          </div>
        )}
      </div>

      {/* Stock In Form Modal */}
      {showForm && (
        <StockInForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}