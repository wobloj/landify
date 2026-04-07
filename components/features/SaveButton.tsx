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
import { useEffect } from "react";

interface SaveButtonProps {
  siteId: number;
}

export function SaveButton({ siteId: propSiteId }: SaveButtonProps) {
  const {
    hasChanges,
    canUndo,
    undoChanges,
    saveChanges,
    isSaving,
    siteId,
    setSiteId,
  } = useChanges();

  // Set siteId in context when prop changes
  useEffect(() => {
    if (propSiteId && propSiteId !== siteId) {
      setSiteId(propSiteId);
    }
  }, [propSiteId, siteId, setSiteId]);

  // DEBUGOWANIE - pomocne do diagnozy problemów
  useEffect(() => {
    console.log("SaveButton state:", {
      hasChanges,
      isSaving,
      siteId: propSiteId,
      canUndo,
    });
  }, [hasChanges, isSaving, propSiteId, canUndo]);

  const handleSave = async () => {
    console.log("SaveButton clicked - calling saveChanges()");
    console.log("Current siteId:", propSiteId);
    console.log("Has changes:", hasChanges);

    if (!propSiteId) {
      console.error("ERROR: siteId is null! Cannot save changes.");
      return;
    }

    await saveChanges();
  };

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
              onClick={handleSave}
              disabled={!hasChanges || isSaving || !propSiteId}
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
            {!propSiteId ? (
              <p className="text-red-500">Błąd: Brak ID strony</p>
            ) : hasChanges ? (
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
