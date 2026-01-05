// Product Types for Basho E-commerce

export type ProductCategory = 'tableware' | 'decor' | 'custom';

export type GlazeColor = {
  name: string;
  code: string; // hex color code
};

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  longDescription?: string;
  price: number;
  images: string[]; // array of image paths
  availableColors: GlazeColor[];
  features: string[];
  dimensions?: {
    diameter?: string;
    height?: string;
    capacity?: string;
  };
  materials: string[];
  careInstructions: string[];
  isFoodSafe: boolean;
  isMicrowaveSafe: boolean;
  isDishwasherSafe: boolean;
  isCustomizable: boolean;
  stock: number;
  weight: number; // in kg for shipping calculation
  featured?: boolean;
  relatedProducts?: string[]; // array of product IDs
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: GlazeColor;
}

export interface ShippingDetails {
  weightInKg: number;
  shippingCost: number;
  estimatedDelivery: string;
}