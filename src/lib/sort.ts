// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import type { Product } from './productAdapter';
import type { SortOption } from './urlState';

/**
 * Returns a new array sorted according to the given option.
 * @param products - Products to sort.
 * @param sort - Selected sort option.
 */
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  return [...products].sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating_desc':
        return b.rating - a.rating;
      case 'popularity':
        return b.id - a.id; // assuming higher id is newer/more popular
      default:
        return 0;
    }
  });
}
