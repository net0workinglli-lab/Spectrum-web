'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';

export function ImageGallerySection() {
  const { content, isLoading } = useContent('image-gallery-section');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Default images with titles and descriptions
  const defaultImageItems = [
    { 
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&fit=crop',
      title: 'Xmart OS',
      description: 'Advanced infotainment system with intuitive interface'
    },
    { 
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop',
      title: 'XPILOT ASSIST',
      description: 'Intelligent driver assistance with lane-keeping and navigation'
    },
    { 
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
      title: 'OTA',
      description: 'Over-the-air updates bringing new experiences with each upgrade'
    },
  ];

  // Process images - support both array of strings and array of objects
  const processImageItems = () => {
    if (!content?.images || content.images.length === 0) {
      return defaultImageItems;
    }

    return content.images.map((item: any, index: number) => {
      if (typeof item === 'string') {
        // If it's just a string (image URL), use default title/description
        return {
          image: item,
          title: defaultImageItems[index]?.title || `Feature ${index + 1}`,
          description: defaultImageItems[index]?.description || ''
        };
      } else {
        // If it's an object with image, title, description
        return {
          image: item.image || item.url || '',
          title: item.title || defaultImageItems[index]?.title || `Feature ${index + 1}`,
          description: item.description || defaultImageItems[index]?.description || ''
        };
      }
    });
  };

  const allImageItems = processImageItems();
  
  // Limit to maximum 3 images
  const imageItems = allImageItems.slice(0, 3);

  const title = content?.title || '';
  const subtitle = content?.subtitle || '';

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <div className="text-center mb-8">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="flex gap-1 max-w-[1200px] mx-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-1 h-[500px] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-16 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto px-4 max-w-[1200px]">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && (
              <h2 className="text-xl lg:text-2xl font-normal mb-2 text-slate-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-slate-600 max-w-2xl mx-auto text-sm">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-1 max-w-[1200px] mx-auto">
          {imageItems.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.div
                key={index}
                className="relative flex-1 h-[500px] overflow-hidden rounded-lg cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                animate={{ flexGrow: isActive ? 3 : 1, zIndex: isActive ? 10 : 1 }}
                onHoverStart={!isMobile ? () => setActiveIndex(index) : undefined}
                onClick={isMobile ? () => setActiveIndex(index === activeIndex ? null : index) : undefined}
                viewport={{ once: true }}
                style={{ transform: 'none' }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
                  y: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
                  flexGrow: { duration: 0.3, ease: 'easeOut' },
                  zIndex: { duration: 0.3, ease: 'easeOut' }
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  style={{ transform: 'none', willChange: 'auto' }}
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Text content container */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {/* Title - Always visible */}
                  <h3 className={`text-white font-medium text-sm lg:text-base mb-1 transition-all duration-300 ${
                    isActive ? 'mb-2' : 'group-hover:mb-2'
                  }`}>
                    {item.title}
                  </h3>
                  
                  {/* Description - Show on hover or when active */}
                  {item.description && (
                    <p className={`text-white/90 text-xs lg:text-sm line-clamp-2 overflow-hidden transition-all duration-300 ${
                      isActive ? 'max-h-20' : 'max-h-0 group-hover:max-h-20'
                    }`}>
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

