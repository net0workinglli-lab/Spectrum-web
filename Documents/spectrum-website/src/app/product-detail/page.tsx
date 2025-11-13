'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Share2,
  Star,
  Check,
  X,
  MapPin,
  Loader2,
  Phone,
  Gauge,
  BatteryCharging,
  Zap,
  ShieldCheck,
  CalendarCheck,
  FileText,
  Wallet,
  Car,
  Leaf
} from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Sunny Auto Solis X 2025',
  description:
    'Sunny Auto Solis X is a flagship electric SUV engineered for long-range adventures with 520 km WLTP efficiency, 250 kW ultra-fast DC charging, and Level 3 autonomous assistance. Aerodynamic design meets spacecraft-inspired interior comfort for a smooth, confident drive.',
  price: 1250000000,
  originalPrice: 1350000000,
  images: [
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1b?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611526778547-1d41e961f89d?w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619768223646-d0b210b8f10d?w=1600&auto=format&fit=crop',
  ],
  category: 'electric-suv',
  brand: 'Sunny Auto',
  features: [
    'Up to 520 km of real-world range per charge',
    '250 kW DC fast charging from 10% to 80% in 25 minutes',
    'Level 3 autonomous driving with 18 smart sensors',
    'Panoramic smart cockpit with 27-inch curved display',
    'Solid-state battery with 8-year or 200,000 km warranty',
  ],
  evDetails: {
    range: '520 km WLTP',
    charge: '10-80% in 25 minutes (DC 250 kW)',
    acceleration: '0-100 km/h in 3.8 seconds',
    power: '420 kW (563 hp)',
    drivetrain: 'Dual Motor AWD',
    battery: '95 kWh solid-state battery pack',
  },
  inStock: true,
  rating: 4.8,
  reviewsCount: 326,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function ProductDetailContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || '1';
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { phoneNumber } = useStoreSettings();

  // Load product from Firebase
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Record<string, unknown>) => p.id === productId) as Product;
        
        if (foundProduct) {
          // Process Firestore data to handle Timestamps
          const processTimestamp = (timestamp: unknown): Date => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as { toDate: () => Date }).toDate();
            }
            if (typeof timestamp === 'string') {
              return new Date(timestamp);
            }
            return new Date();
          };

          const processedProduct = {
            ...foundProduct,
            createdAt: processTimestamp(foundProduct.createdAt),
            updatedAt: processTimestamp(foundProduct.updatedAt),
          } as Product;

          setProduct(processedProduct);
        } else {
          toast.error('Product not found');
          // Fallback to mock data
          setProduct(mockProduct as Product);
        }
      } catch (error) {
        toast.error('Unable to load product details');
        // Fallback to mock data
        setProduct(mockProduct as Product);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  // Load related products based on same category
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product) return;
      
      try {
        const products = await getProducts();
        
        // Filter products: same category but not the current product
        const related = products
          .filter((p: Product) => 
            p.category === product.category && p.id !== product.id
          )
          .slice(0, 4); // Limit to 4 products
        
        // Process timestamps for related products
        const processedRelated = related.map((p: Product) => {
          const processTimestamp = (timestamp: unknown): Date => {
            if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
              return (timestamp as { toDate: () => Date }).toDate();
            }
            if (typeof timestamp === 'string') {
              return new Date(timestamp);
            }
            return new Date();
          };

          return {
            ...p,
            createdAt: processTimestamp(p.createdAt),
            updatedAt: processTimestamp(p.updatedAt),
          } as Product;
        });
        
        setRelatedProducts(processedRelated);
      } catch (error) {
        console.error('Error loading related products:', error);
      }
    };

    loadRelatedProducts();
  }, [product]);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const defaultEvDetails = {
    range: '520 km WLTP',
    charge: '10-80% in 25 minutes (DC 250 kW)',
    acceleration: '0-100 km/h in 3.8 seconds',
    power: '420 kW (563 hp)',
    drivetrain: 'Dual Motor AWD',
    battery: '95 kWh solid-state battery pack',
  };

  const evDetails = {
    range: (product as unknown as { evDetails?: { range?: string } })?.evDetails?.range || defaultEvDetails.range,
    charge: (product as unknown as { evDetails?: { charge?: string } })?.evDetails?.charge || defaultEvDetails.charge,
    acceleration: (product as unknown as { evDetails?: { acceleration?: string } })?.evDetails?.acceleration || defaultEvDetails.acceleration,
    power: (product as unknown as { evDetails?: { power?: string } })?.evDetails?.power || defaultEvDetails.power,
    drivetrain: (product as unknown as { evDetails?: { drivetrain?: string } })?.evDetails?.drivetrain || defaultEvDetails.drivetrain,
    battery: (product as unknown as { evDetails?: { battery?: string } })?.evDetails?.battery || defaultEvDetails.battery,
  };

  const productFeatures = Array.isArray(product.features) && product.features.length > 0
    ? product.features
    : [
        'Up to 520 km of range on a single charge',
        'DC fast charging to 80% in just 25 minutes',
        'Level 3 autonomous driving intelligence',
        'Immersive cabin with panoramic curved display',
      ];

  const evHighlights = [
    {
      label: 'Range',
      value: evDetails.range,
      icon: Gauge,
    },
    {
      label: 'Rapid charging',
      value: evDetails.charge,
      icon: BatteryCharging,
    },
    {
      label: 'Acceleration',
      value: evDetails.acceleration,
      icon: Zap,
    },
    {
      label: 'Power output',
      value: evDetails.power,
      icon: Car,
    },
    {
      label: 'Drivetrain',
      value: evDetails.drivetrain,
      icon: Leaf,
    },
    {
      label: 'Battery tech',
      value: evDetails.battery,
      icon: ShieldCheck,
    },
  ];

  const ownershipServices = [
    {
      title: 'Schedule a test drive',
      description: 'Experience instant torque and autonomous assistance on our dedicated EV proving ground.',
      icon: CalendarCheck,
    },
    {
      title: 'Flexible financing',
      description: 'Get tailored financing with 0% APR for 12 months for returning Sunny Auto owners.',
      icon: Wallet,
    },
    {
      title: 'Download brochure',
      description: "Access deep dives on battery tech, active safety, and Sunny Auto's charging standards.",
      icon: FileText,
    },
  ];

  const formatCurrency = (value: unknown) => {
    if (typeof value !== 'number') return value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const displayPrice = formatCurrency(product.price ?? mockProduct.price);
  const displayOriginalPrice = product.originalPrice ? formatCurrency(product.originalPrice) : null;
  const categoryLabel = product.category ? product.category.replace(/-/g, ' ') : 'electric vehicle';
  const stockBadge = product.inStock ? 'Available for test drive' : 'Pre-order now';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Electric vehicles</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={(product.images || [])[selectedImageIndex] || '/placeholder-glasses.jpg'}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>

          {/* Thumbnail Images */}
          {(product.images || []).length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {(product.images || []).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
                {product.brand || 'Sunny Auto'}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {categoryLabel}
              </Badge>
              <Badge variant="default" className={product.inStock ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}>
                {stockBadge}
              </Badge>
              <Badge variant="outline" className="border-emerald-500 text-emerald-600">
                Zero Emission
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>

            <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400 mb-2">MSRP</p>
                  <p className="text-4xl font-semibold tracking-tight">{displayPrice}</p>
                  {displayOriginalPrice && (
                    <p className="text-sm text-slate-400 line-through mt-1">{displayOriginalPrice}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 text-sm text-slate-200">
                  <span>Tax incentives & charging infrastructure support up to 120,000,000 VND</span>
                  <span>Complimentary 3-year maintenance plan + 12 months of home charging service</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 4.5)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                ({product.rating || 4.5}) • {product.reviewsCount || 128} verified owner reviews
              </span>
            </div>


            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 text-lg">Technology highlights</h3>
              <ul className="space-y-3">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EV Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {evHighlights.map(({ label, value, icon: Icon }, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 bg-white/60 backdrop-blur-sm p-4 shadow-sm hover:border-emerald-500 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 text-emerald-600 p-2">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                      <p className="text-base font-semibold text-slate-900">{value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability at Experience Center */}
            {product.inStock ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-emerald-800 mb-1">Demo vehicles ready at the experience center</h3>
                    <p className="text-sm text-emerald-700 mb-2">
                      Book a session on our private test track and experience the autonomous suite in real traffic scenarios.
                    </p>
                    <div className="text-sm text-emerald-600">
                      <p className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4" /> Sunny Auto Experience Center</p>
                      <a
                        href="https://maps.google.com/maps?q=Sunny+Auto+Experience+Center+HCM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-emerald-800 underline"
                      >
                        12 D5 Street, Hi-Tech Park, Thu Duc City, Ho Chi Minh City
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <div className="flex items-start gap-3">
                  <X className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-1">Accepting pre-orders</h3>
                    <p className="text-sm text-amber-700 mb-2">
                      Estimated delivery within 45-60 days. Contact us for exclusive launch incentives.
                    </p>
                    <div className="text-sm text-amber-600">
                      <p className="font-medium">Quick advisory hotline:</p>
                      <a
                        href={`tel:${phoneNumber}`}
                        className="hover:text-amber-800 underline font-medium"
                      >
                        {phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  asChild
                >
                  <a href={`tel:${phoneNumber}`}>
                    <Phone className="h-5 w-5 mr-2" />
                    Book a test drive
                  </a>
                </Button>
                <Button
                  size="lg"
                  className="flex-1"
                  variant="outline"
                  asChild
                >
                  <a
                    href="https://maps.google.com/maps?q=Sunny+Auto+Experience+Center+HCM"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Get directions to showroom
                  </a>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                  {isWishlisted ? 'Saved to favorites' : 'Add to favorites'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share instantly
                </Button>
              </div>
            </div>
          </div>

          {/* Ownership & Services */}
          <Card className="border-emerald-100 bg-emerald-50/40">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ownership experience & benefits</h3>
              <div className="space-y-4">
                {ownershipServices.map(({ title, description, icon: Icon }, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-lg bg-white shadow-sm p-2 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar electric vehicles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}