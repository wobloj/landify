import {
  FooterConfig,
  SectionConfig,
  SiteConfig,
  WipConfig,
} from "../types/types";
import { getDefaultSectionData } from "./sections/defaultSectionData";
import { createClient } from "./server";

/**
 * Pobiera aktywny site_id dla zalogowanego użytkownika
 * Zwraca pierwszy aktywny site lub null jeśli nie znaleziono
 */
async function getActiveSiteId(): Promise<number | null> {
  const supabase = await createClient();

  // Pobierz zalogowanego użytkownika
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Błąd podczas pobierania użytkownika:", authError?.message);
    return null;
  }

  // Pobierz pierwszy aktywny site dla tego użytkownika
  const { data, error } = await supabase
    .from("site_config")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("Błąd podczas pobierania site_id:", error.message);
    return null;
  }

  return data?.id || null;
}

/**
 * Pobiera site_id na podstawie site_slug i user_id
 * Używaj gdy masz dostęp do slug'a (np. z URL)
 */
export async function getSiteIdBySlug(slug: string): Promise<number | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Błąd podczas pobierania użytkownika:", authError?.message);
    return null;
  }

  const { data, error } = await supabase
    .from("site_config")
    .select("id")
    .eq("user_id", user.id)
    .eq("site_slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Błąd podczas pobierania site_id:", error.message);
    return null;
  }

  return data?.id || null;
}

/**
 * Pobiera wszystkie strony użytkownika
 */
export async function getUserSites(): Promise<SiteConfig[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Błąd podczas pobierania użytkownika:", authError?.message);
    return [];
  }

  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Błąd podczas pobierania stron użytkownika:", error.message);
    return [];
  }

  return data || [];
}

export async function getSiteConfig(
  siteId?: number,
): Promise<SiteConfig | null> {
  const supabase = await createClient();

  // Jeśli nie podano siteId, pobierz aktywny
  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony dla użytkownika");
    return null;
  }

  const { data, error } = await supabase
    .from("site_config")
    .select("*")
    .eq("id", targetSiteId)
    .single();

  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji strony:",
      error.message,
    );
    return null;
  }

  return data;
}

export async function getFooterConfig(
  siteId?: number,
): Promise<FooterConfig | null> {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony");
    return null;
  }

  const { data, error } = await supabase
    .from("footer")
    .select("*")
    .eq("site_id", targetSiteId)
    .limit(1)
    .single();

  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji stopki:",
      error.message,
    );
    return null;
  }

  return data;
}

export async function getSectionsData(
  siteId?: number,
): Promise<Record<string, SectionConfig>> {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony");
    return {};
  }

  const { data, error } = await supabase
    .from("section_config")
    .select("*")
    .eq("site_id", targetSiteId)
    .eq("is_deleted", false)
    .order("sort_order", { ascending: false });

  if (error) {
    console.error(
      "Błąd podczas pobierania tabeli section_config:",
      error.message,
    );
    return {};
  }

  const sectionsMap = (data || []).reduce(
    (acc, section) => {
      acc[section.section_type] = section;
      return acc;
    },
    {} as Record<string, SectionConfig>,
  );

  return sectionsMap;
}

export async function getSectionsName(siteId?: number) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony");
    return [];
  }

  const { data, error } = await supabase
    .from("section_config")
    .select("section_type")
    .eq("site_id", targetSiteId)
    .order("sort_order", { ascending: false });

  if (error) {
    console.error(
      "Błąd podczas pobierania tabeli section_config:",
      error.message,
    );
  }

  return data || [];
}

export async function getWipData(siteId?: number): Promise<WipConfig | null> {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony");
    return null;
  }

  const { data, error } = await supabase
    .from("wip")
    .select("*")
    .eq("site_id", targetSiteId)
    .single();

  if (error) {
    console.error("Błąd podczas pobierania konfiguracji WIP:", error.message);
    return null;
  }

  console.log("Wip data:", data);

  return data;
}

export async function getSectionConfigByType(
  sectionType: string,
  siteId?: number,
): Promise<SectionConfig | null> {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    console.error("Nie znaleziono aktywnej strony");
    return null;
  }

  const { data, error } = await supabase
    .from("section_config")
    .select("*")
    .eq("section_type", sectionType)
    .eq("site_id", targetSiteId)
    .single();

  if (error) {
    console.error(
      "Błąd podczas pobierania konfiguracji sekcji:",
      error.message,
    );
    return null;
  }

  return data;
}

export async function saveOrderToSection(sections: string[], siteId?: number) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { data: currentSections, error: fetchError } = await supabase
    .from("section_config")
    .select("id, section_type")
    .eq("site_id", targetSiteId);

  if (fetchError) {
    console.error("Błąd podczas pobierania ID sekcji:", fetchError.message);
    throw new Error(fetchError.message);
  }

  const idMap = (currentSections || []).reduce(
    (acc, section) => {
      acc[section.section_type] = section.id;
      return acc;
    },
    {} as Record<string, number>,
  );

  const updatePromises = sections
    .map((section_type, index) => {
      const id = idMap[section_type];
      if (id === undefined) {
        console.warn(
          `Sekcja typu '${section_type}' nie została znaleziona w bazie danych. Pomijanie.`,
        );
        return null;
      }

      return supabase
        .from("section_config")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("site_id", targetSiteId);
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
      updateError.message,
    );
    throw new Error(
      `Błąd podczas aktualizacji kolejności: ${updateError.message}`,
    );
  }
}

export async function updatePublishStatus(
  isPublished: boolean,
  siteId?: number,
) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("site_config")
    .update({ is_published: isPublished })
    .eq("id", targetSiteId);

  if (error) {
    console.error(
      "Błąd podczas aktualizacji statusu publikacji:",
      error.message,
    );
    throw new Error("Nie udało się zaktualizować statusu publikacji.");
  }
}

export async function updateSiteGlobalContent(
  updates: Partial<SiteConfig>,
  siteId?: number,
) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("site_config")
    .update(updates)
    .eq("id", targetSiteId);

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
  },
  siteId?: number,
) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("section_config")
    .update(updates)
    .eq("section_type", sectionType)
    .eq("site_id", targetSiteId);

  if (error) {
    console.error(`[updateSectionContent] ${sectionType}`, error);
    throw new Error("Nie udało się zapisać sekcji strony.");
  }
}

export async function updateFooterContent(
  updates: Partial<FooterConfig>,
  siteId?: number,
) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("footer")
    .update(updates)
    .eq("site_id", targetSiteId);

  if (error) {
    console.error("Błąd podczas aktualizacji stopki:", error.message);
    throw new Error("Nie udało się zapisać stopki.");
  }
}

export async function setSectionVisibility(
  section_type: string,
  is_deleted: boolean,
  siteId?: number,
) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("section_config")
    .update({ is_deleted })
    .eq("section_type", section_type)
    .eq("site_id", targetSiteId);

  if (error) throw error;
}

export async function softDeleteSectionById(id: number, siteId?: number) {
  const supabase = await createClient();

  const targetSiteId = siteId || (await getActiveSiteId());

  if (!targetSiteId) {
    throw new Error("Nie znaleziono aktywnej strony");
  }

  const { error } = await supabase
    .from("section_config")
    .update({ is_deleted: true })
    .eq("id", id)
    .eq("site_id", targetSiteId);

  if (error) throw error;
}
