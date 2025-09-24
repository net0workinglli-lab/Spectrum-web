'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Award, Star, MapPin, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export default function BrandsPage() {
  const brands = [
    {
      id: '1',
      name: 'Ray-Ban',
      logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=100&fit=crop',
      description: 'Iconic American eyewear since 1936',
      category: 'Luxury',
      products: 45,
      rating: 4.8,
      established: '1936',
      country: 'United States',
      website: 'https://ray-ban.com'
    },
    {
      id: '2',
      name: 'Oakley',
      logo: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=100&fit=crop',
      description: 'Performance eyewear for athletes',
      category: 'Sports',
      products: 32,
      rating: 4.6,
      established: '1975',
      country: 'United States',
      website: 'https://oakley.com'
    },
    {
      id: '3',
      name: 'Persol',
      logo: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=200&h=100&fit=crop',
      description: 'Italian luxury craftsmanship',
      category: 'Luxury',
      products: 28,
      rating: 4.9,
      established: '1917',
      country: 'Italy',
      website: 'https://persol.com'
    },
    {
      id: '4',
      name: 'Warby Parker',
      logo: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=100&fit=crop',
      description: 'Direct-to-consumer eyewear',
      category: 'Modern',
      products: 67,
      rating: 4.7,
      established: '2010',
      country: 'United States',
      website: 'https://warbyparker.com'
    },
    {
      id: '5',
      name: 'Tom Ford',
      logo: 'https://images.unsplash.com/photo-1506629905607-7b1b0b0b0b0b?w=200&h=100&fit=crop',
      description: 'Luxury fashion eyewear',
      category: 'Fashion',
      products: 23,
      rating: 4.8,
      established: '2005',
      country: 'United States',
      website: 'https://tomford.com'
    },
    {
      id: '6',
      name: 'Gucci',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=100&fit=crop',
      description: 'Italian luxury fashion',
      category: 'Fashion',
      products: 34,
      rating: 4.9,
      established: '1921',
      country: 'Italy',
      website: 'https://gucci.com'
    },
    {
      id: '7',
      name: 'Prada',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=100&fit=crop',
      description: 'Milanese luxury design',
      category: 'Fashion',
      products: 29,
      rating: 4.7,
      established: '1913',
      country: 'Italy',
      website: 'https://prada.com'
    },
    {
      id: '8',
      name: 'Versace',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=100&fit=crop',
      description: 'Bold Italian luxury',
      category: 'Fashion',
      products: 26,
      rating: 4.6,
      established: '1978',
      country: 'Italy',
      website: 'https://versace.com'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground mb-4">
          <Award className="h-4 w-4" />
          Premium Partners
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Brand Partners</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the world&apos;s most prestigious eyewear brands that we proudly carry in our collection.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {brands.map((brand) => (
          <Card key={brand.id} className="group hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="text-center">
                {/* Brand Logo */}
                <div className="relative w-20 h-12 mx-auto mb-4">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Brand Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{brand.description}</p>

                {/* Category Badge */}
                <Badge variant="outline" className="mb-3">
                  {brand.category}
                </Badge>

                {/* Stats */}
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Products:</span>
                    <span className="font-medium">{brand.products}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{brand.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Established:</span>
                    <span className="font-medium">{brand.established}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Country:</span>
                    <span className="font-medium">{brand.country}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="outline" className="w-full" asChild>
                  <a href={brand.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interested in Becoming a Partner?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          We&apos;re always looking for new premium eyewear brands to add to our collection. 
          Contact us to discuss partnership opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-5 w-5" />
            <a 
              href="https://maps.google.com/maps?q=Spectrum+Eyecare+192+Nguyễn+Văn+Hưởng,+Thảo+Điền,+Thủ+Đức,+Hồ+Chí+Minh+700000,+Việt+Nam"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700 underline"
            >
              <strong>Spectrum Eyecare</strong><br />
              192 Nguyễn Văn Hưởng, Thảo Điền, Thủ Đức, Hồ Chí Minh 700000, Việt Nam
            </a>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-5 w-5" />
            <span>+84 123 456 789</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="h-5 w-5" />
            <span>partnerships@spectrum.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
