import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { addProduct, updateProduct } = useInventory();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    buyingPrice: 0,
    sellingPrice: 0,
    stock: 0,
    stockThreshold: 10,
  });

  const canEditPricing = currentUser?.role === 'super_admin';
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        buyingPrice: product.buyingPrice,
        sellingPrice: product.sellingPrice,
        stock: product.stock,
        stockThreshold: product.stockThreshold,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && product) {
      const updates: Partial<Product> = {
        name: formData.name,
        category: formData.category,
        stock: formData.stock,
        stockThreshold: formData.stockThreshold,
      };
      
      if (canEditPricing) {
        updates.buyingPrice = formData.buyingPrice;
        updates.sellingPrice = formData.sellingPrice;
        updates.margin = formData.sellingPrice - formData.buyingPrice;
      }
      
      updateProduct(product.id, updates);
    } else {
      const productData = {
        ...formData,
        margin: formData.sellingPrice - formData.buyingPrice,
      };
      addProduct(productData);
    }
    
    onClose();
  };

  const margin = formData.sellingPrice - formData.buyingPrice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-elegant-black">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              className="input-field w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              className="input-field w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Suits">Suits</option>
              <option value="Shirts">Shirts</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
              <option value="Trousers">Trousers</option>
            </select>
          </div>

          {canEditPricing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buying Price (KSh)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field w-full"
                  value={formData.buyingPrice}
                  onChange={(e) => setFormData({ ...formData, buyingPrice: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (KSh)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  className="input-field w-full"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                />
              </div>

              <div className="bg-gold-50 p-3 rounded-lg">
                <p className="text-sm text-gold-800">
                  <strong>Margin per unit: KSh {margin.toLocaleString()}</strong>
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock
            </label>
            <input
              type="number"
              required
              min="0"
              className="input-field w-full"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Alert Threshold
            </label>
            <input
              type="number"
              required
              min="1"
              className="input-field w-full"
              value={formData.stockThreshold}
              onChange={(e) => setFormData({ ...formData, stockThreshold: Number(e.target.value) })}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}