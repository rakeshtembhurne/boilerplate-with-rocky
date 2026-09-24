import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

import { ItemForm } from "../../_components/item-form";
import { getItem } from "../../_lib/server-api";

export const metadata = constructMetadata({
  title: "Edit Item",
  description: "Edit an item.",
});

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) notFound();

  return (
    <>
      <DashboardHeader heading="Edit Item" text={item.name} />
      <ItemForm initialItem={item} />
    </>
  );
}
