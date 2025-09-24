'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Award, Leaf, Shield, Users, ArrowLeft, 
  CheckCircle, Star, Globe, Heart, Target,
  TrendingUp, Clock, FileText, Download
} from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';

export default function ESGCertificatePage() {
  const { content, isLoading } = useContent('esg-certificate-page');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ESG Certificate...</p>
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
                {content?.title || 'ESG Certificate'}
              </h1>
              <p className="text-gray-600">
                {content?.subtitle || 'Environmental, Social & Governance Certification'}
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
          className="max-w-6xl mx-auto"
        >
          {/* Certificate Hero */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Award className="h-4 w-4 mr-2" />
              {content?.badgeText || 'Synesgy ESG Certified'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {content?.heroTitle || 'Among Vietnam\'s First Sustainable Eyewear Retailers'}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {content?.heroDescription || 'On May 5, 2025, Spectrum Eyecare was awarded the prestigious Synesgy Environmental, Social, and Governance (ESG) Certificate, recognizing our commitment to sustainable practices and ethical business operations.'}
            </p>
          </div>

          {/* Certificate Display */}
          <Card className="mb-12 overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="aspect-[16/10] relative">
                <Image
                  src={content?.imageUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=750&fit=crop"}
                  alt="Synesgy ESG Certificate - Spectrum Eyecare"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-4xl">
                      <h3 className="text-3xl font-bold mb-2">
                        {content?.certificateTitle || 'Synesgy ESG Certificate'}
                      </h3>
                      <p className="text-xl mb-2">
                        {content?.certificateSubtitle || 'Awarded to Spectrum Eyecare'}
                      </p>
                      <p className="text-lg opacity-90 mb-4">
                        {content?.certificateDate || 'May 5, 2025 • Certificate #SYN-2025-001'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-600 text-white">
                          <Award className="h-4 w-4 mr-1" />
                          Certified
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                          <Leaf className="h-4 w-4 mr-1" />
                          Environmental
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                          <Users className="h-4 w-4 mr-1" />
                          Social
                        </Badge>
                        <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                          <Shield className="h-4 w-4 mr-1" />
                          Governance
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What This Means */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                {content?.whatThisMeansTitle || 'What This Certification Means'}
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  {content?.whatThisMeansDescription || 'The Synesgy ESG Certificate is a comprehensive assessment that evaluates companies across three critical dimensions: Environmental impact, Social responsibility, and Governance practices.'}
                </p>
                <p>
                  This certification demonstrates our commitment to sustainable practices, 
                  ethical business operations, and environmental responsibility in the 
                  eyewear industry.
                </p>
                <p>
                  As one of Vietnam&apos;s first eyewear retailers to receive this certification, 
                  we&apos;re leading the way in sustainable eyewear practices and setting new 
                  standards for the industry.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h4>
              <div className="space-y-3">
                {[
                  "Verified sustainable business practices",
                  "Enhanced customer trust and confidence",
                  "Reduced environmental footprint",
                  "Improved social impact",
                  "Transparent governance standards",
                  "Industry leadership recognition"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ESG Pillars */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {content?.esgPillarsTitle || 'Our ESG Pillars'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Environmental</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We&apos;re committed to reducing our environmental impact through 
                    sustainable materials, eco-friendly packaging, and carbon-neutral operations.
                  </p>
                  <div className="space-y-2 text-left">
                    {[
                      "100% recyclable packaging",
                      "Carbon-neutral shipping",
                      "Sustainable material sourcing",
                      "Energy-efficient operations",
                      "Waste reduction programs"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Social</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We prioritize fair labor practices, community engagement, and creating 
                    positive social impact through our business operations.
                  </p>
                  <div className="space-y-2 text-left">
                    {[
                      "Fair labor practices",
                      "Community health programs",
                      "Employee well-being",
                      "Accessible eyewear",
                      "Local community support"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Governance</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    We maintain the highest standards of transparency, ethical business 
                    practices, and responsible corporate governance.
                  </p>
                  <div className="space-y-2 text-left">
                    {[
                      "Transparent reporting",
                      "Ethical business practices",
                      "Stakeholder engagement",
                      "Risk management",
                      "Compliance standards"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {content?.impactMetricsTitle || 'Our Impact Metrics'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Leaf, label: "Carbon Footprint", value: "75%", description: "Reduction in carbon emissions" },
                { icon: Globe, label: "Packaging", value: "100%", description: "Recyclable materials used" },
                { icon: Heart, label: "Community", value: "500+", description: "Lives improved through programs" },
                { icon: Target, label: "Waste", value: "90%", description: "Waste diverted from landfills" }
              ].map((metric, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent>
                    <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <metric.icon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{metric.label}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certification Details */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {content?.certificationDetailsTitle || 'Certification Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Certificate Information</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Certificate Number:</span>
                        <span className="font-medium">SYN-2025-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issue Date:</span>
                        <span className="font-medium">May 5, 2025</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid Until:</span>
                        <span className="font-medium">May 5, 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issuing Body:</span>
                        <span className="font-medium">Synesgy</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Assessment Criteria</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Environmental Score:</span>
                        <span className="font-medium text-green-600">95/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Social Score:</span>
                        <span className="font-medium text-green-600">92/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Governance Score:</span>
                        <span className="font-medium text-green-600">98/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overall Rating:</span>
                        <span className="font-medium text-green-600">A+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {content?.ctaTitle || 'Join Us in Our Mission'}
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {content?.ctaDescription || 'Together, we can create a more sustainable future for eyewear. Learn more about our initiatives and how you can contribute to positive change.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content?.buttonText && (
                <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                  <Link href={content.buttonLink || '/download-report'}>
                    <FileText className="h-5 w-5 mr-2" />
                    {content.buttonText}
                  </Link>
                </Button>
              )}
              {content?.secondaryButtonText && (
                <Button variant="outline" size="lg" asChild>
                  <Link href={content.secondaryButtonLink || '/eco-friendly'}>
                    <Leaf className="h-5 w-5 mr-2" />
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
