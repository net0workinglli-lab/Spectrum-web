'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Save, Eye, Type, Image, 
  Monitor, Smartphone, Tablet, CheckCircle, AlertCircle,
  Award, Leaf, Users, Shield, X
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { useContent, ContentData, DropdownItem } from '@/hooks/useContent';
import { ImageUpload } from '@/components/ImageUpload';
import DropdownManager from '@/components/admin/DropdownManager';

// ContentData interface is imported from hook

// generateStaticParams is in separate file

export default function EditContentPage({ params }: { params: { id: string } }) {
  const { isLoggedIn, user } = useApp();
  const { content, isLoading, isSaving, error, saveContent, updateContent } = useContent(params.id);
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
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
    updateContent({ [field]: value });
    setHasChanges(true);
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
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="space-y-6">
              {/* Hero Slides Management - Only for Hero Section */}
              {content.id === 'hero-section' ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Type className="h-5 w-5" />
                      Hero Slides Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[1, 2, 3].map((slideId) => {
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
                /* Header Section Editor - Shopify Style */
                <div className="space-y-6">
                  {/* Basic Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-5 w-5" />
                        Basic Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                            label="Logo Image (Horizontal)"
                            className="max-w-xs"
                          />
                        </div>
                      </div>

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

                    <div className="space-y-4">
                      <Label>Navigation Items</Label>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Eco-friendly Text</Label>
                            <Input
                              value={content.ecoFriendlyText || 'Eco-friendly'}
                              onChange={(e) => handleInputChange('ecoFriendlyText', e.target.value)}
                              placeholder="Eco-friendly"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Eco-friendly Link</Label>
                            <Input
                              value={content.ecoFriendlyLink || '/eco-friendly'}
                              onChange={(e) => handleInputChange('ecoFriendlyLink', e.target.value)}
                              placeholder="/eco-friendly"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Community Text</Label>
                            <Input
                              value={content.communityText || 'Community'}
                              onChange={(e) => handleInputChange('communityText', e.target.value)}
                              placeholder="Community"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Community Link</Label>
                            <Input
                              value={content.communityLink || '/community'}
                              onChange={(e) => handleInputChange('communityLink', e.target.value)}
                              placeholder="/community"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                      <div className="grid grid-cols-2 gap-4">
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
                      </div>

                      <div className="space-y-2">
                        <Label>Search Placeholder</Label>
                        <Input
                          value={content.searchPlaceholder || 'Search glasses, brands...'}
                          onChange={(e) => handleInputChange('searchPlaceholder', e.target.value)}
                          placeholder="Search glasses, brands..."
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

                  {/* Dropdown Managers */}
                  <div className="space-y-6">
                    <DropdownManager
                      title="Products Dropdown"
                      items={content.productsDropdown || []}
                      onItemsChange={(items) => handleInputChange('productsDropdown', items)}
                      placeholder="Enter product name"
                      maxItems={8}
                      category="products"
                    />

                    <DropdownManager
                      title="Brands Dropdown"
                      items={content.brandsDropdown || []}
                      onItemsChange={(items) => handleInputChange('brandsDropdown', items)}
                      placeholder="Enter brand name"
                      maxItems={10}
                      category="brands"
                    />

                    <DropdownManager
                      title="Lenses Dropdown"
                      items={content.lensesDropdown || []}
                      onItemsChange={(items) => handleInputChange('lensesDropdown', items)}
                      placeholder="Enter lens brand name"
                      maxItems={10}
                      category="lenses"
                    />
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
              ) : !['hero-section', 'certificate-section', 'brands-section', 'premium-partners-page', 'esg-certificate-page', 'header-section'].includes(content.id) ? (
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

            {/* Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-6 bg-white">
                    <div className="text-center space-y-4">
                      {/* Main Image */}
                      {content.imageUrl && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={content.imageUrl}
                            alt="Main Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Hero Slides Preview */}
                      {content.id === 'hero-section' && content.slides && content.slides.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Hero Slides Preview:</h4>
                          <div className="space-y-3">
                            {content.slides.map((slide, index) => (
                              <div key={slide.id} className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">Slide {slide.id}</Badge>
                                  {slide.id === 1 && <Badge className="bg-blue-100 text-blue-800 text-xs">Dynamic</Badge>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <p className="text-sm font-medium">{slide.title || 'No title'}</p>
                                    <p className="text-xs text-gray-600">{slide.subtitle || 'No subtitle'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-600">Button: {slide.cta || 'No button'}</p>
                                    <p className="text-xs text-gray-600">Link: {slide.href || 'No link'}</p>
                                  </div>
                                  <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                                    {slide.image ? (
                                      <img
                                        src={slide.image}
                                        alt={`Slide ${slide.id}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                        No image
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Images */}
                      {content.images && content.images.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Additional Images:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {content.images.map((imageUrl, index) => (
                              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Header Section Preview */}
                      {content.id === 'header-section' && (
                        <div className="space-y-6">
                          <div className="bg-white border rounded-lg overflow-hidden">
                            {/* Top Bar */}
                            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 flex justify-between">
                              <span>{content.topBarLeft || 'Free consultation and eye exam'}</span>
                              <div className="flex gap-4">
                                <span className="hidden md:inline">|</span>
                                <span className="hidden md:inline">{content.topBarRight || '30-day return policy'}</span>
                                <a href="/blog" className="hover:text-primary">{content.blogLinkText || 'Blog'}</a>
                                <a href="/contact" className="hover:text-primary">{content.contactLinkText || 'Contact'}</a>
                              </div>
                            </div>
                            
                            {/* Main Header */}
                            <div className="px-4 py-4 flex items-center justify-between">
                              {/* Logo */}
                              <div className="flex items-center gap-2">
                                {content.logoImage ? (
                                  <img 
                                    src={content.logoImage} 
                                    alt="Logo" 
                                    className="h-10 w-auto object-contain"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                  </div>
                                )}
                                {content.logoText && (
                                  <span className="text-2xl font-bold">{content.logoText}</span>
                                )}
                              </div>
                              
                              {/* Desktop Navigation */}
                              <div className="hidden lg:flex items-center gap-8">
                                <a href={content.ecoFriendlyLink || '/eco-friendly'} className="flex items-center gap-2 hover:text-primary">
                                  <span className="w-4 h-4">🌱</span>
                                  {content.ecoFriendlyText || 'Eco-friendly'}
                                </a>
                                <a href={content.communityLink || '/community'} className="flex items-center gap-2 hover:text-primary">
                                  <span className="w-4 h-4">👥</span>
                                  {content.communityText || 'Community'}
                                </a>
                                
                                {/* Products Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-2 hover:text-primary">
                                    <span className="w-4 h-4">👓</span>
                                    Products
                                    <span className="w-4 h-4">▼</span>
                                  </button>
                                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="py-2">
                                      {(content.productsDropdown || []).map((item) => (
                                        <a key={item.id} href={item.href} className="block px-4 py-2 hover:bg-gray-50">
                                          {item.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Brands Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-2 hover:text-primary">
                                    <span className="w-4 h-4">🏆</span>
                                    Brands
                                    <span className="w-4 h-4">▼</span>
                                  </button>
                                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="py-2">
                                      {(content.brandsDropdown || []).map((item) => (
                                        <a key={item.id} href={item.href} className="block px-4 py-2 hover:bg-gray-50">
                                          {item.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Lenses Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-2 hover:text-primary">
                                    <span className="w-4 h-4">🔍</span>
                                    Lenses
                                    <span className="w-4 h-4">▼</span>
                                  </button>
                                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="py-2">
                                      {(content.lensesDropdown || []).map((item) => (
                                        <a key={item.id} href={item.href} className="block px-4 py-2 hover:bg-gray-50">
                                          {item.name}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Search Bar */}
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder={content.searchPlaceholder || 'Search glasses, brands...'}
                                    className="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  <button className="p-2 hover:bg-gray-100 rounded-lg">❤️</button>
                                  <button className="p-2 hover:bg-gray-100 rounded-lg">👤</button>
                                  <button className="p-2 hover:bg-gray-100 rounded-lg lg:hidden">☰</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Brands Section Preview */}
                      {content.id === 'brands-section' && (
                        <div className="space-y-6">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                              {content.badgeText || '✨ Premium Partners'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {content.title || 'Discover Our Premium Lens Brands'}
                            </h2>
                            <p className="text-lg text-gray-600">
                              {content.description || 'Description'}
                            </p>
                          </div>
                          
                          {/* Brands Grid Preview */}
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {content.brandLogos && content.brandLogos.length > 0 ? (
                              content.brandLogos.slice(0, 8).map((logoUrl, index) => (
                                <div key={index} className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                                  <div className="relative w-12 h-8 mb-2">
                                    <img
                                      src={logoUrl}
                                      alt={`Brand ${index + 1}`}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW52YWxpZDwvdGV4dD48L3N2Zz4=';
                                      }}
                                    />
                                  </div>
                                  <h3 className="text-xs font-medium text-gray-800 text-center">
                                    Brand {index + 1}
                                  </h3>
                                </div>
                              ))
                            ) : (
                              Array.from({ length: 8 }).map((_, index) => (
                                <div key={index} className="group flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl border border-gray-200">
                                  <div className="w-12 h-8 mb-2 bg-gray-200 rounded"></div>
                                  <h3 className="text-xs font-medium text-gray-500 text-center">
                                    Brand {index + 1}
                                  </h3>
                                </div>
                              ))
                            )}
                          </div>
                          
                          <div className="text-center space-y-4">
                            <p className="text-gray-600 text-sm">
                              {content.bottomCtaText || 'Discover our complete collection...'}
                            </p>
                            <div className="flex gap-2 justify-center">
                              {content.buttonText && (
                                <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm">
                                  {content.buttonText}
                                </button>
                              )}
                              {content.secondaryButtonText && (
                                <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                                  {content.secondaryButtonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Certificate Section Preview */}
                      {content.id === 'certificate-section' && (
                        <div className="space-y-6">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                              <Award className="h-4 w-4 mr-2" />
                              {content.badgeText || 'Chứng nhận ESG'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {content.title || 'ESG Certified Excellence'}
                            </h2>
                            <p className="text-lg text-gray-600">
                              {content.description || 'Description'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="relative">
                              {content.imageUrl && (
                                <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={content.imageUrl}
                                    alt="Certificate"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-end">
                                    <div className="p-4 text-white">
                                      <h3 className="text-lg font-bold">
                                        {content.certificateTitle || 'Synesgy ESG Certificate'}
                                      </h3>
                                      <p className="text-sm">
                                        {content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                                      </p>
                                      <p className="text-xs opacity-90">
                                        {content.certificateDate || 'May 5, 2025'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {content.whatThisMeansTitle || 'What This Means for You'}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {content.whatThisMeansDescription || 'Description'}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center">
                                    <Leaf className="h-4 w-4 text-green-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Environmental</h4>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Social</h4>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Governance</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center space-y-4">
                            <p className="text-gray-600 text-sm">
                              {content.bottomCtaText || 'Join us in our mission...'}
                            </p>
                            <div className="flex gap-2 justify-center">
                              {content.buttonText && (
                                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                                  {content.buttonText}
                                </button>
                              )}
                              {content.secondaryButtonText && (
                                <button className="border border-green-600 text-green-600 px-4 py-2 rounded text-sm">
                                  {content.secondaryButtonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ESG Certificate Page Preview */}
                      {content.id === 'esg-certificate-page' && (
                        <div className="space-y-6">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                              <Award className="h-4 w-4 mr-2" />
                              {content.badgeText || 'Synesgy ESG Certified'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {content.heroTitle || 'Among Vietnam\'s First Sustainable Eyewear Retailers'}
                            </h2>
                            <p className="text-lg text-gray-600">
                              {content.heroDescription || 'Hero description...'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="relative">
                              {content.imageUrl && (
                                <div className="aspect-[16/10] bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={content.imageUrl}
                                    alt="Certificate"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-end">
                                    <div className="p-4 text-white">
                                      <h3 className="text-lg font-bold">
                                        {content.certificateTitle || 'Synesgy ESG Certificate'}
                                      </h3>
                                      <p className="text-sm">
                                        {content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                                      </p>
                                      <p className="text-xs opacity-90">
                                        {content.certificateDate || 'May 5, 2025 • Certificate #SYN-2025-001'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {content.whatThisMeansTitle || 'What This Certification Means'}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {content.whatThisMeansDescription || 'Description'}
                                </p>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center">
                                    <Leaf className="h-4 w-4 text-green-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Environmental</h4>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Social</h4>
                                </div>
                                <div className="text-center p-2 bg-white rounded border">
                                  <div className="w-8 h-8 mx-auto mb-1 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <h4 className="text-xs font-semibold">Governance</h4>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {content.esgPillarsTitle || 'Our ESG Pillars'}
                            </h3>
                            <h3 className="text-xl font-bold text-gray-900">
                              {content.impactMetricsTitle || 'Our Impact Metrics'}
                            </h3>
                            <h3 className="text-xl font-bold text-gray-900">
                              {content.certificationDetailsTitle || 'Certification Details'}
                            </h3>
                          </div>
                          
                          <div className="text-center space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {content.ctaTitle || 'Join Us in Our Mission'}
                            </h3>
                            <p className="text-lg text-gray-600">
                              {content.ctaDescription || 'CTA description...'}
                            </p>
                            <div className="flex gap-2 justify-center">
                              {content.buttonText && (
                                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                                  {content.buttonText}
                                </button>
                              )}
                              {content.secondaryButtonText && (
                                <button className="border border-green-600 text-green-600 px-4 py-2 rounded text-sm">
                                  {content.secondaryButtonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Premium Partners Page Preview */}
                      {content.id === 'premium-partners-page' && (
                        <div className="space-y-6">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                              <Award className="h-4 w-4 mr-2" />
                              {content.badgeText || 'Premium Partners'}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                              {content.heroTitle || 'Trusted by Leading Brands'}
                            </h2>
                            <p className="text-lg text-gray-600">
                              {content.heroDescription || 'Hero description...'}
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">
                              {content.benefitsTitle || 'Why Partner with Us?'}
                            </h3>
                            <h3 className="text-xl font-bold text-gray-900">
                              {content.statsTitle || 'Partnership Statistics'}
                            </h3>
                          </div>
                          
                          <div className="text-center space-y-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {content.ctaTitle || 'Interested in Partnership?'}
                            </h3>
                            <p className="text-lg text-gray-600">
                              {content.ctaDescription || 'CTA description...'}
                            </p>
                            <div className="flex gap-2 justify-center">
                              {content.buttonText && (
                                <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm">
                                  {content.buttonText}
                                </button>
                              )}
                              {content.secondaryButtonText && (
                                <button className="border border-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                                  {content.secondaryButtonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Only show general content fields for non-hero sections */}
                      {content.id !== 'hero-section' && content.id !== 'certificate-section' && content.id !== 'brands-section' && content.id !== 'premium-partners-page' && content.id !== 'esg-certificate-page' && content.id !== 'header-section' && (
                        <>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {content.title || 'Title'}
                          </h2>
                          <p className="text-lg text-gray-600">
                            {content.subtitle || 'Subtitle'}
                          </p>
                          <p className="text-gray-600">
                            {content.description || 'Description'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {content.content || 'Main content...'}
                          </p>
                          {content.buttonText && (
                            <Button asChild>
                              <Link href={content.buttonLink || '#'}>
                                {content.buttonText}
                              </Link>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Device Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Button 
                      variant={deviceType === 'mobile' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDeviceType('mobile')}
                    >
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobile
                    </Button>
                    <Button 
                      variant={deviceType === 'tablet' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDeviceType('tablet')}
                    >
                      <Tablet className="h-4 w-4 mr-1" />
                      Tablet
                    </Button>
                    <Button 
                      variant={deviceType === 'desktop' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setDeviceType('desktop')}
                    >
                      <Monitor className="h-4 w-4 mr-1" />
                      Desktop
                    </Button>
                  </div>
                  
                  {/* Responsive Preview Container */}
                  <div className="flex justify-center">
                    <div 
                      className={`border-2 border-gray-300 rounded-lg bg-white shadow-lg transition-all duration-300 ${
                        deviceType === 'mobile' 
                          ? 'w-80 h-[600px]' 
                          : deviceType === 'tablet' 
                          ? 'w-96 h-[500px]' 
                          : 'w-full h-[400px]'
                      }`}
                    >
                      <div className="h-full overflow-auto">
                        {/* Header Section Preview for Header Section */}
                        {content.id === 'header-section' ? (
                          <div className="h-full bg-white">
                            {/* Top Bar */}
                            <div className={`bg-gray-50 px-2 py-1 text-xs text-gray-600 flex justify-between ${
                              deviceType === 'mobile' ? 'px-2 py-1' : 
                              deviceType === 'tablet' ? 'px-3 py-1' : 'px-4 py-2'
                            }`}>
                              <span className={`${
                                deviceType === 'mobile' ? 'text-xs' : 
                                deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                              }`}>
                                {content.topBarLeft || 'Free consultation and eye exam'}
                              </span>
                              <div className="flex gap-2">
                                <span className={`hidden md:inline ${
                                  deviceType === 'mobile' ? 'hidden' : 
                                  deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                }`}>|</span>
                                <span className={`hidden md:inline ${
                                  deviceType === 'mobile' ? 'hidden' : 
                                  deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                }`}>
                                  {content.topBarRight || '30-day return policy'}
                                </span>
                                <a href="/blog" className={`hover:text-primary ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                }`}>
                                  {content.blogLinkText || 'Blog'}
                                </a>
                                <a href="/contact" className={`hover:text-primary ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                }`}>
                                  {content.contactLinkText || 'Contact'}
                                </a>
                              </div>
                            </div>
                            
                            {/* Main Header */}
                            <div className={`px-2 py-2 flex items-center justify-between ${
                              deviceType === 'mobile' ? 'px-2 py-2' : 
                              deviceType === 'tablet' ? 'px-3 py-3' : 'px-4 py-4'
                            }`}>
                              {/* Logo */}
                              <div className="flex items-center gap-1">
                                {content.logoImage ? (
                                  <img 
                                    src={content.logoImage} 
                                    alt="Logo" 
                                    className={`object-contain ${
                                      deviceType === 'mobile' ? 'h-8 w-auto' : 
                                      deviceType === 'tablet' ? 'h-9 w-auto' : 'h-10 w-auto'
                                    }`}
                                  />
                                ) : (
                                  <div className={`bg-primary rounded flex items-center justify-center ${
                                    deviceType === 'mobile' ? 'w-8 h-8' : 
                                    deviceType === 'tablet' ? 'w-9 h-9' : 'w-10 h-10'
                                  }`}>
                                    <span className={`text-white font-bold ${
                                      deviceType === 'mobile' ? 'text-xs' : 
                                      deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                    }`}>S</span>
                                  </div>
                                )}
                                {content.logoText && (
                                  <span className={`font-bold ${
                                    deviceType === 'mobile' ? 'text-lg' : 
                                    deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                                  }`}>
                                    {content.logoText}
                                  </span>
                                )}
                              </div>
                              
                              {/* Desktop Navigation */}
                              <div className={`hidden lg:flex items-center gap-4 ${
                                deviceType === 'mobile' ? 'hidden' : 
                                deviceType === 'tablet' ? 'hidden' : 'flex'
                              }`}>
                                <a href={content.ecoFriendlyLink || '/eco-friendly'} className="flex items-center gap-1 hover:text-primary">
                                  <span className="w-3 h-3">🌱</span>
                                  <span className={`${
                                    deviceType === 'mobile' ? 'text-xs' : 
                                    deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                  }`}>
                                    {content.ecoFriendlyText || 'Eco-friendly'}
                                  </span>
                                </a>
                                <a href={content.communityLink || '/community'} className="flex items-center gap-1 hover:text-primary">
                                  <span className="w-3 h-3">👥</span>
                                  <span className={`${
                                    deviceType === 'mobile' ? 'text-xs' : 
                                    deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                  }`}>
                                    {content.communityText || 'Community'}
                                  </span>
                                </a>
                                
                                {/* Products Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-1 hover:text-primary">
                                    <span className="w-3 h-3">👓</span>
                                    <span className={`${
                                      deviceType === 'mobile' ? 'text-xs' : 
                                      deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                    }`}>
                                      Products
                                    </span>
                                    <span className="w-3 h-3">▼</span>
                                  </button>
                                </div>
                                
                                {/* Brands Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-1 hover:text-primary">
                                    <span className="w-3 h-3">🏆</span>
                                    <span className={`${
                                      deviceType === 'mobile' ? 'text-xs' : 
                                      deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                    }`}>
                                      Brands
                                    </span>
                                    <span className="w-3 h-3">▼</span>
                                  </button>
                                </div>
                                
                                {/* Lenses Dropdown */}
                                <div className="relative group">
                                  <button className="flex items-center gap-1 hover:text-primary">
                                    <span className="w-3 h-3">🔍</span>
                                    <span className={`${
                                      deviceType === 'mobile' ? 'text-xs' : 
                                      deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                    }`}>
                                      Lenses
                                    </span>
                                    <span className="w-3 h-3">▼</span>
                                  </button>
                                </div>
                              </div>
                              
                              {/* Search Bar */}
                              <div className="flex items-center gap-1">
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder={content.searchPlaceholder || 'Search glasses, brands...'}
                                    className={`border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                      deviceType === 'mobile' ? 'w-32 px-2 py-1 text-xs' : 
                                      deviceType === 'tablet' ? 'w-48 px-3 py-1 text-sm' : 'w-64 px-4 py-2'
                                    }`}
                                  />
                                  <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 ${
                                    deviceType === 'mobile' ? 'text-xs' : 
                                    deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                  }`}>🔍</span>
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="flex items-center gap-1">
                                  <button className={`hover:bg-gray-100 rounded-lg ${
                                    deviceType === 'mobile' ? 'p-1' : 
                                    deviceType === 'tablet' ? 'p-1' : 'p-2'
                                  }`}>❤️</button>
                                  <button className={`hover:bg-gray-100 rounded-lg ${
                                    deviceType === 'mobile' ? 'p-1' : 
                                    deviceType === 'tablet' ? 'p-1' : 'p-2'
                                  }`}>👤</button>
                                  <button className={`hover:bg-gray-100 rounded-lg lg:hidden ${
                                    deviceType === 'mobile' ? 'p-1' : 
                                    deviceType === 'tablet' ? 'p-1' : 'p-2'
                                  }`}>☰</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : content.id === 'hero-section' && content.slides && content.slides.length > 0 ? (
                          <div className="h-full">
                            {/* Hero Slider Preview */}
                            <div className="relative h-full">
                              {content.slides.slice(0, 1).map((slide) => (
                                <div key={slide.id} className="relative h-full">
                                  {slide.image && (
                                    <div className="absolute inset-0">
                                      <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/40" />
                                    </div>
                                  )}
                                  
                                  <div className="absolute inset-0 flex items-center">
                                    <div className="container mx-auto px-4">
                                      <div className="max-w-2xl">
                                        <h1 className={`font-bold text-white mb-4 ${
                                          deviceType === 'mobile' ? 'text-2xl' : 
                                          deviceType === 'tablet' ? 'text-3xl' : 'text-4xl'
                                        }`}>
                                          {slide.title || 'Title'}
                                        </h1>
                                        <p className={`text-white/90 mb-8 ${
                                          deviceType === 'mobile' ? 'text-sm' : 
                                          deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                        }`}>
                                          {slide.subtitle || 'Subtitle'}
                                        </p>
                                        {slide.cta && (
                                          <button className={`bg-white text-gray-900 px-4 py-2 rounded font-medium ${
                                            deviceType === 'mobile' ? 'text-sm px-3 py-1' : 
                                            deviceType === 'tablet' ? 'text-base px-4 py-2' : 'text-lg px-6 py-3'
                                          }`}>
                                            {slide.cta}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : content.id === 'brands-section' ? (
                          /* Brands Section Preview */
                          <div className="p-4 h-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center space-y-4">
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                {content.badgeText || '✨ Premium Partners'}
                              </div>
                              <h2 className={`font-bold text-gray-900 ${
                                deviceType === 'mobile' ? 'text-lg' : 
                                deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                              }`}>
                                {content.title || 'Discover Our Premium Lens Brands'}
                              </h2>
                              <p className={`text-gray-600 ${
                                deviceType === 'mobile' ? 'text-xs' : 
                                deviceType === 'tablet' ? 'text-sm' : 'text-base'
                              }`}>
                                {content.description || 'Description'}
                              </p>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                                {content.brandLogos && content.brandLogos.length > 0 ? (
                                  content.brandLogos.slice(0, 8).map((logoUrl, index) => (
                                    <div key={index} className="group flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                      <div className={`relative mb-1 ${
                                        deviceType === 'mobile' ? 'w-8 h-5' : 
                                        deviceType === 'tablet' ? 'w-10 h-6' : 'w-12 h-8'
                                      }`}>
                                        <img
                                          src={logoUrl}
                                          alt={`Brand ${index + 1}`}
                                          className="w-full h-full object-contain"
                                          onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCIgeT0iMjgiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW52YWxpZDwvdGV4dD48L3N2Zz4=';
                                          }}
                                        />
                                      </div>
                                      <h3 className={`font-medium text-gray-800 text-center ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>
                                        Brand {index + 1}
                                      </h3>
                                    </div>
                                  ))
                                ) : (
                                  Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className="group flex flex-col items-center justify-center p-2 bg-gray-100 rounded-lg border border-gray-200">
                                      <div className={`mb-1 bg-gray-200 rounded ${
                                        deviceType === 'mobile' ? 'w-8 h-5' : 
                                        deviceType === 'tablet' ? 'w-10 h-6' : 'w-12 h-8'
                                      }`}></div>
                                      <h3 className={`font-medium text-gray-500 text-center ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>
                                        Brand {index + 1}
                                      </h3>
                                    </div>
                                  ))
                                )}
                              </div>
                              
                              <div className="text-center space-y-2">
                                <p className={`text-gray-600 ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                }`}>
                                  {content.bottomCtaText || 'Discover our complete collection...'}
                                </p>
                                <div className="flex gap-2 justify-center">
                                  {content.buttonText && (
                                    <button className={`bg-gray-900 text-white px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.buttonText}
                                    </button>
                                  )}
                                  {content.secondaryButtonText && (
                                    <button className={`border border-gray-200 text-gray-700 px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.secondaryButtonText}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : content.id === 'certificate-section' ? (
                          /* Certificate Section Preview */
                          <div className="p-4 h-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center space-y-4">
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {content.badgeText || 'Chứng nhận ESG'}
                              </div>
                              <h2 className={`font-bold text-gray-900 ${
                                deviceType === 'mobile' ? 'text-lg' : 
                                deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                              }`}>
                                {content.title || 'ESG Certified Excellence'}
                              </h2>
                              <p className={`text-gray-600 ${
                                deviceType === 'mobile' ? 'text-xs' : 
                                deviceType === 'tablet' ? 'text-sm' : 'text-base'
                              }`}>
                                {content.description || 'Description'}
                              </p>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="relative">
                                  {content.imageUrl && (
                                    <div className={`bg-gray-100 rounded overflow-hidden ${
                                      deviceType === 'mobile' ? 'h-32' : 
                                      deviceType === 'tablet' ? 'h-48' : 'h-64'
                                    }`}>
                                      <img
                                        src={content.imageUrl}
                                        alt="Certificate"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-end">
                                        <div className="p-2 text-white">
                                          <h3 className={`font-bold ${
                                            deviceType === 'mobile' ? 'text-xs' : 
                                            deviceType === 'tablet' ? 'text-sm' : 'text-base'
                                          }`}>
                                            {content.certificateTitle || 'Synesgy ESG Certificate'}
                                          </h3>
                                          <p className={`${
                                            deviceType === 'mobile' ? 'text-xs' : 
                                            deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                          }`}>
                                            {content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className={`font-bold text-gray-900 ${
                                    deviceType === 'mobile' ? 'text-sm' : 
                                    deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                  }`}>
                                    {content.whatThisMeansTitle || 'What This Means for You'}
                                  </h3>
                                  <p className={`text-gray-600 ${
                                    deviceType === 'mobile' ? 'text-xs' : 
                                    deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                  }`}>
                                    {content.whatThisMeansDescription || 'Description'}
                                  </p>
                                  
                                  <div className="grid grid-cols-3 gap-1">
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Leaf className={`text-green-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Environmental</h4>
                                    </div>
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Users className={`text-gray-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Social</h4>
                                    </div>
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-purple-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Shield className={`text-purple-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Governance</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-center space-y-2">
                                <p className={`text-gray-600 ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                }`}>
                                  {content.bottomCtaText || 'Join us in our mission...'}
                                </p>
                                <div className="flex gap-2 justify-center">
                                  {content.buttonText && (
                                    <button className={`bg-green-600 text-white px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.buttonText}
                                    </button>
                                  )}
                                  {content.secondaryButtonText && (
                                    <button className={`border border-green-600 text-green-600 px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.secondaryButtonText}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : content.id === 'esg-certificate-page' ? (
                          /* ESG Certificate Page Preview */
                          <div className="p-4 h-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center space-y-4">
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {content.badgeText || 'Synesgy ESG Certified'}
                              </div>
                              <h2 className={`font-bold text-gray-900 ${
                                deviceType === 'mobile' ? 'text-lg' : 
                                deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                              }`}>
                                {content.heroTitle || 'Among Vietnam\'s First Sustainable Eyewear Retailers'}
                              </h2>
                              <p className={`text-gray-600 ${
                                deviceType === 'mobile' ? 'text-xs' : 
                                deviceType === 'tablet' ? 'text-sm' : 'text-base'
                              }`}>
                                {content.heroDescription || 'Hero description...'}
                              </p>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="relative">
                                  {content.imageUrl && (
                                    <div className={`bg-gray-100 rounded overflow-hidden ${
                                      deviceType === 'mobile' ? 'h-32' : 
                                      deviceType === 'tablet' ? 'h-48' : 'h-64'
                                    }`}>
                                      <img
                                        src={content.imageUrl}
                                        alt="Certificate"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-end">
                                        <div className="p-2 text-white">
                                          <h3 className={`font-bold ${
                                            deviceType === 'mobile' ? 'text-xs' : 
                                            deviceType === 'tablet' ? 'text-sm' : 'text-base'
                                          }`}>
                                            {content.certificateTitle || 'Synesgy ESG Certificate'}
                                          </h3>
                                          <p className={`${
                                            deviceType === 'mobile' ? 'text-xs' : 
                                            deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                          }`}>
                                            {content.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  <h3 className={`font-bold text-gray-900 ${
                                    deviceType === 'mobile' ? 'text-sm' : 
                                    deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                  }`}>
                                    {content.whatThisMeansTitle || 'What This Certification Means'}
                                  </h3>
                                  <p className={`text-gray-600 ${
                                    deviceType === 'mobile' ? 'text-xs' : 
                                    deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                  }`}>
                                    {content.whatThisMeansDescription || 'Description'}
                                  </p>
                                  
                                  <div className="grid grid-cols-3 gap-1">
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Leaf className={`text-green-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Environmental</h4>
                                    </div>
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-gray-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Users className={`text-gray-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Social</h4>
                                    </div>
                                    <div className="text-center p-1 bg-white rounded border">
                                      <div className={`mx-auto mb-1 bg-purple-100 rounded-full flex items-center justify-center ${
                                        deviceType === 'mobile' ? 'w-4 h-4' : 
                                        deviceType === 'tablet' ? 'w-6 h-6' : 'w-8 h-8'
                                      }`}>
                                        <Shield className={`text-purple-600 ${
                                          deviceType === 'mobile' ? 'h-2 w-2' : 
                                          deviceType === 'tablet' ? 'h-3 w-3' : 'h-4 w-4'
                                        }`} />
                                      </div>
                                      <h4 className={`font-semibold ${
                                        deviceType === 'mobile' ? 'text-xs' : 
                                        deviceType === 'tablet' ? 'text-xs' : 'text-sm'
                                      }`}>Governance</h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-sm' : 
                                  deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                }`}>
                                  {content.esgPillarsTitle || 'Our ESG Pillars'}
                                </h3>
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-sm' : 
                                  deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                }`}>
                                  {content.impactMetricsTitle || 'Our Impact Metrics'}
                                </h3>
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-sm' : 
                                  deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                }`}>
                                  {content.certificationDetailsTitle || 'Certification Details'}
                                </h3>
                              </div>
                              
                              <div className="text-center space-y-2">
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-base' : 
                                  deviceType === 'tablet' ? 'text-lg' : 'text-xl'
                                }`}>
                                  {content.ctaTitle || 'Join Us in Our Mission'}
                                </h3>
                                <p className={`text-gray-600 ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                }`}>
                                  {content.ctaDescription || 'CTA description...'}
                                </p>
                                <div className="flex gap-2 justify-center">
                                  {content.buttonText && (
                                    <button className={`bg-green-600 text-white px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.buttonText}
                                    </button>
                                  )}
                                  {content.secondaryButtonText && (
                                    <button className={`border border-green-600 text-green-600 px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.secondaryButtonText}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : content.id === 'premium-partners-page' ? (
                          /* Premium Partners Page Preview */
                          <div className="p-4 h-full bg-gradient-to-br from-gray-50 to-gray-100">
                            <div className="text-center space-y-4">
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                {content.badgeText || 'Premium Partners'}
                              </div>
                              <h2 className={`font-bold text-gray-900 ${
                                deviceType === 'mobile' ? 'text-lg' : 
                                deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                              }`}>
                                {content.heroTitle || 'Trusted by Leading Brands'}
                              </h2>
                              <p className={`text-gray-600 ${
                                deviceType === 'mobile' ? 'text-xs' : 
                                deviceType === 'tablet' ? 'text-sm' : 'text-base'
                              }`}>
                                {content.heroDescription || 'Hero description...'}
                              </p>
                              
                              <div className="space-y-2">
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-sm' : 
                                  deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                }`}>
                                  {content.benefitsTitle || 'Why Partner with Us?'}
                                </h3>
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-sm' : 
                                  deviceType === 'tablet' ? 'text-base' : 'text-lg'
                                }`}>
                                  {content.statsTitle || 'Partnership Statistics'}
                                </h3>
                              </div>
                              
                              <div className="text-center space-y-2">
                                <h3 className={`font-bold text-gray-900 ${
                                  deviceType === 'mobile' ? 'text-base' : 
                                  deviceType === 'tablet' ? 'text-lg' : 'text-xl'
                                }`}>
                                  {content.ctaTitle || 'Interested in Partnership?'}
                                </h3>
                                <p className={`text-gray-600 ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-sm' : 'text-sm'
                                }`}>
                                  {content.ctaDescription || 'CTA description...'}
                                </p>
                                <div className="flex gap-2 justify-center">
                                  {content.buttonText && (
                                    <button className={`bg-gray-900 text-white px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.buttonText}
                                    </button>
                                  )}
                                  {content.secondaryButtonText && (
                                    <button className={`border border-gray-200 text-gray-700 px-3 py-1 rounded font-medium ${
                                      deviceType === 'mobile' ? 'text-xs px-2 py-1' : 
                                      deviceType === 'tablet' ? 'text-sm px-3 py-1' : 'text-sm px-4 py-2'
                                    }`}>
                                      {content.secondaryButtonText}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Standard Content Preview */
                          <div className="p-6 h-full flex flex-col justify-center">
                            <div className="text-center space-y-4">
                              {content.imageUrl && (
                                <div className={`mx-auto bg-gray-100 rounded-lg overflow-hidden ${
                                  deviceType === 'mobile' ? 'w-32 h-24' : 
                                  deviceType === 'tablet' ? 'w-48 h-36' : 'w-64 h-48'
                                }`}>
                                  <img
                                    src={content.imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              <h3 className={`font-semibold text-gray-900 ${
                                deviceType === 'mobile' ? 'text-lg' : 
                                deviceType === 'tablet' ? 'text-xl' : 'text-2xl'
                              }`}>
                                {content.title || 'Title'}
                              </h3>
                              <p className={`text-gray-600 ${
                                deviceType === 'mobile' ? 'text-sm' : 
                                deviceType === 'tablet' ? 'text-base' : 'text-lg'
                              }`}>
                                {content.subtitle || 'Subtitle'}
                              </p>
                              {content.description && (
                                <p className={`text-gray-500 ${
                                  deviceType === 'mobile' ? 'text-xs' : 
                                  deviceType === 'tablet' ? 'text-sm' : 'text-base'
                                }`}>
                                  {content.description}
                                </p>
                              )}
                              {content.buttonText && (
                                <button className={`bg-blue-600 text-white px-4 py-2 rounded font-medium ${
                                  deviceType === 'mobile' ? 'text-sm px-3 py-1' : 
                                  deviceType === 'tablet' ? 'text-base px-4 py-2' : 'text-lg px-6 py-3'
                                }`}>
                                  {content.buttonText}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Device Info */}
                  <div className="mt-4 text-center text-sm text-gray-500">
                    {deviceType === 'mobile' && 'Mobile (375px × 667px)'}
                    {deviceType === 'tablet' && 'Tablet (768px × 1024px)'}
                    {deviceType === 'desktop' && 'Desktop (1920px × 1080px)'}
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
