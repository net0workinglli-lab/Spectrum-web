'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { SwiperComponent } from '@/components/ui/swiper';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { Product } from '@/types';
import { useContent } from '@/hooks/useContent';

export function FeaturedProductsSection() {
  const { content, isLoading: contentLoading } = useContent('featured-products-section');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Load featured products from Firebase based on selected IDs
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
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

        // Use selected products from CMS or fallback to first few products
        if (content?.selectedProductIds && content.selectedProductIds.length > 0) {
          const selectedProducts = content.selectedProductIds
            .map(id => processedProducts.find(p => p.id === id))
            .filter(Boolean) as Product[];
          setFeaturedProducts(selectedProducts);
        } else {
          // Fallback: Take first 4 products if no selection
          const maxProducts = content?.maxProducts || 4;
          setFeaturedProducts(processedProducts.slice(0, maxProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to mock data if Firebase fails
        setFeaturedProducts([
          {
            id: '1',
            name: 'Ray-Ban Aviator Classic',
            description: 'Timeless aviator sunglasses with crystal green lenses',
            price: 154.00,
            originalPrice: 189.00,
            images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop'],
            category: 'sunglasses' as const,
            brand: 'Ray-Ban',
            features: ['UV Protection', 'Polarized', 'Lightweight'],
            inStock: true,
            rating: 4.8,
            reviewsCount: 124,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: '2',
            name: 'Oakley Holbrook',
            description: 'Modern lifestyle sunglasses with Prizm lenses',
            price: 189.00,
            images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop'],
            category: 'sunglasses' as const,
            brand: 'Oakley',
            features: ['Prizm Technology', 'Durable', 'Comfortable'],
            inStock: true,
            rating: 4.6,
            reviewsCount: 89,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [content]);

  // Use content from CMS or fallback to defaults
  const badgeText = content?.badgeText || 'Our Electric Fleet';
  const buttonText = content?.buttonText || 'View All Vehicles';
  const buttonLink = content?.buttonLink || '/products';
  
  // Get title and subtitle from active product
  const activeProduct = featuredProducts.length > 0 && activeSlideIndex < featuredProducts.length
    ? featuredProducts[activeSlideIndex]
    : featuredProducts.length > 0 ? featuredProducts[0] : null;
  
  // Format category name (e.g., "electric-suv" -> "Electric SUV")
  const formatCategory = (category: string | undefined) => {
    if (!category) return '';
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const category = activeProduct?.category 
    ? formatCategory(activeProduct.category)
    : '';
  const title = activeProduct?.name || content?.title || 'Our Featured Electric Vehicles';
  const description = activeProduct?.description || content?.description || 'Discover our most popular zero-emission vehicles. From efficient sedans to powerful SUVs, experience the future of mobility.';

  // Scroll active tab to center
  useEffect(() => {
    if (tabRefs.current[activeSlideIndex]) {
      tabRefs.current[activeSlideIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeSlideIndex]);

  if (contentLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      viewport={{ once: true }}
      className="py-20 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto px-4">
        {/* Category */}
        {category && (
          <div className="text-center mb-4">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              {category}
            </p>
          </div>
        )}
        
        {/* View All Button */}
        <div className="text-center mb-6">
          <Button 
            size="sm"
            variant="outline"
            asChild
            className="border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 transition-all rounded-full px-6"
          >
            <Link href={buttonLink} className="flex items-center gap-2">
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Product Tabs */}
        {featuredProducts.length > 0 && (
          <div className="flex flex-nowrap justify-center gap-2 lg:gap-3 mb-12 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
            {featuredProducts.map((product, index) => (
              <button
                key={product.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => setActiveSlideIndex(index)}
                className={`px-4 py-2 text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  activeSlideIndex === index
                    ? 'text-black font-semibold'
                    : 'text-slate-500 font-medium hover:text-slate-700'
                }`}
              >
                {product.name}
              </button>
            ))}
          </div>
        )}

        {loadingProducts ? (
          // Loading skeleton
          <div className="flex justify-center">
            <div className="w-full max-w-lg aspect-square bg-gray-200 rounded-lg animate-pulse" />
          </div>
        ) : featuredProducts.length > 0 && activeSlideIndex < featuredProducts.length ? (
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlideIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="w-full max-w-lg relative"
              >
                {/* Brand Text Background - Outside image frame */}
                {featuredProducts[activeSlideIndex].brand && (
                  <div className="hidden md:block absolute -left-8 lg:-left-16 top-1/2 -translate-y-1/2 pointer-events-none z-0">
                    <p className="text-[12rem] lg:text-[16rem] font-black text-slate-300/30 select-none leading-none whitespace-nowrap">
                      {featuredProducts[activeSlideIndex].brand.toUpperCase()}
                    </p>
                  </div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full aspect-square group cursor-pointer mb-4 overflow-hidden rounded-lg z-10"
                >
                  <Link href={`/product-detail?id=${featuredProducts[activeSlideIndex].id}`} className="block w-full h-full relative">
                    <Image
                      src={featuredProducts[activeSlideIndex].images?.[0] || '/placeholder-glasses.jpg'}
                      alt={featuredProducts[activeSlideIndex].name}
                      fill
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Product Info Overlay on Hover */}
                  <Link 
                    href={`/product-detail?id=${featuredProducts[activeSlideIndex].id}`}
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 z-20 cursor-pointer"
                  >
                    <div className="text-white space-y-3 max-w-xs">
                      {/* Price */}
                      {featuredProducts[activeSlideIndex].price && (
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-400">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(featuredProducts[activeSlideIndex].price)}
                          </p>
                        </div>
                      )}
                      
                      {/* EV Details */}
                      {featuredProducts[activeSlideIndex].evDetails && (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {featuredProducts[activeSlideIndex].evDetails.range && (
                            <div>
                              <p className="text-emerald-400 font-semibold">Range</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.range}</p>
                            </div>
                          )}
                          {featuredProducts[activeSlideIndex].evDetails.charge && (
                            <div>
                              <p className="text-emerald-400 font-semibold">Charge</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.charge}</p>
                            </div>
                          )}
                          {featuredProducts[activeSlideIndex].evDetails.acceleration && (
                            <div>
                              <p className="text-emerald-400 font-semibold">0-100 km/h</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.acceleration}</p>
                            </div>
                          )}
                          {featuredProducts[activeSlideIndex].evDetails.power && (
                            <div>
                              <p className="text-emerald-400 font-semibold">Power</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.power}</p>
                            </div>
                          )}
                          {featuredProducts[activeSlideIndex].evDetails.drivetrain && (
                            <div>
                              <p className="text-emerald-400 font-semibold">Drivetrain</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.drivetrain}</p>
                            </div>
                          )}
                          {featuredProducts[activeSlideIndex].evDetails.battery && (
                            <div>
                              <p className="text-emerald-400 font-semibold">Battery</p>
                              <p className="text-white/90">{featuredProducts[activeSlideIndex].evDetails.battery}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Brand */}
                      {featuredProducts[activeSlideIndex].brand && (
                        <div className="text-center pt-2 border-t border-white/20">
                          <p className="text-xs text-white/70">Brand</p>
                          <p className="text-sm font-semibold">{featuredProducts[activeSlideIndex].brand}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
                {featuredProducts[activeSlideIndex].description && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-center"
                  >
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-3 line-clamp-3">
                      {featuredProducts[activeSlideIndex].description}
                    </p>
                    <Link 
                      href={`/product-detail?id=${featuredProducts[activeSlideIndex].id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      See more details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
