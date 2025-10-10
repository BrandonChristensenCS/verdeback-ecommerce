// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import SearchBar from './SearchBar';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { messages } from '@/lib/messages';

/**
 * Header component with logo at left, flexible search center, and actions right.
 */
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b border-border p-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 flex-shrink-0">
          <Logo />
        </Link>
        <div className="flex-1 min-w-0 max-w-lg mx-4">
          <Suspense fallback={<input type="text" placeholder={messages.searchPlaceholder} aria-label={messages.searchAriaLabel} className="w-full px-3 py-2 bg-background border rounded-md text-text placeholder-text/50" />}>
            <SearchBar />
          </Suspense>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}