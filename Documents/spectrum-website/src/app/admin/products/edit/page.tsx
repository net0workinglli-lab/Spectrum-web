'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, ArrowLeft, Save, X, Plus, Loader2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { getProducts, updateProduct, getCategories } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { ImageUpload } from '@/components/ImageUpload';

const formatCurrencyInput = (value: string): string => {
  if (!value) return '';
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return '';

  const numericValue = Number.parseInt(digitsOnly, 10);
  if (!Number.isFinite(numericValue)) {
    return '';
  }

  return numericValue.toLocaleString('vi-VN');
};

const formatNumberToCurrencyInput = (value?: number | null): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '';
  return Math.trunc(value).toLocaleString('vi-VN');
};

const parseCurrencyToNumber = (value: string): number => {
  if (!value) return 0;
  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) return 0;

  const numericValue = Number.parseInt(digitsOnly, 10);
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

function EditProductContent() {
  const { isLoggedIn, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, name: string, slug: string}>>([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    rating: '5.0',
    reviewsCount: '0',
    features: [] as string[],
    inStock: true,
    images: [] as string[],
    evRange: '',
    evCharge: '',
    evAcceleration: '',
    evPower: '',
    evDrivetrain: '',
    evBattery: '',
    priceIncentives: '',
    priceServices: '',
    specBatteryBrand: '',
    specBatteryConfig: '',
    specEAxleType: '',
    specVehicleController: '',
    specMotorType: '',
    specBrakingSystem: '',
    specChargingSpeed: '',
    specExteriorDesign: '',
    specAutonomousLevel: '',
    specWarranty: '',
    powerPackPower: '',
    powerPackEnergyDensity: '',
    powerMotorRatedPower: '',
    powerMotorPeakPower: '',
    powerMotorRatedTorque: '',
    powerMotorPeakTorque: '',
    perfCruisingRange: '',
    perfMaxSpeed: '',
    perfLoadingCapacity: '',
    ownershipTitle1: '',
    ownershipDesc1: '',
    ownershipTitle2: '',
    ownershipDesc2: '',
    ownershipTitle3: '',
    ownershipDesc3: ''
  });
  const [newFeature, setNewFeature] = useState('');

  // Load product categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log('📦 Loading product categories for edit...');
        const allCategories = await getCategories();
        const productCategories = allCategories
          .filter((cat: any) => cat.type === 'product')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
        
        console.log('📦 Product categories loaded for edit:', productCategories.length, productCategories);
        setCategories(productCategories);
      } catch (error) {
        console.error('❌ Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p: Record<string, unknown>) => p.id === productId) as Product;
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData({
            name: foundProduct.name || '',
            brand: foundProduct.brand || '',
            category: foundProduct.category || 'sunglasses',
            description: foundProduct.description || '',
            price: typeof foundProduct.price === 'number'
              ? formatNumberToCurrencyInput(foundProduct.price)
              : formatCurrencyInput(String(foundProduct.price ?? '')),
            rating: foundProduct.rating?.toString() || '5.0',
            reviewsCount: foundProduct.reviewsCount?.toString() || '0',
            features: foundProduct.features || [],
            inStock: foundProduct.inStock ?? true,
            images: foundProduct.images || [],
            evRange: foundProduct.evDetails?.range || '',
            evCharge: foundProduct.evDetails?.charge || '',
            evAcceleration: foundProduct.evDetails?.acceleration || '',
            evPower: foundProduct.evDetails?.power || '',
            evDrivetrain: foundProduct.evDetails?.drivetrain || '',
            evBattery: foundProduct.evDetails?.battery || '',
            priceIncentives: foundProduct.priceIncentives || '',
            priceServices: foundProduct.priceServices || '',
            specBatteryBrand: foundProduct.evSpecs?.batteryBrand || '',
            specBatteryConfig: foundProduct.evSpecs?.batteryConfig || '',
            specEAxleType: foundProduct.evSpecs?.eAxleType || '',
            specVehicleController: foundProduct.evSpecs?.vehicleController || '',
            specMotorType: foundProduct.evSpecs?.motorType || '',
            specBrakingSystem: foundProduct.evSpecs?.brakingSystem || '',
            specChargingSpeed: foundProduct.evSpecs?.chargingSpeed || '',
            specExteriorDesign: foundProduct.evSpecs?.exteriorDesign || '',
            specAutonomousLevel: foundProduct.evSpecs?.autonomousLevel || '',
            specWarranty: foundProduct.evSpecs?.warranty || '',
            powerPackPower: foundProduct.evPowertrain?.packPower || '',
            powerPackEnergyDensity: foundProduct.evPowertrain?.packEnergyDensity || '',
            powerMotorRatedPower: foundProduct.evPowertrain?.motorRatedPower || '',
            powerMotorPeakPower: foundProduct.evPowertrain?.motorPeakPower || '',
            powerMotorRatedTorque: foundProduct.evPowertrain?.motorRatedTorque || '',
            powerMotorPeakTorque: foundProduct.evPowertrain?.motorPeakTorque || '',
            perfCruisingRange: foundProduct.evPerformance?.cruisingRange || '',
            perfMaxSpeed: foundProduct.evPerformance?.maxSpeed || '',
            perfLoadingCapacity: foundProduct.evPerformance?.loadingCapacity || '',
            ownershipTitle1: foundProduct.ownershipHighlights?.[0]?.title || '',
            ownershipDesc1: foundProduct.ownershipHighlights?.[0]?.description || '',
            ownershipTitle2: foundProduct.ownershipHighlights?.[1]?.title || '',
            ownershipDesc2: foundProduct.ownershipHighlights?.[1]?.description || '',
            ownershipTitle3: foundProduct.ownershipHighlights?.[2]?.title || '',
            ownershipDesc3: foundProduct.ownershipHighlights?.[2]?.description || ''
          });
        } else {
          toast.error('Sản phẩm không tồn tại');
          router.push('/admin/products');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast.error('Có lỗi xảy ra khi tải sản phẩm');
        router.push('/admin/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && productId) {
      loadProduct();
    }
  }, [isLoggedIn, productId, router]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
            <Button asChild>
              <Link href="/admin">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/admin/products">Back to Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSaving(true);
      
      const {
        price,
        rating,
        reviewsCount,
        evRange,
        evCharge,
        evAcceleration,
        evPower,
        evDrivetrain,
        evBattery,
        priceIncentives,
        priceServices,
        specBatteryBrand,
        specBatteryConfig,
        specEAxleType,
        specVehicleController,
        specMotorType,
        specBrakingSystem,
        specChargingSpeed,
        specExteriorDesign,
        specAutonomousLevel,
        specWarranty,
        powerPackPower,
        powerPackEnergyDensity,
        powerMotorRatedPower,
        powerMotorPeakPower,
        powerMotorRatedTorque,
        powerMotorPeakTorque,
        perfCruisingRange,
        perfMaxSpeed,
        perfLoadingCapacity,
        ownershipTitle1,
        ownershipDesc1,
        ownershipTitle2,
        ownershipDesc2,
        ownershipTitle3,
        ownershipDesc3,
        ...rest
      } = formData;

      const evDetailsInput = {
        range: evRange,
        charge: evCharge,
        acceleration: evAcceleration,
        power: evPower,
        drivetrain: evDrivetrain,
        battery: evBattery
      };

      const evSpecsInput = {
        batteryBrand: specBatteryBrand,
        batteryConfig: specBatteryConfig,
        eAxleType: specEAxleType,
        vehicleController: specVehicleController,
        motorType: specMotorType,
        brakingSystem: specBrakingSystem,
        chargingSpeed: specChargingSpeed,
        exteriorDesign: specExteriorDesign,
        autonomousLevel: specAutonomousLevel,
        warranty: specWarranty
      };

      const evPowertrainInput = {
        packPower: powerPackPower,
        packEnergyDensity: powerPackEnergyDensity,
        motorRatedPower: powerMotorRatedPower,
        motorPeakPower: powerMotorPeakPower,
        motorRatedTorque: powerMotorRatedTorque,
        motorPeakTorque: powerMotorPeakTorque
      };

      const evPerformanceInput = {
        cruisingRange: perfCruisingRange,
        maxSpeed: perfMaxSpeed,
        loadingCapacity: perfLoadingCapacity
      };

      const evDetails = Object.entries(evDetailsInput).reduce<Record<string, string>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed) {
          acc[key] = trimmed;
        }
        return acc;
      }, {});

      const evSpecs = Object.entries(evSpecsInput).reduce<Record<string, string>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed) {
          acc[key] = trimmed;
        }
        return acc;
      }, {});

      const evPowertrain = Object.entries(evPowertrainInput).reduce<Record<string, string>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed) {
          acc[key] = trimmed;
        }
        return acc;
      }, {});

      const evPerformance = Object.entries(evPerformanceInput).reduce<Record<string, string>>((acc, [key, value]) => {
        const trimmed = value.trim();
        if (trimmed) {
          acc[key] = trimmed;
        }
        return acc;
      }, {});

      const trimmedPriceIncentives = priceIncentives.trim();
      const trimmedPriceServices = priceServices.trim();

      const productData: Record<string, unknown> = {
        ...rest,
        price: parseCurrencyToNumber(price),
        rating: parseFloat(rating) || 5.0,
        reviewsCount: parseInt(reviewsCount) || 0,
        priceIncentives: trimmedPriceIncentives || null,
        priceServices: trimmedPriceServices || null,
        author: {
          name: (user as { displayName?: string })?.displayName || 'Admin',
          email: user?.email || 'admin@example.com',
          ...((user as { photoURL?: string })?.photoURL && { avatar: (user as { photoURL?: string }).photoURL })
        }
      };

      productData.evDetails = Object.keys(evDetails).length > 0 ? evDetails : null;
      productData.evSpecs = Object.keys(evSpecs).length > 0 ? evSpecs : null;
      productData.evPowertrain = Object.keys(evPowertrain).length > 0 ? evPowertrain : null;
      productData.evPerformance = Object.keys(evPerformance).length > 0 ? evPerformance : null;

      const ownershipHighlights = [
        {
          title: ownershipTitle1.trim(),
          description: ownershipDesc1.trim(),
        },
        {
          title: ownershipTitle2.trim(),
          description: ownershipDesc2.trim(),
        },
        {
          title: ownershipTitle3.trim(),
          description: ownershipDesc3.trim(),
        },
      ].filter((item) => item.title || item.description);

      productData.ownershipHighlights = ownershipHighlights.length > 0 ? ownershipHighlights : null;

      Object.keys(productData).forEach((key) => {
        if (productData[key] === undefined) {
          delete productData[key];
        }
      });

      await updateProduct(productId!, productData);
      
      toast.success('Sản phẩm đã được cập nhật thành công!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Product</h1>
              <p className="text-gray-600">Update product information</p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {categories.length === 0 && (
                      <p className="text-sm text-yellow-600">
                        ⚠️ Chưa có Product Categories. 
                        <a href="/admin/categories" className="underline ml-1">
                          Tạo categories trước
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (VND)</Label>
                    <Input
                      id="price"
                      type="text"
                      inputMode="decimal"
                      value={formData.price}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setFormData(prev => ({ ...prev, price: formatted }));
                      }}
                      onBlur={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setFormData(prev => ({ ...prev, price: formatted }));
                      }}
                      placeholder="e.g. 1.250.000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                {/* EV Specifications */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">EV Performance &amp; Specs</h3>
                    <p className="text-sm text-gray-500">Update the core electric metrics highlighted on the product detail page.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="evRange">Range</Label>
                      <Input
                        id="evRange"
                        value={formData.evRange}
                        onChange={(e) => setFormData(prev => ({ ...prev, evRange: e.target.value }))}
                        placeholder="e.g. 520 km WLTP"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evCharge">Rapid charging</Label>
                      <Input
                        id="evCharge"
                        value={formData.evCharge}
                        onChange={(e) => setFormData(prev => ({ ...prev, evCharge: e.target.value }))}
                        placeholder="e.g. 10-80% in 25 minutes (DC 250 kW)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evAcceleration">Acceleration</Label>
                      <Input
                        id="evAcceleration"
                        value={formData.evAcceleration}
                        onChange={(e) => setFormData(prev => ({ ...prev, evAcceleration: e.target.value }))}
                        placeholder="e.g. 0-100 km/h in 3.8 seconds"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evPower">Power output</Label>
                      <Input
                        id="evPower"
                        value={formData.evPower}
                        onChange={(e) => setFormData(prev => ({ ...prev, evPower: e.target.value }))}
                        placeholder="e.g. 420 kW (563 hp)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evDrivetrain">Drivetrain</Label>
                      <Input
                        id="evDrivetrain"
                        value={formData.evDrivetrain}
                        onChange={(e) => setFormData(prev => ({ ...prev, evDrivetrain: e.target.value }))}
                        placeholder="e.g. Dual Motor AWD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evBattery">Battery tech</Label>
                      <Input
                        id="evBattery"
                        value={formData.evBattery}
                        onChange={(e) => setFormData(prev => ({ ...prev, evBattery: e.target.value }))}
                        placeholder="e.g. 95 kWh solid-state battery"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Highlights */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pricing Highlights</h3>
                    <p className="text-sm text-gray-500">Update the incentive and service copy displayed with the price banner.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceIncentives">Incentive message</Label>
                      <Textarea
                        id="priceIncentives"
                        value={formData.priceIncentives}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceIncentives: e.target.value }))}
                        placeholder="e.g. Tax incentives & charging infrastructure support up to 120,000,000 VND"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceServices">Service message</Label>
                      <Textarea
                        id="priceServices"
                        value={formData.priceServices}
                        onChange={(e) => setFormData(prev => ({ ...prev, priceServices: e.target.value }))}
                        placeholder="e.g. Complimentary 3-year maintenance plan + 12 months of home charging service"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Specifications (Thông số kỹ thuật)</h3>
                    <p className="text-sm text-gray-500">Update detailed hardware information for this EV.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specBatteryBrand">Battery Brand / Type</Label>
                      <Input
                        id="specBatteryBrand"
                        value={formData.specBatteryBrand}
                        onChange={(e) => setFormData(prev => ({ ...prev, specBatteryBrand: e.target.value }))}
                        placeholder="e.g. BYD blade battery"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specBatteryConfig">Battery Configuration</Label>
                      <Input
                        id="specBatteryConfig"
                        value={formData.specBatteryConfig}
                        onChange={(e) => setFormData(prev => ({ ...prev, specBatteryConfig: e.target.value }))}
                        placeholder="e.g. Mid-mounted charging and swapping integrated battery"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specEAxleType">e-Axle Type</Label>
                      <Input
                        id="specEAxleType"
                        value={formData.specEAxleType}
                        onChange={(e) => setFormData(prev => ({ ...prev, specEAxleType: e.target.value }))}
                        placeholder="e.g. Integrated e-axle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specVehicleController">Vehicle Controller</Label>
                      <Input
                        id="specVehicleController"
                        value={formData.specVehicleController}
                        onChange={(e) => setFormData(prev => ({ ...prev, specVehicleController: e.target.value }))}
                        placeholder="e.g. Weichai VCU vehicle controller"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specMotorType">Motor Type</Label>
                      <Input
                        id="specMotorType"
                        value={formData.specMotorType}
                        onChange={(e) => setFormData(prev => ({ ...prev, specMotorType: e.target.value }))}
                        placeholder="e.g. Permanent magnet synchronous motor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specBrakingSystem">Braking System</Label>
                      <Input
                        id="specBrakingSystem"
                        value={formData.specBrakingSystem}
                        onChange={(e) => setFormData(prev => ({ ...prev, specBrakingSystem: e.target.value }))}
                        placeholder="e.g. Intelligent braking energy feedback system"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specChargingSpeed">Charging Speed</Label>
                      <Input
                        id="specChargingSpeed"
                        value={formData.specChargingSpeed}
                        onChange={(e) => setFormData(prev => ({ ...prev, specChargingSpeed: e.target.value }))}
                        placeholder="e.g. Charge up to 80% in 30 minutes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specExteriorDesign">Exterior Design</Label>
                      <Input
                        id="specExteriorDesign"
                        value={formData.specExteriorDesign}
                        onChange={(e) => setFormData(prev => ({ ...prev, specExteriorDesign: e.target.value }))}
                        placeholder="e.g. Closed grille design, drag coefficient cd 0.45"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specAutonomousLevel">Autonomous Driving Level</Label>
                      <Input
                        id="specAutonomousLevel"
                        value={formData.specAutonomousLevel}
                        onChange={(e) => setFormData(prev => ({ ...prev, specAutonomousLevel: e.target.value }))}
                        placeholder="e.g. Level 2 autonomous driving"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specWarranty">Warranty</Label>
                      <Input
                        id="specWarranty"
                        value={formData.specWarranty}
                        onChange={(e) => setFormData(prev => ({ ...prev, specWarranty: e.target.value }))}
                        placeholder="e.g. 6 years or 300,000 km three-electric warranty"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Battery &amp; Powertrain</h3>
                    <p className="text-sm text-gray-500">Maintain accurate battery pack and motor output data.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="powerPackPower">PACK Power (kWh)</Label>
                      <Input
                        id="powerPackPower"
                        value={formData.powerPackPower}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerPackPower: e.target.value }))}
                        placeholder="e.g. 92 kWh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerPackEnergyDensity">PACK Energy Density (Wh/kg)</Label>
                      <Input
                        id="powerPackEnergyDensity"
                        value={formData.powerPackEnergyDensity}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerPackEnergyDensity: e.target.value }))}
                        placeholder="e.g. 210 Wh/kg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorRatedPower">Motor Rated Power (kW)</Label>
                      <Input
                        id="powerMotorRatedPower"
                        value={formData.powerMotorRatedPower}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerMotorRatedPower: e.target.value }))}
                        placeholder="e.g. 150 kW"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorPeakPower">Motor Peak Power (kW)</Label>
                      <Input
                        id="powerMotorPeakPower"
                        value={formData.powerMotorPeakPower}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerMotorPeakPower: e.target.value }))}
                        placeholder="e.g. 320 kW"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorRatedTorque">Motor Rated Torque (N·m)</Label>
                      <Input
                        id="powerMotorRatedTorque"
                        value={formData.powerMotorRatedTorque}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerMotorRatedTorque: e.target.value }))}
                        placeholder="e.g. 340 N·m"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorPeakTorque">Motor Peak Torque (N·m)</Label>
                      <Input
                        id="powerMotorPeakTorque"
                        value={formData.powerMotorPeakTorque}
                        onChange={(e) => setFormData(prev => ({ ...prev, powerMotorPeakTorque: e.target.value }))}
                        placeholder="e.g. 650 N·m"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Performance</h3>
                    <p className="text-sm text-gray-500">Summarize real-world capabilities for range, speed, and capacity.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="perfCruisingRange">Cruising Range (km)</Label>
                      <Input
                        id="perfCruisingRange"
                        value={formData.perfCruisingRange}
                        onChange={(e) => setFormData(prev => ({ ...prev, perfCruisingRange: e.target.value }))}
                        placeholder="e.g. 520 km"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfMaxSpeed">Maximum Speed (km/h)</Label>
                      <Input
                        id="perfMaxSpeed"
                        value={formData.perfMaxSpeed}
                        onChange={(e) => setFormData(prev => ({ ...prev, perfMaxSpeed: e.target.value }))}
                        placeholder="e.g. 200 km/h"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfLoadingCapacity">Loading Capacity (tons)</Label>
                      <Input
                        id="perfLoadingCapacity"
                        value={formData.perfLoadingCapacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, perfLoadingCapacity: e.target.value }))}
                        placeholder="e.g. 1.2 tons"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Ownership Experience &amp; Benefits</h3>
                    <p className="text-sm text-gray-500">Update the concierge services highlighted in the ownership section.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle1">Highlight #1 Title</Label>
                      <Input
                        id="ownershipTitle1"
                        value={formData.ownershipTitle1}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipTitle1: e.target.value }))}
                        placeholder="e.g. Schedule a test drive"
                      />
                      <Label htmlFor="ownershipDesc1" className="sr-only">Highlight #1 Description</Label>
                      <Textarea
                        id="ownershipDesc1"
                        value={formData.ownershipDesc1}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipDesc1: e.target.value }))}
                        placeholder="Describe the benefit in detail"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle2">Highlight #2 Title</Label>
                      <Input
                        id="ownershipTitle2"
                        value={formData.ownershipTitle2}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipTitle2: e.target.value }))}
                        placeholder="e.g. Flexible financing"
                      />
                      <Label htmlFor="ownershipDesc2" className="sr-only">Highlight #2 Description</Label>
                      <Textarea
                        id="ownershipDesc2"
                        value={formData.ownershipDesc2}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipDesc2: e.target.value }))}
                        placeholder="Detail financing perks or partner programs"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle3">Highlight #3 Title</Label>
                      <Input
                        id="ownershipTitle3"
                        value={formData.ownershipTitle3}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipTitle3: e.target.value }))}
                        placeholder="e.g. Download brochure"
                      />
                      <Label htmlFor="ownershipDesc3" className="sr-only">Highlight #3 Description</Label>
                      <Textarea
                        id="ownershipDesc3"
                        value={formData.ownershipDesc3}
                        onChange={(e) => setFormData(prev => ({ ...prev, ownershipDesc3: e.target.value }))}
                        placeholder="Describe documentation or concierge support"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  maxImages={5}
                  label="Product Images"
                  description="Upload product images or add image URLs. Maximum 5 images."
                />

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                      placeholder="5.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reviewsCount">Reviews Count</Label>
                    <Input
                      id="reviewsCount"
                      type="number"
                      value={formData.reviewsCount}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviewsCount: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Status</Label>
                    <select
                      value={formData.inStock ? 'true' : 'false'}
                      onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.value === 'true' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={isSaving} className="flex-1">
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Update Product
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    }>
      <EditProductContent />
    </Suspense>
  );
}
