import { Metadata } from "next";
import ProductForm from "../_components/product-form";

export const metadata: Metadata = {
  title: "Add Product",
  description: "Add a new product to your inventory",
};

export default function CreateProductPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="space-y-4">
        <ProductForm />
      </div>
    </div>
  );
}
