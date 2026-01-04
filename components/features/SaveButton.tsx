"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import { useChanges } from "@/context/ChangesContext";
import { saveAllChanges } from "@/app/admin/action";
import { useToast } from "@/hooks/use-toast";

export function SaveButton() {
  const { changes, hasChanges, resetChanges } = useChanges();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!hasChanges) {
      toast({
        title: "Brak zmian",
        description: "Nie ma żadnych zmian do zapisania.",
        variant: "default",
      });
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveAllChanges(changes);

      if (result.success) {
        toast({
          title: "Sukces!",
          description: result.message,
          variant: "default",
        });

        // Pokaż szczegóły zapisanych zmian
        if (result.savedChanges) {
          console.log("Zapisane zmiany:", result.savedChanges);
        }

        // Resetuj śledzenie zmian
        resetChanges();
      } else {
        toast({
          title: "Błąd",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Błąd",
        description: "Wystąpił nieoczekiwany błąd podczas zapisywania.",
        variant: "destructive",
      });
      console.error("Błąd zapisu:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSave}
      disabled={!hasChanges || isSaving}
      className="gap-2"
    >
      {isSaving ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Zapisywanie...
        </>
      ) : hasChanges ? (
        <>
          <Save className="h-4 w-4" />
          Zapisz zmiany
        </>
      ) : (
        <>
          <Check className="h-4 w-4" />
          Wszystko zapisane
        </>
      )}
    </Button>
  );
}
