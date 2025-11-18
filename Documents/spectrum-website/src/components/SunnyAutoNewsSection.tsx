'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getBlogPosts } from '@/lib/firebase-firestore';
import { useContent } from '@/hooks/useContent';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string | { seconds: number } | { toDate: () => Date };
  category?: string;
  readingTime?: string;
  author?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function SunnyAutoNewsSection() {
  const { content } = useContent('sunny-auto-news-section');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const firebasePosts = await getBlogPosts();
        
        // Process Firestore data to handle Timestamps
        const processedPosts = firebasePosts
          .filter((post: any) => post.status === 'published')
          .slice(0, 3) // Get latest 3 posts
          .map((post: any) => {
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
              id: post.id,
              title: post.title || '',
              slug: post.slug || post.id,
              excerpt: post.excerpt || post.content?.substring(0, 150) || '',
              featuredImage: post.featuredImage,
              publishedAt: post.publishedAt || post.createdAt,
              createdAt: processTimestamp(post.createdAt),
              category: post.category,
              readingTime: post.readingTime || '5 min read',
              author: post.author,
            };
          }) as BlogPost[];

        setPosts(processedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const sectionTitle = content?.title || 'Sunny Auto News';
  const sectionDescription = content?.description || 'Sunny Auto continues to push boundaries and bring you the latest innovations.';
  const buttonText = content?.buttonText || 'View All News';
  const buttonLink = content?.buttonLink || '/blog';

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-12 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="container mx-auto px-4 max-w-[1200px]">
        {/* Header */}
        <div className="text-center mb-6">
          {/* Badge - Similar to Featured Products Section */}
          <div className="text-center mb-2">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              Latest Updates
            </p>
          </div>
          
          <h2 className="text-xl lg:text-2xl font-normal mb-2 text-slate-900">
            {sectionTitle}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm mb-4">
            {sectionDescription}
          </p>
          
          {/* View All Button */}
          <div className="flex justify-center mb-8">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="border-emerald-600/60 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 transition-all rounded-full px-6 text-xs"
            >
              <Link href={buttonLink} className="flex items-center gap-2">
                {buttonText}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/blog-detail?slug=${post.slug}`}>
                <div className="group h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-400/60">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-slate-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-slate-200 flex items-center justify-center">
                        <Calendar className="h-16 w-16 text-emerald-400/50" />
                      </div>
                    )}
                    {post.category && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-emerald-600 text-white border-0 text-[10px] px-1.5 py-0.5">
                          {post.category}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-normal mb-1.5 text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-2 line-clamp-2 text-xs">
                      {post.excerpt}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px]">{formatDate(post.createdAt as Date)}</span>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-[10px]">{post.readingTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center text-emerald-600 font-medium text-xs group-hover:gap-1.5 transition-all">
                      Read more
                      <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

