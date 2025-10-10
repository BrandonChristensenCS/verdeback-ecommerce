// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import Skeleton from './(components)/Skeleton';

/**
 * Route Loading UI for the home/catalog page.
 * Minimal, static placeholders sized to match final layout.
 * Avoids any animations to keep low-end devices feeling snappy.
 */
export default function Loading() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* Mark when loading UI is shown (runs before hydration) */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          window.__perfMarks = window.__perfMarks || {};
          window.__perfMarks.loadingShown = performance.now();
          console.log('[VITALS] loadingShown', window.__perfMarks.loadingShown);
          var el = document.getElementById('updating-label');
          if (el) el.hidden = false;
        })();
      ` }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-background">
            <Skeleton className="w-full aspect-[4/3] mb-3" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </main>
  );
}