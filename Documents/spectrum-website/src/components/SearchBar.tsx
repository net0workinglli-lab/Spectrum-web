'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import Image from 'next/image';
import { getProducts } from '@/lib/firebase-firestore';


// Popular search terms - updated for EV products
const popularSearches: string[] = [];

interface SearchBarProps {
  placeholder?: string;
  isScrolled?: boolean;
}

export function SearchBar({ placeholder = 'Search vehicles, models...', isScrolled = false }: SearchBarProps) {
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
    const lowerTerm = term.toLowerCase().trim();
    
    if (!lowerTerm) {
      // When no search term, show popular suggestions from real data
      const uniqueBrands = Array.from(
        new Set(
          allProducts
            .map(p => p.brand)
            .filter((brand): brand is string => Boolean(brand))
        )
      ).slice(0, 6);
      
      // Show featured/recent products (limit to 4)
      const featuredProducts = allProducts
        .sort((a, b) => {
          const aDate = a.updatedAt || a.createdAt || new Date(0);
          const bDate = b.updatedAt || b.createdAt || new Date(0);
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 4);

      setSuggestions({ products: featuredProducts, popular: uniqueBrands });
      return;
    }

    // Filter products from Firebase data
    const filteredProducts = allProducts.filter(product =>
      (product.name || '').toLowerCase().includes(lowerTerm) ||
      (product.brand || '').toLowerCase().includes(lowerTerm) ||
      (product.description || '').toLowerCase().includes(lowerTerm) ||
      (product.category || '').toLowerCase().includes(lowerTerm)
    ).slice(0, 4);
    
    console.log(`🔍 SearchBar: Filtering "${term}" in ${allProducts.length} products, found ${filteredProducts.length} matches`);

    // Generate popular suggestions from real data (brands and categories that match)
    const matchingBrands = Array.from(
      new Set(
        allProducts
          .filter(p => 
            (p.brand || '').toLowerCase().includes(lowerTerm) ||
            (p.category || '').toLowerCase().includes(lowerTerm)
          )
          .map(p => p.brand)
          .filter((brand): brand is string => Boolean(brand))
      )
    ).slice(0, 3);

    // Also include matching categories
    const matchingCategories = Array.from(
      new Set(
        allProducts
          .filter(p => (p.category || '').toLowerCase().includes(lowerTerm))
          .map(p => p.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    ).slice(0, 2);

    const filteredPopular = [...matchingBrands, ...matchingCategories].slice(0, 3);

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
      setSearchTerm('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    generateSuggestions(value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    // Generate suggestions when focusing (even with empty search term)
    if (!searchTerm.trim() && allProducts.length > 0) {
      generateSuggestions('');
    }
  };

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Regenerate suggestions when products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      // If there's a search term, filter based on it
      // Otherwise, generate popular suggestions
      generateSuggestions(searchTerm);
    }
  }, [allProducts, searchTerm]);

  // Close suggestions and search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // Only close search if clicking outside and not typing
        if (!searchTerm.trim()) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchTerm]);

  return (
    <div className="relative" ref={suggestionsRef}>
      {/* Desktop Search - Expandable */}
      <div className="hidden md:block">
        {!isOpen ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className={`transition-colors ${
              isScrolled 
                ? 'hover:bg-emerald-50 hover:text-emerald-600 text-slate-700' 
                : 'hover:bg-white/10 hover:text-white text-white/90'
            }`}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <form onSubmit={handleSearch} className="flex items-center relative animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isScrolled ? 'text-slate-500' : 'text-white/70'
              }`} />
              <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={handleInputFocus}
                className={`w-64 pl-10 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-1 transition-all backdrop-blur-md ${
                  isScrolled 
                    ? 'bg-white/95 border border-slate-200 text-slate-900 focus:ring-emerald-500/50 shadow-lg' 
                    : 'bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:ring-white/30 shadow-xl'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 hover:opacity-70 transition-opacity ${
                    isScrolled ? 'text-slate-500' : 'text-white/70'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                setShowSuggestions(false);
                setSearchTerm('');
              }}
              className={`ml-1 transition-colors ${
                isScrolled 
                  ? 'hover:bg-slate-100 text-slate-700' 
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        )}

        {/* Desktop Suggestions Dropdown */}
        {isOpen && showSuggestions && (
          <div className={`absolute top-full left-0 mt-2 w-64 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto backdrop-blur-md ${
            isScrolled 
              ? 'bg-white/95 border border-slate-200' 
              : 'bg-white/10 border border-white/20 backdrop-blur-md'
          }`}>
            {/* Product Suggestions */}
            {suggestions.products.length > 0 && (
              <div className="p-2">
                <div className={`text-xs font-medium mb-2 px-2 ${
                  isScrolled ? 'text-gray-500' : 'text-white/70'
                }`}>Sản phẩm</div>
                {suggestions.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors ${
                      isScrolled 
                        ? 'hover:bg-gray-50' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Image
                      src={product.images?.[0] || '/placeholder-glasses.jpg'}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${
                        isScrolled ? 'text-gray-900' : 'text-white'
                      }`}>{product.name}</div>
                      <div className={`text-xs ${
                        isScrolled ? 'text-gray-500' : 'text-white/70'
                      }`}>{product.brand}</div>
                      <div className={`text-sm font-semibold ${
                        isScrolled ? 'text-emerald-600' : 'text-emerald-300'
                      }`}>${product.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches / Suggestions */}
            {suggestions.popular.length > 0 && (
              <div className={`p-2 border-t ${
                isScrolled ? 'border-gray-100' : 'border-white/20'
              }`}>
                <div className={`text-xs font-medium mb-2 px-2 flex items-center gap-1 ${
                  isScrolled ? 'text-gray-500' : 'text-white/70'
                }`}>
                  <Clock className="h-3 w-3" />
                  {searchTerm ? 'Đề xuất tìm kiếm' : 'Tìm kiếm phổ biến'}
                </div>
                {suggestions.popular.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors ${
                      isScrolled 
                        ? 'hover:bg-gray-50' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Search className={`h-4 w-4 ${
                      isScrolled ? 'text-gray-400' : 'text-white/60'
                    }`} />
                    <span className={`text-sm ${
                      isScrolled ? 'text-gray-700' : 'text-white/90'
                    }`}>{search}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {suggestions.products.length === 0 && suggestions.popular.length === 0 && searchTerm && (
              <div className={`p-4 text-center text-sm ${
                isScrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                Không tìm thấy kết quả cho &quot;{searchTerm}&quot;
              </div>
            )}

            {/* Show message when no search term and no suggestions */}
            {!searchTerm && suggestions.products.length === 0 && suggestions.popular.length === 0 && allProducts.length === 0 && (
              <div className={`p-4 text-center text-sm ${
                isScrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                Đang tải dữ liệu...
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={`md:hidden transition-colors ${
          isScrolled 
            ? 'hover:bg-emerald-50 hover:text-emerald-600 text-slate-700' 
            : 'hover:bg-white/10 hover:text-white text-white/90'
        }`}
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
                  onFocus={handleInputFocus}
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

                {/* Popular Searches / Suggestions */}
                {suggestions.popular.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {searchTerm ? 'Đề xuất tìm kiếm' : 'Tìm kiếm phổ biến'}
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

                {/* Show message when no search term and no suggestions */}
                {!searchTerm && suggestions.products.length === 0 && suggestions.popular.length === 0 && allProducts.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    Đang tải dữ liệu...
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
