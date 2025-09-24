'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, Star, Award, Globe, Shield, 
  CheckCircle, ExternalLink, Mail, Phone,
  MapPin, Calendar, Users, Target
} from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function PremiumPartnersPage() {
  const { content, isLoading } = useContent('premium-partners-page');
  
  // Default partners data (fallback) - empty array, partners should come from CMS
  const defaultPartners: Array<{
    name: string;
    logo: string;
    description: string;
    category: string;
    country: string;
    founded: string;
    website: string;
    specialties: string[];
    highlights: string[];
    partnership: {
      startDate: string;
      level: string;
      products: number;
      exclusive: boolean;
    };
  }> = [];

  const categories = ['All', 'Luxury', 'Sports', 'Fashion', 'Modern'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Use partners from Firebase or fallback to default
  const partners = defaultPartners;

  const filteredPartners = selectedCategory === 'All' 
    ? partners 
    : partners.filter(partner => partner.category === selectedCategory);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Premium Partners...</p>
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
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {content?.title || 'Premium Partners'}
              </h1>
              <p className="text-gray-600">
                {content?.subtitle || 'Trusted by Leading Eyewear Brands'}
              </p>
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
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 bg-gray-100 text-gray-800 border-gray-200">
              <Star className="h-4 w-4 mr-2" />
              {content?.badgeText || 'Premium Partners'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content?.heroTitle || 'Trusted by Leading Brands'}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content?.heroDescription || 'We partner with the world\'s most prestigious eyewear brands to bring you the finest selection of sunglasses and eyeglasses. Our exclusive partnerships ensure you have access to the latest collections and limited editions.'}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="relative w-20 h-12 mx-auto mb-4">
                      <Image
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{partner.name}</h3>
                      {partner.partnership.exclusive && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Award className="h-3 w-3 mr-1" />
                          Exclusive
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{partner.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{partner.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Country:</span>
                        <p className="font-medium">{partner.country}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Founded:</span>
                        <p className="font-medium">{partner.founded}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Partnership:</span>
                        <p className="font-medium">{partner.partnership.startDate}</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {partner.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
                      <ul className="space-y-1">
                        {partner.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Partnership Stats */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Partnership Stats</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Products:</span>
                          <p className="font-medium">{partner.partnership.products}+</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Level:</span>
                          <p className="font-medium">{partner.partnership.level}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a href={partner.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Website
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/products?brand=${partner.name.toLowerCase().replace(' ', '-')}`}>
                          View Products
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Partnership Benefits */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {content?.benefitsTitle || 'Why Partner with Us?'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Premium Positioning</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We position your brand in the premium segment, ensuring your products 
                    are presented with the respect and attention they deserve.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Expert Curation</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our team of eyewear experts carefully curates the best products from 
                    each brand, ensuring quality and style for our customers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Global Reach</h4>
                  <p className="text-gray-600 leading-relaxed">
                    We provide a platform for brands to reach customers worldwide while 
                    maintaining their brand integrity and exclusivity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Partnership Stats */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 text-center">
                {content?.statsTitle || 'Partnership Statistics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">8</div>
                  <div className="text-gray-600">Premium Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">820+</div>
                  <div className="text-gray-600">Products Available</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">5</div>
                  <div className="text-gray-600">Exclusive Partnerships</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                  <div className="text-gray-600">Authentic Products</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {content?.ctaTitle || 'Interested in Partnership?'}
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {content?.ctaDescription || 'We\'re always looking for new premium brands to partner with. Join our exclusive network and reach discerning customers worldwide.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content?.buttonText && (
                <Button size="lg" className="bg-gray-900 hover:bg-gray-800" asChild>
                  <Link href={content.buttonLink || '/contact'}>
                    <Mail className="h-5 w-5 mr-2" />
                    {content.buttonText}
                  </Link>
                </Button>
              )}
              {content?.secondaryButtonText && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={content.secondaryButtonLink || '/products'}>
                    <Globe className="h-5 w-5 mr-2" />
                    {content.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
