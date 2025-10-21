"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarModeSelector() {
  const { state, setOpen } = useSidebar();

  return (
    <div className="hidden flex-col gap-4 lg:flex">
      <Label>Sidebar mode:</Label>
      <ToggleGroup
        type="single"
        value={state}
        onValueChange={(value) => {
          if (value) {
            setOpen(value === "expanded");
          }
        }}
        className="*:border-input w-full gap-4 *:rounded-md *:border">
        <ToggleGroupItem variant="outline" value="expanded">
          Default
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="collapsed"
          className="data-[variant=outline]:border-l-1">
          Icon
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
