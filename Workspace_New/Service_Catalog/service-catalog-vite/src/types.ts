// Product Types
export interface Product {
  id: number;
  name: string;
  code?: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  gender?: number;
  material?: string;
  goldKarat?: number;
  color?: string;
  size?: string;
  brand?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number;
  categoryName?: string;
  collectionId?: number;
  collectionName?: string;
  productImages: ProductImage[];
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  url?: string;
  description?: string;
  productIds?: number[];
}

// Collection Types
export interface Collection {
  id: number;
  name: string;
  description?: string;
  collectionImages?: CollectionImage[];
  productIds?: number[];
}

export interface CollectionImage {
  id: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

// Filter Types
export interface FilterOptions {
  brands: string[];
  materials: string[];
  sizes: string[];
  goldKarats: string[];
  colors: string[];
  minPrice?: number;
  maxPrice?: number;
}

export interface FilterState {
  brand?: string | null;
  material?: string | null;
  size?: string | null;
  goldKarat?: string | null;
  color?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  sortBy?: string;
}

// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}