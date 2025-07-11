import React, { useState } from 'react';
import { Edit, Plus, AlertTriangle } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import ProductForm from './ProductForm';

export default function ProductList() {
  const { products } = useInventory();
  const { currentUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const canEditPricing = currentUser?.role === 'super_admin';
  const canAddProducts = currentUser?.role === 'super_admin';

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-elegant-black">Products</h2>
        {canAddProducts && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="text-left py-3 px-4">Product Name</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Status</th>
                {canEditPricing && <th className="text-left py-3 px-4">Buying Price</th>}
                <th className="text-left py-3 px-4">Selling Price</th>
                {canEditPricing && <th className="text-left py-3 px-4">Margin</th>}
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.stock <= product.stockThreshold ? (
                      <span className="alert-low-stock flex items-center">
                        <AlertTriangle size={14} className="mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="alert-in-stock">In Stock</span>
                    )}
                  </td>
                  {canEditPricing && (
                    <td className="py-3 px-4">KSh {product.buyingPrice.toLocaleString()}</td>
                  )}
                  <td className="py-3 px-4">KSh {product.sellingPrice.toLocaleString()}</td>
                  {canEditPricing && (
                    <td className="py-3 px-4 text-green-600">KSh {product.margin.toLocaleString()}</td>
                  )}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}