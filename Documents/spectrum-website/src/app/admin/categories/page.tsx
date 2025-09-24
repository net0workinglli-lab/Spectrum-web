'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Edit, Trash2, Search, RefreshCw, Tag, 
  Hash, Palette, Save, X, Eye, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/firebase-firestore';
import { ImageUpload } from '@/components/ImageUpload';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  image?: string;
  postCount: number;
  productCount?: number;
  type: 'blog' | 'product';
  createdAt: string;
  updatedAt: string;
}

// Helper function to process Firestore timestamps
const processTimestamp = (timestamp: unknown): string => {
  if (!timestamp) return new Date().toISOString();
  
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    return (timestamp as { toDate: () => Date }).toDate().toISOString();
  }
  
  return new Date().toISOString();
};

export default function CategoriesManagementPage() {
  const { isLoggedIn, user } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    image: '',
    type: 'product' as 'blog' | 'product'
  });
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'blog' | 'product'>('all');

  // Load categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategories();
        const processedCategories = categoriesData.map((category: Record<string, unknown>) => ({
          id: category.id as string,
          name: category.name as string,
          slug: category.slug as string,
          description: category.description as string,
          color: category.color as string,
          image: category.image as string || '',
          postCount: category.postCount as number || 0,
          productCount: category.productCount as number || 0,
          type: category.type as 'blog' | 'product' || 'blog',
          createdAt: processTimestamp(category.createdAt),
          updatedAt: processTimestamp(category.updatedAt)
        }));
        setCategories(processedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Có lỗi xảy ra khi tải danh mục');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      loadCategories();
    }
  }, [isLoggedIn]);

  // Filter categories
  useEffect(() => {
    let filtered = categories;

    // Filter by type
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(category => category.type === categoryFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCategories(filtered);
  }, [categories, searchTerm, categoryFilter]);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, '');
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      image: '',
      type: 'product'
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCreating(false);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color,
      image: category.image || '',
      type: category.type || 'blog'
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      image: '',
      type: 'product'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Tên danh mục không được để trống');
      return;
    }

    const slug = generateSlug(formData.name);
    
    // Check if slug already exists
    const existingCategory = categories.find(cat => 
      cat.slug === slug && cat.id !== editingCategory?.id
    );
    
    if (existingCategory) {
      toast.error('Tên danh mục đã tồn tại');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, {
          name: formData.name,
          slug: slug,
          description: formData.description,
          color: formData.color,
          image: formData.image,
          type: formData.type
        });
        
        // Update local state
        const updatedCategory = {
          ...editingCategory,
          name: formData.name,
          slug: slug,
          description: formData.description,
          color: formData.color,
          image: formData.image,
          type: formData.type,
          updatedAt: new Date().toISOString()
        };
        
        setCategories(prev => 
          prev.map(cat => cat.id === editingCategory.id ? updatedCategory : cat)
        );
        toast.success('Danh mục đã được cập nhật!');
      } else {
        // Create new category
        const categoryData = {
          name: formData.name,
          slug: slug,
          description: formData.description,
          color: formData.color,
          image: formData.image,
          type: formData.type,
          postCount: 0,
          productCount: 0
        };
        
        const categoryId = await createCategory(categoryData);
        
        // Update local state
        const newCategory: Category = {
          id: categoryId,
          name: formData.name,
          slug: slug,
          description: formData.description,
          color: formData.color,
          image: formData.image,
          type: formData.type,
          postCount: 0,
          productCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCategories(prev => [newCategory, ...prev]);
        toast.success('Danh mục đã được tạo!');
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Có lỗi xảy ra khi lưu danh mục');
    }
  };

  const handleDelete = async (category: Category) => {
    if (category.postCount > 0) {
      toast.error('Không thể xóa danh mục có bài viết. Vui lòng di chuyển các bài viết trước.');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`)) {
      return;
    }

    try {
      await deleteCategory(category.id);
      setCategories(prev => prev.filter(cat => cat.id !== category.id));
      toast.success('Danh mục đã được xóa!');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Có lỗi xảy ra khi xóa danh mục');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="outline" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage blog and product categories</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | 'blog' | 'product')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="blog">Blog Categories</option>
              <option value="product">Product Categories</option>
            </select>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Category Stats */}
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Total: {categories.length}</span>
            <span>Blog: {categories.filter(c => c.type === 'blog').length}</span>
            <span>Product: {categories.filter(c => c.type === 'product').length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {(isCreating || editingCategory) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'blog' | 'product' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="product">Product Category</option>
                    <option value="blog">Blog Category</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <ImageUpload
                  images={formData.image ? [formData.image] : []}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, image: images[0] || '' }))}
                  maxImages={1}
                  label="Category Image"
                  description="Upload a category image or add image URL. This image will be displayed in the category section on the homepage."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <div className="relative h-32 w-full overflow-hidden rounded-t-lg bg-gray-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Image load error:', category.image);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Tag className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={category.type === 'product' ? 'default' : 'secondary'} className="text-xs">
                          {category.type === 'product' ? 'Product' : 'Blog'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {category.type === 'product' ? 
                            `${category.productCount || 0} products` : 
                            `${category.postCount} posts`
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    <span>Slug: {category.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    <span>Color: {category.color}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>Created: {formatDate(category.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Category
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
