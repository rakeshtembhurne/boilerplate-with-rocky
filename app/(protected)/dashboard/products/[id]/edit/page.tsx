import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductForm from "@/components/forms/product-form";
import { getProduct } from "@/actions/product";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit product details",
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="space-y-4">
        <ProductForm product={product} isEdit={true} />
      </div>
    </div>
  );
}
