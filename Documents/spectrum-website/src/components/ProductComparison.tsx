'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Star, Check, X as XIcon } from 'lucide-react';
import Image from 'next/image';

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function ProductComparison({ products, onRemove, onClear }: ProductComparisonProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'price', 'rating', 'brand', 'category', 'inStock', 'description'
  ]);

  const features = [
    { key: 'price', label: 'Giá', type: 'price' },
    { key: 'rating', label: 'Đánh giá', type: 'rating' },
    { key: 'brand', label: 'Thương hiệu', type: 'text' },
    { key: 'category', label: 'Danh mục', type: 'text' },
    { key: 'inStock', label: 'Tình trạng', type: 'boolean' },
    { key: 'description', label: 'Mô tả', type: 'text' },
    { key: 'features', label: 'Tính năng', type: 'features' },
  ];

  const toggleFeature = (featureKey: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureKey)
        ? prev.filter(f => f !== featureKey)
        : [...prev, featureKey]
    );
  };

  const renderFeatureValue = (product: Product, feature: { key: string; label: string; type: string }) => {
    switch (feature.type) {
      case 'price':
        return (
          <div className="text-center">
            <div className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        );
      
      case 'rating':
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600">
              {product.rating?.toFixed(1) || 'N/A'} ({product.reviewsCount || 0})
            </div>
          </div>
        );
      
      case 'boolean':
        const value = product[feature.key as keyof Product];
        return (
          <div className="text-center">
            {value ? (
              <Check className="h-5 w-5 text-green-500 mx-auto" />
            ) : (
              <XIcon className="h-5 w-5 text-red-500 mx-auto" />
            )}
          </div>
        );
      
      case 'features':
        return (
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Chống tia UV 100%</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Tròng kính chống trầy</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Khung kim loại</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm text-center">
            {String(product[feature.key as keyof Product] || 'N/A')}
          </div>
        );
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">So sánh sản phẩm ({products.length}/4)</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFeatures(features.map(f => f.key))}
              >
                Tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
              >
                Xóa tất cả
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Feature Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Chọn tiêu chí so sánh:</h4>
            <div className="flex flex-wrap gap-1">
              {features.map((feature) => (
                <Button
                  key={feature.key}
                  variant={selectedFeatures.includes(feature.key) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleFeature(feature.key)}
                  className="text-xs"
                >
                  {feature.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600">
              <div>Tiêu chí</div>
              {products.map((product) => (
                <div key={product.id} className="text-center">
                  <div className="truncate">{product.name}</div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {features
              .filter(feature => selectedFeatures.includes(feature.key))
              .map((feature) => (
                <div key={feature.key} className="grid grid-cols-4 gap-2 text-sm">
                  <div className="font-medium text-gray-700 py-2">
                    {feature.label}
                  </div>
                  {products.map((product) => (
                    <div key={product.id} className="py-2">
                      {renderFeatureValue(product, feature)}
                    </div>
                  ))}
                </div>
              ))}
          </div>

          {/* Product Images */}
          <div className="grid grid-cols-4 gap-2">
            <div className="text-xs font-medium text-gray-600">Hình ảnh</div>
            {products.map((product) => (
              <div key={product.id} className="relative">
                <div className="aspect-square relative overflow-hidden rounded">
                  <Image
                    src={product.images?.[0] || '/placeholder-glasses.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={() => onRemove(product.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
