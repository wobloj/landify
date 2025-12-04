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
  data_json:[];
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
    console.error("Błąd podczas pobierania konfiguracji strony:", error.message);
    return null;

  }
  return data;
}

export async function getSectionConfig(sectionType:string): Promise<SectionConfig | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("section_config")
    .select("*")
    .eq("section_type", sectionType)
    .single();
    
  if (error) {
    console.error("Błąd podczas pobierania konfiguracji sekcji:", error.message);
    return null;
  }

  return data;
}

export async function updatePublishStatus(isPublished: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_config")
    .update({ is_published: isPublished })
    .eq("id", 1);


  if (error) {
    console.error("Błąd podczas aktualizacji statusu publikacji:", error.message);
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