'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Save, Type, Image, 
  CheckCircle, AlertCircle,
  Award, Leaf, Users, Shield, X, Settings, SlidersHorizontal,
  MessageSquare, Building2, Globe, MapPin, Monitor, Eye
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { useContent, ContentData, DropdownItem } from '@/hooks/useContent';
import { ImageUpload } from '@/components/ImageUpload';
import DropdownManager from '@/components/admin/DropdownManager';
import ProductSelector from '@/components/admin/ProductSelector';

// ContentData interface is imported from hook

// generateStaticParams is in separate file

export default function EditContentPage({ params }: { params: { id: string } }) {
  const { isLoggedIn, user } = useApp();
  const { content, isLoading, isSaving, error, saveContent, updateContent } = useContent(params.id);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Check if user is admin
  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  const handleSave = async () => {
    if (!content) return;

    const success = await saveContent(content);
    if (success) {
      setSuccessMessage('Content saved successfully!');
      setHasChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleInputChange = (field: keyof ContentData, value: string) => {
    try {
      if (typeof updateContent === 'function') {
    updateContent({ [field]: value });
    setHasChanges(true);
      } else {
        console.error('handleInputChange: updateContent is not a function', updateContent);
      }
    } catch (error) {
      console.error('Error in handleInputChange:', error);
    }
  };

  // Brand logos management functions
  const addBrandLogo = () => {
    if (!newLogoUrl.trim() || !content) return;
    
    const currentLogos = content.brandLogos || [];
    if (currentLogos.length >= 8) {
      alert('Maximum 8 brand logos allowed');
      return;
    }
    
    if (currentLogos.includes(newLogoUrl.trim())) {
      alert('This logo URL is already added');
      return;
    }
    
    const updatedLogos = [...currentLogos, newLogoUrl.trim()];
    updateContent({ brandLogos: updatedLogos });
    setNewLogoUrl('');
    setHasChanges(true);
  };

  const removeBrandLogo = (index: number) => {
    if (!content) return;
    
    const currentLogos = content.brandLogos || [];
    const updatedLogos = currentLogos.filter((_, i) => i !== index);
    updateContent({ brandLogos: updatedLogos });
    setHasChanges(true);
  };

  const addPresetLogo = (url: string) => {
    if (!content) return;
    
    const currentLogos = content.brandLogos || [];
    if (currentLogos.length >= 8) {
      alert('Maximum 8 brand logos allowed');
      return;
    }
    
    if (currentLogos.includes(url)) {
      alert('This logo is already added');
      return;
    }
    
    const updatedLogos = [...currentLogos, url];
    updateContent({ brandLogos: updatedLogos });
    setHasChanges(true);
  };

  const clearAllLogos = () => {
    if (!content) return;
    
    if (confirm('Are you sure you want to remove all brand logos?')) {
      updateContent({ brandLogos: [] });
      setHasChanges(true);
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Type className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading content...</p>
          <p className="text-sm text-gray-500 mt-2">Loading from Firebase...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Type className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Content Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested content could not be found.
            </p>
            <Button asChild>
              <Link href="/admin/content">Back to Content</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Content ID:</span>
              <Badge variant="outline">{content.id}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge variant={content.status === 'published' ? 'default' : 'outline'}>
                {content.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Last Modified:</span>
              <span className="text-gray-600">{content.lastModified}</span>
            </div>
            {content.title && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Title:</span>
                <span className="text-gray-600">{content.title}</span>
              </div>
            )}
            {content.slides && content.slides.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Slides:</span>
                <span className="text-gray-600">{content.slides.length} slides</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/content">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Content
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Content</h1>
                <p className="text-gray-600">{content.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
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
          className="max-w-6xl mx-auto"
        >
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700">{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <div className="max-w-5xl mx-auto">
            {/* Editor */}
            <div className="space-y-6">
              {/* Hero Slides Management - Only for Hero Section */}
              {content.id === 'hero-section' ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          <CardTitle>Hero Slides Management</CardTitle>
                        </div>
                        <Badge variant="outline">{content.slides?.length || 0} / 6 slides</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((slideId) => {
                        const slide = content.slides?.find(s => s.id === slideId) || {
                          id: slideId,
                          title: '',
                          subtitle: '',
                          image: '',
                          cta: '',
                          href: ''
                        };
                        
                        return (
                          <Card key={slideId} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Slide {slideId}</Badge>
                                {slideId === 1 && <Badge className="bg-blue-100 text-blue-800">Dynamic from CMS</Badge>}
                                {slideId > 1 && <Badge className="bg-gray-100 text-gray-800">Static</Badge>}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm">Title</Label>
                                  <Input
                                    value={slide.title}
                                    onChange={(e) => {
                                      const newSlides = [...(content.slides || [])];
                                      const existingIndex = newSlides.findIndex(s => s.id === slideId);
                                      if (existingIndex >= 0) {
                                        newSlides[existingIndex] = { ...newSlides[existingIndex], title: e.target.value };
                                      } else {
                                        newSlides.push({ ...slide, title: e.target.value });
                                      }
                                      handleInputChange('slides', newSlides);
                                    }}
                                    placeholder="Slide title..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm">Subtitle</Label>
                                  <Input
                                    value={slide.subtitle}
                                    onChange={(e) => {
                                      const newSlides = [...(content.slides || [])];
                                      const existingIndex = newSlides.findIndex(s => s.id === slideId);
                                      if (existingIndex >= 0) {
                                        newSlides[existingIndex] = { ...newSlides[existingIndex], subtitle: e.target.value };
                                      } else {
                                        newSlides.push({ ...slide, subtitle: e.target.value });
                                      }
                                      handleInputChange('slides', newSlides);
                                    }}
                                    placeholder="Slide subtitle..."
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <ImageUpload
                                  value={slide.image}
                                  onChange={(url) => {
                                    const newSlides = [...(content.slides || [])];
                                    const existingIndex = newSlides.findIndex(s => s.id === slideId);
                                    if (existingIndex >= 0) {
                                      newSlides[existingIndex] = { ...newSlides[existingIndex], image: url };
                                    } else {
                                      newSlides.push({ ...slide, image: url });
                                    }
                                    handleInputChange('slides', newSlides);
                                  }}
                                  placeholder="https://example.com/slide-image.jpg"
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm">Button Text</Label>
                                  <Input
                                    value={slide.cta}
                                    onChange={(e) => {
                                      const newSlides = [...(content.slides || [])];
                                      const existingIndex = newSlides.findIndex(s => s.id === slideId);
                                      if (existingIndex >= 0) {
                                        newSlides[existingIndex] = { ...newSlides[existingIndex], cta: e.target.value };
                                      } else {
                                        newSlides.push({ ...slide, cta: e.target.value });
                                      }
                                      handleInputChange('slides', newSlides);
                                    }}
                                    placeholder="Button text..."
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm">Button Link</Label>
                                  <Input
                                    value={slide.href}
                                    onChange={(e) => {
                                      const newSlides = [...(content.slides || [])];
                                      const existingIndex = newSlides.findIndex(s => s.id === slideId);
                                      if (existingIndex >= 0) {
                                        newSlides[existingIndex] = { ...newSlides[existingIndex], href: e.target.value };
                                      } else {
                                        newSlides.push({ ...slide, href: e.target.value });
                                      }
                                      handleInputChange('slides', newSlides);
                                    }}
                                    placeholder="/link"
                                  />
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Publication Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                          value={content.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : content.id === 'brands-section' ? (
                /* Brands Section Editor */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Premium Lens Brands Section Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Badge Text</Label>
                      <Input
                        value={content.badgeText || '✨ Premium Partners'}
                        onChange={(e) => handleInputChange('badgeText', e.target.value)}
                        placeholder="Badge text..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea
                        value={content.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bottom CTA Text</Label>
                      <Input
                        value={content.bottomCtaText || 'Discover our complete collection of premium eyewear from these trusted brands'}
                        onChange={(e) => handleInputChange('bottomCtaText', e.target.value)}
                        placeholder="Bottom CTA text..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Button Text</Label>
                        <Input
                          value={content.buttonText}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Primary button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Button Link</Label>
                        <Input
                          value={content.buttonLink}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/link"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secondary Button Text</Label>
                        <Input
                          value={content.secondaryButtonText || 'View Brand Stories'}
                          onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                          placeholder="Secondary button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Button Link</Label>
                        <Input
                          value={content.secondaryButtonLink || '/premium-partners'}
                          onChange={(e) => handleInputChange('secondaryButtonLink', e.target.value)}
                          placeholder="/link"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Brand Logos</Label>
                      
                      {/* Add New Logo */}
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://example.com/brand-logo.jpg"
                            value={newLogoUrl}
                            onChange={(e) => setNewLogoUrl(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addBrandLogo();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={addBrandLogo}
                            disabled={!newLogoUrl.trim()}
                            size="sm"
                          >
                            Add Logo
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500">
                          Enter a brand logo URL and click "Add Logo" to add it to the grid.
                        </p>
                      </div>

                      {/* Brand Logos Grid */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current Brand Logos ({content.brandLogos?.length || 0}/8)</span>
                          {content.brandLogos && content.brandLogos.length > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={clearAllLogos}
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                        
                        {content.brandLogos && content.brandLogos.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {content.brandLogos.map((logoUrl, index) => (
                              <div key={index} className="relative group">
                                <div className="border rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                                  <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                                    <img
                                      src={logoUrl}
                                      alt={`Brand ${index + 1}`}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW52YWxpZDwvdGV4dD48L3N2Zz4=';
                                      }}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-600 truncate">Brand {index + 1}</p>
                                    <p className="text-xs text-gray-400 truncate">{logoUrl.split('/').pop()}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeBrandLogo(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <Image className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-sm text-gray-500 mb-2">No brand logos added yet</p>
                            <p className="text-xs text-gray-400">Add your first brand logo above</p>
                          </div>
                        )}
                      </div>

                      {/* Quick Add Presets */}
                      <div className="space-y-2">
                        <Label className="text-sm">Quick Add Popular Brands</Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: 'Ray-Ban', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=100&fit=crop' },
                            { name: 'Oakley', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=100&fit=crop' },
                            { name: 'Persol', url: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=200&h=100&fit=crop' },
                            { name: 'Warby Parker', url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=100&fit=crop' },
                            { name: 'Tom Ford', url: 'https://images.unsplash.com/photo-1506629905607-7b1b0b0b0b0b?w=200&h=100&fit=crop' },
                            { name: 'Gucci', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=100&fit=crop' }
                          ].map((brand) => (
                            <Button
                              key={brand.name}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addPresetLogo(brand.url)}
                              disabled={content.brandLogos?.includes(brand.url) || (content.brandLogos?.length || 0) >= 8}
                              className="text-xs"
                            >
                              {brand.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : content.id === 'header-section' ? (
                /* Header Section Editor - 2 Column Layout */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Settings */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Basic Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Logo */}
                        <div className="space-y-2">
                          <Label>Logo Text</Label>
                          <Input
                            value={content.logoText || 'Spectrum'}
                            onChange={(e) => handleInputChange('logoText', e.target.value)}
                            placeholder="Spectrum"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <ImageUpload
                            value={content.logoImage || ''}
                            onChange={(url) => handleInputChange('logoImage', url)}
                            placeholder="https://example.com/logo.png"
                            label="Logo Image"
                          />
                        </div>

                        {/* Top Bar */}
                        <div className="space-y-2">
                          <Label>Top Bar Left Text</Label>
                          <Input
                            value={content.topBarLeft || 'Free consultation and eye exam'}
                            onChange={(e) => handleInputChange('topBarLeft', e.target.value)}
                            placeholder="Free consultation and eye exam"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Top Bar Right Text</Label>
                          <Input
                            value={content.topBarRight || '30-day return policy'}
                            onChange={(e) => handleInputChange('topBarRight', e.target.value)}
                            placeholder="30-day return policy"
                          />
                        </div>

                        {/* Top Links */}
                        <div className="space-y-2">
                          <Label>Blog Link Text</Label>
                          <Input
                            value={content.blogLinkText || 'Blog'}
                            onChange={(e) => handleInputChange('blogLinkText', e.target.value)}
                            placeholder="Blog"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Contact Link Text</Label>
                          <Input
                            value={content.contactLinkText || 'Contact'}
                            onChange={(e) => handleInputChange('contactLinkText', e.target.value)}
                            placeholder="Contact"
                          />
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                          <Label>Search Placeholder</Label>
                          <Input
                            value={content.searchPlaceholder || 'Search glasses, brands...'}
                            onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
                            placeholder="Search glasses, brands..."
                          />
                        </div>

                        {/* Dropdown Menu Titles */}
                        <div className="border-t pt-4 mt-4">
                          <Label className="text-base font-semibold mb-3 block">Dropdown Menu Titles</Label>
                          
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm">Dropdown Menu 1 Title</Label>
                              <Input
                                value={content.productsDropdownTitle || 'Products'}
                                onChange={(e) => handleInputChange('productsDropdownTitle', e.target.value)}
                                placeholder="e.g. Products, Shop, Categories"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">Dropdown Menu 2 Title</Label>
                              <Input
                                value={content.brandsDropdownTitle || 'Brands'}
                                onChange={(e) => handleInputChange('brandsDropdownTitle', e.target.value)}
                                placeholder="e.g. Brands, Partners, Collections"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm">Dropdown Menu 3 Title</Label>
                              <Input
                                value={content.lensesDropdownTitle || 'Lenses'}
                                onChange={(e) => handleInputChange('lensesDropdownTitle', e.target.value)}
                                placeholder="e.g. Lenses, Technology, Solutions"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="border-t pt-4 mt-4">
                          <Label>Status</Label>
                          <select
                            value={content.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Navigation & Dropdown Managers */}
                  <div className="space-y-6">
                    <DropdownManager
                      title="Navigation Items"
                      items={content.navigationItems || []}
                      onItemsChange={(items) => handleInputChange('navigationItems', items)}
                      placeholder="Enter navigation item name"
                      maxItems={5}
                      category="navigation"
                    />

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          {content.productsDropdownTitle || 'Dropdown Menu 1'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage items for &quot;{content.productsDropdownTitle || 'Products'}&quot; dropdown
                        </p>
                      </CardHeader>
                      <CardContent>
                        <DropdownManager
                          title=""
                          items={content.productsDropdown || []}
                          onItemsChange={(items) => handleInputChange('productsDropdown', items)}
                          placeholder="e.g. Eyeglasses, Sunglasses, Contact Lenses"
                          maxItems={8}
                          category="products"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          {content.brandsDropdownTitle || 'Dropdown Menu 2'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage items for &quot;{content.brandsDropdownTitle || 'Brands'}&quot; dropdown
                        </p>
                      </CardHeader>
                      <CardContent>
                        <DropdownManager
                          title=""
                          items={content.brandsDropdown || []}
                          onItemsChange={(items) => handleInputChange('brandsDropdown', items)}
                          placeholder="e.g. Ray-Ban, Oakley, Gucci"
                          maxItems={10}
                          category="brands"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          {content.lensesDropdownTitle || 'Dropdown Menu 3'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage items for &quot;{content.lensesDropdownTitle || 'Lenses'}&quot; dropdown
                        </p>
                      </CardHeader>
                      <CardContent>
                        <DropdownManager
                          title=""
                          items={content.lensesDropdown || []}
                          onItemsChange={(items) => handleInputChange('lensesDropdown', items)}
                          placeholder="e.g. Essilor, Hoya, Zeiss"
                          maxItems={10}
                          category="lenses"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : content.id === 'esg-certificate-page' ? (
                /* ESG Certificate Page Editor */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      ESG Certificate Page Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="ESG Certificate"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Page Subtitle</Label>
                      <Input
                        value={content.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Environmental, Social & Governance Certification"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Badge Text</Label>
                      <Input
                        value={content.badgeText || 'Synesgy ESG Certified'}
                        onChange={(e) => handleInputChange('badgeText', e.target.value)}
                        placeholder="Synesgy ESG Certified"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Title</Label>
                      <Input
                        value={content.heroTitle || 'Among Vietnam\'s First Sustainable Eyewear Retailers'}
                        onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                        placeholder="Hero title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Description</Label>
                      <textarea
                        value={content.heroDescription || 'On May 5, 2025, Spectrum Eyecare was awarded the prestigious Synesgy Environmental, Social, and Governance (ESG) Certificate, recognizing our commitment to sustainable practices and ethical business operations.'}
                        onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                        placeholder="Hero description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <ImageUpload
                        value={content.imageUrl}
                        onChange={(url) => handleInputChange('imageUrl', url)}
                        placeholder="https://example.com/certificate-image.jpg"
                        label="Certificate Image"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Title (Overlay)</Label>
                      <Input
                        value={content.certificateTitle || 'Synesgy ESG Certificate'}
                        onChange={(e) => handleInputChange('certificateTitle', e.target.value)}
                        placeholder="Certificate title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Subtitle (Overlay)</Label>
                      <Input
                        value={content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                        onChange={(e) => handleInputChange('certificateSubtitle', e.target.value)}
                        placeholder="Certificate subtitle..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Date (Overlay)</Label>
                      <Input
                        value={content.certificateDate || 'May 5, 2025 • Certificate #SYN-2025-001'}
                        onChange={(e) => handleInputChange('certificateDate', e.target.value)}
                        placeholder="Certificate date..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What This Means Title</Label>
                      <Input
                        value={content.whatThisMeansTitle || 'What This Certification Means'}
                        onChange={(e) => handleInputChange('whatThisMeansTitle', e.target.value)}
                        placeholder="What this means title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What This Means Description</Label>
                      <textarea
                        value={content.whatThisMeansDescription || 'The Synesgy ESG Certificate is a comprehensive assessment that evaluates companies across three critical dimensions: Environmental impact, Social responsibility, and Governance practices.'}
                        onChange={(e) => handleInputChange('whatThisMeansDescription', e.target.value)}
                        placeholder="What this means description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ESG Pillars Title</Label>
                      <Input
                        value={content.esgPillarsTitle || 'Our ESG Pillars'}
                        onChange={(e) => handleInputChange('esgPillarsTitle', e.target.value)}
                        placeholder="ESG Pillars title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Impact Metrics Title</Label>
                      <Input
                        value={content.impactMetricsTitle || 'Our Impact Metrics'}
                        onChange={(e) => handleInputChange('impactMetricsTitle', e.target.value)}
                        placeholder="Impact Metrics title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certification Details Title</Label>
                      <Input
                        value={content.certificationDetailsTitle || 'Certification Details'}
                        onChange={(e) => handleInputChange('certificationDetailsTitle', e.target.value)}
                        placeholder="Certification Details title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>CTA Section Title</Label>
                      <Input
                        value={content.ctaTitle || 'Join Us in Our Mission'}
                        onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                        placeholder="CTA title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>CTA Description</Label>
                      <textarea
                        value={content.ctaDescription || 'Together, we can create a more sustainable future for eyewear. Learn more about our initiatives and how you can contribute to positive change.'}
                        onChange={(e) => handleInputChange('ctaDescription', e.target.value)}
                        placeholder="CTA description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary CTA Text</Label>
                        <Input
                          value={content.buttonText}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Download Full Report"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary CTA Link</Label>
                        <Input
                          value={content.buttonLink}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/download-report"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secondary CTA Text</Label>
                        <Input
                          value={content.secondaryButtonText || 'Our Sustainability Initiatives'}
                          onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                          placeholder="Secondary button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary CTA Link</Label>
                        <Input
                          value={content.secondaryButtonLink || '/eco-friendly'}
                          onChange={(e) => handleInputChange('secondaryButtonLink', e.target.value)}
                          placeholder="/eco-friendly"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : content.id === 'premium-partners-page' ? (
                /* Premium Partners Page Editor */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Premium Partners Page Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Page Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Premium Partners"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Page Subtitle</Label>
                      <Input
                        value={content.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Trusted by Leading Eyewear Brands"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Badge Text</Label>
                      <Input
                        value={content.badgeText || 'Premium Partners'}
                        onChange={(e) => handleInputChange('badgeText', e.target.value)}
                        placeholder="Premium Partners"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Title</Label>
                      <Input
                        value={content.heroTitle || 'Trusted by Leading Brands'}
                        onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                        placeholder="Trusted by Leading Brands"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hero Description</Label>
                      <textarea
                        value={content.heroDescription || 'We partner with the world\'s most prestigious eyewear brands to bring you the finest selection of sunglasses and eyeglasses. Our exclusive partnerships ensure you have access to the latest collections and limited editions.'}
                        onChange={(e) => handleInputChange('heroDescription', e.target.value)}
                        placeholder="Hero description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Partnership Benefits Title</Label>
                      <Input
                        value={content.benefitsTitle || 'Why Partner with Us?'}
                        onChange={(e) => handleInputChange('benefitsTitle', e.target.value)}
                        placeholder="Why Partner with Us?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Partnership Stats Title</Label>
                      <Input
                        value={content.statsTitle || 'Partnership Statistics'}
                        onChange={(e) => handleInputChange('statsTitle', e.target.value)}
                        placeholder="Partnership Statistics"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>CTA Section Title</Label>
                      <Input
                        value={content.ctaTitle || 'Interested in Partnership?'}
                        onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                        placeholder="Interested in Partnership?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>CTA Description</Label>
                      <textarea
                        value={content.ctaDescription || 'We\'re always looking for new premium brands to partner with. Join our exclusive network and reach discerning customers worldwide.'}
                        onChange={(e) => handleInputChange('ctaDescription', e.target.value)}
                        placeholder="CTA description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary CTA Text</Label>
                        <Input
                          value={content.buttonText}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Contact Partnership Team"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary CTA Link</Label>
                        <Input
                          value={content.buttonLink}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/contact"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secondary CTA Text</Label>
                        <Input
                          value={content.secondaryButtonText || 'Browse All Products'}
                          onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                          placeholder="Browse All Products"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary CTA Link</Label>
                        <Input
                          value={content.secondaryButtonLink || '/products'}
                          onChange={(e) => handleInputChange('secondaryButtonLink', e.target.value)}
                          placeholder="/products"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : content.id === 'footer-section' ? (
                /* Footer Section Editor - 2 Column Layout */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Brand Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Brand Name (optional)</Label>
                          <Input
                            value={content.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Spectrum (leave empty to show logo only)"
                          />
                        </div>

                        <div className="space-y-2">
                          <ImageUpload
                            value={content.logoImage || ''}
                            onChange={(url) => handleInputChange('logoImage', url)}
                            placeholder="https://example.com/footer-logo.png"
                            label="Footer Logo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Brand Description</Label>
                          <textarea
                            value={content.description || 'Discover the perfect eyewear that complements your style and protects your vision.'}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Brand description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Newsletter Section
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Newsletter Title</Label>
                          <Input
                            value={content.subtitle || 'Stay Updated'}
                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                            placeholder="Stay Updated"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Newsletter Description</Label>
                          <textarea
                            value={content.content || 'Subscribe to our newsletter for the latest trends and exclusive offers.'}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            placeholder="Newsletter description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Footer Links */}
                  <div className="space-y-6">
                    <DropdownManager
                      title="Shop Links"
                      items={content.shopLinks || []}
                      onItemsChange={(items) => handleInputChange('shopLinks', items)}
                      category="products"
                    />

                    <DropdownManager
                      title="Support Links"
                      items={content.supportLinks || []}
                      onItemsChange={(items) => handleInputChange('supportLinks', items)}
                      category="general"
                    />

                    <DropdownManager
                      title="Company Links"
                      items={content.companyLinks || []}
                      onItemsChange={(items) => handleInputChange('companyLinks', items)}
                      category="general"
                    />

                    <DropdownManager
                      title="Legal Links"
                      items={content.legalLinks || []}
                      onItemsChange={(items) => handleInputChange('legalLinks', items)}
                      category="general"
                    />

                    <DropdownManager
                      title="Social Links"
                      items={content.socialLinks || []}
                      onItemsChange={(items) => handleInputChange('socialLinks', items)}
                      category="social"
                    />
                  </div>
                </div>
              ) : content.id === 'certificate-section' ? (
                /* Certificate Section Editor */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      ESG Certificate Section Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Badge Text</Label>
                      <Input
                        value={content.badgeText || 'Chứng nhận ESG'}
                        onChange={(e) => handleInputChange('badgeText', e.target.value)}
                        placeholder="Badge text..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea
                        value={content.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <ImageUpload
                        value={content.imageUrl}
                        onChange={(url) => handleInputChange('imageUrl', url)}
                        placeholder="https://example.com/certificate-image.jpg"
                        label="Certificate Image"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Title (Overlay)</Label>
                      <Input
                        value={content.certificateTitle || 'Synesgy ESG Certificate'}
                        onChange={(e) => handleInputChange('certificateTitle', e.target.value)}
                        placeholder="Certificate title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Subtitle (Overlay)</Label>
                      <Input
                        value={content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                        onChange={(e) => handleInputChange('certificateSubtitle', e.target.value)}
                        placeholder="Certificate subtitle..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Certificate Date (Overlay)</Label>
                      <Input
                        value={content.certificateDate || 'May 5, 2025'}
                        onChange={(e) => handleInputChange('certificateDate', e.target.value)}
                        placeholder="Certificate date..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What This Means Title</Label>
                      <Input
                        value={content.whatThisMeansTitle || 'What This Means for You'}
                        onChange={(e) => handleInputChange('whatThisMeansTitle', e.target.value)}
                        placeholder="What this means title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What This Means Description</Label>
                      <textarea
                        value={content.whatThisMeansDescription || 'This certification demonstrates our commitment to sustainable practices, ethical business operations, and environmental responsibility in the eyewear industry.'}
                        onChange={(e) => handleInputChange('whatThisMeansDescription', e.target.value)}
                        placeholder="What this means description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Bottom CTA Text</Label>
                      <Input
                        value={content.bottomCtaText || 'Join us in our mission to create a more sustainable future for eyewear.'}
                        onChange={(e) => handleInputChange('bottomCtaText', e.target.value)}
                        placeholder="Bottom CTA text..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Button Text</Label>
                        <Input
                          value={content.buttonText}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Primary button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Button Link</Label>
                        <Input
                          value={content.buttonLink}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/link"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secondary Button Text</Label>
                        <Input
                          value={content.secondaryButtonText || 'View Full Report'}
                          onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                          placeholder="Secondary button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Button Link</Label>
                        <Input
                          value={content.secondaryButtonLink || '/esg-certificate'}
                          onChange={(e) => handleInputChange('secondaryButtonLink', e.target.value)}
                          placeholder="/link"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : content.id === 'featured-products-section' ? (
                /* Featured Products Section Editor */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Featured Products Section Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Badge Text</Label>
                      <Input
                        value={content.badgeText || 'Featured Collection'}
                        onChange={(e) => handleInputChange('badgeText', e.target.value)}
                        placeholder="Featured Collection"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input
                        value={content.title || 'Our Most Popular Eyewear'}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Our Most Popular Eyewear"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Section Description</Label>
                      <textarea
                        value={content.description || 'Discover the eyewear that our customers love most. From classic designs to modern trends.'}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Section description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    {/* Product Selection */}
                    <ProductSelector
                      selectedProductIds={content.selectedProductIds || []}
                      onSelectionChange={(productIds) => handleInputChange('selectedProductIds', productIds)}
                      maxProducts={content.maxProducts || 4}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={content.buttonText || 'View All Products'}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="View All Products"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input
                          value={content.buttonLink || '/products'}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/products"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Max Products to Display</Label>
                      <select
                        value={content.maxProducts || 4}
                        onChange={(e) => handleInputChange('maxProducts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={3}>3 Products</option>
                        <option value={4}>4 Products</option>
                        <option value={6}>6 Products</option>
                        <option value={8}>8 Products</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : content.id === 'about-page' ? (
                /* About Page Editor */
                <div className="space-y-6">
                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Hero Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Page Title</Label>
                        <Input
                          value={content.title || 'About Spectrum Eyecare'}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="About Spectrum Eyecare"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={content.subtitle || 'Your Vision, Our Passion'}
                          onChange={(e) => handleInputChange('subtitle', e.target.value)}
                          placeholder="Your Vision, Our Passion"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Main Description</Label>
                        <textarea
                          value={content.description || 'Since our founding, Spectrum has been dedicated to providing premium eyewear solutions that combine style, comfort, and cutting-edge technology.'}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Main description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <ImageUpload
                          value={content.imageUrl || ''}
                          onChange={(url) => handleInputChange('imageUrl', url)}
                          placeholder="https://example.com/hero-image.jpg"
                          label="Hero Image"
                          className="max-w-xs"
                        />
                      </div>

                      <div className="space-y-2">
                        <ImageUpload
                          value={content.secondaryButtonText || ''}
                          onChange={(url) => handleInputChange('secondaryButtonText', url)}
                          placeholder="https://example.com/background-image.jpg"
                          label="Background Image (Mission & Vision)"
                          className="max-w-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Gallery */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Company Gallery
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Gallery Title</Label>
                        <Input
                          value={content.galleryTitle || 'Our Store & Workshop'}
                          onChange={(e) => handleInputChange('galleryTitle', e.target.value)}
                          placeholder="Our Store & Workshop"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gallery Description</Label>
                        <textarea
                          value={content.galleryDescription || 'Take a look inside our modern facility and professional workspace'}
                          onChange={(e) => handleInputChange('galleryDescription', e.target.value)}
                          placeholder="Gallery description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <ImageUpload
                            value={content.galleryImage1 || ''}
                            onChange={(url) => handleInputChange('galleryImage1', url)}
                            placeholder="https://example.com/store-interior.jpg"
                            label="Main Store Image"
                            className="max-w-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <ImageUpload
                            value={content.galleryImage2 || ''}
                            onChange={(url) => handleInputChange('galleryImage2', url)}
                            placeholder="https://example.com/equipment.jpg"
                            label="Equipment Image"
                            className="max-w-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <ImageUpload
                            value={content.galleryImage3 || ''}
                            onChange={(url) => handleInputChange('galleryImage3', url)}
                            placeholder="https://example.com/collection.jpg"
                            label="Collection Image"
                            className="max-w-xs"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Mission & Vision */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Mission & Vision
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Mission Statement</Label>
                        <textarea
                          value={content.content || 'To provide exceptional eyewear that enhances both vision and style, while maintaining our commitment to sustainability and customer satisfaction.'}
                          onChange={(e) => handleInputChange('content', e.target.value)}
                          placeholder="Mission statement..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Vision Statement</Label>
                        <textarea
                          value={content.buttonText || 'To be the leading eyewear retailer in Vietnam, known for quality, innovation, and environmental responsibility.'}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Vision statement..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Company Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Happy Customers</Label>
                          <Input
                            value={content.stat1 || '10,000+'}
                            onChange={(e) => handleInputChange('stat1', e.target.value)}
                            placeholder="10,000+"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Premium Products</Label>
                          <Input
                            value={content.stat2 || '500+'}
                            onChange={(e) => handleInputChange('stat2', e.target.value)}
                            placeholder="500+"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Brand Partners</Label>
                          <Input
                            value={content.stat3 || '15+'}
                            onChange={(e) => handleInputChange('stat3', e.target.value)}
                            placeholder="15+"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Years Experience</Label>
                          <Input
                            value={content.stat4 || '5+'}
                            onChange={(e) => handleInputChange('stat4', e.target.value)}
                            placeholder="5+"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Core Values */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Core Values
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Value 1: Quality First */}
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Quality First</Label>
                        </div>
                        <textarea
                          value={content.value1 || 'We source only the finest materials and work with premium brands to ensure exceptional quality.'}
                          onChange={(e) => handleInputChange('value1', e.target.value)}
                          placeholder="Quality description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      {/* Value 2: Customer Focus */}
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Customer Focus</Label>
                        </div>
                        <textarea
                          value={content.value2 || 'Your satisfaction is our priority. We provide personalized service and expert guidance.'}
                          onChange={(e) => handleInputChange('value2', e.target.value)}
                          placeholder="Customer focus description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      {/* Value 3: Innovation */}
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Type className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Innovation</Label>
                        </div>
                        <textarea
                          value={content.value3 || 'We embrace the latest technology and trends to offer cutting-edge eyewear solutions.'}
                          onChange={(e) => handleInputChange('value3', e.target.value)}
                          placeholder="Innovation description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      {/* Value 4: Sustainability */}
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          <Label className="text-base font-semibold">Sustainability</Label>
                        </div>
                        <textarea
                          value={content.value4 || 'Committed to eco-friendly practices and responsible business operations.'}
                          onChange={(e) => handleInputChange('value4', e.target.value)}
                          placeholder="Sustainability description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Team Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Team Section Title</Label>
                          <Input
                            value={content.teamTitle || 'Our Expert Team'}
                            onChange={(e) => handleInputChange('teamTitle', e.target.value)}
                            placeholder="Our Expert Team"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Team Section Description</Label>
                          <textarea
                            value={content.teamDescription || 'Meet the passionate professionals who make Spectrum exceptional.'}
                            onChange={(e) => handleInputChange('teamDescription', e.target.value)}
                            placeholder="Team description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                      </div>

                      {/* Team Members */}
                      <div className="space-y-6">
                        <Label className="text-base font-semibold">Team Members</Label>
                        
                        {/* Member 1 - CEO */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <Label className="text-base font-semibold">CEO / Founder</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={content.member1Name || 'Dr. Nguyen Phuoc Sang'}
                                onChange={(e) => handleInputChange('member1Name', e.target.value)}
                                placeholder="Dr. Nguyen Phuoc Sang"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Input
                                value={content.member1Role || 'Founder & CEO'}
                                onChange={(e) => handleInputChange('member1Role', e.target.value)}
                                placeholder="Founder & CEO"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                              value={content.member1Description || 'Visionary leader with 15+ years in optical industry'}
                              onChange={(e) => handleInputChange('member1Description', e.target.value)}
                              placeholder="Member description..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <ImageUpload
                              value={content.member1Image || ''}
                              onChange={(url) => handleInputChange('member1Image', url)}
                              placeholder="https://example.com/ceo-photo.jpg"
                              label="Photo"
                              className="max-w-xs"
                            />
                          </div>
                        </div>

                        {/* Member 2 - Optometrist */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-primary" />
                            <Label className="text-base font-semibold">Chief Optometrist</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={content.member2Name || 'Dr. Tran Minh Duc'}
                                onChange={(e) => handleInputChange('member2Name', e.target.value)}
                                placeholder="Dr. Tran Minh Duc"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Input
                                value={content.member2Role || 'Chief Optometrist'}
                                onChange={(e) => handleInputChange('member2Role', e.target.value)}
                                placeholder="Chief Optometrist"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                              value={content.member2Description || 'Expert in vision care with international certifications'}
                              onChange={(e) => handleInputChange('member2Description', e.target.value)}
                              placeholder="Member description..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <ImageUpload
                              value={content.member2Image || ''}
                              onChange={(url) => handleInputChange('member2Image', url)}
                              placeholder="https://example.com/optometrist-photo.jpg"
                              label="Photo"
                              className="max-w-xs"
                            />
                          </div>
                        </div>

                        {/* Member 3 - Manager */}
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-primary" />
                            <Label className="text-base font-semibold">Customer Experience Manager</Label>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={content.member3Name || 'Le Thi Mai'}
                                onChange={(e) => handleInputChange('member3Name', e.target.value)}
                                placeholder="Le Thi Mai"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Role</Label>
                              <Input
                                value={content.member3Role || 'Customer Experience Manager'}
                                onChange={(e) => handleInputChange('member3Role', e.target.value)}
                                placeholder="Customer Experience Manager"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <textarea
                              value={content.member3Description || 'Ensuring every customer receives exceptional service'}
                              onChange={(e) => handleInputChange('member3Description', e.target.value)}
                              placeholder="Member description..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                          </div>
                          <div className="space-y-2">
                            <ImageUpload
                              value={content.member3Image || ''}
                              onChange={(url) => handleInputChange('member3Image', url)}
                              placeholder="https://example.com/manager-photo.jpg"
                              label="Photo"
                              className="max-w-xs"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <Input
                            value={content.address || 'Ho Chi Minh City, Vietnam'}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Ho Chi Minh City, Vietnam"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={content.phone || '+84 123 456 789'}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="+84 123 456 789"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            value={content.email || 'info@spectrum.com'}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="info@spectrum.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>CTA Title</Label>
                          <Input
                            value={content.ctaTitle || 'Ready to Find Your Perfect Eyewear?'}
                            onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                            placeholder="CTA title..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CTA Description</Label>
                          <textarea
                            value={content.ctaDescription || 'Visit our store or browse our collection online. Our expert team is here to help you find the perfect glasses for your style and needs.'}
                            onChange={(e) => handleInputChange('ctaDescription', e.target.value)}
                            placeholder="CTA description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Publication Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                          value={content.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : content.id === 'products-page' ? (
                /* Products Page Editor - 2 Column Layout */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Basic Settings */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="h-5 w-5" />
                          Page Header
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Page Title</Label>
                          <Input
                            value={content.title || 'Tất cả sản phẩm'}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Tất cả sản phẩm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Page Description</Label>
                          <textarea
                            value={content.description || 'Khám phá bộ sưu tập kính mắt thời trang của chúng tôi'}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Page description..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <ImageUpload
                            value={content.imageUrl || ''}
                            onChange={(url) => handleInputChange('imageUrl', url)}
                            placeholder="https://example.com/products-hero.jpg"
                            label="Hero Banner Image (Optional)"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Category Labels
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>All Categories Label</Label>
                          <Input
                            value={content.allCategoriesLabel || 'Tất cả danh mục'}
                            onChange={(e) => handleInputChange('allCategoriesLabel', e.target.value)}
                            placeholder="Tất cả danh mục"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category Filter Label</Label>
                          <Input
                            value={content.categoryFilterLabel || 'Danh mục'}
                            onChange={(e) => handleInputChange('categoryFilterLabel', e.target.value)}
                            placeholder="Danh mục"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Filter & Display Settings */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <SlidersHorizontal className="h-5 w-5" />
                          Filter & Search Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Search Placeholder</Label>
                          <Input
                            value={content.searchPlaceholder || 'Tìm kiếm sản phẩm...'}
                            onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Filter Button Text</Label>
                          <Input
                            value={content.filterButtonText || 'Bộ lọc'}
                            onChange={(e) => handleInputChange('filterButtonText', e.target.value)}
                            placeholder="Bộ lọc"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Items Per Page Label</Label>
                          <Input
                            value={content.itemsPerPageLabel || 'Sản phẩm mỗi trang:'}
                            onChange={(e) => handleInputChange('itemsPerPageLabel', e.target.value)}
                            placeholder="Sản phẩm mỗi trang:"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Category Labels
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>All Categories Label</Label>
                          <Input
                            value={content.allCategoriesLabel || 'Tất cả danh mục'}
                            onChange={(e) => handleInputChange('allCategoriesLabel', e.target.value)}
                            placeholder="Tất cả danh mục"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category Filter Label</Label>
                          <Input
                            value={content.categoryFilterLabel || 'Danh mục'}
                            onChange={(e) => handleInputChange('categoryFilterLabel', e.target.value)}
                            placeholder="Danh mục"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sort & Display Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Sort & Display Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Sort Label</Label>
                          <Input
                            value={content.sortLabel || 'Sắp xếp'}
                            onChange={(e) => handleInputChange('sortLabel', e.target.value)}
                            placeholder="Sắp xếp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Display Mode Label</Label>
                          <Input
                            value={content.displayModeLabel || 'Hiển thị'}
                            onChange={(e) => handleInputChange('displayModeLabel', e.target.value)}
                            placeholder="Hiển thị"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Price Range Label</Label>
                          <Input
                            value={content.priceRangeLabel || 'Khoảng giá'}
                            onChange={(e) => handleInputChange('priceRangeLabel', e.target.value)}
                            placeholder="Khoảng giá"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Clear Filters Text</Label>
                          <Input
                            value={content.clearFiltersText || 'Xóa tất cả bộ lọc'}
                            onChange={(e) => handleInputChange('clearFiltersText', e.target.value)}
                            placeholder="Xóa tất cả bộ lọc"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Sort & Display Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Sort Label</Label>
                          <Input
                            value={content.sortLabel || 'Sắp xếp'}
                            onChange={(e) => handleInputChange('sortLabel', e.target.value)}
                            placeholder="Sắp xếp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Display Mode Label</Label>
                          <Input
                            value={content.displayModeLabel || 'Hiển thị'}
                            onChange={(e) => handleInputChange('displayModeLabel', e.target.value)}
                            placeholder="Hiển thị"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Price Range Label</Label>
                          <Input
                            value={content.priceRangeLabel || 'Khoảng giá'}
                            onChange={(e) => handleInputChange('priceRangeLabel', e.target.value)}
                            placeholder="Khoảng giá"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Clear Filters Text</Label>
                          <Input
                            value={content.clearFiltersText || 'Xóa tất cả bộ lọc'}
                            onChange={(e) => handleInputChange('clearFiltersText', e.target.value)}
                            placeholder="Xóa tất cả bộ lọc"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Type className="h-5 w-5" />
                          Messages & Pagination
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>No Products Found Title</Label>
                          <Input
                            value={content.noProductsTitle || 'Không tìm thấy sản phẩm'}
                            onChange={(e) => handleInputChange('noProductsTitle', e.target.value)}
                            placeholder="Không tìm thấy sản phẩm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>No Products Found Message</Label>
                          <textarea
                            value={content.noProductsMessage || 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'}
                            onChange={(e) => handleInputChange('noProductsMessage', e.target.value)}
                            placeholder="No products message..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Previous Page Text</Label>
                            <Input
                              value={content.previousPageText || 'Trước'}
                              onChange={(e) => handleInputChange('previousPageText', e.target.value)}
                              placeholder="Trước"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Next Page Text</Label>
                            <Input
                              value={content.nextPageText || 'Sau'}
                              onChange={(e) => handleInputChange('nextPageText', e.target.value)}
                              placeholder="Sau"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : content.id === 'contact-page' ? (
                /* Contact Page Editor */
                <div className="space-y-6">
                  {/* Hero Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Contact Page Hero Section
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Page Title</Label>
                        <Input
                          value={content.title || 'Liên hệ với chúng tôi'}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          placeholder="Liên hệ với chúng tôi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Page Description</Label>
                        <textarea
                          value={content.description || 'Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn tốt nhất.'}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Page description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <ImageUpload
                          value={content.imageUrl || ''}
                          onChange={(url) => handleInputChange('imageUrl', url)}
                          placeholder="https://example.com/contact-hero.jpg"
                          label="Hero Background Image (Optional)"
                          className="max-w-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Form Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Contact Form Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Form Title</Label>
                        <Input
                          value={content.formTitle || 'Gửi tin nhắn cho chúng tôi'}
                          onChange={(e) => handleInputChange('formTitle', e.target.value)}
                          placeholder="Gửi tin nhắn cho chúng tôi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Form Description</Label>
                        <textarea
                          value={content.formDescription || 'Điền thông tin bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể.'}
                          onChange={(e) => handleInputChange('formDescription', e.target.value)}
                          placeholder="Form description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Submit Button Text</Label>
                        <Input
                          value={content.submitButtonText || 'Gửi tin nhắn'}
                          onChange={(e) => handleInputChange('submitButtonText', e.target.value)}
                          placeholder="Gửi tin nhắn"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Info Section Title</Label>
                        <Input
                          value={content.infoTitle || 'Thông tin liên hệ'}
                          onChange={(e) => handleInputChange('infoTitle', e.target.value)}
                          placeholder="Thông tin liên hệ"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company Address</Label>
                          <textarea
                            value={content.address || '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam'}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Company address..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Numbers</Label>
                          <Input
                            value={content.phone || '(+84) 123 456 789'}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="(+84) 123 456 789"
                          />
                          <Input
                            value={content.hotline || 'Hotline: 1900 1234'}
                            onChange={(e) => handleInputChange('hotline', e.target.value)}
                            placeholder="Hotline: 1900 1234"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email Addresses</Label>
                          <Input
                            value={content.email || 'info@spectrum.com'}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="info@spectrum.com"
                          />
                          <Input
                            value={content.supportEmail || 'support@spectrum.com'}
                            onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                            placeholder="support@spectrum.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Business Hours</Label>
                          <Input
                            value={content.businessHours || 'Thứ 2 - Thứ 6: 8:00 - 18:00'}
                            onChange={(e) => handleInputChange('businessHours', e.target.value)}
                            placeholder="Thứ 2 - Thứ 6: 8:00 - 18:00"
                          />
                          <Input
                            value={content.weekendHours || 'Thứ 7: 8:00 - 12:00'}
                            onChange={(e) => handleInputChange('weekendHours', e.target.value)}
                            placeholder="Thứ 7: 8:00 - 12:00"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Media & Quick Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Social Media & Quick Info
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Social Media Section Title</Label>
                        <Input
                          value={content.socialTitle || 'Kết nối với chúng tôi'}
                          onChange={(e) => handleInputChange('socialTitle', e.target.value)}
                          placeholder="Kết nối với chúng tôi"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Facebook URL</Label>
                          <Input
                            value={content.facebookUrl || 'https://facebook.com/spectrum.eyecare'}
                            onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                            placeholder="https://facebook.com/your-page"
                            type="url"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Instagram URL</Label>
                          <Input
                            value={content.instagramUrl || 'https://instagram.com/spectrum.eyecare'}
                            onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                            placeholder="https://instagram.com/your-account"
                            type="url"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Twitter URL</Label>
                          <Input
                            value={content.twitterUrl || 'https://twitter.com/spectrum_eyecare'}
                            onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                            placeholder="https://twitter.com/your-account"
                            type="url"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>LinkedIn URL</Label>
                          <Input
                            value={content.linkedinUrl || 'https://linkedin.com/company/spectrum-eyecare'}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            placeholder="https://linkedin.com/company/your-company"
                            type="url"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Quick Info Section Title</Label>
                        <Input
                          value={content.quickInfoTitle || 'Thông tin nhanh'}
                          onChange={(e) => handleInputChange('quickInfoTitle', e.target.value)}
                          placeholder="Thông tin nhanh"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Response Time</Label>
                          <Input
                            value={content.responseTime || 'Phản hồi trong 24h'}
                            onChange={(e) => handleInputChange('responseTime', e.target.value)}
                            placeholder="Phản hồi trong 24h"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Support Language</Label>
                          <Input
                            value={content.supportLanguage || 'Hỗ trợ tiếng Việt & English'}
                            onChange={(e) => handleInputChange('supportLanguage', e.target.value)}
                            placeholder="Hỗ trợ tiếng Việt & English"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Free Consultation</Label>
                          <Input
                            value={content.consultationFree || 'Tư vấn miễn phí'}
                            onChange={(e) => handleInputChange('consultationFree', e.target.value)}
                            placeholder="Tư vấn miễn phí"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Map Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Map Section Title</Label>
                        <Input
                          value={content.mapTitle || 'Vị trí của chúng tôi'}
                          onChange={(e) => handleInputChange('mapTitle', e.target.value)}
                          placeholder="Vị trí của chúng tôi"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Google Maps Embed URL</Label>
                        <textarea
                          value={content.mapEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.921690491891!2d106.72869727547798!3d10.817304789333951!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527844d7e6a45%3A0xedaeefbaf55796d!2sSpectrum%20Eyecare!5e0!3m2!1svi!2s!4v1758169698616!5m2!1svi!2s'}
                          onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
                          placeholder="Paste Google Maps embed URL here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          rows={4}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          <p className="mb-2"><strong>Cách lấy embed URL:</strong></p>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>Vào Google Maps → Tìm địa điểm</li>
                            <li>Click "Chia sẻ" → "Nhúng bản đồ"</li>
                            <li>Copy URL trong src="..." của iframe</li>
                            <li>Paste vào ô trên</li>
                          </ol>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Map Latitude (Backup)</Label>
                          <Input
                            value={content.mapLat || '10.8231'}
                            onChange={(e) => handleInputChange('mapLat', e.target.value)}
                            placeholder="10.8231"
                            type="number"
                            step="any"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Map Longitude (Backup)</Label>
                          <Input
                            value={content.mapLng || '106.6297'}
                            onChange={(e) => handleInputChange('mapLng', e.target.value)}
                            placeholder="106.6297"
                            type="number"
                            step="any"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Map Zoom Level (Backup)</Label>
                          <Input
                            value={content.mapZoom || '15'}
                            onChange={(e) => handleInputChange('mapZoom', e.target.value)}
                            placeholder="15"
                            type="number"
                            min="1"
                            max="20"
                          />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p><strong>Lưu ý:</strong> Các trường Latitude, Longitude, Zoom chỉ dùng làm backup khi không có Embed URL.</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="showMap"
                          checked={content.showMap !== false}
                          onChange={(e) => handleInputChange('showMap', e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="showMap">Show Map Section</Label>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Publication Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <select
                          value={content.status}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : !['hero-section', 'certificate-section', 'brands-section', 'premium-partners-page', 'esg-certificate-page', 'header-section', 'footer-section', 'featured-products-section', 'about-page', 'products-page', 'contact-page'].includes(content.id) ? (
                /* Standard Content Editor for other sections */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Content Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={content.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Enter subtitle..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea
                        value={content.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Content</Label>
                      <textarea
                        value={content.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        placeholder="Enter main content..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Button Text</Label>
                        <Input
                          value={content.buttonText}
                          onChange={(e) => handleInputChange('buttonText', e.target.value)}
                          placeholder="Button text..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Button Link</Label>
                        <Input
                          value={content.buttonLink}
                          onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                          placeholder="/link"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <ImageUpload
                        value={content.imageUrl}
                        onChange={(url) => handleInputChange('imageUrl', url)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Images (one per line)</Label>
                      <textarea
                        value={content.images?.join('\n') || ''}
                        onChange={(e) => {
                          const imageUrls = e.target.value.split('\n').filter(url => url.trim());
                          handleInputChange('images', imageUrls);
                        }}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        Enter one image URL per line. Used for sections with multiple images like Brand logos, etc.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Fallback for sections without specialized editors */
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Basic Content Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={content.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter title..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea
                        value={content.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Enter description..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select
                        value={content.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
