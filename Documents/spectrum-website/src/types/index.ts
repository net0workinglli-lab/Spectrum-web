// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: ProductCategory;
  brand: string;
  features: string[];
  inStock: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: Date;
  updatedAt: Date;
  evDetails?: ProductEvDetails;
  priceIncentives?: string;
  priceServices?: string;
  evSpecs?: ProductEvSpecs;
  evPowertrain?: ProductEvPowertrain;
  evPerformance?: ProductEvPerformance;
  ownershipHighlights?: ProductOwnershipHighlight[];
}

export interface ProductEvDetails {
  range?: string;
  charge?: string;
  acceleration?: string;
  power?: string;
  drivetrain?: string;
  battery?: string;
}

export interface ProductEvSpecs {
  batteryBrand?: string;
  batteryConfig?: string;
  eAxleType?: string;
  vehicleController?: string;
  motorType?: string;
  brakingSystem?: string;
  chargingSpeed?: string;
  exteriorDesign?: string;
  autonomousLevel?: string;
  warranty?: string;
}

export interface ProductEvPowertrain {
  packPower?: string;
  packEnergyDensity?: string;
  motorRatedPower?: string;
  motorPeakPower?: string;
  motorRatedTorque?: string;
  motorPeakTorque?: string;
}

export interface ProductEvPerformance {
  cruisingRange?: string;
  maxSpeed?: string;
  loadingCapacity?: string;
}

export interface ProductOwnershipHighlight {
  title?: string;
  description?: string;
  icon?: string;
}

export type ProductCategory = 
  | 'sunglasses'
  | 'eyeglasses'
  | 'reading-glasses'
  | 'contact-lenses'
  | 'accessories'
  | 'electric-suv'
  | 'electric-sedan'
  | 'electric-crossover'
  | 'electric-truck'
  | 'electric-vehicle';

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  category: BlogCategory;
  published: boolean;
}

export type BlogCategory = 
  | 'eye-care'
  | 'fashion'
  | 'technology'
  | 'lifestyle'
  | 'health';

// Collection types
export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products: string[]; // Product IDs
  featured: boolean;
  createdAt: Date;
}

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  selectedOptions?: {
    color?: string;
    size?: string;
    prescription?: string;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
