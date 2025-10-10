// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

export type SortOption = 'price_asc' | 'price_desc' | 'rating_desc' | 'popularity';
export type ViewOption = 'grid' | 'list';

export type UrlState = {
  q: string;
  category: string[];
  brand: string[];
  priceMin: number | undefined;
  priceMax: number | undefined;
  rating: number | undefined;
  stock: boolean;
  sort: SortOption;
  view: ViewOption;
  cursor: string | undefined;
};

/**
 * Parses URLSearchParams into UrlState.
 * @param searchParams - The search params to parse.
 * @returns Parsed UrlState with defaults.
 */
export function parseUrlState(searchParams: URLSearchParams): UrlState {
  return {
    q: searchParams.get('q') || '',
    category: searchParams.get('category')?.split(',').filter(Boolean) || [],
    brand: searchParams.get('brand')?.split(',').filter(Boolean) || [],
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    stock: searchParams.get('stock') === '1',
    sort: (searchParams.get('sort') as SortOption) || 'price_asc',
    view: (searchParams.get('view') as ViewOption) || 'grid',
    cursor: searchParams.get('cursor') || undefined,
  };
}

/**
 * Creates URLSearchParams from partial UrlState.
 * @param state - Partial state to serialize.
 * @returns URLSearchParams object.
 */
export function createSearchParams(state: Partial<UrlState>): URLSearchParams {
  const params = new URLSearchParams();

  if (state.q) {
    params.set('q', state.q);
  }
  if (state.category?.length) {
    params.set('category', state.category.join(','));
  }
  if (state.brand?.length) {
    params.set('brand', state.brand.join(','));
  }
  if (state.priceMin !== undefined) {
    params.set('priceMin', state.priceMin.toString());
  }
  if (state.priceMax !== undefined) {
    params.set('priceMax', state.priceMax.toString());
  }
  if (state.rating !== undefined) {
    params.set('rating', state.rating.toString());
  }
  if (state.stock) {
    params.set('stock', '1');
  }
  if (state.sort) {
    params.set('sort', state.sort);
  }
  if (state.view) {
    params.set('view', state.view);
  }
  if (state.cursor) {
    params.set('cursor', state.cursor);
  }

  return params;
}