"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { saveAllChanges } from "@/app/admin/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ChangeSet } from "@/lib/types/types";

type ChangesContextType = {
  changes: ChangeSet;
  hasChanges: boolean;
  updateSiteConfig: (updates: Partial<ChangeSet["siteConfig"]>) => void;
  updateSection: (
    sectionType: string,
    updates: ChangeSet["sections"][string],
  ) => void;
  updateFooter: (updates: ChangeSet["footer"]) => void;
  updateSectionOrder: (order: string[]) => void;
  resetChanges: () => void;
  undoChanges: () => void;
  canUndo: boolean;
  getChanges: () => ChangeSet;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
  refreshKey: number; // Key do wymuszania re-render komponentów
};

const ChangesContext = createContext<ChangesContextType | undefined>(undefined);

const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minut

export function ChangesProvider({ children }: { children: React.ReactNode }) {
  const [changes, setChanges] = useState<ChangeSet>({});
  const [lastSavedState, setLastSavedState] = useState<ChangeSet>({}); // Stan po ostatnim zapisie
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Key do wymuszania re-render
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Sprawdź czy są jakiekolwiek zmiany w stosunku do początku
  const hasChanges = Object.keys(changes).some((key) => {
    const value = changes[key as keyof ChangeSet];
    if (!value) return false;
    if (typeof value === "object" && !Array.isArray(value)) {
      return Object.keys(value).length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  });

  // Możesz cofnąć jeśli obecny stan różni się od ostatnio zapisanego
  const canUndo = hasChanges || Object.keys(lastSavedState).length > 0;

  // Auto-save logic
  useEffect(() => {
    if (hasChanges) {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, AUTO_SAVE_INTERVAL);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [changes, hasChanges]);

  // Warning before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges && !isSaving) {
        e.preventDefault();
        e.returnValue =
          "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  const handleAutoSave = async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);
    try {
      const result = await saveAllChanges(changes);

      if (result.success) {
        toast({
          title: "Auto-save",
          description: "Zmiany zostały automatycznie zapisane.",
          duration: 3000,
        });

        // Zapisz aktualny stan jako ostatni zapisany
        setLastSavedState(changes);
        setChanges({});

        // Odśwież dane na stronie
        router.refresh();
      } else {
        toast({
          title: "Auto-save nie powiódł się",
          description: result.message,
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Auto-save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateSiteConfig = useCallback(
    (updates: Partial<ChangeSet["siteConfig"]>) => {
      setChanges((prev) => ({
        ...prev,
        siteConfig: {
          ...prev.siteConfig,
          ...updates,
        },
      }));
    },
    [],
  );

  const updateSection = useCallback(
    (sectionType: string, updates: ChangeSet["sections"][string]) => {
      setChanges((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [sectionType]: {
            ...prev.sections?.[sectionType],
            ...updates,
          },
        },
      }));
    },
    [],
  );

  const updateFooter = useCallback((updates: ChangeSet["footer"]) => {
    setChanges((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        ...updates,
      },
    }));
  }, []);

  const updateSectionOrder = useCallback((order: string[]) => {
    setChanges((prev) => ({
      ...prev,
      sectionOrder: order,
    }));
  }, []);

  const resetChanges = useCallback(() => {
    setChanges({});
    setLastSavedState({});
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  const undoChanges = useCallback(() => {
    // Cofnij do stanu z ostatniego zapisu (czyli wyczyść niezapisane zmiany)
    setChanges({});

    // Odśwież stronę aby załadować dane z bazy
    router.refresh();

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    toast({
      title: "Cofnięto zmiany",
      description: hasChanges
        ? "Przywrócono ostatnio zapisany stan."
        : "Odświeżono dane z bazy.",
      duration: 2000,
    });
  }, [hasChanges, router, toast]);

  const saveChanges = useCallback(async () => {
    if (!hasChanges || isSaving) return;

    setIsSaving(true);

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    try {
      const result = await saveAllChanges(changes);

      if (result.success) {
        toast({
          title: "Sukces!",
          description: result.message,
          variant: "default",
        });

        if (result.savedChanges) {
          console.log("Zapisane zmiany:", result.savedChanges);
        }

        // Zapisz aktualny stan jako ostatni zapisany
        setLastSavedState(changes);
        setChanges({});

        // Odśwież dane na stronie
        router.refresh();
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
  }, [changes, hasChanges, isSaving, toast, router]);

  const getChanges = useCallback(() => changes, [changes]);

  return (
    <ChangesContext.Provider
      value={{
        changes,
        hasChanges,
        updateSiteConfig,
        updateSection,
        updateFooter,
        updateSectionOrder,
        resetChanges,
        undoChanges,
        canUndo,
        getChanges,
        saveChanges,
        isSaving,
        refreshKey,
      }}
    >
      {children}
    </ChangesContext.Provider>
  );
}

export function useChanges() {
  const context = useContext(ChangesContext);
  if (!context) {
    throw new Error("useChanges musi być użyty wewnątrz ChangesProvider");
  }
  return context;
}
