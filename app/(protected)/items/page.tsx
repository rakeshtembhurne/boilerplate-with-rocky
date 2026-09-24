import { DashboardHeader } from "@/components/dashboard/header";
import { constructMetadata } from "@/lib/utils";

import { ItemList } from "./_components/item-list";
import { getItems } from "./_lib/server-api";
import type { ItemStatus } from "./_types";

export const metadata = constructMetadata({
  title: "Items",
  description: "Create, edit, and delete items.",
});

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search ?? "";
  const status = (params.status as ItemStatus | "ALL") ?? "ALL";

  const result = await getItems({ page, search, status });

  return (
    <>
      <DashboardHeader
        heading="Items"
        text="Create, edit, and delete items."
      />
      <ItemList result={result} search={search} status={status} />
    </>
  );
}
