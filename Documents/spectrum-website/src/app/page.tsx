'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Hero } from '@/components/Hero';
import { FeaturedProductsSection } from '@/components/FeaturedProductsSection';
import { BatteryCharging, Zap, Leaf, Car, Gauge, Users, Shield, Star, Truck, CheckCircle, Award, TrendingUp, Activity, Target, Heart, Globe, Building, DollarSign, Clock, TrendingDown, BarChart3, PieChart, LineChart } from 'lucide-react';
import Link from 'next/link';
import { getCategories } from '@/lib/firebase-firestore';
import { useContent, StatItem } from '@/hooks/useContent';
import { StatCounter } from '@/components/StatCounter';
import { SunnyAutoNewsSection } from '@/components/SunnyAutoNewsSection';
import { SecondaryHero } from '@/components/SecondaryHero';
import { ImageGallerySection } from '@/components/ImageGallerySection';

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

// Icon mapping for stats
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  'Car': Car,
  'BatteryCharging': BatteryCharging,
  'Leaf': Leaf,
  'Users': Users,
  'Zap': Zap,
  'Shield': Shield,
  'Star': Star,
  'Gauge': Gauge,
  'Truck': Truck,
  'CheckCircle': CheckCircle,
  'Award': Award,
  'TrendingUp': TrendingUp,
  'Activity': Activity,
  'Target': Target,
  'Heart': Heart,
  'Globe': Globe,
  'Building': Building,
  'DollarSign': DollarSign,
  'Clock': Clock,
  'TrendingDown': TrendingDown,
  'BarChart3': BarChart3,
  'PieChart': PieChart,
  'LineChart': LineChart,
};

// Default stats fallback
const defaultStats: StatItem[] = [
  { icon: 'Car', value: '500+', label: 'EVs Delivered' },
  { icon: 'BatteryCharging', value: '1000+', label: 'Charging Stations' },
  { icon: 'Leaf', value: '50K+', label: 'Tons CO₂ Saved' },
  { icon: 'Users', value: '10K+', label: 'Happy Owners' },
];

export default function Home() {
  const { content: statsContent, isLoading: statsLoading } = useContent('stats-section');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Get stats from CMS or use defaults
  const stats: StatItem[] = statsContent?.stats && statsContent.stats.length > 0 
    ? statsContent.stats 
    : defaultStats;

  // Debug logging
  useEffect(() => {
    if (!statsLoading && statsContent) {
      console.log('📊 Stats Section Data:', {
        hasStats: !!statsContent.stats,
        statsCount: statsContent.stats?.length || 0,
        stats: statsContent.stats,
        usingDefaults: !statsContent.stats || statsContent.stats.length === 0
      });
    }
  }, [statsContent, statsLoading]);

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
        // Fallback to default EV categories if Firebase fails
        setCategories([
          {
            id: '1',
            name: 'Electric Sedans',
            slug: 'electric-sedan',
            description: 'Efficient and elegant city driving',
            color: '#10B981',
            postCount: 0
          },
          {
            id: '2',
            name: 'Electric SUVs',
            slug: 'electric-suv',
            description: 'Spacious and powerful for families',
            color: '#059669',
            postCount: 0
          },
          {
            id: '3',
            name: 'Electric Hatchbacks',
            slug: 'electric-hatchback',
            description: 'Compact and eco-friendly',
            color: '#34D399',
            postCount: 0
          },
          {
            id: '4',
            name: 'Electric Trucks',
            slug: 'electric-truck',
            description: 'Heavy-duty zero-emission power',
            color: '#047857',
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

      {/* Image Gallery Section */}
      <ImageGallerySection />

      {/* Stats Section */}
      {stats && stats.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900">
          <div className="container mx-auto px-4">
            {statsContent?.title && (
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                  {statsContent.title}
                </h2>
                {statsContent.description && (
                  <p className="text-emerald-100/80 max-w-2xl mx-auto text-lg">
                    {statsContent.description}
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || Car;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-400/10 rounded-2xl border border-emerald-400/20 mb-4">
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-emerald-300" />
                    </div>
                    <StatCounter 
                      value={stat.value} 
                      duration={2000}
                      className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white drop-shadow-sm"
                    />
                    <div className="text-sm md:text-base text-emerald-100/80">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Secondary Hero Section */}
      <SecondaryHero />

      {/* Categories Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="py-16"
      >
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-6">
            {/* Badge - Similar to Featured Products Section */}
            <div className="text-center mb-2">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                Explore Our Fleet
              </p>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-normal mb-2 text-slate-900">
              Electric Vehicle Categories
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm mb-4">
              Discover our range of zero-emission electric vehicles designed for every lifestyle and need.
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
                  
                  // Fallback to default EV images based on category name
                  const name = category.name.toLowerCase();
                  if (name.includes('sedan')) return 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=400&fit=crop';
                  if (name.includes('suv')) return 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&h=400&fit=crop';
                  if (name.includes('hatchback')) return 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=400&fit=crop';
                  if (name.includes('truck')) return 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=400&fit=crop';
                  return 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=400&h=400&fit=crop';
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
                  className="group relative overflow-hidden rounded-3xl aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 hover:shadow-2xl transition-all duration-300 block border border-white/10"
                >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                  <div className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300 mb-3 w-fit">
                    <Zap className="h-3 w-3 mr-1" />
                    Electric
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">{category.name}</h3>
                  <p className="text-emerald-100/90 mb-2 text-sm line-clamp-2 overflow-hidden">{category.description}</p>
                  <span className="text-sm text-emerald-200/80">{category.count}</span>
                </div>
                </Link>
              </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.section>

      {/* Sunny Auto News Section */}
      <SunnyAutoNewsSection />

      {/* Brand Section */}
    </motion.div>
  );
}
