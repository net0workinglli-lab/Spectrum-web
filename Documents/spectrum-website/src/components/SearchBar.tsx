'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import Image from 'next/image';
import { getProducts } from '@/lib/firebase-firestore';


// Popular search terms - updated to match actual products
const popularSearches = [
  'Ray-Ban',
  'Oakley', 
  'Gucci',
  'Tom Ford',
  'Persol',
  'Maui Jim',
  'Sunglasses',
  'Eyeglasses'
];

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search glasses, brands...' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ products: Product[]; popular: string[] }>({ products: [], popular: [] });
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoadingProducts(true);
        console.log('🔍 SearchBar: Loading products from Firebase...');
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

        console.log(`📦 SearchBar: Loaded ${processedProducts.length} products:`, processedProducts.map(p => p.name));
        setAllProducts(processedProducts);
      } catch (error) {
        console.error('❌ SearchBar: Error loading products:', error);
        // Fallback to empty array if Firebase fails
        console.log('📦 SearchBar: Using empty array as fallback');
        setAllProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Generate suggestions based on search term
  const generateSuggestions = (term: string) => {
    if (!term.trim()) {
      setSuggestions({ products: [], popular: popularSearches.slice(0, 6) });
      return;
    }

    const lowerTerm = term.toLowerCase();
    
    // Filter products from Firebase data
    const filteredProducts = allProducts.filter(product =>
      (product.name || '').toLowerCase().includes(lowerTerm) ||
      (product.brand || '').toLowerCase().includes(lowerTerm) ||
      (product.description || '').toLowerCase().includes(lowerTerm)
    ).slice(0, 4);
    
    console.log(`🔍 SearchBar: Filtering "${term}" in ${allProducts.length} products, found ${filteredProducts.length} matches`);

    // Filter popular searches
    const filteredPopular = popularSearches.filter(search =>
      search.toLowerCase().includes(lowerTerm)
    ).slice(0, 3);

    setSuggestions({ products: filteredProducts, popular: filteredPopular });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    router.push(`/products?search=${encodeURIComponent(suggestion)}`);
    setIsOpen(false);
    setShowSuggestions(false);
  };

  const handleProductClick = (product: Product) => {
    router.push(`/product-detail?id=${product.id}`);
    setIsOpen(false);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Regenerate suggestions when products are loaded
  useEffect(() => {
    if (allProducts.length > 0 && searchTerm) {
      generateSuggestions(searchTerm);
    }
  }, [allProducts, searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={suggestionsRef}>
      {/* Desktop Search */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-md flex-1 mx-8">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Desktop Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {/* Product Suggestions */}
            {suggestions.products.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">Sản phẩm</div>
                {suggestions.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <Image
                      src={product.images?.[0] || '/placeholder-glasses.jpg'}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand}</div>
                      <div className="text-sm font-semibold text-primary">${product.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            {suggestions.popular.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tìm kiếm phổ biến
                </div>
                {suggestions.popular.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md text-left"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {suggestions.products.length === 0 && suggestions.popular.length === 0 && searchTerm && (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không tìm thấy kết quả cho &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        )}
      </form>

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Mobile Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed top-0 left-0 right-0 bg-white p-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </form>

            {/* Mobile Suggestions */}
            {showSuggestions && (
              <div className="mt-2 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {/* Product Suggestions */}
                {suggestions.products.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">Sản phẩm</div>
                    {suggestions.products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md text-left"
                      >
                        <Image
                          src={product.images?.[0] || '/placeholder-glasses.jpg'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.brand}</div>
                          <div className="text-sm font-semibold text-primary">${product.price.toFixed(2)}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Searches */}
                {suggestions.popular.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Tìm kiếm phổ biến
                    </div>
                    {suggestions.popular.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md text-left"
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {suggestions.products.length === 0 && suggestions.popular.length === 0 && searchTerm && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Không tìm thấy kết quả cho &quot;{searchTerm}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
