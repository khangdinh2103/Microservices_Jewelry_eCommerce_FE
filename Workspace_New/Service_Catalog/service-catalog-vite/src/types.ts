export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface ProductFeature {
  id: number;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  variantType: string;
  variantValue: string;
  price: number;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  url?: string;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  collectionImages?: ProductImage[];
}

export interface Product {
  id: number;
  name: string;
  code: string;
  description: string;
  price: number;
  quantity: number;
  status: string;
  brand?: string;
  material?: string;
  goldKarat?: number;
  color?: string;
  size?: string;
  category?: Category;
  collection?: Collection;
  productImages?: ProductImage[];
  productFeatures?: ProductFeature[];
  productVariants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}