import { ChangeSet, SectionConfig } from "@/lib/types/types";

/**
 * Merguje dane początkowe z contextu zmian dla SiteConfig
 */
export function mergeSiteConfig<T extends Record<string, any>>(
  initialConfig: T,
  changes: ChangeSet["siteConfig"],
): T {
  if (!changes || Object.keys(changes).length === 0) {
    return initialConfig;
  }

  const merged = { ...initialConfig };

  // Merguj wszystkie zmiany
  Object.entries(changes).forEach(([key, value]) => {
    if (value !== undefined) {
      // Specjalna obsługa dla spacing (może być number w changes)
      if (key === "spacing") {
        merged[key as keyof T] = (
          typeof value === "number" ? `${value}px` : value
        ) as any;
      } else {
        merged[key as keyof T] = value as any;
      }
    }
  });

  return merged;
}

/**
 * Merguje dane początkowe z contextu zmian dla pojedynczej sekcji
 */
export function mergeSectionData(
  initialSection: SectionConfig,
  changes: ChangeSet["sections"],
): SectionConfig {
  if (!changes || !changes[initialSection.section_type]) {
    return initialSection;
  }

  const sectionChanges = changes[initialSection.section_type];
  const merged = { ...initialSection };

  // Merguj title
  if (sectionChanges.title !== undefined) {
    merged.title = sectionChanges.title;
  }

  // Merguj image_url
  if (sectionChanges.image_url !== undefined) {
    merged.image_url = sectionChanges.image_url;
  }

  // Merguj data_json (głębokie mergowanie)
  if (sectionChanges.data_json !== undefined) {
    merged.data_json = {
      ...merged.data_json,
      ...sectionChanges.data_json,
    };
  }

  return merged;
}

/**
 * Merguje dane początkowe z contextu zmian dla Footer
 */
export function mergeFooterData<T extends Record<string, any>>(
  initialFooter: T,
  changes: ChangeSet["footer"],
): T {
  if (!changes || Object.keys(changes).length === 0) {
    return initialFooter;
  }

  return {
    ...initialFooter,
    ...changes,
  };
}

/**
 * Pobiera aktualną kolejność sekcji (z uwzględnieniem zmian)
 */
export function getSectionOrder(
  initialSections: SectionConfig[],
  changes: ChangeSet,
): SectionConfig[] {
  // Jeśli są zmiany kolejności, użyj ich do posortowania
  if (changes.sectionOrder && changes.sectionOrder.length > 0) {
    const orderMap = new Map(
      changes.sectionOrder.map((type, index) => [type, index]),
    );

    return [...initialSections].sort((a, b) => {
      const orderA = orderMap.get(a.section_type) ?? a.sort_order ?? 0;
      const orderB = orderMap.get(b.section_type) ?? b.sort_order ?? 0;
      return orderA - orderB;
    });
  }

  // W przeciwnym razie użyj kolejności początkowej
  return [...initialSections].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}
