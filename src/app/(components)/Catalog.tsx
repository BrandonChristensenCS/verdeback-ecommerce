// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Slider, SliderTrack, SliderRange, SliderThumb } from '@radix-ui/react-slider';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import type { Product } from '@/lib/productAdapter';
import { formatCurrency } from '@/lib/formatting';
import { getResultAnnouncement } from '@/lib/a11y';
import RatingDisplay from './RatingDisplay';

type CatalogProps = {
  products: Product[];
  facets: { categories: Record<string, number>; brands: Record<string, number> };
  priceRange: { min: number; max: number };
};

/**
 * Catalog component for displaying and filtering products.
 * @param products - Array of products to display.
 * @param facets - Facet data for categories and brands.
 * @param priceRange - Min and max price range.
 */
export default function Catalog({ products, facets, priceRange }: CatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategories = searchParams.get('category')?.split(',').filter(Boolean) || [];
  const currentBrands = searchParams.get('brand')?.split(',').filter(Boolean) || [];
  const currentPriceMin = searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : priceRange.min;
  const currentPriceMax = searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : priceRange.max;
  const currentStock = searchParams.get('stock') === '1';
  const currentSort = searchParams.get('sort') || 'price_asc';
  const [selectedCategories, setSelectedCategories] = useState(currentCategories);
  const [selectedBrands, setSelectedBrands] = useState(currentBrands);
  const [selectedPriceMin, setSelectedPriceMin] = useState(currentPriceMin);
  const [selectedPriceMax, setSelectedPriceMax] = useState(currentPriceMax);
  const [selectedStock, setSelectedStock] = useState(currentStock);
  const [minText, setMinText] = useState(searchParams.has('priceMin') ? Math.floor(currentPriceMin).toString() : '');
  const [maxText, setMaxText] = useState(searchParams.has('priceMax') ? Math.ceil(currentPriceMax).toString() : '');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF] Catalog component rendered with ${products.length} products at ${performance.now()}ms`);
    }
  }, [products.length]);

  /**
   * Applies the selected filters and updates the URL.
   */
  const handleApply = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (selectedCategories.length) {
      params.set('category', selectedCategories.join(','));
    } else {
      params.delete('category');
    }

    if (selectedBrands.length) {
      params.set('brand', selectedBrands.join(','));
    } else {
      params.delete('brand');
    }

    params.set('priceMin', Math.floor(selectedPriceMin).toString());
    params.set('priceMax', Math.ceil(selectedPriceMax).toString());

    if (selectedStock) {
      params.set('stock', '1');
    } else {
      params.delete('stock');
    }

    // Preserve sort if present; default maintained on server otherwise
    if (searchParams.get('sort')) {
      params.set('sort', searchParams.get('sort') as string);
    }

    // Ensure filtered branch is used; remove any explicit view that could bypass filters
    params.delete('view');
    params.delete('cursor');
    router.push(`/?${params.toString()}`);
  };

  /**
   * Handles sort option change and updates the URL.
   * @param newSort - The new sort option.
   */
  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('sort', newSort);
    router.push(`/?${params.toString()}`);
  };

  /**
   * Renders the categories filter section.
   * @param isMobile - Whether rendering for mobile dialog.
   */
  const renderCategories = (isMobile: boolean) => {
    const HeaderTag = isMobile ? 'h3' : 'h4';
    return (
      <div>
        <HeaderTag className="text-xl md:text-2xl font-bold mb-1">Categories</HeaderTag>
        <div className="space-y-2">
          {Object.entries(facets.categories).map(([cat, count]) => (
            <label key={cat} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCategories([...selectedCategories, cat]);
                  } else {
                    setSelectedCategories(selectedCategories.filter(c => c !== cat));
                  }
                }}
                className="mr-2"
              />
              <span className="truncate">{cat} <span className="text-text-muted">({count})</span></span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the availability (in stock) filter section.
   * @param isMobile - Whether rendering for mobile dialog.
   */
  const renderInStock = (isMobile: boolean) => {
    const HeaderTag = isMobile ? 'h3' : 'h4';
    return (
      <div>
        <HeaderTag className="text-xl md:text-2xl font-semibold mb-1">Availability</HeaderTag>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={selectedStock}
            onChange={(e) => setSelectedStock(e.target.checked)}
            className="mr-2"
          />
          In Stock Only
        </label>
      </div>
    );
  };

  /**
   * Renders the price range filter section.
   * @param isMobile - Whether rendering for mobile dialog.
   */
  const renderPriceRange = (isMobile: boolean) => {
    const HeaderTag = isMobile ? 'h3' : 'h4';
    return (
      <div>
        <HeaderTag className="text-xl md:text-2xl font-semibold mb-3">Price Range</HeaderTag>
        <div className="space-y-4">
          <div className={isMobile ? 'px-2 py-1' : 'py-1'}>
            <Slider
              value={[selectedPriceMin, selectedPriceMax]}
              onValueChange={([min, max]) => {
                setSelectedPriceMin(min);
                setSelectedPriceMax(max);
                setMinText(Math.floor(min).toString());
                setMaxText(Math.ceil(max).toString());
              }}
              min={priceRange.min}
              max={priceRange.max}
              step={1}
              className="relative flex w-full touch-none select-none items-center"
            >
              <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-text/20">
                <SliderRange className="absolute h-full bg-accent" />
              </SliderTrack>
              <SliderThumb className="block h-5 w-5 rounded-full bg-accent shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
              <SliderThumb className="block h-5 w-5 rounded-full bg-accent shadow-md focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
            </Slider>
          </div>
          <div className={`flex justify-between items-center ${isMobile ? 'px-2' : ''}`}>
            <input
              type="number"
              placeholder="Min"
              value={minText}
              onChange={(e) => {
                const value = e.target.value;
                setMinText(value);
                const num = parseFloat(value) || 0;
                setSelectedPriceMin(Math.max(priceRange.min, num));
              }}
              className="w-20 p-1 border rounded"
            />
            <span className="text-sm text-text-muted">to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxText}
              onChange={(e) => {
                const value = e.target.value;
                setMaxText(value);
                const num = parseFloat(value) || priceRange.max;
                setSelectedPriceMax(Math.min(priceRange.max, num));
              }}
              className="w-20 p-1 border rounded"
            />
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the brands filter section.
   * @param isMobile - Whether rendering for mobile dialog.
   */
  const renderBrands = (isMobile: boolean) => {
    const HeaderTag = isMobile ? 'h3' : 'h4';
    return (
      <div>
        <HeaderTag className="text-xl md:text-2xl font-semibold mb-1">Brands</HeaderTag>
        <div className="space-y-2">
          {Object.entries(facets.brands).map(([brand, count]) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
                className="mr-2"
              />
              <span className="truncate">{brand} ({count})</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the apply filters button.
   * @param isMobile - Whether rendering for mobile dialog.
   */
  const renderApplyButton = (isMobile: boolean) => (
    <button
      onClick={handleApply}
      className={`${isMobile ? '' : 'w-full'} px-4 py-2 bg-accent text-white rounded hover:bg-accent/90`}
    >
      Apply Filters
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex">
        {/* Desktop/Tablet sidebar (hidden on mobile) */}
  <aside className="hidden md:block w-64 p-4 border-r border">
          <div className="space-y-6">
            {renderInStock(false)}
            {renderCategories(false)}
            {renderPriceRange(false)}
            {renderBrands(false)}
            {renderApplyButton(false)}
          </div>
        </aside>
        <main className="flex-1 p-4">
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {getResultAnnouncement(products.length)}
        </div>
          {/* Mobile toolbar: Filters (left) and Sort (right) */}
          <div className="mb-3 flex items-center justify-between md:hidden">
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="px-3 py-2 text-sm font-medium border rounded bg-background hover:bg-text/5"
                  aria-label="Open filters"
                >
                  Filters
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed left-0 right-0 top-16 bottom-0 bg-black/40 z-40" />
                <Dialog.Content
                  className="fixed left-0 top-16 bottom-0 w-[85vw] max-w-sm bg-background p-4 shadow-xl outline-none z-50 transition-transform data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-2 flex-shrink-0">
                    <Dialog.Title className="text-lg font-semibold">Filters</Dialog.Title>
                    <Dialog.Close asChild>
                      <button type="button" className="p-2 text-sm border rounded hover:bg-text/5" aria-label="Close filters">
                        Close
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="space-y-6 overflow-y-auto pb-4 flex-1 min-h-0">
                    {renderInStock(true)}
                    {renderCategories(true)}
                    {renderPriceRange(true)}
                    {renderBrands(true)}
                  </div>
                  <div className="mt-4 flex-shrink-0">
                    <Dialog.Close asChild>
                      {renderApplyButton(true)}
                    </Dialog.Close>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 text-sm border rounded"
              aria-label="Sort products"
            >
              <option value="rating_desc">Top Rated</option>
              <option value="popularity">Popularity</option>
              <option value="price_asc">Price (Ascending)</option>
              <option value="price_desc">Price (Descending)</option>
            </select>
          </div>

          {/* Desktop toolbar (unchanged), hidden on mobile */}
          <div className="mb-4 hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Displaying {products.length} products</h1>
              <span aria-live="polite" className="text-sm text-text-muted" id="updating-label" hidden>
                Updating…
              </span>
            </div>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="rating_desc">Top Rated</option>
              <option value="popularity">Popularity</option>
              <option value="price_asc">Price (Ascending)</option>
              <option value="price_desc">Price (Descending)</option>
            </select>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, idx) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div className="border rounded-lg p-4 bg-background hover:bg-text/5 cursor-pointer border-border">
                   <div className="w-full aspect-[4/3] relative">
                     <Image src={product.thumbnail} alt={product.title} fill className="object-contain rounded" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" priority={idx === 0} />
                </div>
                <h2 className="text-lg font-semibold mt-2">{product.title}</h2>
                <p className="text-accent font-bold">{formatCurrency(product.price)}</p>
                <RatingDisplay rating={product.rating} />
              </div>
            </Link>
          ))}
        </div>
        </main>
      </div>
    </div>
  );
}
