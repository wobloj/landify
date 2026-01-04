"use server";

import {
  updateSiteGlobalContent,
  updatePublishStatus,
  saveOrderToSection,
  updateSectionContent,
  updateFooterContent,
  getSiteConfig,
  getSectionsData,
  getFooterConfig,
} from "@/lib/supabase/data";
import { ChangeSet, SaveResult } from "@/lib/types/types";

import { revalidatePath } from "next/cache";

/**
 * Główna akcja zapisująca wszystkie zmiany
 * Porównuje zmiany z aktualnym stanem w bazie i zapisuje tylko rzeczywiste różnice
 */
export async function saveAllChanges(changes: ChangeSet): Promise<SaveResult> {
  try {
    const savedChanges: SaveResult["savedChanges"] = {};
    let hasAnyChanges = false;

    // 1. Sprawdź i zapisz zmiany w site_config
    if (changes.siteConfig && Object.keys(changes.siteConfig).length > 0) {
      const currentConfig = await getSiteConfig();
      const actualChanges = compareAndFilterChanges(
        currentConfig,
        changes.siteConfig
      );

      if (Object.keys(actualChanges).length > 0) {
        // Konwertuj spacing na string z "px" jeśli jest obecny
        const processedChanges = { ...actualChanges };
        if (processedChanges.spacing !== undefined) {
          processedChanges.spacing = `${processedChanges.spacing}px` as any;
        }

        await updateSiteGlobalContent(processedChanges);
        savedChanges.siteConfig = true;
        hasAnyChanges = true;
      }
    }

    // 2. Sprawdź i zapisz zmiany w sekcjach
    if (changes.sections && Object.keys(changes.sections).length > 0) {
      const currentSections = await getSectionsData();
      const updatedSections: string[] = [];

      for (const [sectionType, sectionChanges] of Object.entries(
        changes.sections
      )) {
        const currentSection = currentSections[sectionType];
        if (!currentSection) continue;

        const actualChanges = compareAndFilterSectionChanges(
          currentSection,
          sectionChanges
        );

        if (Object.keys(actualChanges).length > 0) {
          await updateSectionContent(sectionType, actualChanges);
          updatedSections.push(sectionType);
          hasAnyChanges = true;
        }
      }

      if (updatedSections.length > 0) {
        savedChanges.sections = updatedSections;
      }
    }

    // 3. Sprawdź i zapisz zmiany w footer
    if (changes.footer && Object.keys(changes.footer).length > 0) {
      const currentFooter = await getFooterConfig();
      const actualChanges = compareAndFilterChanges(
        currentFooter,
        changes.footer
      );

      if (Object.keys(actualChanges).length > 0) {
        await updateFooterContent(actualChanges);
        savedChanges.footer = true;
        hasAnyChanges = true;
      }
    }

    // 4. Sprawdź i zapisz zmiany kolejności sekcji
    if (changes.sectionOrder && changes.sectionOrder.length > 0) {
      const currentSections = await getSectionsData();
      const currentOrder = Object.values(currentSections)
        .sort((a, b) => b.sort_order - a.sort_order)
        .map((s) => s.section_type);

      const hasOrderChanged = !arraysEqual(currentOrder, changes.sectionOrder);

      if (hasOrderChanged) {
        await saveOrderToSection(changes.sectionOrder);
        savedChanges.sectionOrder = true;
        hasAnyChanges = true;
      }
    }

    // 5. Rewalidacja ścieżek
    if (hasAnyChanges) {
      revalidatePath("/admin");
      revalidatePath("/");
    }

    return {
      success: true,
      message: hasAnyChanges
        ? "Zmiany zostały zapisane pomyślnie."
        : "Brak zmian do zapisania.",
      savedChanges: hasAnyChanges ? savedChanges : undefined,
    };
  } catch (error: any) {
    console.error("Błąd podczas zapisywania zmian:", error);
    return {
      success: false,
      message: error.message || "Wystąpił błąd podczas zapisywania zmian.",
    };
  }
}

/**
 * Porównuje obiekty i zwraca tylko te pola, które się różnią
 */
function compareAndFilterChanges<T extends Record<string, any>>(
  current: T | null,
  changes: Partial<T>
): Partial<T> {
  if (!current) return changes;

  const actualChanges: Partial<T> = {};

  for (const [key, value] of Object.entries(changes)) {
    // Specjalna obsługa dla spacing (number vs "16px")
    if (key === "spacing") {
      const currentSpacing = String(current[key]).replace("px", "");
      const newSpacing = String(value).replace("px", "");
      if (currentSpacing !== newSpacing) {
        actualChanges[key as keyof T] = value;
      }
    } else if (current[key] !== value) {
      actualChanges[key as keyof T] = value;
    }
  }

  return actualChanges;
}

/**
 * Porównuje zmiany w sekcji (z uwzględnieniem data_json)
 */
function compareAndFilterSectionChanges(
  current: any,
  changes: {
    title?: string;
    image_url?: string | null;
    data_json?: Record<string, any>;
  }
) {
  const actualChanges: any = {};

  if (changes.title !== undefined && current.title !== changes.title) {
    actualChanges.title = changes.title;
  }

  if (
    changes.image_url !== undefined &&
    current.image_url !== changes.image_url
  ) {
    actualChanges.image_url = changes.image_url;
  }

  if (changes.data_json !== undefined) {
    const dataJsonChanged = !deepEqual(current.data_json, changes.data_json);
    if (dataJsonChanged) {
      actualChanges.data_json = changes.data_json;
    }
  }

  return actualChanges;
}

/**
 * Głębokie porównanie obiektów
 */
function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

/**
 * Porównuje dwie tablice
 */
function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}

// === Stare akcje (zachowane dla kompatybilności wstecznej) ===

export async function saveGlobalSettings(formData: FormData) {
  try {
    const updates = {
      app_title: formData.get("app_title") as string,
      primary_color: formData.get("primary_color") as string,
      secondary_color: formData.get("secondary_color") as string,
      bg_color: formData.get("bg_color") as string,
      text_color_primary: formData.get("text_color_primary") as string,
      text_color_secondary: formData.get("text_color_secondary") as string,
      spacing: (formData.get("spacing") + "px") as string,
    };

    await updateSiteGlobalContent(updates);
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, message: "Zapisano ustawienia globalne." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function saveSectionSettings(formData: FormData): Promise<void> {
  const sectionType = formData.get("section_type") as string;
  if (!sectionType) throw new Error("Brak section_type");

  const title = formData.get("title") as string;
  let data_json: any = {};

  if (sectionType === "hero") {
    data_json = {
      subtitle: formData.get("subtitle"),
      button_text: formData.get("button_text"),
    };
  }

  if (sectionType === "features") {
    const items: any[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^items\[(\d+)\]\.(.+)$/);
      if (!match) continue;
      const index = Number(match[1]);
      const field = match[2];
      items[index] ??= {};
      items[index][field] = value;
    }
    data_json = { items };
  }

  if (sectionType === "cta") {
    data_json = {
      desc: formData.get("desc"),
      button_text: formData.get("button_text"),
    };
  }

  await updateSectionContent(sectionType, { title, data_json });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function saveSectionOrder(sections: string[]) {
  try {
    await saveOrderToSection(sections);
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function publishPageAction() {
  try {
    await updatePublishStatus(true);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Strona opublikowana pomyślnie!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Błąd publikacji strony.",
    };
  }
}

export async function unpublishPageAction() {
  try {
    await updatePublishStatus(false);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Strona ustawiona jako 'W Budowie'." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Błąd de-publikacji strony.",
    };
  }
}
