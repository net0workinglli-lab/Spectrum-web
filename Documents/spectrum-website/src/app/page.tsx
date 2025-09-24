'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { FeaturedProductsSection } from '@/components/FeaturedProductsSection';
import { CertificateSection } from '@/components/CertificateSection';
import { BrandSection } from '@/components/BrandSection';
import { LensesSection } from '@/components/LensesSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from '@/lib/firebase-firestore';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  image?: string;
  postCount: number;
  productCount?: number;
  type?: string;
}

// Featured products are now loaded from Firebase

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Customers' },
  { icon: Star, value: '4.9/5', label: 'Average Rating' },
  { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        const processedCategories = categoriesData
          .filter((category: Record<string, unknown>) => category.type === 'product') // Only product categories
          .map((category: Record<string, unknown>) => ({
            id: category.id as string,
            name: category.name as string,
            slug: category.slug as string,
            description: category.description as string,
            color: category.color as string,
          image: category.image as string || undefined,
          postCount: category.postCount as number || 0,
          productCount: category.productCount as number || 0,
          type: category.type as string
          }));
        console.log('🏷️ Homepage: Loaded product categories:', processedCategories.length, processedCategories.map(c => c.name));
        setCategories(processedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to default categories if Firebase fails
        setCategories([
          {
            id: '1',
            name: 'Sunglasses',
            slug: 'sunglasses',
            description: 'Protect your eyes in style',
            color: '#3B82F6',
            postCount: 0
          },
          {
            id: '2',
            name: 'Eyeglasses',
            slug: 'eyeglasses',
            description: 'Clear vision, clear style',
            color: '#10B981',
            postCount: 0
          },
          {
            id: '3',
            name: 'Reading Glasses',
            slug: 'reading',
            description: 'Comfortable reading experience',
            color: '#F59E0B',
            postCount: 0
          },
          {
            id: '4',
            name: 'Contact Lenses',
            slug: 'contact',
            description: 'Invisible comfort',
            color: '#EF4444',
            postCount: 0
          }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <Hero />

      {/* Featured Products */}
      <FeaturedProductsSection />

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Section */}
      <CertificateSection />

      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the perfect eyewear for every occasion and style preference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingCategories ? (
              // Simple loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))
            ) : (
              categories.map((category, index) => {
                // Use actual category image from database, fallback to default if not available
                const getCategoryImage = (category: Category) => {
                  if (category.image) {
                    return category.image;
                  }
                  
                  // Fallback to default images based on category name
                  const name = category.name.toLowerCase();
                  if (name.includes('sunglass')) return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop';
                  if (name.includes('eyeglass') || name.includes('glasses')) return 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop';
                  if (name.includes('reading')) return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop';
                  if (name.includes('contact')) return 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop';
                  return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop';
                };

                return {
                  name: category.name,
                  description: category.description,
                  image: getCategoryImage(category),
                  href: `/products?category=${category.slug}`,
                  count: `${category.productCount || 0}+ products`,
                  color: category.color
                };
              }).map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={category.href}
                  className="group relative overflow-hidden rounded-lg aspect-square bg-gray-100 hover:shadow-lg transition-shadow block"
                >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 mb-2 text-sm line-clamp-2 overflow-hidden">{category.description}</p>
                  <span className="text-sm text-white/80">{category.count}</span>
                </div>
                </Link>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Brand Section */}
      <BrandSection />

      {/* Lenses Section */}
      <LensesSection />

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their ideal eyewear with us. 
            Free shipping, easy returns, and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">
                Read Our Blog
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
