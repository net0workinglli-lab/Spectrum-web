'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

export function BrandSection() {
  const { content, isLoading } = useHomeContent();
  
  // Default brands fallback - empty array, brands should come from CMS
  const defaultBrands: Array<{
    name: string;
    logo: string;
    description: string;
  }> = [];

  // Use brandLogos from CMS or fallback to default brands
  const brands = content.brands.brandLogos && content.brands.brandLogos.length > 0 
    ? content.brands.brandLogos.map((logoUrl, index) => ({
        name: '',
        logo: logoUrl,
        description: ''
      }))
    : defaultBrands;

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-4"></div>
              <div className="h-10 bg-gray-300 rounded w-96 mx-auto mb-6"></div>
              <div className="h-6 bg-gray-300 rounded w-2xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-emerald-400/60 bg-emerald-400/10 text-emerald-700">
              <Zap className="h-3 w-3 mr-1" />
              {content.brands.badgeText || 'Premium EV Partners'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {content.brands.title || 'Trusted Electric Vehicle Brands'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {content.brands.description || 'Explore our curated collection of premium electric vehicles from the world\'s most trusted manufacturers.'}
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {brands.map((brand, index) => (
              <div
                key={brand.name || `brand-${index}`}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-400/60 hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1"
              >
                <div className="relative w-20 h-12 mb-4">
                  <Image
                    src={brand.logo}
                    alt={brand.name || 'Brand logo'}
                    fill
                    className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                  />
                </div>
                {brand.name && (
                  <h3 className="text-sm font-medium text-gray-800 text-center transition-colors duration-300 group-hover:text-emerald-700">
                    {brand.name}
                  </h3>
                )}
                {brand.description && (
                  <div className="mt-2 h-0 overflow-hidden transition-all duration-300 ease-out group-hover:h-8">
                    <p className="text-xs text-gray-500 text-center leading-tight">
                      {brand.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-8 text-lg">
              {content.brands.bottomCtaText || 'Discover our complete collection of premium electric vehicles from these trusted manufacturers'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {content.brands.buttonText && (
                <Button 
                  asChild 
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-xl shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-300 font-medium transform hover:-translate-y-0.5"
                >
                  <Link href={content.brands.buttonLink || '/products'}>
                    {content.brands.buttonText}
                  </Link>
                </Button>
              )}
              {content.brands.secondaryButtonText && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="px-8 py-4 border-2 border-emerald-400/60 text-emerald-700 rounded-xl hover:border-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-all duration-300 font-medium"
                >
                  <Link href={content.brands.secondaryButtonLink || '/premium-partners'}>
                    {content.brands.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
