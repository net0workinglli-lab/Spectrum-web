'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ReactNode, useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import '@/styles/swiper.css';

interface SwiperComponentProps {
  children: ReactNode[];
  className?: string;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  autoplay?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip' | 'cards' | 'creative';
  speed?: number;
  centeredSlides?: boolean;
  activeIndex?: number;
  onSlideChange?: (activeIndex: number) => void;
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween: number;
      centeredSlides?: boolean;
    };
  };
}

export function SwiperComponent({
  children,
  className = '',
  slidesPerView = 1,
  spaceBetween = 30,
  autoplay = false,
  navigation = true,
  pagination = true,
  effect = 'slide',
  speed = 800,
  centeredSlides = false,
  activeIndex,
  onSlideChange,
  breakpoints,
}: SwiperComponentProps) {
  // Calculate if we have enough slides for loop mode
  const childrenArray = Array.isArray(children) ? children : [children];
  const hasEnoughSlides = childrenArray.length > 1;
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Control slide from outside
  useEffect(() => {
    if (activeIndex !== undefined && swiperRef.current) {
      swiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);
  
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay, EffectFade]}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      autoplay={autoplay ? { 
        delay: 5000, 
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        stopOnLastSlide: false
      } : false}
      effect={effect}
      speed={speed}
      centeredSlides={centeredSlides}
      breakpoints={breakpoints}
      className={className}
      loop={hasEnoughSlides}
      grabCursor={true}
      keyboard={{
        enabled: true,
      }}
      mousewheel={{
        invert: false,
      }}
      onSlideChange={(swiper) => {
        onSlideChange?.(swiper.realIndex);
      }}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        // Trigger initial slide change to set active index
        onSlideChange?.(swiper.realIndex);
      }}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className="h-auto">
          <div className="h-full">
            {child}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
