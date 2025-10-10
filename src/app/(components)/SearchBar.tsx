// © 2025 Brandon Christensen. All rights reserved.
// License: Proprietary (no license granted). Do not distribute.

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { messages } from '@/lib/messages';
import { useEffect, useRef, useState } from 'react';

type ProductFromAPI = {
  title?: string;
  brand?: string;
  category?: string;
};

type APIResponse = {
  products: ProductFromAPI[];
};

/**
 * SearchBar component for product search with predictive dropdown.
 */
export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cache = useRef<Map<string, APIResponse>>(new Map());
  const debounceRef = useRef<number | null>(null);

  // Debounce prefetch suggestions
  useEffect(() => {
    if (!inputValue.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const timer = window.setTimeout(async () => {
      const query = inputValue.trim();
      if (cache.current.has(query)) {
        const data = cache.current.get(query)!;
        const suggs = extractSuggestions(data.products);
        setSuggestions(suggs);
        setShowDropdown(isFocused && suggs.length > 0);
      } else {
        try {
          const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=8`);
          const data: APIResponse = await response.json();
          cache.current.set(query, data);
          const suggs = extractSuggestions(data.products);
          setSuggestions(suggs);
          setShowDropdown(isFocused && suggs.length > 0);
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to fetch suggestions:', error);
          }
        }
      }
    }, 150);
    debounceRef.current = timer;

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [inputValue, isFocused]);

  /**
   * Extracts unique suggestions from products.
   * @param products - Array of products from API.
   * @returns Array of unique suggestion strings.
   */
  const extractSuggestions = (products: ProductFromAPI[]): string[] => {
    const set = new Set<string>();
    for (const product of products) {
      if (product.title) {
        set.add(product.title);
      }
      if (product.brand) {
        set.add(product.brand);
      }
      if (product.category) {
        set.add(product.category);
      }
      if (set.size >= 8) {
        break;
      }
    }
    return Array.from(set).slice(0, 8);
  };

  /**
   * Submits the search query and navigates to results.
   * @param query - The search query string.
   */
  const handleSubmit = (query: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));

    if (query) {
      // When searching explicitly, ensure we don't force the all-products view
      params.set('q', query);
      params.delete('view');
    } else {
      // No query: route to the all-products catalog view
      params.delete('q');
      params.set('view', 'all');
    }

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');

    // Proactively dismiss dropdown and cancel any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    setIsFocused(false);
  };

  /**
   * Handles keyboard events for navigation and submission.
   * @param e - The keyboard event.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSubmit(suggestions[selectedIndex]);
      } else {
        handleSubmit(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  useEffect(() => {
    /**
     * Handles global keyboard shortcuts.
     * @param e - The keyboard event.
     */
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target === document.body) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Keep input in sync with the URL (e.g., when clicking a suggestion or pressing Enter)
  // Also dismiss the dropdown on URL changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setInputValue(q);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setIsFocused(false);
    setSuggestions([]);
  }, [searchParams.toString()]);

  // Close dropdown whenever URL search params change (navigation within /)
  // This covers the case where pathname stays `/` but `?q=...` updates.
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    setShowDropdown(false);
    setSelectedIndex(-1);
  }, [searchParams.toString()]);

  // Dismiss on outside click
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(e.target as Node)) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }

        setShowDropdown(false);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', onDocMouseDown, true);
    return () => document.removeEventListener('mousedown', onDocMouseDown, true);
  }, []);

  const activeId = selectedIndex >= 0 && suggestions[selectedIndex] ? `suggestion-${selectedIndex}` : undefined;

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsFocused(true);
          setShowDropdown(suggestions.length > 0);
        }}
        onBlur={() => setTimeout(() => {
          setIsFocused(false);
          setShowDropdown(false);
        }, 200)}
        placeholder={messages.searchPlaceholder}
        aria-label={messages.searchAriaLabel}
        role="combobox"
        aria-controls="search-suggestions"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
  className="w-full px-3 py-2 bg-background border rounded-md text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 bg-background border rounded-md mt-1 max-h-60 overflow-y-auto z-10 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`px-3 py-2 cursor-pointer hover:bg-text/5 ${index === selectedIndex ? 'bg-text/10' : ''}`}
              onMouseDown={(e) => { e.preventDefault(); handleSubmit(suggestion); }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}