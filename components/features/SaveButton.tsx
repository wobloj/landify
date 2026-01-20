"use client";

import { Button } from "@/components/ui/button";
import { useChanges } from "@/context/ChangesContext";
import { Save, Check, Undo2, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SaveButton() {
  const { hasChanges, canUndo, undoChanges, saveChanges, isSaving } =
    useChanges();

  return (
    <div className="flex items-center gap-2">
      {/* Undo Button - zawsze widoczny jeśli można cofnąć */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={undoChanges}
              disabled={!canUndo || isSaving}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Undo2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {hasChanges ? "Cofnij" : "Odśwież"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {hasChanges
                ? "Cofnij wszystkie niezapisane zmiany"
                : "Odśwież dane z bazy"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Save Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={saveChanges}
              disabled={!hasChanges || isSaving}
              className="gap-2"
              size="sm"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="hidden sm:inline">Zapisywanie...</span>
                </>
              ) : hasChanges ? (
                <>
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Zapisz</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Zapisane</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {hasChanges ? (
              <div className="flex flex-col gap-1">
                <p className="font-semibold">Kliknij aby zapisać zmiany</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Auto-save za 5 minut
                </p>
              </div>
            ) : (
              <p>Wszystkie zmiany zapisane</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
