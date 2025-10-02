'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ReactNode } from 'react';

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
  breakpoints?: {
    [width: number]: {
      slidesPerView: number;
      spaceBetween: number;
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
  breakpoints,
}: SwiperComponentProps) {
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
      breakpoints={breakpoints}
      className={className}
      loop={true}
      grabCursor={true}
      keyboard={{
        enabled: true,
      }}
      mousewheel={{
        invert: false,
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
