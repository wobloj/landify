"use client";

import { useChanges } from "@/context/ChangesContext";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileEdit } from "lucide-react";

export function UnsavedChangesIndicator() {
  const { changes, hasChanges } = useChanges();

  if (!hasChanges) return null;

  const changedItems: string[] = [];

  if (changes.siteConfig && Object.keys(changes.siteConfig).length > 0) {
    changedItems.push("Ustawienia globalne");
  }

  if (changes.sections) {
    Object.keys(changes.sections).forEach((sectionType) => {
      changedItems.push(
        `Sekcja: ${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}`
      );
    });
  }

  if (changes.footer) {
    changedItems.push("Stopka");
  }

  if (changes.sectionOrder) {
    changedItems.push("Kolejność sekcji");
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge
          variant="secondary"
          className="cursor-pointer gap-2 animate-pulse hover:animate-none"
        >
          <FileEdit className="h-3 w-3" />
          {changedItems.length}{" "}
          {changedItems.length === 1 ? "zmiana" : "zmiany"}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Niezapisane zmiany:</h4>
          <ul className="space-y-1">
            {changedItems.map((item, index) => (
              <li
                key={index}
                className="text-xs text-muted-foreground flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
