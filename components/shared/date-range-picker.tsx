"use client";

import * as React from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  startOfYear,
  startOfWeek,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";

import { useGlobalFilter } from "@/hooks/use-page-filters";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dateFilterPresets = [
  { name: "Today", value: "today" },
  { name: "Yesterday", value: "yesterday" },
  { name: "This Week", value: "thisWeek" },
  { name: "Last 7 Days", value: "last7Days" },
  { name: "Last 28 Days", value: "last28Days" },
  { name: "This Month", value: "thisMonth" },
  { name: "Last Month", value: "lastMonth" },
  { name: "This Year", value: "thisYear" },
];

interface DateRangePickerProps {
  className?: string;
}

export function DateRangePicker({ className }: DateRangePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = new Date();
  const twentyEightDaysAgo = startOfDay(subDays(today, 27));

  // Get initial date from URL
  const urlDateFrom = searchParams.get("dateFrom");
  const urlDateTo = searchParams.get("dateTo");
  const initialDateRange: DateRange | undefined = urlDateFrom && urlDateTo
    ? { from: new Date(urlDateFrom), to: new Date(urlDateTo) }
    : undefined;

  // Use global filter for date range (persists across all pages)
  const [dateRange, setDateRange] = useGlobalFilter<DateRange | undefined>({
    filterKey: "date-range",
    defaultValue: { from: twentyEightDaysAgo, to: endOfDay(today) },
    initialValue: initialDateRange,
  });

  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    dateRange?.from || new Date()
  );

  const updateURLWithDate = React.useCallback(
    (from: Date, to: Date) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set("dateFrom", format(from, "yyyy-MM-dd"));
      newSearchParams.set("dateTo", format(to, "yyyy-MM-dd"));
      newSearchParams.set("page", "1"); // Reset to page 1 when filtering
      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  // Sync localStorage date range to URL on mount (if URL doesn't have it)
  const hasSyncedDateRef = React.useRef(false);
  React.useEffect(() => {
    if (hasSyncedDateRef.current) return;

    const hasUrlDates = urlDateFrom && urlDateTo;

    if (!hasUrlDates && dateRange?.from && dateRange?.to) {
      // localStorage has a date range but URL doesn't - sync it
      updateURLWithDate(dateRange.from, dateRange.to);
      hasSyncedDateRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleQuickSelect = (from: Date, to: Date) => {
    const newDateRange = { from, to };
    setDateRange(newDateRange);
    setCurrentMonth(from);
    updateURLWithDate(from, to);
  };

  const changeHandle = (type: string) => {
    const today = new Date();

    switch (type) {
      case "today":
        handleQuickSelect(startOfDay(today), endOfDay(today));
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        handleQuickSelect(startOfDay(yesterday), endOfDay(yesterday));
        break;
      case "thisWeek":
        const startOfCurrentWeek = startOfWeek(today);
        handleQuickSelect(startOfDay(startOfCurrentWeek), endOfDay(today));
        break;
      case "last7Days":
        const sevenDaysAgo = subDays(today, 6);
        handleQuickSelect(startOfDay(sevenDaysAgo), endOfDay(today));
        break;
      case "last28Days":
        const twentyEightDaysAgo = subDays(today, 27);
        handleQuickSelect(startOfDay(twentyEightDaysAgo), endOfDay(today));
        break;
      case "thisMonth":
        handleQuickSelect(startOfMonth(today), endOfDay(today));
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        handleQuickSelect(startOfMonth(lastMonth), endOfMonth(lastMonth));
        break;
      case "thisYear":
        const startOfCurrentYear = startOfYear(today);
        handleQuickSelect(startOfDay(startOfCurrentYear), endOfDay(today));
        break;
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM yyyy")} - {format(dateRange.to, "dd MMM yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex flex-col lg:flex-row">
            <div className="border-b p-3 lg:border-b-0 lg:border-r">
              <Select defaultValue="last28Days" onValueChange={(value) => changeHandle(value)}>
                <SelectTrigger className="w-full lg:hidden" aria-label="Select a value">
                  <SelectValue placeholder="Last 28 Days" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilterPresets.map((item, key) => (
                    <SelectItem key={key} value={item.value}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ToggleGroup
                type="single"
                defaultValue="last28Days"
                className="hidden w-32 flex-col items-start lg:flex"
              >
                {dateFilterPresets.map((item, key) => (
                  <ToggleGroupItem
                    key={key}
                    className="w-full justify-start text-sm"
                    value={item.value}
                    onClick={() => changeHandle(item.value)}
                  >
                    {item.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Calendar
              mode="range"
              month={currentMonth}
              selected={dateRange}
              onSelect={(newDateRange) => {
                setDateRange(newDateRange);
                if (newDateRange?.from) {
                  setCurrentMonth(newDateRange.from);
                }
                if (newDateRange?.from && newDateRange?.to) {
                  updateURLWithDate(newDateRange.from, newDateRange.to);
                }
              }}
              onMonthChange={setCurrentMonth}
              numberOfMonths={1}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
