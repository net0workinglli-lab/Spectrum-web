'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Edit, Eye, Save, FileText, 
  Image, Type, Globe, Settings, Monitor,
  Smartphone, Tablet, Laptop, Award, Users, Phone
} from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { getAllSections } from '@/lib/firebase-firestore';

interface ContentItem {
  id: string;
  name: string;
  type: 'section' | 'page';
  description: string;
  lastModified: string;
  status: 'published' | 'draft';
  category: string;
  icon: string;
}

export default function ContentManagementPage() {
  const { isLoggedIn, user } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);

  // Mock data for content items
  const mockContentItems: ContentItem[] = [
    // Contact Page
    {
      id: 'contact-page',
      name: 'Contact Page',
      type: 'page',
      description: 'Trang liên hệ với form và thông tin công ty',
      lastModified: new Date().toISOString().split('T')[0],
      status: 'published',
      category: 'page',
      icon: 'Phone'
    },
    // Homepage Sections
    {
      id: 'hero-section',
      name: 'Hero Section',
      type: 'section',
      description: 'Main banner with title, subtitle and CTA buttons',
      lastModified: '2024-01-15',
      status: 'published',
      category: 'homepage',
      icon: 'Type'
    },
    {
      id: 'featured-products-section',
      name: 'Featured Products Section',
      type: 'section',
      description: 'Featured products carousel and collection',
      lastModified: '2024-01-14',
      status: 'published',
      category: 'homepage',
      icon: 'Monitor'
    },
    {
      id: 'stats-section',
      name: 'Stats Section',
      type: 'section',
      description: 'Company statistics and achievements',
      lastModified: '2024-01-13',
      status: 'published',
      category: 'homepage',
      icon: 'Settings'
    },
    {
      id: 'certificate-section',
      name: 'ESG Certificate Section',
      type: 'section',
      description: 'ESG certification display with title, description, certificate image, ESG pillars, and CTA buttons',
      lastModified: '2024-01-12',
      status: 'published',
      category: 'homepage',
      icon: 'Award'
    },
    {
      id: 'categories-section',
      name: 'Categories Section',
      type: 'section',
      description: 'Product categories grid display',
      lastModified: '2024-01-11',
      status: 'published',
      category: 'homepage',
      icon: 'Image'
    },
    {
      id: 'brands-section',
      name: 'Premium Lens Brands Section',
      type: 'section',
      description: 'Premium lens brands grid with logos, descriptions, and CTA buttons',
      lastModified: '2024-01-10',
      status: 'published',
      category: 'homepage',
      icon: 'Image'
    },
    {
      id: 'lenses-section',
      name: 'Lenses Section',
      type: 'section',
      description: 'Premium lens brands and features',
      lastModified: '2024-01-09',
      status: 'published',
      category: 'homepage',
      icon: 'Eye'
    },
    {
      id: 'cta-section',
      name: 'CTA Section',
      type: 'section',
      description: 'Call-to-action section with buttons',
      lastModified: '2024-01-08',
      status: 'published',
      category: 'homepage',
      icon: 'Type'
    },
    // Pages
    {
      id: 'about-page',
      name: 'About Page',
      type: 'page',
      description: 'Company information, mission, vision, values and team details',
      lastModified: new Date().toISOString().split('T')[0],
      status: 'published',
      category: 'pages',
      icon: 'Globe'
    },
    {
      id: 'contact-page',
      name: 'Contact Page',
      type: 'page',
      description: 'Contact information and form',
      lastModified: '2024-01-06',
      status: 'published',
      category: 'pages',
      icon: 'Settings'
    },
    {
      id: 'products-page',
      name: 'Products Page',
      type: 'page',
      description: 'Product catalog and filtering',
      lastModified: '2024-01-05',
      status: 'published',
      category: 'pages',
      icon: 'Monitor'
    },
    {
      id: 'blog-page',
      name: 'Blog Page',
      type: 'page',
      description: 'Blog posts and articles',
      lastModified: '2024-01-04',
      status: 'published',
      category: 'pages',
      icon: 'FileText'
    },
    {
      id: 'esg-certificate-page',
      name: 'ESG Certificate Page',
      type: 'page',
      description: 'Environmental, Social & Governance Certification - Synesgy ESG certificate details, impact metrics, and sustainability initiatives',
      lastModified: '2024-01-03',
      status: 'published',
      category: 'pages',
      icon: 'Award'
    },
    {
      id: 'premium-partners-page',
      name: 'Premium Partners Page',
      type: 'page',
      description: 'Trusted by Leading Eyewear Brands - Premium partners showcase with detailed brand information',
      lastModified: '2024-01-02',
      status: 'published',
      category: 'pages',
      icon: 'Users'
    },
    {
      id: 'community-page',
      name: 'Community Page',
      type: 'page',
      description: 'Community engagement and social features - Customer stories, reviews, and community interactions',
      lastModified: '2024-01-01',
      status: 'published',
      category: 'pages',
      icon: 'Users'
    },
    // Global Sections
    {
      id: 'header-section',
      name: 'Header Section',
      type: 'section',
      description: 'Navigation header and logo',
      lastModified: '2024-01-01',
      status: 'published',
      category: 'global',
      icon: 'Settings'
    },
    {
      id: 'footer-section',
      name: 'Footer Section',
      type: 'section',
      description: 'Footer links and company information',
      lastModified: '2023-12-31',
      status: 'published',
      category: 'global',
      icon: 'Settings'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Content', count: mockContentItems.length },
    { id: 'homepage', name: 'Homepage', count: mockContentItems.filter(item => item.category === 'homepage').length },
    { id: 'pages', name: 'Pages', count: mockContentItems.filter(item => item.category === 'pages').length },
    { id: 'global', name: 'Global', count: mockContentItems.filter(item => item.category === 'global').length }
  ];

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Load real data from Firebase
        const sections = await getAllSections();
        
        // Convert Firebase data to ContentItem format
        const firebaseContentItems: ContentItem[] = sections.map((section: any) => {
          const defaultName = getDefaultName(section.id);
          // Use default name if Firebase name is 'Unknown Content' or empty
          const finalName = (section.name && section.name.trim() !== '' && section.name !== 'Unknown Content') 
            ? section.name 
            : defaultName;
          
          return {
            id: section.id,
            name: finalName,
            type: section.type || (section.id.includes('page') ? 'page' : 'section'),
            description: section.description || getDefaultDescription(section.id),
            lastModified: section.updatedAt ? 
              new Date(section.updatedAt.seconds ? section.updatedAt.seconds * 1000 : section.updatedAt).toISOString().split('T')[0] :
              new Date().toISOString().split('T')[0],
            status: section.status || 'published',
            category: section.category || getDefaultCategory(section.id),
            icon: getDefaultIcon(section.id)
          };
        });

        // Merge with mock data for sections not in Firebase
        const allItems = [...firebaseContentItems];
        mockContentItems.forEach(mockItem => {
          if (!firebaseContentItems.find(item => item.id === mockItem.id)) {
            allItems.push(mockItem);
          }
        });

        // Remove duplicates based on ID
        const uniqueItems = allItems.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );

        setContentItems(uniqueItems);
      } catch (error) {
        console.error('❌ Error loading content from Firebase:', error);
        // Fallback to mock data
        setContentItems(mockContentItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);


  // Helper functions
  const getDefaultName = (id: string) => {
    const names: { [key: string]: string } = {
      'hero-section': 'Hero Section',
      'featured-products-section': 'Featured Products Section',
      'stats-section': 'Stats Section',
      'brands-section': 'Premium Lens Brands Section',
      'certificate-section': 'ESG Certificate Section',
      'categories-section': 'Categories Section',
      'lenses-section': 'Lenses Section',
      'cta-section': 'CTA Section',
      'about-page': 'About Page',
      'contact-page': 'Contact Page',
      'products-page': 'Products Page',
      'blog-page': 'Blog Page',
      'esg-certificate-page': 'ESG Certificate Page',
      'premium-partners-page': 'Premium Partners Page',
      'community-page': 'Community Page',
      'header-section': 'Header Section',
      'footer-section': 'Footer Section'
    };
    return names[id] || 'Unknown Section';
  };

  const getDefaultDescription = (id: string) => {
    const descriptions: { [key: string]: string } = {
      'hero-section': 'Main banner with title, subtitle and CTA buttons',
      'featured-products-section': 'Featured products carousel and collection with product selection',
      'stats-section': 'Company statistics and achievements display',
      'brands-section': 'Premium lens brands grid with logos, descriptions, and CTA buttons',
      'certificate-section': 'ESG certification display with title, description, certificate image, ESG pillars, and CTA buttons',
      'categories-section': 'Product categories grid display',
      'lenses-section': 'Premium lens brands and features showcase',
      'cta-section': 'Call-to-action section with buttons',
      'about-page': 'Company information and team details',
      'contact-page': 'Contact information and form',
      'products-page': 'Product catalog and filtering',
      'blog-page': 'Blog posts and articles',
      'esg-certificate-page': 'Environmental, Social & Governance Certification - Synesgy ESG certificate details, impact metrics, and sustainability initiatives',
      'premium-partners-page': 'Trusted by Leading Eyewear Brands - Premium partners showcase with detailed brand information',
      'community-page': 'Community engagement and social features - Customer stories, reviews, and community interactions',
      'header-section': 'Navigation header with logo, menu items, and dropdowns',
      'footer-section': 'Footer links and company information'
    };
    return descriptions[id] || 'Content section';
  };

  const getDefaultCategory = (id: string) => {
    if (id.includes('page')) return 'pages';
    if (id.includes('header') || id.includes('footer')) return 'global';
    return 'homepage';
  };

  const getDefaultIcon = (id: string) => {
    const icons: { [key: string]: string } = {
      'hero-section': 'Type',
      'featured-products-section': 'Monitor',
      'stats-section': 'Settings',
      'brands-section': 'Image',
      'certificate-section': 'Award',
      'categories-section': 'Image',
      'lenses-section': 'Eye',
      'cta-section': 'Type',
      'about-page': 'Globe',
      'contact-page': 'Phone',
      'products-page': 'Monitor',
      'blog-page': 'FileText',
      'esg-certificate-page': 'Award',
      'premium-partners-page': 'Users',
      'community-page': 'Users',
      'header-section': 'Settings',
      'footer-section': 'Settings'
    };
    return icons[id] || 'FileText';
  };

  const filteredItems = selectedCategory === 'all' 
    ? contentItems 
    : contentItems.filter(item => item.category === selectedCategory);

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Type, Image, FileText, Globe, Settings, Monitor, Eye, Award, Users, Phone
    };
    const IconComponent = icons[iconName] || FileText;
    return <IconComponent className="h-5 w-5" />;
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@spectrum.com' || user?.email === 'nguyenphuocsang@gmail.com';

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              Only administrators can access content management.
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600">Manage sections and pages content</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="px-6 py-2"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Content Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          {getIcon(item.icon)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          <Badge variant={item.type === 'section' ? 'default' : 'secondary'}>
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Last modified:</span>
                        <span>{item.lastModified}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={item.status === 'published' ? 'default' : 'outline'}
                          className={item.status === 'published' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/content/edit/${item.id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link href={`/admin/content/preview/${item.id}`} prefetch={false}>
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" asChild>
                <Link href="/admin/content/bulk-edit" prefetch={false}>
                  <Settings className="h-5 w-5 mr-2" />
                  Bulk Edit
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
