'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, User, ArrowLeft, Clock, Eye, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/firebase-firestore';
import EditorJSContent from '@/components/EditorJSContent';

// Enhanced helper function to sanitize data for React compatibility
const sanitizeForReact = (obj: any): any => {
  try {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    // Handle primitives
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return obj;
    }
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeForReact(item)).filter(item => item !== null && item !== undefined);
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      // Check for circular references
      if (obj instanceof Date || obj instanceof RegExp || obj instanceof Function) {
        return null;
      }
      
      // Handle objects that might cause React Error #31
      const sanitized: any = {};
      const allowedKeys = new Set(['time', 'blocks', 'version', 'id', 'type', 'data', 'text', 'level', 'items', 'content', 'caption', 'code', 'link', 'style', 'meta', 'title', 'description', 'image', 'url']);
      
      for (const [key, value] of Object.entries(obj)) {
        // Only allow safe keys and skip problematic ones
        if (!allowedKeys.has(key) && !key.startsWith('_') && !key.includes('content') && !key.includes('meta') && !key.includes('items')) {
          continue;
        }
        
        try {
          if (
            typeof value === 'string' || 
            typeof value === 'number' || 
            typeof value === 'boolean' ||
            value === null ||
            value === undefined
          ) {
            sanitized[key] = value;
          } else if (Array.isArray(value)) {
            sanitized[key] = sanitizeForReact(value);
          } else if (typeof value === 'object' && value !== null) {
            // Prevent the specific problematic objects mentioned in the error
            const valueAny = value as any;
            if (valueAny.content || valueAny.meta || valueAny.items) {
              // Further sanitize these specific problematic structures
              const safeValue: any = {};
              if (typeof valueAny.content === 'string') safeValue.content = valueAny.content;
              if (typeof valueAny.text === 'string') safeValue.text = valueAny.text;
              if (typeof valueAny.level === 'number') safeValue.level = valueAny.level;
              if (typeof valueAny.style === 'string') safeValue.style = valueAny.style;
              if (Array.isArray(valueAny.items)) {
                safeValue.items = valueAny.items.map((item: any) => {
                  if (typeof item === 'string') return item;
                  if (typeof item === 'object' && item && typeof (item as any).text === 'string') return (item as any).text;
                  return String(item || '');
                });
              }
              sanitized[key] = safeValue;
            } else {
              sanitized[key] = sanitizeForReact(value);
            }
          }
        } catch (e) {
          // Skip problematic properties
          continue;
        }
      }
      return sanitized;
    }
    
    // Fallback for unknown types
    return null;
  } catch (error) {
    console.warn('Error sanitizing data for React:', error);
    return null;
  }
};

// Enhanced helper function to sanitize content specifically for EditorJSContent
const sanitizeContent = (content: string | any): string => {
  try {
    if (typeof content === 'string') {
      if (!content.trim()) {
        return JSON.stringify({
          time: Date.now(),
          blocks: [],
          version: '2.28.2'
        });
      }
      
      const parsed = JSON.parse(content);
      const sanitized = sanitizeForReact(parsed);
      
      // Double validation
      const testStringify = JSON.stringify(sanitized);
      const testParse = JSON.parse(testStringify);
      
      return JSON.stringify(testParse);
    } else if (typeof content === 'object' && content !== null) {
      const sanitized = sanitizeForReact(content);
      return JSON.stringify(sanitized);
    }
    return JSON.stringify({
      time: Date.now(),
      blocks: [],
      version: '2.28.2'
    });
  } catch (error) {
    console.warn('Error sanitizing content:', error);
    // Return safe fallback structure
    return JSON.stringify({
      time: Date.now(),
      blocks: [],
      version: '2.28.2'
    });
  }
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'archived';
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  readingTime: string;
}

function BlogPostDetail() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load blog post from Firebase
  useEffect(() => {
    const loadBlogPost = async () => {
      if (!slug) {
        setError('No post specified');
        setIsLoading(false);
        return;
      }

      try {
        const firebasePosts = await getBlogPosts();
        
        // Process Firestore data to handle Timestamps
        const processedPosts = firebasePosts.map((post: Record<string, unknown>) => {
          const processTimestamp = (timestamp: unknown): string => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as { toDate: () => Date }).toDate().toISOString();
            }
            if (typeof timestamp === 'string') {
              return timestamp;
            }
            return new Date().toISOString();
          };

          return {
            ...post,
            createdAt: processTimestamp(post.createdAt),
            updatedAt: processTimestamp(post.updatedAt),
            publishedAt: post.publishedAt ? processTimestamp(post.publishedAt) : null,
          };
        }) as BlogPost[];

        // Find the post by slug
        const foundPost = processedPosts.find(p => p.slug === slug && p.status === 'published');
        
        if (foundPost) {
          setPost(foundPost);
          
          // Get related posts (same category, excluding current post)
          const related = processedPosts
            .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
            .slice(0, 3);
          setRelatedPosts(related);
        } else {
          setError('Post not found');
        }
      } catch (error) {
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'The blog post you are looking for does not exist.'}
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Content */}
              <EditorJSContent 
                data={sanitizeContent(post.content)} 
                className="prose prose-lg max-w-none"
              />
              
              {/* Tags */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-8 pt-8 border-t flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Like ({post.likes})
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{post.author.name}</h4>
                      <p className="text-sm text-muted-foreground">{post.author.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                            {relatedPost.featuredImage ? (
                              <Image
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-xs font-medium">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              <Link 
                                href={`/blog-detail?slug=${relatedPost.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {relatedPost.title}
                              </Link>
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Newsletter Signup */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
                  <p className="text-muted-foreground mb-4">
                    Get the latest eyewear trends and eye health tips delivered to your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPostDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <BlogPostDetail />
    </Suspense>
  );
}
