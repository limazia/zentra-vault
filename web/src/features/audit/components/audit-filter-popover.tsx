import { Filter, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

import { AUDIT_ACTION_OPTIONS } from "../hooks/use-audit-filters";

interface AuditFilterPopoverProps {
  selectedActions: string[];
  onActionsChange: (actions: string[]) => void;
}

export function AuditFilterPopover({
  selectedActions,
  onActionsChange,
}: AuditFilterPopoverProps) {
  const activeCount = selectedActions.length;

  function toggleAction(value: string) {
    if (selectedActions.includes(value)) {
      onActionsChange(selectedActions.filter((a) => a !== value));
    } else {
      onActionsChange([...selectedActions, value]);
    }
  }

  function clearAll() {
    onActionsChange([]);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter data-icon="inline-start" className="size-4" />
          Filtros
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-0.5 px-1.5">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-0">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <span className="text-sm font-medium">Filtrar por evento</span>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              className="h-auto px-1.5 py-0.5 text-xs text-muted-foreground"
              onClick={clearAll}
            >
              <X className="mr-0.5 size-3" />
              Limpar
            </Button>
          )}
        </div>

        <Separator />

        <div className="flex flex-col gap-1 p-3">
          {AUDIT_ACTION_OPTIONS.map((option) => {
            const checked = selectedActions.includes(option.value);
            return (
              <Label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleAction(option.value)}
                />
                <span className="text-sm font-normal">{option.label}</span>
              </Label>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
