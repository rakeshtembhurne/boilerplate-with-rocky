import { NextRequest } from "next/server";

import { fail, handleApiError, ok } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/session";
import { createItem, getItems } from "@/items/_lib/server-api";
import type { ItemStatus } from "@/items/_types";
import { itemSchema } from "@/items/_validations/item";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(
    50,
    Math.max(1, Number(searchParams.get("pageSize")) || 10),
  );
  const search = searchParams.get("search")?.trim() ?? "";
  const status = (searchParams.get("status") as ItemStatus | "ALL") ?? "ALL";

  const result = await getItems({ page, pageSize, search, status });
  return ok(result);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);

  try {
    const input = itemSchema.parse(await request.json());
    const item = await createItem(input);
    return ok(item, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
