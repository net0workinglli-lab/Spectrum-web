'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye, Lightbulb, Heart, Star, ArrowRight, CheckCircle, 
  Shield, Zap, Globe, Award, Users, Target
} from 'lucide-react';
import Image from 'next/image';

export default function EssilorPage() {
  const features = [
    {
      title: 'Improve Vision',
      description: 'Easier vision with smart light technology for lenses',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop'
    },
    {
      title: 'Improve Style',
      description: 'Affirm your unique personal style through the stylish eyewear collection from Spectrum',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop'
    },
    {
      title: 'Improve Feel',
      description: 'Lenses help reduce headaches and eye strain from blue light from computer screens and daylight',
      icon: Shield,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop'
    }
  ];

  const lensTypes = [
    {
      name: 'Varifocal',
      description: 'Progressive lenses for all distances',
      icon: Target
    },
    {
      name: 'Single Vision',
      description: 'Clear vision for one distance',
      icon: Eye
    },
      {
      name: 'Blue Light Protection',
      description: 'Protect from harmful blue light',
      icon: Shield
    },
    {
      name: 'Photochromic',
      description: 'Adapts to light conditions',
      icon: Lightbulb
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
        <Badge variant="outline" className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
          <Award className="h-4 w-4 mr-2" /> Premium Lens Technology
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Discover Now
        </h1>
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          Essilor
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          PREMIUM LENSES FROM VARIFOCAL TECHNOLOGY PIONEER
        </h3>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Easier vision with smart light technology for lenses. Affirm your unique personal style through the stylish eyewear collection from Spectrum. Providing customers with dedicated care to enhance vision and the opportunity to explore unlimited style expression with countless frame designs.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Three Ways to Improve Your Life
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
      <div className="mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          ELEVATE LIFE
        </h2>
        <h3 className="text-xl font-semibold mb-4 text-center">
          Through Vision Improvement
        </h3>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 leading-relaxed">
            With one-third of the global population living with untreated poor vision, Essilor carries the mission to change that. Through comprehensive initiatives, Essilor is committed to ensuring everyone has better vision and quality of life, towards a generation free from poor vision.
          </p>
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Expand your vision - Endless experience</h4>
            <p className="text-lg mb-6">
              Discover a more beautiful world with Essilor. Lens technology meticulously crafted for you.
            </p>
            <Button size="lg" variant="secondary" className="text-blue-600">
              Discover Now
            </Button>
          </div>
        </div>
      </div>

      {/* Lens Types Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Essilor Lens Types & Function
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Discover Essilor lens types - vision solutions suitable for every lifestyle need.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lensTypes.map((lens, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <lens.icon className="h-8 w-8 text-blue-600" />
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
              Advanced Lens Technology
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Light Technology</h3>
                  <p className="text-gray-600">Adapts to different lighting conditions for optimal vision</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Blue Light Protection</h3>
                  <p className="text-gray-600">Reduces eye strain from digital devices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Precision Crafted</h3>
                  <p className="text-gray-600">Each lens is meticulously designed for your specific needs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop"
              alt="Essilor Lens Technology"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience Better Vision?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Visit our store to discover the perfect Essilor lenses for your lifestyle and vision needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
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
