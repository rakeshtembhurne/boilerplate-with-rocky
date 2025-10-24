import type { Product } from "@/products/_types";
import type { ProductFormData } from "@/products/_validations/product";
import type { ApiSuccessResponse, ApiErrorResponse } from "@/products/_lib/api-response";

interface GetProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categories?: string[];
  statuses?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
}

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Handle API response and extract data
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const result: ApiSuccessResponse<T> | ApiErrorResponse = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data;
}

/**
 * Fetch all products with filtering and pagination
 */
export async function getProducts(params: GetProductsParams = {}): Promise<{
  products: Product[];
  pagination: PaginationMeta;
}> {
  const {
    page = 1,
    pageSize = 10,
    search = "",
    categories = [],
    statuses = [],
    sortBy = "createdAt",
    sortOrder = "desc",
    dateFrom = "",
    dateTo = "",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    search,
    sortBy,
    sortOrder,
  });

  if (categories.length > 0) {
    queryParams.set("categories", categories.join(","));
  }

  if (statuses.length > 0) {
    queryParams.set("statuses", statuses.join(","));
  }

  if (dateFrom) {
    queryParams.set("dateFrom", dateFrom);
  }

  if (dateTo) {
    queryParams.set("dateTo", dateTo);
  }

  const response = await fetch(`/api/products?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result: ApiSuccessResponse<Product[]> = await response.json();

  if (!result.success) {
    throw new Error("Failed to fetch products");
  }

  return {
    products: result.data,
    pagination: result.meta as PaginationMeta,
  };
}

/**
 * Fetch a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  const response = await fetch(`/api/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }

  return handleResponse<Product>(response);
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductFormData): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }

  return handleResponse<Product>(response);
}

/**
 * Update an existing product
 */
export async function updateProduct(id: string, data: ProductFormData): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }

  return handleResponse<Product>(response);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }
}

/**
 * Fetch product filters from database
 */
export interface ProductFilters {
  categories: string[];
  statuses: Array<{ value: string; label: string }>;
}

export async function getProductFilters(): Promise<ProductFilters> {
  const response = await fetch("/api/products/filters", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }

  return handleResponse<ProductFilters>(response);
}

/**
 * Fetch product statistics
 */
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStock: number;
  totalValue: number;
}

export async function getProductStats(params: {
  search?: string;
  categories?: string[];
  statuses?: string[];
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<ProductStats> {
  const { search = "", categories = [], statuses = [], dateFrom = "", dateTo = "" } = params;

  const queryParams = new URLSearchParams();

  if (search) {
    queryParams.set("search", search);
  }

  if (categories.length > 0) {
    queryParams.set("categories", categories.join(","));
  }

  if (statuses.length > 0) {
    queryParams.set("statuses", statuses.join(","));
  }

  if (dateFrom) {
    queryParams.set("dateFrom", dateFrom);
  }

  if (dateTo) {
    queryParams.set("dateTo", dateTo);
  }

  const response = await fetch(`/api/products/stats?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const result: ApiErrorResponse = await response.json();
    throw new Error(result.error.message);
  }

  return handleResponse<ProductStats>(response);
}
