import { Category, Collection, Product } from '../types';

const API_URL = 'http://localhost:8105/api';

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const fetchCategoryById = async (id: string | number): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  return response.json();
};

export const fetchProductsByCategoryId = async (id: string | number): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/categories/${id}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const fetchCollectionById = async (id: string | number): Promise<Collection> => {
  const response = await fetch(`${API_URL}/collections/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch collection');
  }
  return response.json();
};

export const fetchProductsByCollectionId = async (id: string | number): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/collections/${id}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchCategoryFilterOptions = async (id: string | number) => {
  const [brandsResponse, materialsResponse, sizesResponse, goldKaratsResponse, colorsResponse] = await Promise.all([
    fetch(`${API_URL}/categories/${id}/brands`),
    fetch(`${API_URL}/categories/${id}/materials`),
    fetch(`${API_URL}/categories/${id}/sizes`),
    fetch(`${API_URL}/categories/${id}/goldkarats`),
    fetch(`${API_URL}/categories/${id}/colors`)
  ]);

  const brands = await brandsResponse.json();
  const materials = await materialsResponse.json();
  const sizes = await sizesResponse.json();
  const goldKarats = await goldKaratsResponse.json();
  const colors = await colorsResponse.json();

  return {
    brands: brands.filter((brand: string) => brand !== null && brand !== ''),
    materials: materials.filter((material: string) => material !== null && material !== ''),
    sizes: sizes.filter((size: string) => size !== null && size !== ''),
    goldKarats: goldKarats.filter((karat: string) => karat !== null && karat !== ''),
    colors: colors.filter((color: string) => color !== null && color !== '')
  };
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  // Placeholder - adjust to actual endpoint when available
  const response = await fetch(`${API_URL}/products?featured=true&limit=8`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured products');
  }
  return response.json();
};

export const fetchSimilarProducts = async (productId: number, categoryId: number, collectionId?: number, brand?: string): Promise<Product[]> => {
  let url = `${API_URL}/products/${productId}/similar?categoryId=${categoryId}`;
  
  if (collectionId) {
    url += `&collectionId=${collectionId}`;
  }
  
  if (brand) {
    url += `&brand=${encodeURIComponent(brand)}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch similar products');
  }
  return response.json();
};