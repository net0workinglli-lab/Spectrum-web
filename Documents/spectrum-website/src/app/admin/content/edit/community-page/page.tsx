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
  Gift, MapPin, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { getAllSections, createOrUpdateSection } from '@/lib/firebase-firestore';
import { ImageUpload } from '@/components/ImageUpload';

interface CommunityContent {
  id: string;
  // Hero Section
  badgeText: string;
  title: string;
  description: string;
  
  // How It Works Section
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  howItWorksNote: string;
  steps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  locationTitle: string;
  locationAddress: string;
  locationLink: string;
  
  // Activities Section
  activitiesTitle: string;
  activitiesDescription: string;
  activitiesImage: string;
  activitiesFeatures: Array<{
    title: string;
    description: string;
  }>;
  
  // Core Values Section
  coreValuesTitle: string;
  values: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  
  // Recent Activities
  recentActivitiesTitle: string;
  activities: Array<{
    id: string;
    title: string;
    date: string;
    description: string;
    image: string;
    status: string;
  }>;
  
  // Call to Action
  cta: {
    title: string;
    description: string;
    button1Text: string;
    button1Icon: string;
    button2Text: string;
    button2Icon: string;
  };
}

export default function CommunityPageEdit() {
  const { isLoggedIn, user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [content, setContent] = useState<CommunityContent>({
    id: 'community-page',
    // Hero Section
    badgeText: 'Community Outreach Program',
    title: 'NÂNG NIU ĐÔI MẮT, THẮP SÁNG TƯƠNG LAI',
    description: 'Thông qua chương trình "CHĂM SÓC ĐÔI MẮT CỦA BẠN, TƯƠI SÁNG TƯƠNG LAI", chúng tôi cố gắng tạo ra tác động tích cực đến những người không có điều kiện tiếp cận dịch vụ chăm sóc mắt và chỉnh sửa thị lực.',
    
    // How It Works Section
    howItWorksTitle: 'Cách Thức Hoạt Động',
    howItWorksSubtitle: 'Biến Những Chiếc Kính Cũ Của Bạn Thành 500.000 VND Và Món Quà Thị Giác Cho Những Người Cần',
    howItWorksNote: '*(Chỉ nhận kính còn sử dụng được)',
    steps: [
      {
        icon: 'Gift',
        title: '1. Quyên Góp Kính',
        description: 'Mang kính cũ còn sử dụng được đến cửa hàng của chúng tôi'
      },
      {
        icon: 'Heart',
        title: '2. Nhận 500.000 VND',
        description: 'Nhận ngay 500.000 VND và món quà thị giác từ chúng tôi'
      },
      {
        icon: 'Users',
        title: '3. Giúp Đỡ Cộng Đồng',
        description: 'Kính của bạn sẽ được trao cho những người cần hỗ trợ'
      }
    ],
    locationTitle: 'Nơi Thu Nhận:',
    locationAddress: 'Spectrum Eyecare\n192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam',
    locationLink: 'https://maps.google.com/maps?q=Spectrum+Eyecare+192+Nguyễn+Văn+Hưởng,+Thảo+Điền,+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam',
    
    // Activities Section
    activitiesTitle: 'Các Hoạt Động Của Chúng Tôi',
    activitiesDescription: 'Trong hành trình đầu tiên thực hiện ước mơ cho thế hệ kế tiếp, Spectrum Eyecare đã đồng hành cùng Trường Từ Thiện Phước Thiện với hy vọng trực tiếp truyền đạt kiến thức và nguồn lực chuyên môn đến những người cần hỗ trợ nhất.',
    activitiesImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
    activitiesFeatures: [
      {
        title: 'Kiểm tra mắt toàn diện:',
        description: '36 học sinh được kiểm tra, 15 em gặp vấn đề về khúc xạ'
      },
      {
        title: 'Kính tùy chỉnh:',
        description: 'Chế tác kính phù hợp với nhu cầu thị lực cụ thể của từng em'
      },
      {
        title: 'Hỗ trợ học tập:',
        description: 'Cung cấp vở, bút chì và các vật dụng học tập cần thiết'
      }
    ],
    
    // Core Values Section
    coreValuesTitle: 'Cốt Lõi',
    values: [
      {
        icon: 'Heart',
        title: 'Tính Bền Vững',
        description: 'Chúng tôi tích cực thúc đẩy việc tái chế những gọng kính cũ được quyên góp, đảm bảo rằng chúng được tái sử dụng để mang lại lợi ích cho những người cần giúp đỡ.'
      },
      {
        icon: 'Users',
        title: 'Hỗ Trợ Cộng Đồng',
        description: 'Thông qua các đối tác cung cấp đáng tin cậy như Essilor, chúng tôi có thể tài trợ cho những chiếc kính chất lượng xuất sắc, từ đó nâng cao trải nghiệm thị giác.'
      }
    ],
    
    // Recent Activities
    recentActivitiesTitle: 'Hoạt Động Gần Đây',
    activities: [
      {
        id: '1',
        title: 'Trung Thu Bên Em - Ninh Thuận',
        date: 'October 22, 2024',
        description: 'Spectrum tiếp tục chặng đường "Nâng Niu Đôi Mắt, Thắp Sáng Tương Lai" tại tỉnh Ninh Thuận',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Phước Thiện Charity School - Round 2',
        date: 'September 11, 2024',
        description: 'Spectrum continues to carry out the mission "Care for Your Eyes, Shine for Your Future"',
        image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&h=400&fit=crop',
        status: 'completed'
      }
    ],
    
    // Call to Action
    cta: {
      title: 'Hãy Cùng Chúng Tôi Tạo Ra Sự Khác Biệt',
      description: 'Để chương trình ý nghĩa này có thể lan tỏa xa hơn nữa, Spectrum vẫn tiếp tục nhận kính cũ tại cửa hàng. Hãy quyên góp những gọng kính cũ và nhận 500.000 VND cùng với món quà thị giác của mình.',
      button1Text: 'Quyên Góp Ngay',
      button1Icon: 'Gift',
      button2Text: 'Xem Địa Chỉ',
      button2Icon: 'MapPin'
    }
  });

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        console.log('🔄 Loading community page content...');
        const sections = await getAllSections();
        console.log('📋 All sections:', sections);
        const sectionData = sections.find(section => section.id === 'community-page');
        console.log('🎯 Community page data:', sectionData);
        if (sectionData) {
          setContent(prevContent => ({
            ...prevContent,
            ...sectionData,
            id: 'community-page'
          }));
          console.log('✅ Community page content loaded successfully!');
        } else {
          console.log('ℹ️ No community page data found, using default content');
        }
      } catch (error) {
        console.error('❌ Error loading community page content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log('💾 Saving community page content:', content);
      await createOrUpdateSection('community-page', content as unknown as Record<string, unknown>);
      console.log('✅ Community page content saved successfully!');
      setSuccessMessage('Community page content saved successfully!');
      setHasChanges(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error saving community page content:', error);
      alert('Error saving content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...content.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setContent(prev => ({ ...prev, steps: newSteps }));
    setHasChanges(true);
  };

  const handleActivityFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...content.activitiesFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setContent(prev => ({ ...prev, activitiesFeatures: newFeatures }));
    setHasChanges(true);
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    const newValues = [...content.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setContent(prev => ({ ...prev, values: newValues }));
    setHasChanges(true);
  };

  const handleActivityChange = (index: number, field: string, value: any) => {
    const newActivities = [...content.activities];
    newActivities[index] = { ...newActivities[index], [field]: value };
    setContent(prev => ({ ...prev, activities: newActivities }));
    setHasChanges(true);
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Users, MessageSquare, Star, Heart, Share2, Camera, Upload,
      Gift, MapPin, Calendar
    };
    const IconComponent = icons[iconName] || Users;
    return <IconComponent className="h-5 w-5" />;
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
          <p>Loading community page content...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Community Page</h1>
              <p className="text-gray-600">Manage community page content and features</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !hasChanges} 
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/community">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Page
                </Link>
              </Button>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {hasChanges && (
                <div className="flex items-center gap-1 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Unsaved changes</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{successMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="badgeText">Badge Text</Label>
                  <Input
                    id="badgeText"
                    value={content.badgeText}
                    onChange={(e) => handleInputChange('badgeText', e.target.value)}
                    placeholder="Badge text (e.g., Community Outreach Program)"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={content.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Main title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={content.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Hero description"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How It Works Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="howItWorksTitle">Section Title</Label>
                  <Input
                    id="howItWorksTitle"
                    value={content.howItWorksTitle}
                    onChange={(e) => handleInputChange('howItWorksTitle', e.target.value)}
                    placeholder="How It Works title"
                  />
                </div>
                <div>
                  <Label htmlFor="howItWorksSubtitle">Subtitle</Label>
                  <Input
                    id="howItWorksSubtitle"
                    value={content.howItWorksSubtitle}
                    onChange={(e) => handleInputChange('howItWorksSubtitle', e.target.value)}
                    placeholder="How It Works subtitle"
                  />
                </div>
                <div>
                  <Label htmlFor="howItWorksNote">Note</Label>
                  <Input
                    id="howItWorksNote"
                    value={content.howItWorksNote}
                    onChange={(e) => handleInputChange('howItWorksNote', e.target.value)}
                    placeholder="Note text"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Steps</h4>
                {content.steps.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIcon(step.icon)}
                        Step {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`step-icon-${index}`}>Icon</Label>
                        <Input
                          id={`step-icon-${index}`}
                          value={step.icon}
                          onChange={(e) => handleStepChange(index, 'icon', e.target.value)}
                          placeholder="Icon name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`step-title-${index}`}>Title</Label>
                        <Input
                          id={`step-title-${index}`}
                          value={step.title}
                          onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                          placeholder="Step title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`step-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`step-desc-${index}`}
                          value={step.description}
                          onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                          placeholder="Step description"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="locationTitle">Location Title</Label>
                    <Input
                      id="locationTitle"
                      value={content.locationTitle}
                      onChange={(e) => handleInputChange('locationTitle', e.target.value)}
                      placeholder="Location title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationAddress">Address</Label>
                    <Textarea
                      id="locationAddress"
                      value={content.locationAddress}
                      onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                      placeholder="Full address"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="locationLink">Google Maps Link</Label>
                    <Input
                      id="locationLink"
                      value={content.locationLink}
                      onChange={(e) => handleInputChange('locationLink', e.target.value)}
                      placeholder="Google Maps URL"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activities Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Activities Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activitiesTitle">Section Title</Label>
                  <Input
                    id="activitiesTitle"
                    value={content.activitiesTitle}
                    onChange={(e) => handleInputChange('activitiesTitle', e.target.value)}
                    placeholder="Activities section title"
                  />
                </div>
                <div>
                  <Label htmlFor="activitiesDescription">Description</Label>
                  <Textarea
                    id="activitiesDescription"
                    value={content.activitiesDescription}
                    onChange={(e) => handleInputChange('activitiesDescription', e.target.value)}
                    placeholder="Activities description"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Activities Image</Label>
                  <ImageUpload
                    value={content.activitiesImage}
                    onChange={(url) => handleInputChange('activitiesImage', url)}
                    placeholder="Upload or enter activities image URL"
                    description="Recommended size: 600x400px"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Activity Features</h4>
                {content.activitiesFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">Feature {index + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`activity-feature-title-${index}`}>Title</Label>
                        <Input
                          id={`activity-feature-title-${index}`}
                          value={feature.title}
                          onChange={(e) => handleActivityFeatureChange(index, 'title', e.target.value)}
                          placeholder="Feature title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`activity-feature-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`activity-feature-desc-${index}`}
                          value={feature.description}
                          onChange={(e) => handleActivityFeatureChange(index, 'description', e.target.value)}
                          placeholder="Feature description"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Core Values Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Core Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="coreValuesTitle">Section Title</Label>
                <Input
                  id="coreValuesTitle"
                  value={content.coreValuesTitle}
                  onChange={(e) => handleInputChange('coreValuesTitle', e.target.value)}
                  placeholder="Core values title"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Values</h4>
                {content.values.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getIcon(value.icon)}
                        Value {index + 1}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`value-icon-${index}`}>Icon</Label>
                        <Input
                          id={`value-icon-${index}`}
                          value={value.icon}
                          onChange={(e) => handleValueChange(index, 'icon', e.target.value)}
                          placeholder="Icon name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-title-${index}`}>Title</Label>
                        <Input
                          id={`value-title-${index}`}
                          value={value.title}
                          onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                          placeholder="Value title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`value-desc-${index}`}
                          value={value.description}
                          onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                          placeholder="Value description"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="recentActivitiesTitle">Section Title</Label>
                <Input
                  id="recentActivitiesTitle"
                  value={content.recentActivitiesTitle}
                  onChange={(e) => handleInputChange('recentActivitiesTitle', e.target.value)}
                  placeholder="Recent activities title"
                />
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Activities</h4>
                {content.activities.map((activity, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">Activity {index + 1}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`activity-title-${index}`}>Title</Label>
                        <Input
                          id={`activity-title-${index}`}
                          value={activity.title}
                          onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                          placeholder="Activity title"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`activity-date-${index}`}>Date</Label>
                        <Input
                          id={`activity-date-${index}`}
                          value={activity.date}
                          onChange={(e) => handleActivityChange(index, 'date', e.target.value)}
                          placeholder="Activity date"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`activity-status-${index}`}>Status</Label>
                        <Input
                          id={`activity-status-${index}`}
                          value={activity.status}
                          onChange={(e) => handleActivityChange(index, 'status', e.target.value)}
                          placeholder="Activity status"
                        />
                      </div>
                      <div>
                        <Label>Activity Image</Label>
                        <ImageUpload
                          value={activity.image}
                          onChange={(url) => handleActivityChange(index, 'image', url)}
                          placeholder="Upload or enter activity image URL"
                          description="Recommended size: 600x400px"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`activity-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`activity-desc-${index}`}
                        value={activity.description}
                        onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                        placeholder="Activity description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
