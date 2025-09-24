'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Search,
  Package,
  Eye,
  Star
} from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductSelectorProps {
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
  maxProducts?: number;
}

export default function ProductSelector({
  selectedProductIds = [],
  onSelectionChange,
  maxProducts = 4
}: ProductSelectorProps) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  // Load all products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const firebaseProducts = await getProducts();
        
        // Process Firestore data
        const processedProducts = firebaseProducts.map((product: Record<string, unknown>) => {
          const processTimestamp = (timestamp: unknown): Date => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as { toDate: () => Date }).toDate();
            }
            if (typeof timestamp === 'string') {
              return new Date(timestamp);
            }
            return new Date();
          };

          return {
            ...product,
            createdAt: processTimestamp(product.createdAt),
            updatedAt: processTimestamp(product.updatedAt),
          };
        }) as Product[];

        console.log('📦 ProductSelector: Loaded products:', processedProducts.length);
        console.log('📦 ProductSelector: Product names:', processedProducts.map(p => p.name));
        setAllProducts(processedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const selectedProducts = allProducts.filter(product => 
    selectedProductIds.includes(product.id)
  );

  const availableProducts = allProducts.filter(product => 
    !selectedProductIds.includes(product.id) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProduct = (productId: string) => {
    console.log('📦 ProductSelector: Adding product', { 
      productId, 
      currentSelected: selectedProductIds.length, 
      maxProducts,
      canAdd: selectedProductIds.length < maxProducts 
    });
    
    if (selectedProductIds.length >= maxProducts) {
      alert(`Maximum ${maxProducts} products allowed`);
      return;
    }
    
    const newSelection = [...selectedProductIds, productId];
    console.log('📦 ProductSelector: New selection:', newSelection);
    onSelectionChange(newSelection);
    setSearchTerm('');
    setShowProductList(false);
  };

  const removeProduct = (productId: string) => {
    const newSelection = selectedProductIds.filter(id => id !== productId);
    onSelectionChange(newSelection);
  };

  const moveProduct = (fromIndex: number, toIndex: number) => {
    const newSelection = [...selectedProductIds];
    const [movedId] = newSelection.splice(fromIndex, 1);
    newSelection.splice(toIndex, 0, movedId);
    onSelectionChange(newSelection);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Featured Products Selection
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose which products to display in the Featured Collection section
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Products */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Selected Products ({selectedProductIds.length}/{maxProducts})
          </Label>
          
          {selectedProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No products selected</p>
              <p className="text-xs text-gray-400">Add products to display in Featured Collection</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedProducts.map((product, index) => (
                <div key={product.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.images?.[0] || '/placeholder-glasses.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.brand} • {product.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          ${product.price}
                        </Badge>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-500">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Position {index + 1}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveProduct(index, index - 1)}
                          disabled={index === 0}
                          className="h-6 w-6 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveProduct(index, index + 1)}
                          disabled={index === selectedProducts.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Product */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowProductList(!showProductList)}
              disabled={selectedProductIds.length >= maxProducts}
              variant="outline"
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
              {selectedProductIds.length >= maxProducts && (
                <span className="ml-2 text-xs text-gray-500">
                  (Max {maxProducts})
                </span>
              )}
            </Button>
          </div>

          {showProductList && (
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500">Loading products...</div>
                  ) : availableProducts.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {searchTerm ? 'No products found' : 'All products are already selected'}
                    </div>
                  ) : (
                    availableProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                        onClick={() => addProduct(product.id)}
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.images?.[0] || '/placeholder-glasses.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            {product.brand} • ${product.price}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-gray-400" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
