'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Leaf, Recycle, Package, Store, Users, Battery, Calendar, 
  ArrowRight, CheckCircle, Heart, Globe, Award
} from 'lucide-react';
import Image from 'next/image';

export default function EcoFriendlyPage() {
  const ecoInitiatives = [
    {
      title: 'Eyewear Frames',
      description: 'Our collection of eco-friendly eyewear frames is designed to meet the needs of the fashion-conscious and environmentally aware.',
      details: 'Our frames are crafted using sustainable materials, such as bamboo, recycled plastic, and natural materials, which are both durable and stylish.',
      icon: Leaf,
      image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=600&fit=crop'
    },
    {
      title: 'Store Materials',
      description: 'SPECTRUM is committed to protecting the environment, starting with utilizing eco-friendly materials in the construction of our brick-and-mortar store.',
      details: 'We understand the importance of taking responsibility for our impact on the environment, and we believe that every company has a role to play in creating a sustainable future.',
      icon: Store,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop'
    },
    {
      title: 'Packaging',
      description: 'At Spectrum, we are committed to sustainable practices, and one of the ways we demonstrate this commitment is through our eco-friendly packaging.',
      details: 'We understand the importance of reducing our environmental footprint, and our packaging reflects this dedication.',
      icon: Package,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    }
  ];

  const communityPrograms = [
    {
      title: 'Eyetot Community Outreach',
      description: 'Be a part of our SPECTRUM team to create the "good eyes" community by giving your old glasses frames a new purpose',
      icon: Users,
      status: 'Active'
    },
    {
      title: 'Battery & Pin Recycling',
      description: 'At our store, we stick to environmental responsibility. Bring in your used batteries and pins, and we\'ll ensure they are recycled properly.',
      icon: Battery,
      status: 'Active'
    },
    {
      title: 'Events & Activities',
      description: 'Explore our eco-conscious events & activities to make a positive impact on the environment. From community clean-ups to recycling drives and green workshops.',
      icon: Calendar,
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16 bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg">
        <Badge variant="outline" className="mb-4 bg-green-100 text-green-800 border-green-200">
          <Leaf className="h-4 w-4 mr-2" /> Eco-friendly Policy
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          THÂN THIỆN VỚI MÔI TRƯỜNG
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-6">
          At Spectrum, we take our responsibility to the environment seriously and are committed to preserving it for future generations.
        </p>
        <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed">
          To that end, we use eco-friendly materials in our store&apos;s construction, product creation, and order packaging. By making these small changes, we hope to join forces with others to reduce pollution during production and protect our ecosystem.
        </p>
      </div>

      {/* Main Policy Section */}
      <div className="mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Eco-friendly Policy
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p>
              We invite our customers to join us on this journey towards a greener future, and we promise that each step we take will contribute to a brighter tomorrow for all.
            </p>
            <p>
              Some of the eco-friendly materials we use in our stores can be found even in our store constructive materials. We also prioritize sourcing products from suppliers who share our commitment to sustainability and minimizing their environmental impact.
            </p>
            <p>
              Our order packaging is made from recycled materials, and we encourage our customers to recycle or reuse our packaging whenever possible.
            </p>
            <p>
              Additionally, we have implemented various recycling programs in our stores to reduce waste and promote responsible consumption. We also regularly assess our environmental impact and look for ways to improve our practices. We believe that by taking these steps, we can make a positive difference and help protect the planet.
            </p>
            <p>
              We recognize that protecting the environment is a collective effort, and we are proud to play a part in this important work. We hope that our commitment to environmental stewardship inspires others to take action and join us in creating a more sustainable future for all.
            </p>
          </div>
        </div>
      </div>

      {/* Eco-friendly Initiatives */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Eco-friendly Initiatives
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {ecoInitiatives.map((initiative, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src={initiative.image}
                  alt={initiative.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <initiative.icon className="h-12 w-12 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{initiative.title}</h3>
                <p className="text-gray-600 mb-4">{initiative.description}</p>
                <p className="text-sm text-gray-500">{initiative.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Programs */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Community Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityPrograms.map((program, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <program.icon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <Badge 
                variant={program.status === 'Active' ? 'default' : 'secondary'}
                className="mb-4"
              >
                {program.status}
              </Badge>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Join Us in Creating a Sustainable Future
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Together, we can make a positive impact on our planet. Every small action counts towards a greener tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary">
            <Heart className="h-5 w-5 mr-2" /> Learn More
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-green-600">
            <Globe className="h-5 w-5 mr-2" /> Get Involved
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-gray-600">Recycled Packaging</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
          <div className="text-gray-600">Eco-friendly Materials</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
          <div className="text-gray-600">Glasses Recycled</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">5</div>
          <div className="text-gray-600">Years of Commitment</div>
        </div>
      </div>
    </div>
  );
}
