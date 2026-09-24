export const ITEM_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

export type ItemStatus = (typeof ITEM_STATUSES)[number];

export interface Item {
  id: string;
  name: string;
  description: string | null;
  status: ItemStatus;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
