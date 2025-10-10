// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import Skeleton from '@/app/(components)/Skeleton';

/**
 * Route Loading UI for the product detail page.
 * Minimal, static placeholders to match final content without jank.
 */
export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          window.__perfMarks = window.__perfMarks || {};
          window.__perfMarks.loadingShown = performance.now();
          console.log('[VITALS] loadingShown', window.__perfMarks.loadingShown);
          var el = document.getElementById('updating-label');
          if (el) el.hidden = false;
        })();
      ` }} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <div>
          <Skeleton className="h-8 w-3/4 mb-3" />
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </main>
  );
}