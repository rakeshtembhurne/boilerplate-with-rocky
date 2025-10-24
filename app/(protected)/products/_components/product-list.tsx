"use client";

import * as React from "react";
import {
  ColumnsIcon,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  FilterIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { usePageFilters } from "@/hooks/use-page-filters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { deleteProduct, getProductFilters, type ProductFilters } from "../_lib/api-client";
import type { Product } from "../_types";

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ProductListProps {
  data: Product[];
  pagination: PaginationData;
}

function ProductActions({ product }: { product: Product }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product.id);
        toast.success("Product deleted successfully");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(product.id)}
        >
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`/products/${product.id}/edit`}
            className="w-full"
          >
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ProductList({ data, pagination }: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch filters from database
  const [filters, setFilters] = React.useState<ProductFilters>({ categories: [], statuses: [] });
  const [filtersLoaded, setFiltersLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadFilters() {
      try {
        const fetchedFilters = await getProductFilters();
        setFilters(fetchedFilters);
        setFiltersLoaded(true);
      } catch (error) {
        console.error("Failed to load filters:", error);
        toast.error("Failed to load filters");
      }
    }
    loadFilters();
  }, []);

  // Get initial values from URL
  const urlCategories = searchParams.get("categories")?.split(",").filter(Boolean) || undefined;
  const urlStatuses = searchParams.get("statuses")?.split(",").filter(Boolean) || undefined;

  // Use page-specific filters with localStorage persistence
  const [selectedCategories, setSelectedCategories] = usePageFilters<string[]>({
    pageKey: "products",
    filterKey: "categories",
    defaultValue: [],
    initialValue: urlCategories,
  });

  const [selectedStatuses, setSelectedStatuses] = usePageFilters<string[]>({
    pageKey: "products",
    filterKey: "statuses",
    defaultValue: [],
    initialValue: urlStatuses,
  });

  const [columnVisibility, setColumnVisibility] = usePageFilters({
    pageKey: "products",
    filterKey: "column-visibility",
    defaultValue: {
      sku: true,
      category: true,
      stock: true,
      price: true,
      status: true,
    },
  });

  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("search") || ""
  );

  const createQueryString = React.useCallback(
    (params: Record<string, string | number>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newSearchParams.set(key, String(value));
        } else {
          newSearchParams.delete(key);
        }
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const handleSearch = React.useCallback(
    (value: string) => {
      setSearchValue(value);
      const query = createQueryString({ search: value, page: 1 });
      router.push(`/products?${query}`);
    },
    [createQueryString, router]
  );

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      const query = createQueryString({ page: newPage });
      router.push(`/products?${query}`);
    },
    [createQueryString, router]
  );

  const handleCategoriesChange = React.useCallback(
    (categories: string[]) => {
      setSelectedCategories(categories);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (categories.length > 0) {
        newSearchParams.set("categories", categories.join(","));
      } else {
        newSearchParams.delete("categories");
      }
      newSearchParams.set("page", "1");
      router.push(`/products?${newSearchParams.toString()}`);
    },
    [router, searchParams, setSelectedCategories]
  );

  const handleStatusesChange = React.useCallback(
    (statuses: string[]) => {
      setSelectedStatuses(statuses);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (statuses.length > 0) {
        newSearchParams.set("statuses", statuses.join(","));
      } else {
        newSearchParams.delete("statuses");
      }
      newSearchParams.set("page", "1");
      router.push(`/products?${newSearchParams.toString()}`);
    },
    [router, searchParams, setSelectedStatuses]
  );

  // Sync localStorage filters to URL on mount (if URL doesn't have them)
  const hasSyncedRef = React.useRef(false);
  React.useEffect(() => {
    if (hasSyncedRef.current) return;

    const currentCategories = searchParams.get("categories");
    const currentStatuses = searchParams.get("statuses");

    const needsSync =
      (!currentCategories && selectedCategories.length > 0) ||
      (!currentStatuses && selectedStatuses.length > 0);

    if (needsSync) {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (selectedCategories.length > 0 && !currentCategories) {
        newSearchParams.set("categories", selectedCategories.join(","));
      }

      if (selectedStatuses.length > 0 && !currentStatuses) {
        newSearchParams.set("statuses", selectedStatuses.join(","));
      }

      router.replace(`/products?${newSearchParams.toString()}`);
      hasSyncedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        handleSearch(searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, searchParams, handleSearch]);

  const FilterSection = () => {
    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Status
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandInput placeholder="Status" className="h-9" />
              <CommandList>
                <CommandEmpty>No status found.</CommandEmpty>
                <CommandGroup>
                  {filters.statuses.map((status) => (
                    <CommandItem key={status.value} value={status.value}>
                      <div className="flex items-center space-x-3 py-1">
                        <Checkbox
                          id={status.value}
                          checked={selectedStatuses.includes(status.value)}
                          onCheckedChange={(checked) => {
                            const newStatuses = checked
                              ? [...selectedStatuses, status.value]
                              : selectedStatuses.filter((s) => s !== status.value);
                            handleStatusesChange(newStatuses);
                          }}
                        />
                        <label
                          htmlFor={status.value}
                          className="cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {status.label}
                        </label>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Category
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0">
            <Command>
              <CommandInput placeholder="Category" className="h-9" />
              <CommandList>
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup>
                  {filters.categories.map((category) => (
                    <CommandItem key={category} value={category}>
                      <div className="flex items-center space-x-3 py-1">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            const newCategories = checked
                              ? [...selectedCategories, category]
                              : selectedCategories.filter((c) => c !== category);
                            handleCategoriesChange(newCategories);
                          }}
                        />
                        <label
                          htmlFor={category}
                          className="cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </>
    );
  };

  // Active filters
  const hasDateFilter = searchParams.get("dateFrom") && searchParams.get("dateTo");
  const activeFiltersCount = selectedCategories.length + selectedStatuses.length + (searchValue ? 1 : 0) + (hasDateFilter ? 1 : 0);

  const handleClearFilters = () => {
    // Clear page-specific filters
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setSearchValue("");

    // Clear date range from localStorage (global filter)
    if (typeof window !== "undefined") {
      localStorage.removeItem("global-filter-date-range");
    }

    // Navigate to clean URL (this will clear all URL params including dateFrom/dateTo)
    router.push("/products");
  };

  return (
    <div className="w-full space-y-4">
      {/* Active Filters Display */}
      {(activeFiltersCount > 0 || hasDateFilter) && (
        <div className="flex items-center gap-2 flex-wrap bg-muted/30 border-2 border-muted p-3 rounded-lg shadow-sm">
          <strong className="text-sm font-bold">Active filters:</strong>

          {searchValue && (
            <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Search:</span>
              <span className="font-semibold text-primary">{searchValue}</span>
            </div>
          )}

          {selectedCategories.map((cat) => (
            <div key={cat} className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Category:</span>
              <span className="font-semibold text-primary">{cat}</span>
            </div>
          ))}

          {selectedStatuses.map((status) => (
            <div key={status} className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold text-primary capitalize">{status.toLowerCase()}</span>
            </div>
          ))}

          {hasDateFilter && (
            <div className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md text-sm">
              <span className="text-muted-foreground">Date range:</span>
              <span className="font-semibold text-primary">
                {new Date(searchParams.get("dateFrom")!).toLocaleDateString()} - {new Date(searchParams.get("dateTo")!).toLocaleDateString()}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="ml-auto h-7 px-2.5 text-xs border-destructive text-destructive hover:bg-destructive hover:text-white"
          >
            <X className="mr-1 h-3 w-3" />
            Clear filters
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex flex-1 gap-2">
          <Input
            placeholder="Search products..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-64"
          />
          <div className="hidden gap-2 md:flex">
            <FilterSection />
          </div>
          {/* Filter for mobile */}
          <div className="inline md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 p-4">
                <div className="grid space-y-2">
                  <FilterSection />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <span className="hidden lg:inline">Columns</span>
                <ColumnsIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.keys(columnVisibility).map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column}
                    className="capitalize"
                    checked={columnVisibility[column as keyof typeof columnVisibility]}
                    onCheckedChange={(value) =>
                      setColumnVisibility({
                        ...columnVisibility,
                        [column]: value,
                      })
                    }
                  >
                    {column}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              {columnVisibility.price && <TableHead>Price</TableHead>}
              {columnVisibility.category && <TableHead>Category</TableHead>}
              {columnVisibility.stock && <TableHead>Stock</TableHead>}
              {columnVisibility.sku && <TableHead>SKU</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  {columnVisibility.price && (
                    <TableCell>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(product.price))}
                    </TableCell>
                  )}
                  {columnVisibility.category && (
                    <TableCell className="capitalize">
                      {product.category || "-"}
                    </TableCell>
                  )}
                  {columnVisibility.stock && (
                    <TableCell>{product.stock}</TableCell>
                  )}
                  {columnVisibility.sku && (
                    <TableCell>{product.sku || "-"}</TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "ACTIVE"
                            ? "default"
                            : product.status === "DRAFT"
                            ? "secondary"
                            : "outline"
                        }
                        className="capitalize"
                      >
                        {product.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>
                    <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {data.length > 0
            ? (pagination.page - 1) * pagination.pageSize + 1
            : 0}{" "}
          to {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
          of {pagination.total} products
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            <div className="text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
