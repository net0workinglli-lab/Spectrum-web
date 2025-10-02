'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Package, Plus, Edit, Trash2, Eye, Search,
  Filter, Download, Upload, RefreshCw, Star,
  Heart, ShoppingCart, MoreHorizontal, Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { StoreSettings } from '@/components/admin/StoreSettings';
import { getProducts, deleteProduct, getCategories } from '@/lib/firebase-firestore';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { isLoggedIn, user } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const firebaseProducts = await getProducts();
        
        // Process Firestore data to handle Timestamps
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

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Có lỗi xảy ra khi tải sản phẩm');
        // Fallback to empty array if Firebase fails
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  // Load product categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('📦 Loading product categories for filter...');
        const allCategories = await getCategories();
        const productCategories = allCategories
          .filter((cat: any) => cat.type === 'product')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
        
        console.log('📦 Product categories loaded for filter:', productCategories.length);
        setCategories(productCategories);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'in-stock') {
        filtered = filtered.filter(product => product.inStock);
      } else if (statusFilter === 'out-of-stock') {
        filtered = filtered.filter(product => !product.inStock);
      }
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"? Hành động này không thể hoàn tác.`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);
      // Update local state
      const updatedProducts = products.filter(product => product.id !== productId);
      setProducts(updatedProducts);
      
      // Re-apply filters to updated products
      let filtered = updatedProducts;
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(product => product.category === categoryFilter);
      }
      if (statusFilter !== 'all') {
        if (statusFilter === 'in-stock') {
          filtered = filtered.filter(product => product.inStock);
        } else if (statusFilter === 'out-of-stock') {
          filtered = filtered.filter(product => !product.inStock);
        }
      }
      setFilteredProducts(filtered);
      
      toast.success('Sản phẩm đã được xóa thành công!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600">Manage your product catalog and store settings</p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4">
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('products')}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Store Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'settings' ? (
          <StoreSettings />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Product Image */}
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.images?.[0] || '/placeholder-glasses.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.reviewsCount})</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {(product.features || []).slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {(product.features || []).length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{(product.features || []).length - 2} more
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/product-detail?id=${product.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/admin/products/edit?id=${product.id}`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/product-detail?id=${product.id}`} className="flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/products/edit?id=${product.id}`} className="flex items-center">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <span>Created: {formatDate(product.createdAt)}</span>
                      <span>Updated: {formatDate(product.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No products match your current filters.'
                    : 'You haven&apos;t added any products yet.'
                  }
                </p>
                <Button asChild>
                  <Link href="/admin/products/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
        )}
      </div>
    </div>
  );
}
