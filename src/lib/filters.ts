// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import type { Product } from './productAdapter';
import type { UrlState } from './urlState';

/**
 * Filters products based on the provided filters.
 * @param products - Array of products to filter.
 * @param filters - Filter criteria.
 * @returns Filtered array of products.
 */
export function filterProducts(products: Product[], filters: UrlState): Product[] {
  return products.filter((product) => {
    let include = true;

    if (filters.q) {
      const query = filters.q.toLowerCase();
      const searchable = `${product.title} ${product.description} ${product.brand || ''} ${product.category}`.toLowerCase();

      if (!searchable.includes(query)) {
        include = false;
      }
    }

    // Category
    if (filters.category.length > 0 && !filters.category.includes(product.category)) {
      include = false;
    }

    // Brand
    if (filters.brand.length > 0 && (!product.brand || !filters.brand.includes(product.brand))) {
      include = false;
    }

    // Price range
    if (filters.priceMin !== undefined && product.price < filters.priceMin) {
      include = false;
    }
    if (filters.priceMax !== undefined && product.price > filters.priceMax) {
      include = false;
    }

    // Rating
    if (filters.rating !== undefined && product.rating < filters.rating) {
      include = false;
    }

    // Stock
    if (filters.stock && product.availabilityStatus !== "In Stock") {
      include = false;
    }

    return include;
  });
}


/**
 * Computes facet counts from the given products.
 * @param products - Array of products to compute facets from.
 * @returns Facet counts.
 */
export function computeFacets(products: Product[]) {
  const categories: Record<string, number> = {};
  const brands: Record<string, number> = {};

  for (const product of products) {
    categories[product.category] = (categories[product.category] || 0) + 1;
    if (product.brand) {
      brands[product.brand] = (brands[product.brand] || 0) + 1;
    }
  }

  return { categories, brands };
}

/**
 * Gets the price range from products.
 * @param products - Array of products.
 * @returns Min and max price.
 */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  let range = { min: 0, max: 0 };
  if (products.length !== 0) {
    const prices = products.map((p) => p.price);
    range = { min: Math.min(...prices), max: Math.max(...prices) };
  }

  return range;
}