"use client";

import { ChangeSet } from "@/lib/types/types";
import React, { createContext, useContext, useState, useCallback } from "react";

type ChangesContextType = {
  changes: ChangeSet;
  hasChanges: boolean;
  updateSiteConfig: (updates: Partial<ChangeSet["siteConfig"]>) => void;
  updateSection: (
    sectionType: string,
    updates: ChangeSet["sections"][string]
  ) => void;
  updateFooter: (updates: ChangeSet["footer"]) => void;
  updateSectionOrder: (order: string[]) => void;
  resetChanges: () => void;
  getChanges: () => ChangeSet;
};

const ChangesContext = createContext<ChangesContextType | undefined>(undefined);

export function ChangesProvider({ children }: { children: React.ReactNode }) {
  const [changes, setChanges] = useState<ChangeSet>({});

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
    []
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
    []
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
  }, []);

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
        getChanges,
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
