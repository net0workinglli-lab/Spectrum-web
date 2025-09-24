'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Save, Eye, ArrowLeft, Plus, X,
  Calendar, User, Tag, 
  Type, AlignLeft, Hash, Clock
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { createBlogPost, getCategories } from '@/lib/firebase-firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import BlogLayoutSelector from '@/components/admin/BlogLayoutSelector';
import BlogLayoutTemplate from '@/components/admin/BlogLayoutTemplates';
import BlogLayoutPreview from '@/components/admin/BlogLayoutPreview';

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function NewBlogPostPage() {
  const { isLoggedIn, user } = useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published',
    featuredImage: '',
    readingTime: '',
    layout: 'standard' as string
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
    
    // Auto-calculate reading time
    if (field === 'content') {
      const wordsPerMinute = 200;
      const wordCount = value.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / wordsPerMinute);
      setFormData(prev => ({ ...prev, readingTime: `${readingTime} min read` }));
    }
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
        setError('Tiêu đề bài viết là bắt buộc');
        setIsLoading(false);
        return;
      }
      
      if (formData.title.trim().length < 10) {
        setError('Tiêu đề bài viết phải có ít nhất 10 ký tự');
        setIsLoading(false);
        return;
      }
      
      if (!formData.content.trim()) {
        setError('Nội dung bài viết là bắt buộc');
        setIsLoading(false);
        return;
      }
      
      if (formData.content.trim().length < 50) {
        setError('Nội dung bài viết phải có ít nhất 50 ký tự');
        setIsLoading(false);
        return;
      }
      
      if (!formData.category) {
        setError('Vui lòng chọn danh mục cho bài viết');
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
        layout: formData.layout,
        publishedAt: formData.status === 'published' ? new Date().toISOString() : null
      };

      // Create blog post in Firebase
      const postId = await createBlogPost(blogPostData);
      
      if (formData.status === 'published') {
        setSuccess('Bài viết đã được xuất bản thành công!');
      } else {
        setSuccess('Bài viết đã được lưu bản nháp thành công!');
      }
      
      // Redirect to blog management after a short delay
      setTimeout(() => {
        router.push('/admin/blog');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
                <p className="text-gray-600">Write and publish a new blog post</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'draft' }));
                  handleSubmit(new Event('submit') as any);
                }}
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'published' }));
                  handleSubmit(new Event('submit') as any);
                }}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                {isLoading ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
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
                  
                  {isPreview ? (
                    // Preview Mode with Layout Template
                    <div className="space-y-6">
                      <BlogLayoutTemplate
                        layout={formData.layout}
                        formData={formData}
                        author={{
                          name: user?.name || 'Author',
                          email: user?.email || 'admin@spectrum.com',
                          ...(user?.avatar && { avatar: user.avatar })
                        }}
                      />
                    </div>
                  ) : (
                    // Edit Mode with Layout-specific Forms
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Layout-specific Content Forms */}
                      {formData.layout === 'featured' && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                          <h3 className="font-semibold text-yellow-800 mb-2">Featured Story Layout</h3>
                          <p className="text-sm text-yellow-700">Layout này tối ưu cho hero image và title nổi bật. Đảm bảo có featured image đẹp!</p>
                        </div>
                      )}

                      {formData.layout === 'list' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                          <h3 className="font-semibold text-green-800 mb-2">List Article Layout</h3>
                          <p className="text-sm text-green-700">Layout này tối ưu cho listicles. Sử dụng số thứ tự (1., 2., 3.) hoặc bullet points (-, *) để tạo danh sách.</p>
                        </div>
                      )}

                      {formData.layout === 'gallery' && (
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                          <h3 className="font-semibold text-purple-800 mb-2">Photo Gallery Layout</h3>
                          <p className="text-sm text-purple-700">Layout này tập trung vào hình ảnh. Đảm bảo có featured image chất lượng cao!</p>
                        </div>
                      )}

                      {formData.layout === 'video' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                          <h3 className="font-semibold text-red-800 mb-2">Video Post Layout</h3>
                          <p className="text-sm text-red-700">Layout này tối ưu cho video content. Featured image sẽ hiển thị như video thumbnail.</p>
                        </div>
                      )}

                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder={formData.layout === 'featured' ? 'Enter compelling headline for featured story...' : 'Enter post title...'}
                          className="text-lg"
                        />
                      </div>

                      {/* Slug */}
                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleInputChange('slug', e.target.value)}
                          placeholder="url-friendly-slug"
                        />
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => handleInputChange('excerpt', e.target.value)}
                          placeholder={
                            formData.layout === 'featured' 
                              ? 'Brief description that will appear on hero section...'
                              : formData.layout === 'list'
                              ? 'Brief description of the list/article...'
                              : formData.layout === 'gallery'
                              ? 'Brief description of the photo gallery...'
                              : formData.layout === 'video'
                              ? 'Brief description of the video content...'
                              : 'Brief description of the post...'
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Featured Image */}
                      <ImageUpload
                        images={formData.featuredImage ? [formData.featuredImage] : []}
                        onImagesChange={(images) => handleInputChange('featuredImage', images[0] || '')}
                        maxImages={1}
                        label="Featured Image"
                        description={
                          formData.layout === 'featured'
                            ? "Upload a hero image for featured story. This will be the main background image."
                            : formData.layout === 'gallery'
                            ? "Upload a main image for photo gallery. This will be prominently displayed."
                            : formData.layout === 'video'
                            ? "Upload a thumbnail image for video post. This will appear as video preview."
                            : "Upload a featured image for this blog post. Only one image allowed."
                        }
                      />

                      {/* Content */}
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          placeholder={
                            formData.layout === 'list'
                              ? "Write your list content here. Use numbers (1., 2., 3.) or bullets (-, *) for list items:\n\n1. First item\n2. Second item\n3. Third item\n\nOr:\n\n- Bullet point one\n- Bullet point two\n- Bullet point three"
                              : formData.layout === 'featured'
                              ? "Write your featured story content here. Focus on compelling narrative and engaging storytelling..."
                              : formData.layout === 'gallery'
                              ? "Write content about your photo gallery. Describe the images and their significance..."
                              : formData.layout === 'video'
                              ? "Write content about your video. Include transcript, timestamps, or additional information..."
                              : "Write your post content here..."
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={15}
                        />
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Layout Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Layout Bài Viết
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <BlogLayoutSelector
                    selectedLayout={formData.layout}
                    onLayoutChange={(layoutId) => setFormData(prev => ({ ...prev, layout: layoutId }))}
                  />
                  
                  {/* Layout Preview */}
                  <BlogLayoutPreview
                    layout={formData.layout}
                    formData={formData}
                    author={{
                      name: user?.name || 'Author',
                      email: user?.email || 'admin@spectrum.com',
                      ...(user?.avatar && { avatar: user.avatar })
                    }}
                  />
                </CardContent>
              </Card>

              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Publish Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Category</Label>
                    {loadingCategories ? (
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                        Loading categories...
                      </div>
                    ) : (
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Reading Time</Label>
                    <Input
                      value={formData.readingTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, readingTime: e.target.value }))}
                      placeholder="5 min read"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Post Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlignLeft className="h-5 w-5" />
                    Post Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Word Count</span>
                    <span className="font-medium">{formData.content.split(/\s+/).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Character Count</span>
                    <span className="font-medium">{formData.content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Reading Time</span>
                    <span className="font-medium">{formData.readingTime || '0 min read'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tags</span>
                    <span className="font-medium">{formData.tags.length}</span>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    SEO Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Title (60 chars max)</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <div className={`font-medium ${formData.title.length > 60 ? 'text-red-500' : 'text-gray-900'}`}>
                        {formData.title || 'Untitled Post'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData.title.length}/60 characters
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Meta Description (160 chars max)</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm">
                      <div className={`text-gray-600 ${formData.excerpt.length > 160 ? 'text-red-500' : 'text-gray-600'}`}>
                        {formData.excerpt || 'No description provided'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formData.excerpt.length}/160 characters
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">URL Slug</Label>
                    <div className="p-2 bg-gray-50 rounded text-sm font-mono text-gray-600">
                      /blog/{formData.slug || 'untitled-post'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
