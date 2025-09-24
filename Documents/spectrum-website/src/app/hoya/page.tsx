'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Eye, Lightbulb, Heart, Shield, CheckCircle, 
  Globe, Award, Target, Zap, Star
} from 'lucide-react';
import Image from 'next/image';

export default function HoyaPage() {
  const features = [
    {
      title: 'Japanese Innovation',
      description: 'Cutting-edge technology from Japan for superior vision',
      icon: Eye,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop'
    },
    {
      title: 'Durability & Comfort',
      description: 'Engineered for long-lasting comfort and performance',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=600&fit=crop'
    },
    {
      title: 'Smart Protection',
      description: 'Advanced protection against harmful light and digital strain',
      icon: Shield,
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
      name: 'Blue Control',
      description: 'Protect from digital eye strain',
      icon: Shield
    },
    {
      name: 'Transitions',
      description: 'Adapts to changing light conditions',
      icon: Lightbulb
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-lg">
        <Badge variant="outline" className="mb-4 bg-red-100 text-red-800 border-red-200">
          <Award className="h-4 w-4 mr-2" /> Japanese Innovation
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Discover Now
        </h1>
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          Hoya
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6">
          INNOVATIVE LENSES FROM JAPANESE OPTICAL EXCELLENCE
        </h3>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Experience the perfect blend of Japanese innovation and optical excellence with Hoya lenses. Advanced technology meets comfort and durability for your everyday vision needs.
        </p>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Three Pillars of Innovation
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
      <div className="mb-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">
          OPTICAL INNOVATION
        </h2>
        <h3 className="text-xl font-semibold mb-4 text-center">
          Through Japanese Excellence
        </h3>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6 leading-relaxed">
            Hoya has been pioneering optical innovation for over 80 years. Our commitment to Japanese precision and quality ensures that every lens delivers exceptional performance and comfort.
          </p>
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Experience innovation - Unmatched comfort</h4>
            <p className="text-lg mb-6">
              Discover the difference that Japanese innovation makes in your daily vision.
            </p>
            <Button size="lg" variant="secondary" className="text-red-600">
              Discover Now
            </Button>
          </div>
        </div>
      </div>

      {/* Lens Types Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Hoya Lens Types & Function
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
          Explore Hoya lens solutions - innovative optics designed for modern lifestyle and vision requirements.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lensTypes.map((lens, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <lens.icon className="h-8 w-8 text-red-600" />
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
              Advanced Japanese Technology
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Innovation Heritage</h3>
                  <p className="text-gray-600">80+ years of optical innovation and research</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Comfort Engineering</h3>
                  <p className="text-gray-600">Designed for all-day comfort and durability</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Protection</h3>
                  <p className="text-gray-600">Advanced protection against harmful light</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=600&fit=crop"
              alt="Hoya Lens Technology"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Experience Japanese Innovation?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Visit our store to discover the perfect Hoya lenses for your vision needs.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700">
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
