import { createClient } from "./server";

export type SiteConfig = {
  id: number;
  app_title: string;
  is_published: boolean;
  primary_color: string;
  secondary_color: string;
  bg_color: string;
  text_color: string;
  logo_url: string;
  updated_at: string;
};

export type SectionConfig = {
  id: number;
  section_type: "hero" | "features" | "cta" | null;
  sort_order: number;
  title: string;
  data_json: [];
  updated_at: string;
};

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji strony:",
      error.message
    );
    return null;
  }
  return data;
}

export async function getSectionsData(): Promise<
  Record<string, SectionConfig>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("section_config")
    .select("*")
    .order("sort_order", { ascending: false });

  if (error) {
    console.error(
      "Błąd podczas pobierania tabeli section_config:",
      error.message
    );
    return {};
  }

  // Przekształcenie tablicy do obiektu, używając section_type jako klucza
  const sectionsMap = (data || []).reduce((acc, section) => {
    acc[section.section_type] = section;
    return acc;
  }, {} as Record<string, SectionConfig>);

  return sectionsMap;
}

export async function getSectionsName() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("section_config")
    .select("section_type")
    .order("sort_order", { ascending: false });

  if (error) {
    console.error(
      "Błąd podczas pobierania tabeli section_config:",
      error.message
    );
  }
  return data || {};
}

export async function getSectionConfigByType(
  sectionType: string
): Promise<SectionConfig | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("section_config")
    .select("*")
    .eq("section_type", sectionType)
    .single();

  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji sekcji:",
      error.message
    );
    return null;
  }

  return data;
}

export async function saveOrderToSection(sections: string[]) {
  const supabase = await createClient();

  // 1. Pobierz ID dla wszystkich sekcji
  const { data: currentSections, error: fetchError } = await supabase
    .from("section_config")
    .select("id, section_type");

  if (fetchError) {
    console.error("Błąd podczas pobierania ID sekcji:", fetchError.message);
    throw new Error(fetchError.message); // Wyrzucenie oryginalnego błędu
  }

  // Utwórz mapę section_type -> id
  const idMap = (currentSections || []).reduce((acc, section) => {
    acc[section.section_type] = section.id;
    return acc;
  }, {} as Record<string, number>);

  // 2. Przygotuj tablicę obietnic aktualizacji
  const updatePromises = sections
    .map((section_type, index) => {
      const id = idMap[section_type];
      if (id === undefined) {
        console.warn(
          `Sekcja typu '${section_type}' nie została znaleziona w bazie danych. Pomijanie.`
        );
        return null;
      }

      // Tworzymy obietnicę pojedynczej operacji UPDATE
      return supabase
        .from("section_config")
        .update({ sort_order: index })
        .eq("id", id);
    })
    .filter((p): p is Promise<any> => p !== null);

  if (updatePromises.length === 0) {
    return; // Brak sekcji do aktualizacji
  }

  // 3. Wykonaj wszystkie aktualizacje równolegle
  const results = await Promise.all(updatePromises);

  // 4. Sprawdź, czy wystąpiły błędy
  const firstError = results.find((result) => result?.error);

  if (firstError && firstError.error) {
    const updateError = firstError.error;
    console.error(
      "Błąd podczas aktualizacji kolejności sekcji:",
      updateError.message
    );
    // Wyrzucamy dokładny błąd Supabase
    throw new Error(
      `Błąd podczas aktualizacji kolejności: ${updateError.message}`
    );
  }
}

export async function updatePublishStatus(isPublished: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_config")
    .update({ is_published: isPublished })
    .eq("id", 1);

  if (error) {
    console.error(
      "Błąd podczas aktualizacji statusu publikacji:",
      error.message
    );
    throw new Error("Nie udało się zaktualizować statusu publikacji.");
  }
}

export async function updateSiteGlobalContent(updates: Partial<SiteConfig>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_config")
    .update(updates)
    .eq("id", 1);

  if (error) {
    console.error("Błąd podczas aktualizacji treści:", error.message);
    throw new Error("Nie udało się zapisać treści strony.");
  }
}

export async function updateSiteSectionsContent(updates: Partial<SiteConfig>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("section_config")
    .update(updates)
    .eq("id", 1);

  if (error) {
    console.error("Błąd podczas aktualizacji treści:", error.message);
    throw new Error("Nie udało się zapisać treści strony.");
  }
}
