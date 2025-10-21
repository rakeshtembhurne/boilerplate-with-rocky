"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productSchema, ProductFormData } from "@/lib/validations/product";
import { createProduct, updateProduct } from "@/actions/product";
import type { Product } from "types";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      description: product?.description || "",
      price: product?.price || "",
      discountedPrice: product?.discountedPrice || "",
      stock: product?.stock?.toString() || "0",
      category: product?.category || "",
      subCategory: product?.subCategory || "",
      status: product?.status || "DRAFT",
      inStock: product?.inStock ?? true,
      chargeTax: product?.chargeTax ?? false,
    },
  });

  async function onSubmit(data: ProductFormData) {
    setIsLoading(true);
    try {
      const result = isEdit && product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (result.status === "success") {
        toast.success(
          isEdit ? "Product updated successfully" : "Product created successfully"
        );
        router.push("/dashboard/products");
        router.refresh();
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex flex-col justify-between space-y-4 lg:flex-row lg:items-center lg:space-y-2">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/products">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit ? "Edit Product" : "Add Product"}
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/dashboard/products")}
            >
              Discard
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-6">
          <div className="space-y-4 lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Set a description to the product for better visibility.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    name="price"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="discountedPrice"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discounted Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="chargeTax"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chargeTax"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="chargeTax"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Charge tax on this product
                        </label>
                      </div>
                    )}
                  />
                  <hr />
                  <FormField
                    name="inStock"
                    control={form.control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="inStock"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="inStock">In stock</Label>
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Set the product status.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Electronics">Electronics</SelectItem>
                                <SelectItem value="Clothing">Clothing</SelectItem>
                                <SelectItem value="Accessories">Accessories</SelectItem>
                                <SelectItem value="Beauty">Beauty</SelectItem>
                                <SelectItem value="Technology">Technology</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="subCategory"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter sub category" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
