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
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 bg-green-100 text-green-800 border-green-200">
              <Award className="h-4 w-4 mr-2" />
              Chứng nhận ESG
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.certificate.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {content.certificate.description}
            </p>
          </div>

          {/* Certificate Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Certificate Image */}
            <div className="relative">
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <Image
                      src={content.certificate.imageUrl || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop"}
                      alt="Synesgy ESG Certificate - Spectrum Eyecare"
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
                          Awarded to Spectrum Eyecare
                        </p>
                        <p className="text-sm opacity-90">
                          May 5, 2025
                        </p>
                      </div>
                    </div>
                    {/* Certificate badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white shadow-lg">
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
                  eyewear industry.
                </p>
              </div>

              {/* ESG Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Environmental</h4>
                  <p className="text-sm text-gray-600">Sustainable materials & processes</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Social</h4>
                  <p className="text-sm text-gray-600">Fair labor & community impact</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Governance</h4>
                  <p className="text-sm text-gray-600">Transparent & ethical practices</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Learn more about our sustainability initiatives and how we&apos;re 
                  making a positive impact on the environment and community.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Eco-friendly packaging
                  </Badge>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    Carbon neutral shipping
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Ethical sourcing
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Join us in our mission to create a more sustainable future for eyewear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <Link href={content.certificate.buttonLink}>
                  {content.certificate.buttonText}
                </Link>
              </Button>
              <Button asChild variant="outline" className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium">
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
