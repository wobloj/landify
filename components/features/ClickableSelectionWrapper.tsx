"use client";

import { useSectionSelection } from "@/context/SectionSelectionContext";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface ClickableSectionWrapperProps {
  sectionType: "hero" | "features" | "cta" | "video" | "images" | "blank";
  children: React.ReactNode;
  className?: string;
  showLabel?: boolean;
}

export function ClickableSectionWrapper({
  sectionType,
  children,
  className,
  showLabel = true,
}: ClickableSectionWrapperProps) {
  const { selectedSection, setSelectedSection, registerSectionRef } =
    useSectionSelection();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedSection === sectionType;

  // Rejestruj ref w context
  useEffect(() => {
    if (sectionRef.current) {
      registerSectionRef(sectionType, sectionRef.current);
    }

    return () => {
      registerSectionRef(sectionType, null);
    };
  }, [sectionType, registerSectionRef]);

  const sectionLabels = {
    hero: "Hero",
    features: "Funkcje",
    cta: "CTA",
    video: "Wideo",
    images: "Galeria",
    blank: "Pusta sekcja",
  };

  return (
    <div
      ref={sectionRef}
      onClick={() => setSelectedSection(sectionType)}
      className={cn(
        "mx-10 relative cursor-pointer transition-all rounded-md z-10",
        "hover:ring-2 hover:-translate-y-2 hover:ring-blue-500 hover:ring-offset-2",
        isSelected && "ring-2 ring-blue-600 ring-offset-2",
        "group",
        className,
      )}
    >
      {/* Overlay przy hover */}
      <div
        className={cn(
          "absolute inset-0 bg-blue-500/5 opacity-0 transition-opacity pointer-events-none",
          "group-hover:opacity-100",
          isSelected && "opacity-100 bg-blue-500/10",
        )}
      />

      {/* Label sekcji */}
      {showLabel && (
        <div
          className={cn(
            "absolute top-2 left-2 z-10",
            "bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isSelected && "opacity-100",
          )}
        >
          ✏️ {sectionLabels[sectionType]}
        </div>
      )}

      {/* Actual section content */}
      {children}
    </div>
  );
}
