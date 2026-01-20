"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";

type SectionType =
  | "hero"
  | "features"
  | "cta"
  | "video"
  | "images"
  | "blank"
  | null;

type SectionSelectionContextType = {
  selectedSection: SectionType;
  setSelectedSection: (section: SectionType, shouldScroll?: boolean) => void;
  registerSectionRef: (section: SectionType, ref: HTMLElement | null) => void;
  scrollToSection: (section: SectionType) => void;
};

const SectionSelectionContext = createContext<
  SectionSelectionContextType | undefined
>(undefined);

export function SectionSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedSection, setSelectedSectionState] =
    useState<SectionType>(null);

  // Przechowujemy refs do wszystkich sekcji
  const sectionRefs = useRef<Map<SectionType, HTMLElement>>(new Map());

  // Rejestruj ref sekcji
  const registerSectionRef = useCallback(
    (section: SectionType, ref: HTMLElement | null) => {
      if (section && ref) {
        sectionRefs.current.set(section, ref);
      } else if (section) {
        sectionRefs.current.delete(section);
      }
    },
    []
  );

  // Funkcja scrollowania do sekcji
  const scrollToSection = useCallback((section: SectionType) => {
    if (!section) return;

    const element = sectionRefs.current.get(section);
    if (element) {
      // Scroll z płynną animacją i centrowaniem
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, []);

  // Wrapper dla setSelectedSection z opcjonalnym scrollowaniem
  const setSelectedSection = useCallback(
    (section: SectionType, shouldScroll: boolean = false) => {
      setSelectedSectionState(section);

      if (shouldScroll && section) {
        // Małe opóźnienie aby animacja była płynniejsza
        setTimeout(() => {
          scrollToSection(section);
        }, 100);
      }
    },
    [scrollToSection]
  );

  return (
    <SectionSelectionContext.Provider
      value={{
        selectedSection,
        setSelectedSection,
        registerSectionRef,
        scrollToSection,
      }}
    >
      {children}
    </SectionSelectionContext.Provider>
  );
}

export function useSectionSelection() {
  const context = useContext(SectionSelectionContext);
  if (!context) {
    throw new Error(
      "useSectionSelection musi być użyty wewnątrz SectionSelectionProvider"
    );
  }
  return context;
}
