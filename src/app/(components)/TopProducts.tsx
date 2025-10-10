// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { Product } from '@/lib/productAdapter';
import { formatCurrency } from '@/lib/formatting';
import Logo from './Logo';
import RatingDisplay from './RatingDisplay';
import Image from 'next/image';

type TopProductsProps = {
  products: Product[];
};

/**
 * TopProducts component for displaying top-rated products on the homepage.
 * @param products - Array of top products to display.
 */
export default function TopProducts({ products }: TopProductsProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[PERF] TopProducts component rendered with ${products.length} products at ${performance.now()}ms`);
    }
  }, [products.length]);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          Welcome to <Logo />
        </h1>
  <p className="text-text-muted">Discover top rated products!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <Link key={product.id} href={`/product/${product.id}`} prefetch className="block">
            <div className="border border-border rounded-lg p-4 bg-background hover:bg-text/5">
              <div className="w-full aspect-[4/3] relative mb-3">
                <Image src={product.thumbnail} alt={product.title} fill className="object-contain rounded" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" priority={idx === 0} />
              </div>
              <h2 className="text-lg font-semibold mb-1 line-clamp-2">{product.title}</h2>
              <p className="text-accent font-bold text-lg">{formatCurrency(product.price)}</p>
              <RatingDisplay rating={product.rating} />
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/?view=all" className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium">
          View All Products
        </Link>
      </div>
    </main>
  );
}