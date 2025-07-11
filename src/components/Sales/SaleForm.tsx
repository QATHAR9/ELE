import React, { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useAuth } from '../../context/AuthContext';

interface SaleFormProps {
  onClose: () => void;
}

export default function SaleForm({ onClose }: SaleFormProps) {
  const { products, addSale } = useInventory();
  const { currentUser } = useAuth();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const totalAmount = selectedProduct ? selectedProduct.sellingPrice * quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    if (quantity > selectedProduct.stock) {
      setError(`Insufficient stock. Only ${selectedProduct.stock} units available.`);
      return;
    }

    const success = addSale(selectedProductId, quantity, currentUser?.name || 'Unknown');
    
    if (success) {
      onClose();
    } else {
      setError('Failed to process sale. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-elegant-black flex items-center">
            <ShoppingCart className="mr-2" size={20} />
            New Sale
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Product
            </label>
            <select
              required
              className="input-field w-full"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">Choose a product</option>
              {products
                .filter(product => product.stock > 0)
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - KSh {product.sellingPrice.toLocaleString()} ({product.stock} in stock)
                  </option>
                ))}
            </select>
          </div>

          {selectedProduct && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Product:</p>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Available Stock:</p>
                  <p className="font-medium">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <p className="text-gray-600">Unit Price:</p>
                  <p className="font-medium">KSh {selectedProduct.sellingPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category:</p>
                  <p className="font-medium">{selectedProduct.category}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              max={selectedProduct?.stock || 1}
              className="input-field w-full"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          {selectedProduct && (
            <div className="bg-gold-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gold-800 font-medium">Total Amount:</span>
                <span className="text-gold-800 font-bold text-lg">
                  KSh {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Complete Sale
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