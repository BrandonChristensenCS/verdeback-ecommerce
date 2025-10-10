// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

/**
 * Fetches all products with pagination.
 * @param limit - Number of products to fetch (default 100).
 * @param skip - Number of products to skip (default 0).
 * @returns Promise of the API response.
 */
export async function fetchProducts(limit = 100, skip = 0) {
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
  if (process.env.NODE_ENV !== 'production') {
    console.time(`fetchProducts-${limit}-${skip}`);
    console.log(`[PERF] Starting fetch for products: ${url}`);
  }

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // 1 hour
  });

  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(`fetchProducts-${limit}-${skip}`);
    console.log(`[PERF] Fetched products: ${url}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Searches products by query.
 * @param query - Search query string.
 * @returns Promise of the search response.
 */
export async function searchProducts(query: string) {
  const url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetches all product categories.
 * @returns Promise of array of category strings.
 */
export async function fetchCategories() {
  const url = 'https://dummyjson.com/products/categories';
  const response = await fetch(url, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches a product by ID.
 * @param id - Product ID.
 * @returns Promise of the product data.
 */
export async function fetchProductById(id: number) {
  const url = `https://dummyjson.com/products/${id}`;
  if (process.env.NODE_ENV !== 'production') {
    console.time(`fetchProductById-${id}`);
    console.log(`[PERF] Starting fetch for product ${id}: ${url}`);
  }

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(`fetchProductById-${id}`);
    console.log(`[PERF] Fetched product ${id}: ${url}`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}
