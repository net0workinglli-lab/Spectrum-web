'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, ArrowLeft, Save, X, Plus, Loader2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getProducts, updateProduct, getCategories } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { ImageUpload } from '@/components/ImageUpload';

function EditProductContent() {
  const { isLoggedIn, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    rating: '5.0',
    reviewsCount: '0',
    features: [] as string[],
    inStock: true,
    images: [] as string[]
  });
  const [newFeature, setNewFeature] = useState('');

  // Load product categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('📦 Loading product categories for edit...');
        const allCategories = await getCategories();
        const productCategories = allCategories
          .filter((cat: any) => cat.type === 'product')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
        
        console.log('📦 Product categories loaded for edit:', productCategories.length, productCategories);
        setCategories(productCategories);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Record<string, unknown>) => p.id === productId) as Product;
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name || '',
            brand: foundProduct.brand || '',
            category: foundProduct.category || 'sunglasses',
            description: foundProduct.description || '',
            price: foundProduct.price?.toString() || '',
            rating: foundProduct.rating?.toString() || '5.0',
            reviewsCount: foundProduct.reviewsCount?.toString() || '0',
            features: foundProduct.features || [],
            inStock: foundProduct.inStock ?? true,
            images: foundProduct.images || []
          });
        } else {
          toast.error('Sản phẩm không tồn tại');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Có lỗi xảy ra khi tải sản phẩm');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && productId) {
      loadProduct();
    }
  }, [isLoggedIn, productId, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
            <Button asChild>
              <Link href="/admin">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSaving(true);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        rating: parseFloat(formData.rating) || 5.0,
        reviewsCount: parseInt(formData.reviewsCount) || 0,
        author: {
          name: (user as { displayName?: string })?.displayName || 'Admin',
          email: user?.email || 'admin@example.com',
          ...((user as { photoURL?: string })?.photoURL && { avatar: (user as { photoURL?: string }).photoURL })
        }
      };

      await updateProduct(productId!, productData);
      
      toast.success('Sản phẩm đã được cập nhật thành công!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-gray-600">Update product information</p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-sm text-yellow-600">
                        ⚠️ Chưa có Product Categories. 
                        <a href="/admin/categories" className="underline ml-1">
                          Tạo categories trước
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (VND)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={5}
                  label="Product Images"
                  description="Upload product images or add image URLs. Maximum 5 images."
                />

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      placeholder="5.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewsCount">Reviews Count</Label>
                    <Input
                      id="reviewsCount"
                      type="number"
                      value={formData.reviewsCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewsCount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Status</Label>
                    <select
                      value={formData.inStock ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <EditProductContent />
    </Suspense>
  );
}
