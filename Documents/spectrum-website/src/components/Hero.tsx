'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

export function Hero() {
  const { content, isLoading } = useHomeContent();
  

  // Helper function to check if URL is YouTube or Vimeo
  const isYouTubeOrVimeo = (url: string): boolean => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  // Helper function to convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1&background=1`;
    }
    return url;
  };

  // Get first slide only (single hero content)
  const heroSlide = content.hero.slides && content.hero.slides.length > 0 
    ? {
        id: content.hero.slides[0].id,
        title: content.hero.slides[0].title,
        subtitle: content.hero.slides[0].subtitle,
        image: content.hero.slides[0].image,
        video: content.hero.slides[0].video || '',
        cta: content.hero.slides[0].cta,
        href: content.hero.slides[0].href,
      }
    : {
          id: 1,
          title: content.hero.title,
          subtitle: content.hero.subtitle,
          image: content.hero.imageUrl || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop',
        video: '',
          cta: content.hero.buttonText,
          href: content.hero.buttonLink,
      };


  if (isLoading) {
    return (
      <section className="relative">
        <div className="relative h-[800px] lg:h-[1000px] bg-gray-100 animate-pulse">
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

  const hasVideo = heroSlide.video && heroSlide.video.trim() !== '';
  const isEmbedVideo = hasVideo && isYouTubeOrVimeo(heroSlide.video);

  return (
    <section className="relative">
      {/* Hero Content - Single */}
      <div className="relative h-[800px] lg:h-[1000px]">
        {/* Video Background */}
        {hasVideo && isEmbedVideo ? (
          <iframe
            src={getYouTubeEmbedUrl(heroSlide.video)}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : hasVideo ? (
          <video
            src={heroSlide.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
              <Image
            src={heroSlide.image}
            alt={heroSlide.title}
                fill
                className="object-cover"
            priority
              />
        )}
              
        <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
                    <motion.h1 
                className="text-2xl lg:text-3xl font-bold text-white mb-3"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                {heroSlide.title}
                    </motion.h1>
                    <motion.p 
                className="text-base lg:text-lg text-white/90 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                {heroSlide.subtitle}
                    </motion.p>
              {heroSlide.cta && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex justify-center"
                      >
                        <Button 
                          size="lg" 
                          className="group"
                          asChild
                        >
                    <Link href={heroSlide.href || '#'}>
                      {heroSlide.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
          </div>
        </div>
      </div>
    </section>
  );
}
