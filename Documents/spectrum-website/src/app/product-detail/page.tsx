'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Share2,
  Star,
  ArrowLeft,
  Check,
  X,
  Truck,
  Shield,
  RotateCcw,
  MapPin,
  Loader2
} from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Ray-Ban Aviator Classic',
  description: 'Kính mát Ray-Ban Aviator Classic với thiết kế thời trang và chất lượng cao cấp. Phù hợp cho mọi hoạt động ngoài trời.',
  price: 159.99,
  originalPrice: 199.99,
  images: [
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=500',
  ],
  category: 'sunglasses',
  brand: 'Ray-Ban',
  features: ['Chống tia UV 100%', 'Tròng kính chống trầy', 'Khung kim loại'],
  inStock: true,
  rating: 4.5,
  reviewsCount: 128,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || '1';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Load product from Firebase
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Record<string, unknown>) => p.id === productId) as Product;
        
        if (foundProduct) {
          // Process Firestore data to handle Timestamps
          const processTimestamp = (timestamp: unknown): Date => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as { toDate: () => Date }).toDate();
            }
            if (typeof timestamp === 'string') {
              return new Date(timestamp);
            }
            return new Date();
          };

          const processedProduct = {
            ...foundProduct,
            createdAt: processTimestamp(foundProduct.createdAt),
            updatedAt: processTimestamp(foundProduct.updatedAt),
          } as Product;

          setProduct(processedProduct);
        } else {
          toast.error('Sản phẩm không tồn tại');
          // Fallback to mock data
          setProduct(mockProduct as Product);
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải sản phẩm');
        // Fallback to mock data
        setProduct(mockProduct as Product);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Load related products based on same category
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return;
      
      try {
        const products = await getProducts();
        
        // Filter products: same category but not the current product
        const related = products
          .filter((p: Product) => 
            p.category === product.category && p.id !== product.id
          )
          .slice(0, 4); // Limit to 4 products
        
        // Process timestamps for related products
        const processedRelated = related.map((p: Product) => {
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
            ...p,
            createdAt: processTimestamp(p.createdAt),
            updatedAt: processTimestamp(p.updatedAt),
          } as Product;
        });
        
        setRelatedProducts(processedRelated);
      } catch (error) {
        console.error('Error loading related products:', error);
      }
    };

    loadRelatedProducts();
  }, [product]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={(product.images || [])[selectedImageIndex] || '/placeholder-glasses.jpg'}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          {(product.images || []).length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {(product.images || []).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product.rating || 4.5}) • {product.reviewsCount || 128} đánh giá
              </span>
            </div>


            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Tính năng nổi bật:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Chống tia UV 100%</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Tròng kính chống trầy xước</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Khung kim loại cao cấp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Bảo hành 2 năm</span>
                </li>
              </ul>
            </div>

            {/* Availability at Store */}
            {product.inStock ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-1">Có sẵn tại chi nhánh</h3>
                    <p className="text-sm text-green-700 mb-2">
                      Sản phẩm hiện có sẵn tại cửa hàng của chúng tôi
                    </p>
                    <div className="text-sm text-green-600">
                      <p className="font-medium">📍 Địa chỉ:</p>
                      <a 
                        href="https://maps.google.com/maps?q=Spectrum+Eyecare+192+Nguyễn+Văn+Hưởng,+Thảo+Điền,+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-800 underline"
                      >
                        <strong>Spectrum Eyecare</strong><br />
                        192 Nguyễn Văn Hưởng, Thảo Điền<br />
                        Thủ Đức, Hồ Chí Minh 700000, Việt Nam
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Hết hàng</h3>
                    <p className="text-sm text-red-700 mb-2">
                      Sản phẩm hiện đang tạm hết hàng tại cửa hàng
                    </p>
                    <p className="text-sm text-red-600">
                      Vui lòng liên hệ với chúng tôi để đặt hàng trước hoặc kiểm tra thời gian có hàng trở lại.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1"
                  variant="outline"
                  asChild
                >
                  <a 
                    href="https://maps.google.com/maps?q=Spectrum+Eyecare+192+Nguyễn+Văn+Hưởng,+Thảo+Điền,+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Xem bản đồ
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Shipping & Returns */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thông tin giao hàng & đổi trả</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Miễn phí vận chuyển</p>
                    <p className="text-sm text-gray-600">Đơn hàng từ $50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Đổi trả miễn phí</p>
                    <p className="text-sm text-gray-600">Trong vòng 30 ngày</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Bảo hành chính hãng</p>
                    <p className="text-sm text-gray-600">2 năm toàn diện</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}