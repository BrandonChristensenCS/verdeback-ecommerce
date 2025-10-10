// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import { fetchProducts } from '@/lib/dummyjson';
import { normalizeProducts } from '@/lib/productAdapter';
import { parseUrlState } from '@/lib/urlState';
import { filterProducts, computeFacets, getPriceRange } from '@/lib/filters';
import { sortProducts } from '@/lib/sort';
import Catalog from './(components)/Catalog';
import TopProducts from './(components)/TopProducts';

/**
 * Home page component that displays top products or filtered catalog based on URL params.
 * @param searchParams - Search parameters from the URL.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const urlSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  });

  const state = parseUrlState(urlSearchParams);

  // Check if any filters are active
  const hasFilters = state.q || state.category.length > 0 || state.brand.length > 0 ||
    state.priceMin !== undefined || state.priceMax !== undefined ||
    state.rating !== undefined || state.stock;

  console.log(`[PERF] Starting fetch for products in Home`);
  const data = await fetchProducts();
  console.log(`[PERF] Fetched data, starting normalization`);
  const allProducts = normalizeProducts(data);
  console.log(`[PERF] Normalized ${allProducts.length} products, preparing render`);
  console.log(`[VITALS] serverDataReady home`);

  if (params.view === 'all') {
    const sorted = sortProducts(allProducts, state.sort);
    const facets = computeFacets(sorted);
    const priceRange = getPriceRange(allProducts);
    return <Catalog products={sorted} facets={facets} priceRange={priceRange} />;
  } else if (hasFilters) {
    const filtered = filterProducts(allProducts, state);
    const sorted = sortProducts(filtered, state.sort);
    const facets = computeFacets(sorted);
    const priceRange = getPriceRange(allProducts);
    return <Catalog products={sorted} facets={facets} priceRange={priceRange} />;
  } else {
    const topProducts = [...allProducts].sort((a, b) => b.rating - a.rating).slice(0, 12);
    return <TopProducts products={topProducts} />;
  }
}
