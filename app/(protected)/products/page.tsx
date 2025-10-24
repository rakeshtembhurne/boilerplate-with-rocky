"use client";

import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProductList from "./_components/product-list";
import { getProducts, getProductStats, type ProductStats } from "./_lib/api-client";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import type { Product } from "./_types";

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch products when search params change
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const page = Number(searchParams.get("page")) || 1;
        const search = searchParams.get("search") || "";
        const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
        const statuses = searchParams.get("statuses")?.split(",").filter(Boolean) || [];
        const dateFrom = searchParams.get("dateFrom") || "";
        const dateTo = searchParams.get("dateTo") || "";

        // Fetch products and stats in parallel
        const [productsData, statsData] = await Promise.all([
          getProducts({
            page,
            pageSize: 10,
            search,
            categories,
            statuses,
            dateFrom,
            dateTo,
          }),
          getProductStats({
            search,
            categories,
            statuses,
            dateFrom,
            dateTo,
          }),
        ]);

        setProducts(productsData.products);
        setPagination(productsData.pagination);
        setStats(statsData);
      } catch (error: any) {
        console.error("Failed to fetch products:", error);
        toast.error(error.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchParams]);

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
           <DateRangePicker />
          <Link href="/products/create">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {stats.totalProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Products</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {stats.activeProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Low Stock</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {stats.lowStock}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              ${stats.totalValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="pt-4">
        <ProductList data={products} pagination={pagination} />
      </div>
    </div>
  );
}
