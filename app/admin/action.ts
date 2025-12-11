"use server";

import {
  updateSiteGlobalContent,
  updatePublishStatus,
  saveOrderToSection,
} from "@/lib/supabase/data";

import { revalidatePath } from "next/cache";

export async function saveGlobalSettings(formData: FormData) {
  try {
    const updates = {
      app_title: formData.get("app_title") as string,
      primary_color: formData.get("primary_color") as string,
      secondary_color: formData.get("secondary_color") as string,
      bg_color: formData.get("bg_color") as string,
      text_color: formData.get("text_color") as string,
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

// --- SEKCJA HERO ---

export async function saveHeroSettings(formData: FormData) {
  try {
    const updates = {
      hero_title: formData.get("hero_title") as string,
      hero_subtitle: formData.get("hero_subtitle") as string,
    };
    // Aktualizujemy tylko pola Hero
    await updateSiteContent(updates);
    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Zapisano sekcję Hero." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
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
