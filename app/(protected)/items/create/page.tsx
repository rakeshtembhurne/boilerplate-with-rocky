import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

import { ItemForm } from "../_components/item-form";

export const metadata = constructMetadata({
  title: "New Item",
  description: "Create a new item.",
});

export default function CreateItemPage() {
  return (
    <>
      <DashboardHeader heading="New Item" text="Create a new item." />
      <ItemForm />
    </>
  );
}
