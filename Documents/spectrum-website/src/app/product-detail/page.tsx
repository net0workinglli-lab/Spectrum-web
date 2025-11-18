'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import Image from 'next/image';
import Link from 'next/link';
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
  Leaf,
  Camera
} from 'lucide-react';
import { getProducts } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { BookTestRideModal } from '@/components/BookTestRideModal';

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
  evSpecs: {
    batteryBrand: 'CATL Qilin battery pack',
    batteryConfig: 'Mid-mounted charging and swapping integrated battery',
    eAxleType: 'Integrated dual-motor e-axle',
    vehicleController: 'Sunny Auto NeuCore vehicle controller',
    motorType: 'Permanent magnet synchronous motor',
    brakingSystem: 'Intelligent braking energy feedback system',
    chargingSpeed: 'Charge up to 80% in 25 minutes (DC 250 kW)',
    exteriorDesign: 'Closed grille design with Cd 0.45',
    autonomousLevel: 'Level 2+ autonomous driving',
    warranty: '6 years or 300,000 km three-electric warranty'
  },
  evPowertrain: {
    packPower: '95 kWh',
    packEnergyDensity: '210 Wh/kg',
    motorRatedPower: '180 kW',
    motorPeakPower: '420 kW',
    motorRatedTorque: '360 N·m',
    motorPeakTorque: '720 N·m'
  },
  evPerformance: {
    cruisingRange: '520 km (WLTP)',
    maxSpeed: '210 km/h',
    loadingCapacity: '1.5 tons'
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
  const [isTestRideModalOpen, setIsTestRideModalOpen] = useState(false);
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

  const evSpecsData = (product as unknown as { evSpecs?: Record<string, string> })?.evSpecs || {};
  const evPowertrainData = (product as unknown as { evPowertrain?: Record<string, string> })?.evPowertrain || {};
  const evPerformanceData = (product as unknown as { evPerformance?: Record<string, string> })?.evPerformance || {};

  const cleanValue = (value?: string | null) => {
    if (!value) return '';
    const trimmed = value.trim();
    return trimmed;
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

  const specificationDetails = [
    { label: 'Battery brand / type', value: cleanValue(evSpecsData.batteryBrand) },
    { label: 'Battery configuration', value: cleanValue(evSpecsData.batteryConfig) },
    { label: 'e-Axle type', value: cleanValue(evSpecsData.eAxleType) },
    { label: 'Vehicle controller', value: cleanValue(evSpecsData.vehicleController) },
    { label: 'Motor type', value: cleanValue(evSpecsData.motorType) },
    { label: 'Braking system', value: cleanValue(evSpecsData.brakingSystem) },
    { label: 'Charging speed', value: cleanValue(evSpecsData.chargingSpeed) },
    { label: 'Exterior design', value: cleanValue(evSpecsData.exteriorDesign) },
    { label: 'Autonomous driving level', value: cleanValue(evSpecsData.autonomousLevel) },
    { label: 'Warranty', value: cleanValue(evSpecsData.warranty) },
  ].filter((item) => item.value);

  const powertrainDetails = [
    { label: 'PACK power', value: cleanValue(evPowertrainData.packPower) },
    { label: 'PACK energy density', value: cleanValue(evPowertrainData.packEnergyDensity) },
    { label: 'Motor rated power', value: cleanValue(evPowertrainData.motorRatedPower) },
    { label: 'Motor peak power', value: cleanValue(evPowertrainData.motorPeakPower) },
    { label: 'Motor rated torque', value: cleanValue(evPowertrainData.motorRatedTorque) },
    { label: 'Motor peak torque', value: cleanValue(evPowertrainData.motorPeakTorque) },
  ].filter((item) => item.value);

  const performanceDetails = [
    { label: 'Cruising range', value: cleanValue(evPerformanceData.cruisingRange) },
    { label: 'Maximum speed', value: cleanValue(evPerformanceData.maxSpeed) },
    { label: 'Loading capacity', value: cleanValue(evPerformanceData.loadingCapacity) },
  ].filter((item) => item.value);

  const evSpecGroups = [
    {
      title: 'Specifications',
      description: 'Component-level details for Sunny Auto’s EV architecture.',
      icon: Leaf,
      items: specificationDetails,
    },
    {
      title: 'Battery & Powertrain',
      description: 'Energy storage and propulsion metrics for every drive cycle.',
      icon: BatteryCharging,
      items: powertrainDetails,
    },
    {
      title: 'Performance',
      description: 'On-road capability benchmarks and payload support.',
      icon: Gauge,
      items: performanceDetails,
    },
  ].filter((group) => group.items.length > 0);

  const defaultOwnershipHighlights = [
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

  const customOwnershipHighlights = ((product as unknown as { ownershipHighlights?: { title?: string; description?: string; icon?: string }[] })?.ownershipHighlights || [])
    .filter((item) => (item.title && item.title.trim()) || (item.description && item.description.trim()))
    .map((item) => ({
      title: item.title?.trim() || '',
      description: item.description?.trim() || '',
      icon: item.icon?.trim() || '',
    }));

  const iconMap: Record<string, typeof CalendarCheck> = {
    CalendarCheck,
    Wallet,
    FileText,
    ShieldCheck,
    Heart,
    MapPin,
  };

  const iconSequence = [CalendarCheck, Wallet, FileText, ShieldCheck, Heart, MapPin];

  const ownershipServices = defaultOwnershipHighlights.map((fallback, index) => {
    const custom = customOwnershipHighlights[index];
    if (!custom) return fallback;

    const IconComponent = iconMap[custom.icon] || fallback.icon;
    return {
      title: custom.title || fallback.title,
      description: custom.description || fallback.description,
      icon: IconComponent,
    };
  });

  if (customOwnershipHighlights.length > ownershipServices.length) {
    customOwnershipHighlights.slice(ownershipServices.length).forEach((custom, extraIndex) => {
      const icon = iconMap[custom.icon] || iconSequence[(ownershipServices.length + extraIndex) % iconSequence.length];
      ownershipServices.push({
        title: custom.title || 'Sunny Auto concierge benefit',
        description: custom.description || 'Premium ownership support tailored to your needs.',
        icon,
      });
    });
  }

  const parseToNumber = (value: unknown): number | null => {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
      const digitsOnly = value.replace(/\D/g, '');
      if (!digitsOnly) return null;

      const parsed = Number.parseInt(digitsOnly, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    return null;
  };

  const formatCurrency = (rawValue: unknown, fallback = 'Contact for pricing'): string => {
    const numericValue = parseToNumber(rawValue);
    if (numericValue === null || numericValue <= 0) {
      return fallback;
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const displayPrice = formatCurrency(product.price ?? mockProduct.price);
  const displayOriginalPrice = product.originalPrice ? formatCurrency(product.originalPrice, '') : null;
  const priceIncentives =
    (product as unknown as { priceIncentives?: string })?.priceIncentives?.trim() ||
    'Tax incentives & charging infrastructure support up to 120,000,000 VND';
  const priceServices =
    (product as unknown as { priceServices?: string })?.priceServices?.trim() ||
    'Complimentary 3-year maintenance plan + 12 months of home charging service';
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
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[26px] bg-white/70 border border-slate-200 shadow-lg p-5">
            <div className="relative bg-slate-100 overflow-hidden rounded-[18px]" style={{ minHeight: '420px', maxHeight: '640px' }}>
            <Image
              src={(product.images || [])[selectedImageIndex] || '/placeholder-glasses.jpg'}
              alt={product.name}
              fill
                className="object-cover rounded-[24px]"
                priority
              />
              <div className="absolute inset-0 pointer-events-none" />
              <div className="absolute top-4 left-4 inline-flex items-center justify-center rounded-full border border-white/25 bg-black/55 p-3 text-white shadow-lg backdrop-blur">
                <Camera className="h-4 w-4" />
              </div>
              <div className="absolute bottom-4 left-4 text-white/90 text-xs uppercase tracking-[0.25em]">
                {selectedImageIndex + 1}/{(product.images || []).length || 1}
              </div>
            </div>
          </div>

          {(product.images || []).length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-400/60">
              {(product.images || []).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/60 ${
                    selectedImageIndex === index 
                      ? 'border-emerald-400 shadow-lg shadow-emerald-400/20'
                      : 'border-white/20 hover:border-emerald-300/60'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-emerald-300/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">{product.name}</h1>

            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 mb-6 shadow-xl border border-white/5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-emerald-200">
                      Spotlight Price
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400/90">Manufacturer's Suggested Retail Price</p>
                    <p className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-sm">
                      {displayPrice}
                    </p>
                    {displayOriginalPrice && (
                      <p className="text-sm text-slate-300/80 line-through mt-1">
                        {displayOriginalPrice}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                    <ul className="space-y-3 text-sm text-slate-100">
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Leaf className="h-4 w-4 text-emerald-300" />
                        </div>
                        <span>{priceIncentives}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <ShieldCheck className="h-4 w-4 text-emerald-300" />
                        </div>
                        <span>{priceServices}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center gap-3 mb-5 text-sm">
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
            <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg">Technology highlights</h3>
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

            {/* EV Performance & Specifications */}
            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 shadow-xl border border-white/5">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
                      EV Performance
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold text-white">Key electric performance metrics</h3>
                    <p className="text-xs md:text-sm text-emerald-100/80 max-w-2xl">
                      Real-world numbers engineered to keep Sunny Auto ahead—from range and charging to powertrain intelligence.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {evHighlights.map(({ label, value, icon: Icon }, index) => (
                      <div
                        key={index}
                        className={`rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-sm flex items-start gap-3 ${
                          evHighlights.length === 1 ? 'col-span-2' : ''
                        }`}
                      >
                        <div className="rounded-xl bg-emerald-300/15 text-emerald-200 p-2 shadow-inner">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[0.5rem] sm:text-[0.58rem] md:text-xs uppercase tracking-[0.25em] text-emerald-100/80">{label}</p>
                          <p className="text-[0.8rem] sm:text-[0.9rem] md:text-lg font-semibold text-white">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {evSpecGroups.length > 0 && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 shadow-xl border border-white/5">
                  <div className="space-y-2 mb-5">
                    <span className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
                      EV Specifications
                    </span>
                    <h3 className="text-xl md:text-2xl font-semibold text-white">Detailed EV Specifications</h3>
                    <p className="text-xs md:text-sm text-emerald-100/80 max-w-2xl">
                      Comprehensive breakdown of Sunny Auto's EV architecture, powertrain, and performance metrics.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {evSpecGroups.map(({ title, description, icon: Icon, items }, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/12 bg-white/8 p-4 sm:p-5 backdrop-blur-sm"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="rounded-xl bg-emerald-300/15 text-emerald-200 p-2 shadow-inner">
                            <Icon className="h-5 w-5" />
                          </div>
                <div>
                            <p className="text-[0.95rem] md:text-base font-semibold text-white">{title}</p>
                            <p className="text-[0.72rem] md:text-sm text-emerald-100/80">{description}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                          {items.map((item, itemIndex) => (
                            <div
                              key={itemIndex}
                              className={`rounded-xl border border-white/10 bg-white/5 p-3 ${
                                items.length === 1 ? 'col-span-2 md:col-span-1' : ''
                              }`}
                            >
                              <p className="text-[0.6rem] sm:text-[0.72rem] md:text-xs uppercase tracking-[0.25em] text-emerald-100/70">
                                {item.label}
                              </p>
                              <p className="text-[0.7rem] sm:text-[0.85rem] md:text-base font-medium text-white mt-1">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Availability at Experience Center */}
            {product.inStock ? (
              <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white rounded-3xl p-6 shadow-xl border border-white/10 mb-8 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
                    Demo available
                  </span>
                  <Check className="h-5 w-5 text-emerald-200" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-sm">Demo vehicles ready at the experience center</h3>
                  <p className="text-xs md:text-sm text-emerald-100/85">
                    Book a session on our private test track and experience the autonomous suite in real traffic scenarios.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-start gap-3 text-xs md:text-sm text-emerald-100">
                    <div className="mt-0.5">
                      <MapPin className="h-4 w-4 text-emerald-200" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Sunny Auto Experience Center</p>
                    <a 
                        href="https://maps.google.com/maps?q=Sunny+Auto+Experience+Center+HCM"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-emerald-200"
                      >
                        12 D5 Street, Hi-Tech Park, Thu Duc City, Ho Chi Minh City
                      </a>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-white text-emerald-700 hover:bg-emerald-50"
                    asChild
                  >
                    <a
                      href="https://maps.google.com/maps?q=Sunny+Auto+Experience+Center+HCM"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Maps
                    </a>
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white hover:from-emerald-500 hover:via-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-600/30"
                    onClick={() => setIsTestRideModalOpen(true)}
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Book a test drive
                  </Button>
                <Button 
                  size="lg" 
                    className="w-full border border-emerald-400/60 bg-white text-emerald-700 hover:bg-emerald-50"
                  asChild
                >
                  <a 
                      href="https://maps.google.com/maps?q=Sunny+Auto+Experience+Center+HCM"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      Get directions to showroom
                  </a>
                </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <Button
                  size="lg"
                    className={`w-full border border-emerald-400/60 bg-white text-emerald-700 hover:bg-emerald-50 ${
                      isWishlisted ? 'bg-emerald-50' : ''
                    }`}
                  onClick={handleWishlistToggle}
                >
                    <Heart
                      className={`h-5 w-5 mr-2 ${
                        isWishlisted ? 'fill-current text-emerald-500' : ''
                      }`}
                    />
                    {isWishlisted ? 'Saved to favorites' : 'Add to favorites'}
                </Button>
                <Button
                  size="lg"
                    className="w-full border border-emerald-400/60 bg-white text-emerald-700 hover:bg-emerald-50"
                  onClick={handleShare}
                >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share instantly
                </Button>
              </div>
            </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-orange-700 text-white rounded-3xl p-6 shadow-xl border border-white/10 mb-8">
                <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-amber-300/70 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-amber-100">
                      Pre-order status
                    </span>
                    <X className="h-5 w-5 text-amber-200" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white drop-shadow-sm">Accepting pre-orders</h3>
                    <p className="text-xs md:text-sm text-amber-100/85">
                      Estimated delivery within 45-60 days. Contact us for exclusive launch incentives and tailored handover scheduling.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs md:text-sm text-amber-100">
                      <p className="font-medium text-white">Quick advisory hotline</p>
                      <a
                        href={`tel:${phoneNumber}`}
                        className="underline hover:text-amber-200 font-medium"
                      >
                        {phoneNumber}
                      </a>
                </div>
                    <Button
                      variant="secondary"
                      className="bg-white text-amber-700 hover:bg-amber-50"
                      asChild
                    >
                      <a href={`tel:${phoneNumber}`}>
                        Talk to Specialist
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Ownership & Services */}
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 text-white rounded-3xl p-6 shadow-xl border border-white/10">
              <div className="flex flex-col gap-5">
                <div className="space-y-3">
                  <span className="inline-flex items-center rounded-full border border-emerald-300/70 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-100">
                    Ownership benefits
                  </span>
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-sm">Ownership experience &amp; benefits</h3>
                  <p className="text-xs md:text-sm text-emerald-100/80 max-w-xl">
                    Premium services designed exclusively for Sunny Auto drivers—from immersive test drives to concierge-level support throughout your ownership journey.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {ownershipServices.map(({ title, description, icon: Icon }, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                    >
                      <div className="rounded-xl bg-emerald-300/15 text-emerald-200 p-3 shadow-inner">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm md:text-base font-semibold text-white">{title}</p>
                        <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
        </div>
      </div>

      {/* Related Products */}
          {relatedProducts.length > 0 && (
      <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Similar electric vehicles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id} className="min-w-0 w-full">
                    <ProductCard 
                      product={relatedProduct}
                    />
                  </div>
                ))}
              </div>
          </div>
          )}
        </div>
      </div>

      {/* Book Test Ride Modal */}
      <BookTestRideModal
        open={isTestRideModalOpen}
        onOpenChange={setIsTestRideModalOpen}
        productId={productId}
        productName={product.name}
      />
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