// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

export const messages = {
  searchPlaceholder: 'Search verdeback...',
  searchAriaLabel: 'Search for verdeback products',

  filtersTitle: 'Filters',
  categoryLabel: 'Category',
  brandLabel: 'Brand',
  priceLabel: 'Price Range',
  ratingLabel: 'Minimum Rating',
  stockLabel: 'In Stock Only',
  clearAll: 'Clear All',
  applyFilters: 'Apply',

  sortLabel: 'Sort by',
  sortOptions: {
    price_asc: 'Price: Low to High',
    price_desc: 'Price: High to Low',
    rating_desc: 'Rating: High to Low',
    newest: 'Newest',
  },

  resultsCount: (count: number) => `${count} product${count === 1 ? '' : 's'}`,
  noResults: (query: string) => `No matches for "${query}". Try fewer filters or check spelling.`,
  loadingResults: 'Loading products...',

  errorNetwork: 'We couldn\'t load products. Please check your connection and try again.',
  errorServer: 'Something went wrong on our side. Please try again in a moment.',
  refreshing: 'Here are your results while we update.',

  tryAgain: 'Try Again',

  resultCountAnnouncement: (count: number) => `${count} product${count === 1 ? '' : 's'} found.`,
} as const;