"use client";

import { useEffect, useState } from "react";

interface UsePageFiltersOptions<T> {
  pageKey: string; // Unique key for the page (e.g., 'products', 'orders')
  filterKey: string; // Specific filter key (e.g., 'categories', 'statuses')
  defaultValue: T;
  initialValue?: T; // Value from URL or other source
}

/**
 * Custom hook for managing page-specific filter state with localStorage persistence
 *
 * @example
 * const [categories, setCategories] = usePageFilters({
 *   pageKey: 'products',
 *   filterKey: 'categories',
 *   defaultValue: [],
 *   initialValue: urlCategories
 * });
 */
export function usePageFilters<T>({
  pageKey,
  filterKey,
  defaultValue,
  initialValue,
}: UsePageFiltersOptions<T>): [T, (value: T) => void] {
  const storageKey = `${pageKey}-filter-${filterKey}`;

  const [value, setValue] = useState<T>(() => {
    // Priority: initialValue (from URL) > localStorage > defaultValue
    if (initialValue !== undefined) {
      return initialValue;
    }

    // Only access localStorage on client side
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Persist to localStorage whenever value changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${storageKey} to localStorage:`, error);
    }
  }, [value, storageKey]);

  return [value, setValue];
}

/**
 * Hook for managing global app-wide filters (like date range)
 * These persist across all pages
 */
export function useGlobalFilter<T>({
  filterKey,
  defaultValue,
  initialValue,
}: Omit<UsePageFiltersOptions<T>, "pageKey">): [T, (value: T) => void] {
  return usePageFilters({
    pageKey: "global",
    filterKey,
    defaultValue,
    initialValue,
  });
}

/**
 * Utility to clear all filters for a specific page
 */
export function clearPageFilters(pageKey: string) {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(`${pageKey}-filter-`)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}
