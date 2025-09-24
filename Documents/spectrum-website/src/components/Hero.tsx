'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SwiperComponent } from '@/components/ui/swiper';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';


const features = [
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Handpicked frames from top brands',
  },
  {
    icon: Shield,
    title: '100% Authentic',
    description: 'Guaranteed genuine products',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free consultation',
  },
];

export function Hero() {
  const { content, isLoading } = useHomeContent();
  

  // Create dynamic hero slides with Firebase content
  const heroSlides = content.hero.slides && content.hero.slides.length > 0 
    ? content.hero.slides.map(slide => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle,
        image: slide.image,
        cta: slide.cta,
        href: slide.href,
      }))
    : [
        {
          id: 1,
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          image: content.hero.imageUrl || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop',
          cta: content.hero.buttonText,
          href: content.hero.buttonLink,
        }
      ];


  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[600px] lg:h-[700px] bg-gray-100 animate-pulse">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="h-12 bg-gray-300 rounded w-96 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-64 mb-8"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Hero Slider */}
      <div className="relative h-[600px] lg:h-[700px]">
        <SwiperComponent
          className="h-full"
          autoplay={true}
          pagination={true}
          navigation={true}
          effect="fade"
          speed={1000}
        >
          {heroSlides.map((slide) => (
            <div key={slide.id} className="relative h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 bg-black/40" />
              
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl">
                    <motion.h1 
                      className="text-4xl lg:text-6xl font-bold text-white mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      {slide.title}
                    </motion.h1>
                    <motion.p 
                      className="text-xl lg:text-2xl text-white/90 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    {slide.cta && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        <Button 
                          size="lg" 
                          className="group"
                          asChild
                        >
                          <Link href={slide.href || '#'}>
                            {slide.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </SwiperComponent>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
