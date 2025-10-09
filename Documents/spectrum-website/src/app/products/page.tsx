'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { ProductComparison } from '@/components/ProductComparison';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { getProducts, getCategories } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { useContent } from '@/hooks/useContent';


function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { content: pageContent, isLoading: contentLoading } = useContent('products-page');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string, image?: string, description?: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [priceRangeInitialized, setPriceRangeInitialized] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  
  // Advanced filters
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  
  // Quick view
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('🏷️ Loading product categories...');
        const allCategories = await getCategories();
        const productCategories = allCategories
          .filter((cat: any) => cat.type === 'product')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            image: cat.image || '',
            description: cat.description || ''
          }));
        
        console.log('🏷️ Product categories loaded:', productCategories.length, productCategories);
        setCategories(productCategories);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Loading products from Firebase...');
        const firebaseProducts = await getProducts();
        console.log('Firebase products loaded:', firebaseProducts.length, 'products');
        
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

        console.log('Processed products:', processedProducts.length, 'products');
        console.log('Sample product:', processedProducts[0]);
        
        // Set products from Firebase
        console.log('Setting Firebase products to state');
        setProducts(processedProducts);
        
        // Price range not needed since products don't have pricing
        console.log('Price range disabled - products don\'t need pricing');
      } catch (error) {
        console.error('Error loading products:', error);
        toast.error('Có lỗi xảy ra khi tải sản phẩm');
        // Fallback to empty array if Firebase fails
        console.log('Falling back to empty array');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [priceRangeInitialized]);

  // Initialize search term and category from URL
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchTerm(search);
    }
    
    if (category) {
      console.log('🏷️ Setting category from URL:', category);
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    console.log('Filtering products:', {
      totalProducts: products.length,
      searchTerm,
      selectedCategory,
      priceRange,
      sortBy
    });

    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.features && product.features.some(feature => 
          (feature || '').toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      console.log('After search filter:', filtered.length);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => (product.category || '') === selectedCategory);
      console.log('After category filter:', filtered.length);
    }

    // Price range filter - DISABLED since products don't need pricing
    // filtered = filtered.filter(product => {
    //   const price = product.price || 0;
    //   const inRange = price >= priceRange.min && price <= priceRange.max;
    //   return inRange;
    // });
    console.log('Price filter disabled - products don\'t need pricing');

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand || ''));
      console.log('After brand filter:', filtered.length);
    }

    // Features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter(product => 
        product.features && selectedFeatures.every(feature => 
          product.features!.some(pf => (pf || '').toLowerCase().includes(feature.toLowerCase()))
        )
      );
      console.log('After features filter:', filtered.length);
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock === true);
      console.log('After stock filter:', filtered.length);
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(product => (product.rating || 0) >= minRating);
      console.log('After rating filter:', filtered.length);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        default:
          return 0;
      }
    });

    console.log('Final filtered products:', filtered.length);
    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, selectedBrands, selectedFeatures, inStockOnly, minRating]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedBrands, selectedFeatures, inStockOnly, minRating]);

  // Get selected category data
  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find(cat => cat.slug === selectedCategory);
  }, [selectedCategory, categories]);

  // Get unique brands and features for filters
  const availableBrands = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand || '').filter(b => b))];
    return brands.sort();
  }, [products]);

  const availableFeatures = useMemo(() => {
    const features = [...new Set(products.flatMap(p => (p.features || []).filter(f => f)))];
    return features.sort();
  }, [products]);

  const handleToggleWishlist = (product: Product) => {
    console.log('Toggled wishlist:', product.name);
    // Implement wishlist functionality
  };

  const handleAddToComparison = (product: Product) => {
    if (comparisonProducts.length >= 4) {
      alert('Bạn chỉ có thể so sánh tối đa 4 sản phẩm');
      return;
    }
    
    if (comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setComparisonProducts(prev => [...prev, product]);
    }
  };

  const handleRemoveFromComparison = (productId: string) => {
    setComparisonProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Filter handlers
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    // Price range not needed since products don't have pricing
    setPriceRange({ min: 0, max: 0 });
    setSelectedBrands([]);
    setSelectedFeatures([]);
    setInStockOnly(false);
    setMinRating(0);
    setSortBy('name');
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleClearComparison = () => {
    setComparisonProducts([]);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {/* Show category banner if category is selected, otherwise show page content banner */}
        {(selectedCategoryData?.image || pageContent?.imageUrl) && (
          <div className="aspect-[21/9] bg-gray-100 rounded-xl overflow-hidden mb-8">
            <img
              src={selectedCategoryData?.image || pageContent.imageUrl}
              alt={selectedCategoryData ? `${selectedCategoryData.name} Category` : "Products Hero"}
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedCategoryData ? selectedCategoryData.name : (pageContent?.title || 'Tất cả sản phẩm')}
        </h1>
        <p className="text-gray-600">
          {selectedCategoryData?.description || pageContent?.description || 'Khám phá bộ sưu tập kính mắt thời trang của chúng tôi'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={pageContent?.searchPlaceholder || "Tìm kiếm sản phẩm..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {pageContent?.filterButtonText || 'Bộ lọc'}
          </Button>
        </div>

        {/* Filters */}
        <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{pageContent?.allCategoriesLabel || 'Tất cả danh mục'}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Tên A-Z</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Khoảng giá</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Từ"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                />
                <Input
                  type="number"
                  placeholder="Đến"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* View Mode */}
            <div className="flex items-end gap-2">
              <label className="text-sm font-medium">Hiển thị</label>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Tìm kiếm: &quot;{searchTerm}&quot;
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Danh mục: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
            {(priceRange.min > 0 || priceRange.max < 1000) && (
              <Badge variant="secondary" className="gap-1">
                Giá: ${priceRange.min} - ${priceRange.max}
                <button
                  onClick={() => setPriceRange({ min: 0, max: 1000 })}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} trong {filteredProducts.length} sản phẩm
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sản phẩm mỗi trang:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {pageContent?.noProductsTitle || 'Không tìm thấy sản phẩm'}
          </h3>
          <p className="text-gray-600 mb-4">
            {pageContent?.noProductsMessage || 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
          </p>
          <Button
            variant="outline"
            onClick={clearAllFilters}
          >
            {pageContent?.clearFiltersText || 'Xóa tất cả bộ lọc'}
          </Button>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleWishlist={handleToggleWishlist}
                onAddToComparison={handleAddToComparison}
                isInComparison={comparisonProducts.some(p => p.id === product.id)}
                onQuickView={handleQuickView}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}


      {/* Product Comparison */}
      <ProductComparison
        products={comparisonProducts}
        onRemove={handleRemoveFromComparison}
        onClear={handleClearComparison}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}