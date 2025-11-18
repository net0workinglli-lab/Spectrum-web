'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useContent } from '@/hooks/useContent';

export function SecondaryHero() {
  const { content, isLoading } = useContent('secondary-hero-section');

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

  // Default content
  const defaultImage = 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=600&fit=crop';

  const title = content?.title || '';
  const subtitle = content?.subtitle || '';
  const image = content?.imageUrl || content?.images?.[0] || defaultImage;
  const video = content?.video || '';
  const cta = content?.buttonText || '';
  const href = content?.buttonLink || '/products';

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

  const hasVideo = video && video.trim() !== '';
  const isEmbedVideo = hasVideo && isYouTubeOrVimeo(video);

  return (
    <section className="relative">
      <div className="relative h-[800px] lg:h-[1000px]">
        {/* Video Background */}
        {hasVideo && isEmbedVideo ? (
          <iframe
            src={getYouTubeEmbedUrl(video)}
            className="absolute inset-0 w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : hasVideo ? (
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        )}
        
        <div className="absolute inset-0 flex items-start justify-center pt-16 lg:pt-24 pb-16 lg:pb-24">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="mx-auto text-center">
              {title && (
                <motion.h1 
                  className="text-xl lg:text-2xl font-medium text-white mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {title}
                </motion.h1>
              )}
              {subtitle && (
                <motion.p 
                  className="text-xs lg:text-sm text-white/90 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  {subtitle}
                </motion.p>
              )}
              {cta && cta.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex justify-center"
                >
                  <Button 
                    size="lg" 
                    className="group"
                    asChild
                  >
                    <Link href={href || '#'}>
                      {cta}
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

