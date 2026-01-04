import { FooterConfig, SectionConfig, SiteConfig } from "../types/types";
import { createClient } from "./server";

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

export async function getFooterConfig(): Promise<FooterConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("footer")
    .select("*")
    .limit(1)
    .single();
  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji stopki:",
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

  const { data: currentSections, error: fetchError } = await supabase
    .from("section_config")
    .select("id, section_type");

  if (fetchError) {
    console.error("Błąd podczas pobierania ID sekcji:", fetchError.message);
    throw new Error(fetchError.message);
  }

  const idMap = (currentSections || []).reduce((acc, section) => {
    acc[section.section_type] = section.id;
    return acc;
  }, {} as Record<string, number>);

  const updatePromises = sections
    .map((section_type, index) => {
      const id = idMap[section_type];
      if (id === undefined) {
        console.warn(
          `Sekcja typu '${section_type}' nie została znaleziona w bazie danych. Pomijanie.`
        );
        return null;
      }

      return supabase
        .from("section_config")
        .update({ sort_order: index })
        .eq("id", id);
    })
    .filter((p): p is Promise<any> => p !== null);

  if (updatePromises.length === 0) {
    return;
  }

  const results = await Promise.all(updatePromises);
  const firstError = results.find((result) => result?.error);

  if (firstError && firstError.error) {
    const updateError = firstError.error;
    console.error(
      "Błąd podczas aktualizacji kolejności sekcji:",
      updateError.message
    );
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

export async function updateSectionContent(
  sectionType: string,
  updates: {
    title?: string;
    image_url?: string | null;
    data_json?: any;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("section_config")
    .update(updates)
    .eq("section_type", sectionType);

  if (error) {
    console.error(`[updateSectionContent] ${sectionType}`, error);
    throw new Error("Nie udało się zapisać sekcji strony.");
  }
}

export async function updateFooterContent(updates: Partial<FooterConfig>) {
  const supabase = await createClient();

  const { error } = await supabase.from("footer").update(updates).eq("id", 1);

  if (error) {
    console.error("Błąd podczas aktualizacji stopki:", error.message);
    throw new Error("Nie udało się zapisać stopki.");
  }
}
