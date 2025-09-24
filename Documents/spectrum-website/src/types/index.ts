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
}

export type ProductCategory = 
  | 'sunglasses'
  | 'eyeglasses'
  | 'reading-glasses'
  | 'contact-lenses'
  | 'accessories';

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
