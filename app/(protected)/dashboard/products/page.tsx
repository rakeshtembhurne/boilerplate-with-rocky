import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ProductList from "@/components/dashboard/product-list";
import { getProducts } from "@/actions/product";
import { prisma } from "@/lib/db";
import { DateRangePicker } from "@/components/shared/date-range-picker";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
};

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categories?: string;
    statuses?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const categories = params.categories ? params.categories.split(",") : [];
  const statuses = params.statuses ? params.statuses.split(",") : [];
  const dateFrom = params.dateFrom || "";
  const dateTo = params.dateTo || "";

  const { products, pagination } = await getProducts({
    page,
    pageSize: 10,
    search,
    categories,
    statuses,
    dateFrom,
    dateTo,
  });

  // Calculate stats from all products (not just current page)
  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({
    where: { status: "ACTIVE" },
  });
  const lowStock = await prisma.product.count({
    where: { stock: { lt: 10 } },
  });

  // Calculate total value using raw query for better performance
  const totalValueResult = await prisma.$queryRaw<Array<{ total: number }>>`
    SELECT COALESCE(SUM(CAST(price AS NUMERIC) * stock), 0) as total FROM products
  `;
  const totalValue = Number(totalValueResult[0]?.total || 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <Link href="/dashboard/products/create">
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
              {totalProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active Products</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {activeProducts}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Low Stock</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              {lowStock}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-2xl lg:text-3xl">
              ${totalValue.toFixed(2)}
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
