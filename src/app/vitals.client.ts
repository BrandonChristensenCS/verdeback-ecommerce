// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";

// Simple in-memory timing marks
declare global {
  interface Window {
    __perfMarks?: Record<string, number>;
  }
}

const marks: Record<string, number> = {};
if (typeof window !== 'undefined') {
  window.__perfMarks = marks;
}

/**
 * React client component that installs performance logging for the app.
 */
export function VitalsAndTiming() {
  const router = useRouter();
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    console.log(`[VITALS] ${metric.name}`, metric.value, metric);
  });

  useEffect(() => {
    // Navigation timing stamps
    const handleComplete = () => {
      marks['contentPaint'] = performance.now();
      console.log('[VITALS] contentPaint', marks['contentPaint']);

      if (marks['loadingShown']) {
        console.log('[VITALS] delay: loader->content', marks['contentPaint'] - marks['loadingShown']);
      }
      if (marks['navStart']) {
        console.log('[VITALS] delay: navStart->content', marks['contentPaint'] - marks['navStart']);
      }

      const el = document.getElementById('updating-label');
      if (el) {
        el.hidden = true;
      }
    };

    // Mark hydration paint for current route
    requestAnimationFrame(() => handleComplete());

    // Prefetch on idle: home/catalog and top products links
    const idleId: number | undefined = window.requestIdleCallback?.(() => {
      try {
        router.prefetch('/?view=all');
      } catch {
        // Ignore prefetch errors
      }
    });

    return () => {
      if (typeof idleId === 'number' && window.cancelIdleCallback) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [pathname, router]);

  return null;
}

/**
 * Marks the time when the loading UI becomes visible.
 */
export function markLoadingShown() {
  marks['loadingShown'] = performance.now();
  console.log('[VITALS] loadingShown', marks['loadingShown']);
}

/**
 * Marks when server data is ready (server-side log triggers).
 */
export function markDataReady() {
  marks['dataReady'] = performance.now();
  console.log('[VITALS] dataReady', marks['dataReady']);
}

/**
 * Marks the start of navigation (used if needed from other client code).
 */
export function markNavStart() {
  marks['navStart'] = performance.now();
  console.log('[VITALS] navStart', marks['navStart']);
}