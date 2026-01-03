"use server";

import {
  updateSiteGlobalContent,
  updatePublishStatus,
  saveOrderToSection,
  updateSectionContent,
} from "@/lib/supabase/data";

import { revalidatePath } from "next/cache";

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

    // Aktualizujemy tylko pola globalne
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

  // 🔹 HERO
  if (sectionType === "hero") {
    data_json = {
      subtitle: formData.get("subtitle"),
      button_text: formData.get("button_text"),
    };
  }

  // 🔹 FEATURES
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

  // 🔹 CTA
  if (sectionType === "cta") {
    data_json = {
      desc: formData.get("desc"),
      button_text: formData.get("button_text"),
    };
  }

  await updateSectionContent(sectionType, {
    title,
    data_json,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function saveSectionOrder(sections: string[]) {
  try {
    // Ta funkcja jest teraz znacznie bardziej odporna na błędy
    await saveOrderToSection(sections);

    // Rewalidacja ścieżek
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    // Zwracanie dokładnego komunikatu błędu z warstwy danych
    return { success: false, message: error.message };
  }
}

export async function publishPageAction() {
  try {
    await updatePublishStatus(true);
    // Wymuszamy odświeżenie głównej strony, aby pokazać opublikowaną wersję
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
    // Wymuszamy odświeżenie głównej strony
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
