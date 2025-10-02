'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  FileText, Save, ArrowLeft, Plus, X,
  Calendar, User, Tag, Type, AlignLeft, Clock
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getBlogPosts, updateBlogPost, getCategories } from '@/lib/firebase-firestore';
import Link from 'next/link';
import { ImageUpload } from '@/components/ImageUpload';

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
  color: string;
}

function EditBlogPost() {
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  
  const { isLoggedIn, user } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'archived',
    featuredImage: '',
    readingTime: '',
  });

  // Load blog post data
  useEffect(() => {
    const loadBlogPost = async () => {
      if (!postId) {
        setError('No post ID provided');
        setIsLoadingPost(false);
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

        const foundPost = processedPosts.find(p => p.id === postId);
        
        if (foundPost) {
          setFormData({
            title: foundPost.title,
            slug: foundPost.slug,
            excerpt: foundPost.excerpt,
            content: foundPost.content,
            category: foundPost.category,
            tags: foundPost.tags,
            status: foundPost.status,
            featuredImage: foundPost.featuredImage || '',
            readingTime: foundPost.readingTime,
          });
        } else {
          setError('Post not found');
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoadingPost(false);
      }
    };

    loadBlogPost();
  }, [postId]);

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
          color: category.color as string
        }));
        setCategories(processedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Có lỗi xảy ra khi tải danh mục');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isLoggedIn) {
      loadCategories();
    }
  }, [isLoggedIn]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        setError('Title is required');
        setIsLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        setError('Content is required');
        setIsLoading(false);
        return;
      }

      if (!postId) {
        setError('Post ID is required');
        setIsLoading(false);
        return;
      }

      // Prepare blog post data
      const blogPostData = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        featuredImage: formData.featuredImage.trim(),
        readingTime: formData.readingTime || `${Math.ceil(formData.content.split(/\s+/).length / 200)} min read`,
        author: {
          name: user?.name || 'Admin',
          email: user?.email || 'admin@spectrum.com',
          ...(user?.avatar && { avatar: user.avatar })
        },
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null,
        views: 0,
        likes: 0,
        comments: 0,
      };

      // Update blog post in Firebase
      await updateBlogPost(postId, blogPostData);

      setSuccess('Blog post updated successfully!');

      // Redirect to blog management after a short delay
      setTimeout(() => {
        window.location.href = '/admin/blog';
      }, 1500);

    } catch (error) {
      console.error('Error updating blog post:', error);
      setError('Failed to update blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to access this page.
            </p>
            <Button asChild>
              <Link href="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button asChild>
              <Link href="/admin/blog">Back to Blog Management</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <div className="flex gap-2">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            <Save className="h-4 w-4 mr-2" />
            Update Post
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Post Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Error and Success Messages */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                  {success}
                </div>
              )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter post title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="auto-generated from title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleChange}
                      placeholder="A short summary of the post"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      placeholder="Write your blog post content here..."
                      rows={15}
                      required
                    />
                  </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Post Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'draft' | 'published' | 'archived' }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                {loadingCategories ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                    Loading categories...
                  </div>
                ) : (
                  <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <ImageUpload
                images={formData.featuredImage ? [formData.featuredImage] : []}
                onImagesChange={(images) => setFormData(prev => ({ ...prev, featuredImage: images[0] || '' }))}
                maxImages={1}
                label="Featured Image"
                description="Upload a featured image for this blog post. Only one image allowed."
              />
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 flex-wrap">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newTag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Post Stats</Label>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <AlignLeft className="h-4 w-4" />
                    <span>{formData.content.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Type className="h-4 w-4" />
                    <span>{formData.content.length} chars</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formData.readingTime || `${Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200)} min read`}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}

export default function EditBlogPostPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <EditBlogPost />
    </Suspense>
  );
}
