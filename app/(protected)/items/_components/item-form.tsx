"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/shared/icons";

import { itemsApi } from "../_lib/api-client";
import { ITEM_STATUSES, type Item } from "../_types";
import { itemSchema } from "../_validations/item";

type FormValues = z.infer<typeof itemSchema>;

export function ItemForm({ initialItem }: { initialItem?: Item }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const isEdit = Boolean(initialItem);

  const form = useForm<FormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: initialItem
      ? {
          name: initialItem.name,
          description: initialItem.description ?? "",
          status: initialItem.status,
          price: initialItem.price,
          quantity: initialItem.quantity,
        }
      : {
          name: "",
          description: "",
          status: "DRAFT",
          price: 0,
          quantity: 0,
        },
  });

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      try {
        if (isEdit && initialItem) {
          await itemsApi.update(initialItem.id, values);
        } else {
          await itemsApi.create(values);
        }
        toast.success(isEdit ? "Item updated" : "Item created");
        router.push("/items");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border bg-card p-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Item name" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional description"
                  rows={3}
                  disabled={isPending}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ITEM_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={isPending}
                    {...field}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="1"
                    disabled={isPending}
                    {...field}
                    onChange={(event) =>
                      field.onChange(Math.trunc(event.target.valueAsNumber || 0))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/items">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Icons.spinner className="mr-2 size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
