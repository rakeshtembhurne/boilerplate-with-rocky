import { NextRequest } from "next/server";

import { fail, handleApiError, ok } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/session";
import { deleteItem, getItem, updateItem } from "@/items/_lib/server-api";
import { itemSchema } from "@/items/_validations/item";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);

  const { id } = await params;
  const item = await getItem(id);
  if (!item) return fail("Item not found", 404);

  return ok(item);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);

  const { id } = await params;

  try {
    if (!(await getItem(id))) return fail("Item not found", 404);

    const input = itemSchema.parse(await request.json());
    const item = await updateItem(id, input);
    return ok(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const user = await getCurrentUser();
  if (!user) return fail("Unauthorized", 401);

  const { id } = await params;

  try {
    if (!(await getItem(id))) return fail("Item not found", 404);

    await deleteItem(id);
    return ok({ id });
  } catch (error) {
    return handleApiError(error);
  }
}
