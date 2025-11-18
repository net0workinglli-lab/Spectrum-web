'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Leaf, Shield, Users } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

export function CertificateSection() {
  const { content, isLoading } = useHomeContent();

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-2xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-64"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-500 bg-emerald-100 text-emerald-800 border-emerald-300">
              <Award className="h-4 w-4 mr-2" />
              ESG Certified Excellence
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.certificate.title || 'Certified Sustainable Excellence'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {content.certificate.description || 'Our commitment to environmental responsibility, social impact, and ethical governance is recognized through our ESG certification.'}
            </p>
          </div>

          {/* Certificate Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Certificate Image */}
            <div className="relative">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={content.certificate.imageUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop"}
                      alt="Synesgy ESG Certificate - Sunny Auto"
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Overlay with certificate info */}
                    <div className="absolute inset-0 bg-black/20 flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          Synesgy ESG Certificate
                        </h3>
                        <p className="text-lg mb-1">
                          Awarded to Sunny Auto
                        </p>
                        <p className="text-sm opacity-90">
                          May 5, 2025
                        </p>
                      </div>
                    </div>
                    {/* Certificate badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-emerald-600 text-white shadow-lg">
                        <Award className="h-4 w-4 mr-1" />
                        Certified
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certificate Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  What This Means for You
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  This certification demonstrates our commitment to sustainable practices, 
                  ethical business operations, and environmental responsibility in the 
                  electric vehicle industry. When you choose Sunny Auto, you're supporting 
                  a company that prioritizes the planet and your future.
                </p>
              </div>

              {/* ESG Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Leaf className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Environmental</h4>
                  <p className="text-sm text-gray-600">Zero-emission vehicles & sustainable practices</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-slate-600 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Social</h4>
                  <p className="text-sm text-gray-600">Community impact & customer satisfaction</p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Governance</h4>
                  <p className="text-sm text-gray-600">Transparent & ethical business practices</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Learn more about our sustainability initiatives and how we&apos;re 
                  making a positive impact on the environment and community through electric mobility.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Zero-emission vehicles
                  </Badge>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 border border-teal-200">
                    Carbon neutral operations
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-slate-200">
                    Ethical business practices
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 text-lg">
              Join us in our mission to create a more sustainable future through electric mobility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg shadow-emerald-600/30 transition-all font-medium"
              >
                <Link href={content.certificate.buttonLink || '/esg-certificate'}>
                  {content.certificate.buttonText || 'Learn More'}
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-medium"
              >
                <Link href="/esg-certificate">
                  View Full Report
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
