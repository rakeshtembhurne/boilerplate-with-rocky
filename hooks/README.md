# Filter Hooks Documentation

This directory contains custom React hooks for managing filter state with localStorage persistence.

## Overview

The filter system is designed to be modular and page-specific:
- **Page-specific filters** (e.g., product categories, statuses) - Only persist for that specific page
- **Global filters** (e.g., date ranges) - Persist across all pages in the app

## Hooks

### `usePageFilters<T>`

Manages page-specific filter state with localStorage persistence.

**Parameters:**
- `pageKey` (string): Unique identifier for the page (e.g., 'products', 'orders')
- `filterKey` (string): Specific filter identifier (e.g., 'categories', 'statuses')
- `defaultValue` (T): Fallback value if no stored or initial value exists
- `initialValue` (T, optional): Initial value from URL or other source (takes priority)

**Returns:** `[value, setValue]` - Standard React state tuple

**Example:**
```typescript
const [categories, setCategories] = usePageFilters<string[]>({
  pageKey: 'products',
  filterKey: 'categories',
  defaultValue: [],
  initialValue: urlCategories, // from URL params
});
```

**Storage Key Format:** `{pageKey}-filter-{filterKey}`
- Example: `products-filter-categories`

### `useGlobalFilter<T>`

Manages global app-wide filter state (e.g., date ranges) that persists across all pages.

**Parameters:**
- `filterKey` (string): Specific filter identifier
- `defaultValue` (T): Fallback value
- `initialValue` (T, optional): Initial value from URL

**Returns:** `[value, setValue]` - Standard React state tuple

**Example:**
```typescript
const [dateRange, setDateRange] = useGlobalFilter<DateRange | undefined>({
  filterKey: 'date-range',
  defaultValue: { from: startDate, to: endDate },
  initialValue: urlDateRange,
});
```

**Storage Key Format:** `global-filter-{filterKey}`
- Example: `global-filter-date-range`

## Utility Functions

### `clearPageFilters(pageKey: string)`

Clears all filters for a specific page from localStorage.

**Example:**
```typescript
clearPageFilters('products'); // Removes all products-filter-* keys
```

## Implementation Details

### Priority Order
1. **initialValue** (from URL params) - Highest priority
2. **localStorage** - Loaded on client-side mount
3. **defaultValue** - Fallback if nothing else exists

### Server-Side Rendering
- Hooks are safe for SSR - localStorage is only accessed on client-side
- Returns `defaultValue` or `initialValue` during server render
- Hydrates from localStorage on client mount

### Auto-Persistence
- Values are automatically saved to localStorage whenever they change
- No manual `localStorage.setItem()` calls needed

## Usage Examples

### Product List Filters
```typescript
// In components/dashboard/product-list.tsx
const urlCategories = searchParams.get("categories")?.split(",") || undefined;

const [selectedCategories, setSelectedCategories] = usePageFilters<string[]>({
  pageKey: "products",
  filterKey: "categories",
  defaultValue: [],
  initialValue: urlCategories,
});

// Update filter (automatically saves to localStorage)
setSelectedCategories(["Electronics", "Clothing"]);
```

### Global Date Range
```typescript
// In components/shared/date-range-picker.tsx
const urlDateFrom = searchParams.get("dateFrom");
const urlDateTo = searchParams.get("dateTo");
const initialDateRange = urlDateFrom && urlDateTo
  ? { from: new Date(urlDateFrom), to: new Date(urlDateTo) }
  : undefined;

const [dateRange, setDateRange] = useGlobalFilter<DateRange | undefined>({
  filterKey: "date-range",
  defaultValue: { from: defaultStart, to: defaultEnd },
  initialValue: initialDateRange,
});
```

## Benefits

1. **Type-safe** - Fully TypeScript compatible with generics
2. **Modular** - Page-specific filters don't pollute other pages
3. **Persistent** - Filters survive page navigation and browser refreshes
4. **URL-first** - URL params take priority over localStorage
5. **SSR-safe** - No localStorage access during server render
6. **Automatic** - No manual localStorage management needed
