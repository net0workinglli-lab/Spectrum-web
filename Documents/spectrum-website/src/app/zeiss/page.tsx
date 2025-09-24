'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye, Lightbulb, Heart, Shield, CheckCircle, 
  Globe, Award, Target, Zap, Star
} from 'lucide-react';
import Image from 'next/image';

export default function ZeissPage() {
  const features = [
    {
      title: 'Precision Optics',
      description: 'German-engineered precision for crystal clear vision',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop'
    },
    {
      title: 'Premium Quality',
      description: 'Uncompromising quality standards from the world leader in optics',
      icon: Star,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop'
    },
    {
      title: 'Advanced Technology',
      description: 'Cutting-edge lens technology for superior performance',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop'
    }
  ];

  const lensTypes = [
    {
      name: 'Single Vision',
      description: 'Clear vision for one distance',
      icon: Target
    },
    {
      name: 'Progressive',
      description: 'Seamless vision at all distances',
      icon: Eye
    },
    {
      name: 'Blue Light Protection',
      description: 'Protect from digital eye strain',
      icon: Shield
    },
    {
      name: 'Photochromic',
      description: 'Adapts to changing light conditions',
      icon: Lightbulb
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-lg">
        <Badge variant="outline" className="mb-4 bg-gray-100 text-gray-800 border-gray-200">
          <Award className="h-4 w-4 mr-2" /> German Precision Optics
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Discover Now
        </h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Zeiss
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          PRECISION LENSES FROM GERMAN OPTICAL EXCELLENCE
        </h3>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Experience the pinnacle of optical precision with Zeiss lenses. German engineering meets optical excellence to deliver uncompromising quality and performance for your vision needs.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Three Pillars of Excellence
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <feature.icon className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="mb-16 bg-gradient-to-r from-gray-800 to-blue-800 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          OPTICAL EXCELLENCE
        </h2>
        <h3 className="text-xl font-semibold mb-4 text-center">
          Through German Precision
        </h3>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 leading-relaxed">
            For over 175 years, Zeiss has been at the forefront of optical innovation. Our commitment to precision and quality ensures that every lens meets the highest standards of German engineering.
          </p>
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Experience precision - Unmatched quality</h4>
            <p className="text-lg mb-6">
              Discover the difference that German precision makes in your daily vision.
            </p>
            <Button size="lg" variant="secondary" className="text-gray-800">
              Discover Now
            </Button>
          </div>
        </div>
      </div>

      {/* Lens Types Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Zeiss Lens Types & Function
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore Zeiss lens solutions - precision optics designed for every lifestyle and vision requirement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lensTypes.map((lens, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <lens.icon className="h-8 w-8 text-gray-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{lens.name}</h3>
              <p className="text-gray-600">{lens.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Advanced German Technology
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Precision Manufacturing</h3>
                  <p className="text-gray-600">Every lens crafted with German precision standards</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Superior Materials</h3>
                  <p className="text-gray-600">Only the finest materials for optimal performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Innovation Heritage</h3>
                  <p className="text-gray-600">175+ years of optical innovation and expertise</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop"
              alt="Zeiss Lens Technology"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience German Precision?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Visit our store to discover the perfect Zeiss lenses for your vision needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-gray-800 hover:bg-gray-900">
            <Eye className="h-5 w-5 mr-2" /> Book Eye Exam
          </Button>
          <Button size="lg" variant="outline">
            <Globe className="h-5 w-5 mr-2" /> Visit Store
          </Button>
        </div>
      </div>
    </div>
  );
}
