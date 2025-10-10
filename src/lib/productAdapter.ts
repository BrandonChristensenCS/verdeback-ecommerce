// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import { z } from 'zod';

/**
 * Normalized Product type.
 */
export type Product = {
  id: number;
  title: string;
  description: string;
  brand: string | null;
  category: string;
  price: number;
  discountPercentage: number | null;
  rating: number;
  stock: number | null;
  sku: string | null;
  weight: number | null;
  dimensions: { width: number; height: number; depth: number } | null;
  tags: string[] | null;
  warrantyInformation: string | null;
  shippingInformation: string | null;
  availabilityStatus: string | null;
  returnPolicy: string | null;
  thumbnail: string;
  images: string[];
  reviews: { rating: number; comment: string; date: string; reviewerName: string; reviewerEmail: string }[] | null;
};

/**
 * Zod schema for a raw DummyJSON product.
 */
const RawProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  brand: z.string().nullable().optional(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.number().min(0).max(5),
  stock: z.number().nullable().optional(),
  sku: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  warrantyInformation: z.string().optional(),
  shippingInformation: z.string().optional(),
  availabilityStatus: z.string().optional(),
  returnPolicy: z.string().optional(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  reviews: z.array(z.object({
    rating: z.number(),
    comment: z.string(),
    date: z.string(),
    reviewerName: z.string(),
    reviewerEmail: z.string(),
  })).optional(),
});

/**
 * Zod schema for the products API response.
 */
const ProductsResponseSchema = z.object({
  products: z.array(RawProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

/**
 * Normalizes raw DummyJSON products data to an array of Product objects.
 * Filters out invalid products and logs errors gracefully.
 * @param data - Raw data from DummyJSON API.
 * @returns Array of valid Product objects.
 */
export function normalizeProducts(data: unknown): Product[] {
  const parseResult = ProductsResponseSchema.safeParse(data);
  if (!parseResult.success) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Invalid products data:', parseResult.error);
    }
    return [];
  }

  return parseResult.data.products.map((raw) => ({
    id: raw.id,
    title: raw.title,
    description: raw.description,
    brand: raw.brand ?? null,
    category: raw.category,
    price: raw.price,
    discountPercentage: raw.discountPercentage ?? null,
    rating: raw.rating,
    stock: raw.stock ?? null,
    sku: raw.sku ?? null,
    weight: raw.weight ?? null,
    dimensions: raw.dimensions ?? null,
    tags: raw.tags ?? null,
    warrantyInformation: raw.warrantyInformation ?? null,
    shippingInformation: raw.shippingInformation ?? null,
    availabilityStatus: raw.availabilityStatus ?? null,
    returnPolicy: raw.returnPolicy ?? null,
    thumbnail: raw.thumbnail,
    images: raw.images,
    reviews: raw.reviews ?? null,
  }));
}

/**
 * Normalizes a single raw DummyJSON product to Product.
 * @param data - Raw product data.
 * @returns Normalized Product.
 */
export function normalizeProduct(data: unknown): Product {
  const parseResult = RawProductSchema.safeParse(data);
  if (!parseResult.success) {
    throw new Error('Invalid product data');
  }

  const raw = parseResult.data;
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    brand: raw.brand ?? null,
    category: raw.category,
    price: raw.price,
    discountPercentage: raw.discountPercentage ?? null,
    rating: raw.rating,
    stock: raw.stock ?? null,
    sku: raw.sku ?? null,
    weight: raw.weight ?? null,
    dimensions: raw.dimensions ?? null,
    tags: raw.tags ?? null,
    warrantyInformation: raw.warrantyInformation ?? null,
    shippingInformation: raw.shippingInformation ?? null,
    availabilityStatus: raw.availabilityStatus ?? null,
    returnPolicy: raw.returnPolicy ?? null,
    thumbnail: raw.thumbnail,
    images: raw.images,
    reviews: raw.reviews ?? null,
  };
}
