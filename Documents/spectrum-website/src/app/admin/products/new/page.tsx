'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, ArrowLeft, Save, X, Plus
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { createProduct, getCategories } from '@/lib/firebase-firestore';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function NewProductPage() {
  const { isLoggedIn, user } = useApp();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
        console.log('📦 Loading product categories...');
        const allCategories = await getCategories();
        const productCategories = allCategories
          .filter((cat: any) => cat.type === 'product')
          .map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          }));
        
        console.log('📦 Product categories loaded:', productCategories.length, productCategories);
        setCategories(productCategories);
        
        // Set default category if available
        if (productCategories.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: productCategories[0].slug }));
        }
      } catch (error) {
        console.error('❌ Error loading categories:', error);
        toast.error('Không thể tải danh mục sản phẩm');
      }
    };

    loadCategories();
  }, []);

  // Safe setters with logging
  const safeSetFormData = (updater: (prev: typeof formData) => typeof formData) => {
    try {
      console.log('[NewProduct] safeSetFormData called', { hasUpdater: typeof updater === 'function' });
      if (typeof updater === 'function') {
        setFormData(updater);
      } else {
        console.error('[NewProduct] setFormData updater is not a function', updater);
      }
    } catch (error) {
      console.error('[NewProduct] Error in safeSetFormData:', error);
    }
  };

  const safeSetNewFeature = (value: string) => {
    try {
      console.log('[NewProduct] safeSetNewFeature called', { length: value.length });
      if (typeof setNewFeature === 'function') {
        setNewFeature(value);
      } else {
        console.error('[NewProduct] setNewFeature is not a function', setNewFeature);
      }
    } catch (error) {
      console.error('[NewProduct] Error in safeSetNewFeature:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.description) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsLoading(true);
      
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

      const productData: Record<string, unknown> = {
        ...rest,
        price: parseCurrencyToNumber(price),
        rating: parseFloat(rating) || 5.0,
        reviewsCount: parseInt(reviewsCount) || 0,
        priceIncentives: priceIncentives.trim() || undefined,
        priceServices: priceServices.trim() || undefined,
        author: {
          name: (user as { displayName?: string })?.displayName || 'Admin',
          email: user?.email || 'admin@example.com',
          ...((user as { photoURL?: string })?.photoURL && { avatar: (user as { photoURL?: string }).photoURL })
        }
      };

      if (Object.keys(evDetails).length > 0) {
        productData.evDetails = evDetails;
      }
      if (Object.keys(evSpecs).length > 0) {
        productData.evSpecs = evSpecs;
      }
      if (Object.keys(evPowertrain).length > 0) {
        productData.evPowertrain = evPowertrain;
      }
      if (Object.keys(evPerformance).length > 0) {
        productData.evPerformance = evPerformance;
      }

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

      if (ownershipHighlights.length > 0) {
        productData.ownershipHighlights = ownershipHighlights;
      }

      const productId = await createProduct(productData);
      
      toast.success('Sản phẩm đã được tạo thành công!');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
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
              <h1 className="text-3xl font-bold">Create New Product</h1>
              <p className="text-gray-600">Add a new product to your inventory</p>
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
                      onChange={(e) => {
                        console.log('[NewProduct] name onChange', { value: e.target.value });
                        safeSetFormData(prev => ({ ...prev, name: e.target.value }));
                      }}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => {
                        console.log('[NewProduct] brand onChange', { value: e.target.value });
                        safeSetFormData(prev => ({ ...prev, brand: e.target.value }));
                      }}
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
                        safeSetFormData(prev => ({ ...prev, price: formatted }));
                      }}
                      onBlur={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        safeSetFormData(prev => ({ ...prev, price: formatted }));
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

                {/* Pricing Highlights */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Pricing Highlights</h3>
                    <p className="text-sm text-gray-500">Customize the incentive and service messages displayed beside the price.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priceIncentives">Incentive message</Label>
                      <Textarea
                        id="priceIncentives"
                        value={formData.priceIncentives}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, priceIncentives: e.target.value }))}
                        placeholder="e.g. Tax incentives & charging infrastructure support up to 120,000,000 VND"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priceServices">Service message</Label>
                      <Textarea
                        id="priceServices"
                        value={formData.priceServices}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, priceServices: e.target.value }))}
                        placeholder="e.g. Complimentary 3-year maintenance plan + 12 months of home charging service"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* EV Specifications */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">EV Performance &amp; Specs</h3>
                    <p className="text-sm text-gray-500">Highlight the key electric vehicle metrics that appear on the product page.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="evRange">Range</Label>
                      <Input
                        id="evRange"
                        value={formData.evRange}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evRange: e.target.value }))}
                        placeholder="e.g. 520 km WLTP"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evCharge">Rapid charging</Label>
                      <Input
                        id="evCharge"
                        value={formData.evCharge}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evCharge: e.target.value }))}
                        placeholder="e.g. 10-80% in 25 minutes (DC 250 kW)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evAcceleration">Acceleration</Label>
                      <Input
                        id="evAcceleration"
                        value={formData.evAcceleration}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evAcceleration: e.target.value }))}
                        placeholder="e.g. 0-100 km/h in 3.8 seconds"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evPower">Power output</Label>
                      <Input
                        id="evPower"
                        value={formData.evPower}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evPower: e.target.value }))}
                        placeholder="e.g. 420 kW (563 hp)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evDrivetrain">Drivetrain</Label>
                      <Input
                        id="evDrivetrain"
                        value={formData.evDrivetrain}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evDrivetrain: e.target.value }))}
                        placeholder="e.g. Dual Motor AWD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="evBattery">Battery tech</Label>
                      <Input
                        id="evBattery"
                        value={formData.evBattery}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, evBattery: e.target.value }))}
                        placeholder="e.g. 95 kWh solid-state battery"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Specifications (Thông số kỹ thuật)</h3>
                    <p className="text-sm text-gray-500">Capture detailed hardware information for Sunny Auto EVs.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specBatteryBrand">Battery Brand / Type</Label>
                      <Input
                        id="specBatteryBrand"
                        value={formData.specBatteryBrand}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specBatteryBrand: e.target.value }))}
                        placeholder="e.g. BYD blade battery"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specBatteryConfig">Battery Configuration</Label>
                      <Input
                        id="specBatteryConfig"
                        value={formData.specBatteryConfig}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specBatteryConfig: e.target.value }))}
                        placeholder="e.g. Mid-mounted charging and swapping integrated battery"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specEAxleType">e-Axle Type</Label>
                      <Input
                        id="specEAxleType"
                        value={formData.specEAxleType}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specEAxleType: e.target.value }))}
                        placeholder="e.g. Integrated e-axle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specVehicleController">Vehicle Controller</Label>
                      <Input
                        id="specVehicleController"
                        value={formData.specVehicleController}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specVehicleController: e.target.value }))}
                        placeholder="e.g. Weichai VCU vehicle controller"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specMotorType">Motor Type</Label>
                      <Input
                        id="specMotorType"
                        value={formData.specMotorType}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specMotorType: e.target.value }))}
                        placeholder="e.g. Permanent magnet synchronous motor"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specBrakingSystem">Braking System</Label>
                      <Input
                        id="specBrakingSystem"
                        value={formData.specBrakingSystem}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specBrakingSystem: e.target.value }))}
                        placeholder="e.g. Intelligent braking energy feedback system"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specChargingSpeed">Charging Speed</Label>
                      <Input
                        id="specChargingSpeed"
                        value={formData.specChargingSpeed}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specChargingSpeed: e.target.value }))}
                        placeholder="e.g. Charge up to 80% in 30 minutes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specExteriorDesign">Exterior Design</Label>
                      <Input
                        id="specExteriorDesign"
                        value={formData.specExteriorDesign}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specExteriorDesign: e.target.value }))}
                        placeholder="e.g. Closed grille design, drag coefficient cd 0.45"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specAutonomousLevel">Autonomous Driving Level</Label>
                      <Input
                        id="specAutonomousLevel"
                        value={formData.specAutonomousLevel}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specAutonomousLevel: e.target.value }))}
                        placeholder="e.g. Level 2 autonomous driving"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specWarranty">Warranty</Label>
                      <Input
                        id="specWarranty"
                        value={formData.specWarranty}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, specWarranty: e.target.value }))}
                        placeholder="e.g. 6 years or 300,000 km three-electric warranty"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Battery &amp; Powertrain</h3>
                    <p className="text-sm text-gray-500">Record detailed battery pack and motor output specifications.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="powerPackPower">PACK Power (kWh)</Label>
                      <Input
                        id="powerPackPower"
                        value={formData.powerPackPower}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerPackPower: e.target.value }))}
                        placeholder="e.g. 92 kWh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerPackEnergyDensity">PACK Energy Density (Wh/kg)</Label>
                      <Input
                        id="powerPackEnergyDensity"
                        value={formData.powerPackEnergyDensity}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerPackEnergyDensity: e.target.value }))}
                        placeholder="e.g. 210 Wh/kg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorRatedPower">Motor Rated Power (kW)</Label>
                      <Input
                        id="powerMotorRatedPower"
                        value={formData.powerMotorRatedPower}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerMotorRatedPower: e.target.value }))}
                        placeholder="e.g. 150 kW"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorPeakPower">Motor Peak Power (kW)</Label>
                      <Input
                        id="powerMotorPeakPower"
                        value={formData.powerMotorPeakPower}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerMotorPeakPower: e.target.value }))}
                        placeholder="e.g. 320 kW"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorRatedTorque">Motor Rated Torque (N·m)</Label>
                      <Input
                        id="powerMotorRatedTorque"
                        value={formData.powerMotorRatedTorque}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerMotorRatedTorque: e.target.value }))}
                        placeholder="e.g. 340 N·m"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="powerMotorPeakTorque">Motor Peak Torque (N·m)</Label>
                      <Input
                        id="powerMotorPeakTorque"
                        value={formData.powerMotorPeakTorque}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, powerMotorPeakTorque: e.target.value }))}
                        placeholder="e.g. 650 N·m"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Performance</h3>
                    <p className="text-sm text-gray-500">Outline top-level performance outputs and capabilities.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="perfCruisingRange">Cruising Range (km)</Label>
                      <Input
                        id="perfCruisingRange"
                        value={formData.perfCruisingRange}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, perfCruisingRange: e.target.value }))}
                        placeholder="e.g. 520 km"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfMaxSpeed">Maximum Speed (km/h)</Label>
                      <Input
                        id="perfMaxSpeed"
                        value={formData.perfMaxSpeed}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, perfMaxSpeed: e.target.value }))}
                        placeholder="e.g. 200 km/h"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perfLoadingCapacity">Loading Capacity (tons)</Label>
                      <Input
                        id="perfLoadingCapacity"
                        value={formData.perfLoadingCapacity}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, perfLoadingCapacity: e.target.value }))}
                        placeholder="e.g. 1.2 tons"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Ownership Experience &amp; Benefits</h3>
                    <p className="text-sm text-gray-500">Customize the concierge services showcased in the ownership section.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle1">Highlight #1 Title</Label>
                      <Input
                        id="ownershipTitle1"
                        value={formData.ownershipTitle1}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipTitle1: e.target.value }))}
                        placeholder="e.g. Schedule a test drive"
                      />
                      <Label htmlFor="ownershipDesc1" className="sr-only">Highlight #1 Description</Label>
                      <Textarea
                        id="ownershipDesc1"
                        value={formData.ownershipDesc1}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipDesc1: e.target.value }))}
                        placeholder="Describe the benefit in detail"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle2">Highlight #2 Title</Label>
                      <Input
                        id="ownershipTitle2"
                        value={formData.ownershipTitle2}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipTitle2: e.target.value }))}
                        placeholder="e.g. Flexible financing"
                      />
                      <Label htmlFor="ownershipDesc2" className="sr-only">Highlight #2 Description</Label>
                      <Textarea
                        id="ownershipDesc2"
                        value={formData.ownershipDesc2}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipDesc2: e.target.value }))}
                        placeholder="Detail financing perks or partner programs"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTitle3">Highlight #3 Title</Label>
                      <Input
                        id="ownershipTitle3"
                        value={formData.ownershipTitle3}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipTitle3: e.target.value }))}
                        placeholder="e.g. Download brochure"
                      />
                      <Label htmlFor="ownershipDesc3" className="sr-only">Highlight #3 Description</Label>
                      <Textarea
                        id="ownershipDesc3"
                        value={formData.ownershipDesc3}
                        onChange={(e) => safeSetFormData(prev => ({ ...prev, ownershipDesc3: e.target.value }))}
                        placeholder="Describe the documentation or concierge support"
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
                      onChange={(e) => {
                        console.log('[NewProduct] newFeature onChange', { value: e.target.value });
                        safeSetNewFeature(e.target.value);
                      }}
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
                  onImagesChange={(images) => {
                    console.log('[NewProduct] images onChange', { count: images.length });
                    safeSetFormData(prev => ({ ...prev, images }));
                  }}
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
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Product
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
