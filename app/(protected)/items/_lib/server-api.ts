import "server-only";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import type { Item as PrismaItem, Prisma } from "@/prisma/generated/client";
import type { Item, ItemStatus, Paginated } from "../_types";
import type { ItemInput } from "../_validations/item";

type ItemRow = PrismaItem;

export function serializeItem(row: ItemRow): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status as ItemStatus,
    price: row.price,
    quantity: row.quantity,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getItems({
  page = 1,
  pageSize = 10,
  search = "",
  status = "ALL",
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ItemStatus | "ALL";
} = {}): Promise<Paginated<Item>> {
  const where: Prisma.ItemWhereInput = {};
  if (search) where.name = { contains: search };
  if (status !== "ALL") where.status = status;

  const [rows, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.item.count({ where }),
  ]);

  return {
    data: rows.map(serializeItem),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export async function getItem(id: string): Promise<Item | null> {
  const row = await prisma.item.findUnique({ where: { id } });
  return row ? serializeItem(row) : null;
}

export async function createItem(input: ItemInput): Promise<Item> {
  const row = await prisma.item.create({ data: input });
  revalidatePath("/items");
  return serializeItem(row);
}

export async function updateItem(id: string, input: ItemInput): Promise<Item> {
  const row = await prisma.item.update({ where: { id }, data: input });
  revalidatePath("/items");
  return serializeItem(row);
}

export async function deleteItem(id: string): Promise<{ id: string }> {
  await prisma.item.delete({ where: { id } });
  revalidatePath("/items");
  return { id };
}
