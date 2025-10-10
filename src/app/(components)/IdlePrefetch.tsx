// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * IdlePrefetch component
 * Prefetches common routes and a subset of product detail pages when the browser is idle.
 * Kept out of the critical path to avoid affecting initial render.
 *
 * Props:
 * - productIds: number[] — candidate product IDs to prefetch (first few used).
 */
export default function IdlePrefetch({ productIds }: { productIds: number[] }) {
  const router = useRouter();

  useEffect(() => {
    const prefetchAll = () => {
      try {
        router.prefetch('/?view=all');
        productIds.slice(0, 6).forEach((id) => router.prefetch(`/product/${id}`));
      } catch {}
    };

    let idleId: number | undefined;
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
      setTimeout: (cb: () => void, ms: number) => number;
      clearTimeout: (id: number) => void;
    };

    if (w.requestIdleCallback) {
      idleId = w.requestIdleCallback(prefetchAll);
    } else {
      idleId = w.setTimeout(prefetchAll, 1000);
    }

    return () => {
      if (idleId !== undefined) {
        if (w.cancelIdleCallback) {
          w.cancelIdleCallback(idleId);
        } else {
          w.clearTimeout(idleId);
        }
      }
    };
  }, [productIds, router]);

  return null;
}