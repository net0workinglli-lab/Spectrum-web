'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, getCategories } from '@/lib/firebase-firestore';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

// Mock blog posts data (fallback)
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Choose the Perfect Sunglasses for Your Face Shape',
    slug: 'choose-perfect-sunglasses-face-shape',
    excerpt: 'Discover the secrets to finding sunglasses that complement your unique face shape and enhance your personal style.',
    content: 'Full article content here...',
    featuredImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop',
    author: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah@spectrum.com'
    },
    publishedAt: '2024-01-15T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    tags: ['fashion', 'sunglasses', 'style'],
    category: 'fashion',
    status: 'published',
    readingTime: '5 min read',
    views: 150,
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    title: 'Blue Light Glasses: Do You Really Need Them?',
    slug: 'blue-light-glasses-do-you-need-them',
    excerpt: 'Learn about blue light exposure from digital devices and whether blue light blocking glasses are worth the investment.',
    content: 'Full article content here...',
    featuredImage: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop',
    author: {
      name: 'Dr. Michael Chen',
      email: 'michael@spectrum.com'
    },
    publishedAt: '2024-01-10T00:00:00.000Z',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z',
    tags: ['health', 'technology', 'eyeglasses'],
    category: 'health',
    status: 'published',
    readingTime: '7 min read',
    views: 200,
    likes: 18,
    comments: 5,
  },
  {
    id: '3',
    title: 'The Evolution of Eyewear: From Function to Fashion',
    slug: 'evolution-eyewear-function-fashion',
    excerpt: 'Take a journey through the history of eyewear and see how glasses have evolved from simple vision aids to fashion statements.',
    content: 'Full article content here...',
    featuredImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=400&fit=crop',
    author: {
      name: 'Emma Rodriguez',
      email: 'emma@spectrum.com'
    },
    publishedAt: '2024-01-05T00:00:00.000Z',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z',
    tags: ['fashion', 'history', 'lifestyle'],
    category: 'lifestyle',
    status: 'published',
    readingTime: '6 min read',
    views: 120,
    likes: 8,
    comments: 2,
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load blog posts from Firebase
  useEffect(() => {
    const loadBlogPosts = async () => {
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

        // Filter only published posts
        const publishedPosts = processedPosts.filter(post => post.status === 'published');
        setPosts(publishedPosts);
        setFilteredPosts(publishedPosts);
      } catch (error) {
        // Fallback to mock data if Firebase fails
        setPosts(blogPosts);
        setFilteredPosts(blogPosts);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await getCategories();
        const processedCategories = categoriesData.map((category: Record<string, unknown>) => ({
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
          description: category.description as string,
          color: category.color as string,
          postCount: category.postCount as number || 0
        }));
        setCategories(processedCategories);
      } catch (error) {
        // Fallback to default categories if Firebase fails
        setCategories([
          { id: '1', name: 'Fashion', slug: 'fashion', description: 'Fashion trends', color: '#3B82F6', postCount: 0 },
          { id: '2', name: 'Health', slug: 'health', description: 'Health tips', color: '#10B981', postCount: 0 },
          { id: '3', name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle content', color: '#F59E0B', postCount: 0 },
          { id: '4', name: 'Technology', slug: 'technology', description: 'Tech news', color: '#EF4444', postCount: 0 }
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Filter posts by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredPosts(posts);
    } else {
      // Find the category by slug to get the name
      const selectedCategoryData = categories.find(cat => cat.slug === selectedCategory);
      if (selectedCategoryData) {
        setFilteredPosts(posts.filter(post => post.category.toLowerCase() === selectedCategoryData.name.toLowerCase()));
      } else {
        setFilteredPosts([]);
      }
    }
  }, [posts, selectedCategory, categories]);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  // Create categories array with post counts
  const categoriesWithCounts = [
    { name: 'All', slug: 'all', count: posts.length, color: '#6B7280' },
    ...categories.map(category => ({
      name: category.name,
      slug: category.slug,
      count: posts.filter(post => post.category.toLowerCase() === category.name.toLowerCase()).length,
      color: category.color
    }))
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay informed about eye health, fashion trends, and everything related to eyewear. 
              Expert insights, style guides, and industry news.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {loadingCategories ? (
                // Loading skeleton for categories
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
                ))
              ) : (
                categoriesWithCounts.map((category) => (
                  <Badge
                    key={category.slug}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => setSelectedCategory(category.slug)}
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))
              )}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPosts.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-muted-foreground text-lg">No blog posts found.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video overflow-hidden rounded-t-lg">
                      <Image
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {post.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </div>
                        <span>{post.readingTime}</span>
                      </div>
                      
                      <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(post.tags || []).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0">
                    <Button variant="ghost" className="group" asChild>
                      <Link href={`/blog-detail?slug=${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8 space-y-8">
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

              {/* Popular Posts */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Popular Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-gray-100">
                          {post.featuredImage ? (
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
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
                              href={`/blog-detail?slug=${post.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categoriesWithCounts.slice(1).map((category) => (
                      <div key={category.slug} className="flex justify-between items-center">
                        <span className="text-sm hover:text-primary cursor-pointer">
                          {category.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
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
