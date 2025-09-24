'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { SwiperComponent } from '@/components/ui/swiper';
import { ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { Product } from '@/types';
import { useContent } from '@/hooks/useContent';

export function FeaturedProductsSection() {
  const { content, isLoading: contentLoading } = useContent('featured-products-section');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
  const badgeText = content?.badgeText || 'Featured Collection';
  const title = content?.title || 'Our Most Popular Eyewear';
  const description = content?.description || 'Discover the eyewear that our customers love most. From classic designs to modern trends.';
  const buttonText = content?.buttonText || 'View All Products';
  const buttonLink = content?.buttonLink || '/products';

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
      className="py-16 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            {badgeText}
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {loadingProducts ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <SwiperComponent
            className="pb-8"
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            navigation={true}
            pagination={true}
          >
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToComparison={() => {
                  // Optional: Add to comparison logic here
                  console.log('Add to comparison:', product.name);
                }}
              />
            ))}
          </SwiperComponent>
        )}

        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link href={buttonLink}>
              {buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
