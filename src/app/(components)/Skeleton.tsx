// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

import React from 'react';

/**
 * Skeleton component for loading placeholders.
 * @param className - Additional CSS classes.
 */
export default function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-text/10 rounded ${className}`} />;
}
