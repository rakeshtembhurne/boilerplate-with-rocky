import type { Item, ItemStatus, Paginated } from "../_types";
import type { ItemInput } from "../_validations/item";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.success) {
    throw new Error(json?.error ?? `Request failed (${response.status})`);
  }

  return json.data as T;
}

export const itemsApi = {
  list: (params: { page?: number; search?: string; status?: ItemStatus | "ALL" } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    return request<Paginated<Item>>(`/api/items?${query.toString()}`);
  },
  get: (id: string) => request<Item>(`/api/items/${id}`),
  create: (input: ItemInput) =>
    request<Item>("/api/items", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: ItemInput) =>
    request<Item>(`/api/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) =>
    request<{ id: string }>(`/api/items/${id}`, { method: "DELETE" }),
};
