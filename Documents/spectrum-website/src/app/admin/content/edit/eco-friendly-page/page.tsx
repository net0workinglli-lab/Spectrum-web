'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Save, Eye, Users, MessageSquare, 
  Star, Heart, Share2, Camera, Upload, CheckCircle, AlertCircle,
  Leaf, Recycle, Package, Store, Battery, Calendar, Globe, Award, FileText
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { createOrUpdateSection, getSectionContentById } from '@/lib/firebase-firestore';
import { ImageUpload } from '@/components/ImageUpload';

interface EcoFriendlyContent {
  id: string;
  // Hero Section
  badgeText: string;
  title: string;
  description: string;
  subtitle: string;
  
  // Main Policy Section
  policyTitle: string;
  policyContent: string;
  
  // Eco-friendly Initiatives
  initiativesTitle: string;
  initiatives: Array<{
    title: string;
    description: string;
    details: string;
    icon: string;
    image: string;
  }>;
  
  // Community Programs
  programsTitle: string;
  programs: Array<{
    title: string;
    description: string;
    icon: string;
    status: string;
  }>;
  
  // Call to Action
  cta: {
    title: string;
    description: string;
    button1Text: string;
    button1Icon: string;
    button1Link: string;
    button2Text: string;
    button2Icon: string;
    button2Link: string;
  };
  
  // Stats Section
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export default function EcoFriendlyPageEdit() {
  const { isLoggedIn, user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [content, setContent] = useState<EcoFriendlyContent>({
    id: 'eco-friendly-page',
    // Hero Section
    badgeText: 'Eco-friendly Policy',
    title: 'THÂN THIỆN VỚI MÔI TRƯỜNG',
    description: 'At Spectrum, we take our responsibility to the environment seriously and are committed to preserving it for future generations.',
    subtitle: 'To that end, we use eco-friendly materials in our store\'s construction, product creation, and order packaging. By making these small changes, we hope to join forces with others to reduce pollution during production and protect our ecosystem.',
    
    // Main Policy Section
    policyTitle: 'Our Eco-friendly Policy',
    policyContent: 'We invite our customers to join us on this journey towards a greener future, and we promise that each step we take will contribute to a brighter tomorrow for all.\n\nSome of the eco-friendly materials we use in our stores can be found even in our store constructive materials. We also prioritize sourcing products from suppliers who share our commitment to sustainability and minimizing their environmental impact.\n\nOur order packaging is made from recycled materials, and we encourage our customers to recycle or reuse our packaging whenever possible.\n\nAdditionally, we have implemented various recycling programs in our stores to reduce waste and promote responsible consumption. We also regularly assess our environmental impact and look for ways to improve our practices. We believe that by taking these steps, we can make a positive difference and help protect the planet.\n\nWe recognize that protecting the environment is a collective effort, and we are proud to play a part in this important work. We hope that our commitment to environmental stewardship inspires others to take action and join us in creating a more sustainable future for all.',
    
    // Eco-friendly Initiatives
    initiativesTitle: 'Our Eco-friendly Initiatives',
    initiatives: [
      {
        title: 'Eyewear Frames',
        description: 'Our collection of eco-friendly eyewear frames is designed to meet the needs of the fashion-conscious and environmentally aware.',
        details: 'Our frames are crafted using sustainable materials, such as bamboo, recycled plastic, and natural materials, which are both durable and stylish.',
        icon: 'Leaf',
        image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop'
      },
      {
        title: 'Store Materials',
        description: 'SPECTRUM is committed to protecting the environment, starting with utilizing eco-friendly materials in the construction of our brick-and-mortar store.',
        details: 'We understand the importance of taking responsibility for our impact on the environment, and we believe that every company has a role to play in creating a sustainable future.',
        icon: 'Store',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
      },
      {
        title: 'Packaging',
        description: 'At Spectrum, we are committed to sustainable practices, and one of the ways we demonstrate this commitment is through our eco-friendly packaging.',
        details: 'We understand the importance of reducing our environmental footprint, and our packaging reflects this dedication.',
        icon: 'Package',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
      }
    ],
    
    // Community Programs
    programsTitle: 'Community Programs',
    programs: [
      {
        title: 'Eyetot Community Outreach',
        description: 'Be a part of our SPECTRUM team to create the "good eyes" community by giving your old glasses frames a new purpose',
        icon: 'Users',
        status: 'Active'
      },
      {
        title: 'Battery & Pin Recycling',
        description: 'At our store, we stick to environmental responsibility. Bring in your used batteries and pins, and we\'ll ensure they are recycled properly.',
        icon: 'Battery',
        status: 'Active'
      },
      {
        title: 'Events & Activities',
        description: 'Explore our eco-conscious events & activities to make a positive impact on the environment. From community clean-ups to recycling drives and green workshops.',
        icon: 'Calendar',
        status: 'Coming Soon'
      }
    ],
    
    // Call to Action
    cta: {
      title: 'Join Us in Creating a Sustainable Future',
      description: 'Together, we can make a positive impact on our planet. Every small action counts towards a greener tomorrow.',
      button1Text: 'Learn More',
      button1Icon: 'Heart',
      button1Link: '/about',
      button2Text: 'Get Involved',
      button2Icon: 'Globe',
      button2Link: '/contact'
    },
    
    // Stats Section
    stats: [
      { value: '100%', label: 'Recycled Packaging' },
      { value: '50+', label: 'Eco-friendly Materials' },
      { value: '1000+', label: 'Glasses Recycled' },
      { value: '5', label: 'Years of Commitment' }
    ]
  });

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        console.log('🔄 Loading eco-friendly page content...');
        const sectionData = await getSectionContentById('eco-friendly-page');
        console.log('🎯 Eco-friendly page data:', sectionData);
        if (sectionData) {
          setContent(prevContent => ({
            ...prevContent,
            ...sectionData,
            id: 'eco-friendly-page'
          }));
          console.log('✅ Eco-friendly page content loaded successfully!');
        } else {
          console.log('ℹ️ No eco-friendly page data found, using default content');
        }
      } catch (error) {
        console.error('❌ Error loading eco-friendly page content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleInitiativeChange = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      initiatives: prev.initiatives.map((initiative, i) => 
        i === index ? { ...initiative, [field]: value } : initiative
      )
    }));
    setHasChanges(true);
  };

  const handleProgramChange = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      programs: prev.programs.map((program, i) => 
        i === index ? { ...program, [field]: value } : program
      )
    }));
    setHasChanges(true);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Saving eco-friendly page content:', content);
      await createOrUpdateSection('eco-friendly-page', content as unknown as Record<string, unknown>);
      console.log('✅ Eco-friendly page content saved successfully!');
      setSuccessMessage('Eco-friendly page content saved successfully!');
      setHasChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error saving eco-friendly page content:', error);
      alert('Error saving content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Leaf, Recycle, Package, Store, Users, Battery, Calendar, Globe, Award, Heart
    };
    const IconComponent = icons[iconName] || Leaf;
    return <IconComponent className="h-4 w-4" />;
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don&apos;t have permission to edit this content.
            </p>
            <Button asChild>
              <Link href="/admin/content">Back to Content Management</Link>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading eco-friendly page content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/content">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Content Management
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Eco-friendly Page</h1>
              <p className="text-gray-600">Chỉnh sửa nội dung trang Eco-friendly - tất cả các section và hoạt động</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/eco-friendly" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview Page
              </Link>
            </Button>
            
            {successMessage && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                {successMessage}
              </Badge>
            )}
            
            {hasChanges && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-3 w-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                Hero Section - Phần Tiêu Đề Chính
              </CardTitle>
              <p className="text-sm text-gray-600">Chỉnh sửa tiêu đề, badge và mô tả chính của trang Eco-friendly</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="badgeText">Badge Text (Văn bản hiển thị trên badge)</Label>
                  <Input
                    id="badgeText"
                    value={content.badgeText}
                    onChange={(e) => handleInputChange('badgeText', e.target.value)}
                    placeholder="Ví dụ: Eco-friendly Policy"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title (Tiêu đề chính)</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ví dụ: THÂN THIỆN VỚI MÔI TRƯỜNG"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Mô tả chính)</Label>
                  <Textarea
                    id="description"
                    value={content.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả về chính sách eco-friendly..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle (Mô tả phụ)</Label>
                  <Textarea
                    id="subtitle"
                    value={content.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    placeholder="Mô tả chi tiết về các hoạt động eco-friendly..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Policy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Main Policy Section - Phần Chính Sách Chính
              </CardTitle>
              <p className="text-sm text-gray-600">Chỉnh sửa tiêu đề và nội dung chính sách eco-friendly</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="policyTitle">Policy Title (Tiêu đề chính sách)</Label>
                  <Input
                    id="policyTitle"
                    value={content.policyTitle}
                    onChange={(e) => handleInputChange('policyTitle', e.target.value)}
                    placeholder="Ví dụ: Our Eco-friendly Policy"
                  />
                </div>
                <div>
                  <Label htmlFor="policyContent">Policy Content (Nội dung chính sách)</Label>
                  <Textarea
                    id="policyContent"
                    value={content.policyContent}
                    onChange={(e) => handleInputChange('policyContent', e.target.value)}
                    placeholder="Nội dung chi tiết về chính sách eco-friendly..."
                    rows={10}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eco-friendly Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-500" />
                Eco-friendly Initiatives - Các Sáng Kiến Thân Thiện Môi Trường
              </CardTitle>
              <p className="text-sm text-gray-600">Chỉnh sửa các sáng kiến eco-friendly</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="initiativesTitle">Section Title (Tiêu đề section)</Label>
                <Input
                  id="initiativesTitle"
                  value={content.initiativesTitle}
                  onChange={(e) => handleInputChange('initiativesTitle', e.target.value)}
                  placeholder="Ví dụ: Our Eco-friendly Initiatives"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Initiatives (Các sáng kiến)</h4>
                {content.initiatives.map((initiative, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIcon(initiative.icon)}
                        Initiative {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`initiative-title-${index}`}>Title</Label>
                        <Input
                          id={`initiative-title-${index}`}
                          value={initiative.title}
                          onChange={(e) => handleInitiativeChange(index, 'title', e.target.value)}
                          placeholder="Initiative title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`initiative-icon-${index}`}>Icon</Label>
                        <Input
                          id={`initiative-icon-${index}`}
                          value={initiative.icon}
                          onChange={(e) => handleInitiativeChange(index, 'icon', e.target.value)}
                          placeholder="Icon name"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`initiative-description-${index}`}>Description</Label>
                        <Textarea
                          id={`initiative-description-${index}`}
                          value={initiative.description}
                          onChange={(e) => handleInitiativeChange(index, 'description', e.target.value)}
                          placeholder="Initiative description"
                          rows={2}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`initiative-details-${index}`}>Details</Label>
                        <Textarea
                          id={`initiative-details-${index}`}
                          value={initiative.details}
                          onChange={(e) => handleInitiativeChange(index, 'details', e.target.value)}
                          placeholder="Initiative details"
                          rows={2}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Initiative Image</Label>
                        <ImageUpload
                          value={initiative.image}
                          onChange={(url) => handleInitiativeChange(index, 'image', url)}
                          placeholder="Upload or enter initiative image URL"
                          description="Recommended size: 800x600px"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Community Programs - Chương Trình Cộng Đồng
              </CardTitle>
              <p className="text-sm text-gray-600">Chỉnh sửa các chương trình cộng đồng</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="programsTitle">Section Title (Tiêu đề section)</Label>
                <Input
                  id="programsTitle"
                  value={content.programsTitle}
                  onChange={(e) => handleInputChange('programsTitle', e.target.value)}
                  placeholder="Ví dụ: Community Programs"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Programs (Các chương trình)</h4>
                {content.programs.map((program, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIcon(program.icon)}
                        Program {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`program-title-${index}`}>Title</Label>
                        <Input
                          id={`program-title-${index}`}
                          value={program.title}
                          onChange={(e) => handleProgramChange(index, 'title', e.target.value)}
                          placeholder="Program title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`program-icon-${index}`}>Icon</Label>
                        <Input
                          id={`program-icon-${index}`}
                          value={program.icon}
                          onChange={(e) => handleProgramChange(index, 'icon', e.target.value)}
                          placeholder="Icon name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`program-status-${index}`}>Status</Label>
                        <Input
                          id={`program-status-${index}`}
                          value={program.status}
                          onChange={(e) => handleProgramChange(index, 'status', e.target.value)}
                          placeholder="Active, Coming Soon, etc."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`program-description-${index}`}>Description</Label>
                        <Textarea
                          id={`program-description-${index}`}
                          value={program.description}
                          onChange={(e) => handleProgramChange(index, 'description', e.target.value)}
                          placeholder="Program description"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Call to Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cta-title">CTA Title</Label>
                  <Input
                    id="cta-title"
                    value={content.cta.title}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, title: e.target.value } }))}
                    placeholder="CTA title"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-description">CTA Description</Label>
                  <Textarea
                    id="cta-description"
                    value={content.cta.description}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, description: e.target.value } }))}
                    placeholder="CTA description"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta-button1-text">Button 1 Text</Label>
                  <Input
                    id="cta-button1-text"
                    value={content.cta.button1Text}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button1Text: e.target.value } }))}
                    placeholder="First button text"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-button1-icon">Button 1 Icon</Label>
                  <Input
                    id="cta-button1-icon"
                    value={content.cta.button1Icon}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button1Icon: e.target.value } }))}
                    placeholder="First button icon"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-button1-link">Button 1 Link</Label>
                  <Input
                    id="cta-button1-link"
                    value={content.cta.button1Link}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button1Link: e.target.value } }))}
                    placeholder="/about"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-button2-text">Button 2 Text</Label>
                  <Input
                    id="cta-button2-text"
                    value={content.cta.button2Text}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button2Text: e.target.value } }))}
                    placeholder="Second button text"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-button2-icon">Button 2 Icon</Label>
                  <Input
                    id="cta-button2-icon"
                    value={content.cta.button2Icon}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button2Icon: e.target.value } }))}
                    placeholder="Second button icon"
                  />
                </div>
                <div>
                  <Label htmlFor="cta-button2-link">Button 2 Link</Label>
                  <Input
                    id="cta-button2-link"
                    value={content.cta.button2Link}
                    onChange={(e) => setContent(prev => ({ ...prev, cta: { ...prev.cta, button2Link: e.target.value } }))}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Stats Section - Phần Thống Kê
              </CardTitle>
              <p className="text-sm text-gray-600">Chỉnh sửa các thống kê hiển thị</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Statistics (Thống kê)</h4>
                {content.stats.map((stat, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">Stat {index + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`stat-value-${index}`}>Value</Label>
                        <Input
                          id={`stat-value-${index}`}
                          value={stat.value}
                          onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                          placeholder="100%, 50+, etc."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`stat-label-${index}`}>Label</Label>
                        <Input
                          id={`stat-label-${index}`}
                          value={stat.label}
                          onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                          placeholder="Recycled Packaging, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
