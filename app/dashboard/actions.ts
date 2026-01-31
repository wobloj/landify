"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserSites() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("site_config")
    .select(
      "id, site_slug, app_title, plan, is_published, created_at, plan_expired_date",
    )
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sites:", error);
    throw error;
  }

  return data || [];
}

export async function createNewSite() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Pobierz aktualne strony użytkownika
  const { data: existingSites, error: fetchError } = await supabase
    .from("site_config")
    .select("id, plan")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (fetchError) {
    throw fetchError;
  }

  // Sprawdź limit na podstawie planu
  const plan = existingSites?.[0]?.plan || "free";
  const maxSites = plan === "free" ? 1 : plan === "basic" ? 2 : 3;

  if (existingSites && existingSites.length >= maxSites) {
    throw new Error(`Osiągnięto limit stron dla planu ${plan}`);
  }

  // Wygeneruj unikalny slug
  const siteNumber = (existingSites?.length || 0) + 1;
  const slug = `site-${siteNumber}`;

  // 1. Utwórz site_config
  const { data: siteData, error: siteError } = await supabase
    .from("site_config")
    .insert({
      user_id: user.id,
      site_slug: slug,
      app_title: `Moja strona ${siteNumber}`,
      plan: plan,
      is_active: true,
      is_published: false,
      primary_color: "#2563EB",
      secondary_color: "#1E40AF",
      bg_color: "#FFFFFF",
      text_color_primary: "#000000",
      text_color_secondary: "#6B7280",
      spacing: "16px",
    })
    .select()
    .single();

  if (siteError) {
    console.error("Error creating site:", siteError);
    throw siteError;
  }

  const siteId = siteData.id;

  // 2. Utwórz domyślne sekcje
  const defaultSections = [
    {
      site_id: siteId,
      section_type: "hero",
      sort_order: 0,
      title: "Witaj na mojej stronie",
      data_json: {
        subtitle: "To jest Twoja nowa landing page",
      },
      is_deleted: false,
    },
    {
      site_id: siteId,
      section_type: "features",
      sort_order: 1,
      title: "Funkcje",
      data_json: {
        items: [
          {
            title: "Funkcja 1",
            desc: "Opis funkcji 1",
            icon: "smile",
          },
          {
            title: "Funkcja 2",
            desc: "Opis funkcji 2",
            icon: "sun",
          },
          {
            title: "Funkcja 3",
            desc: "Opis funkcji 3",
            icon: "moon",
          },
        ],
      },
      is_deleted: false,
    },
    {
      site_id: siteId,
      section_type: "cta",
      sort_order: 2,
      title: "Skontaktuj się",
      data_json: {
        desc: "Masz pytania? Napisz do nas!",
        button_text: "Wyślij wiadomość",
      },
      is_deleted: false,
    },
  ];

  await supabase.from("section_config").insert(defaultSections);

  // 3. Utwórz footer
  await supabase.from("footer").insert({
    site_id: siteId,
    copyright_text: "© 2026 Moja Strona. Wszystkie prawa zastrzeżone.",
    email: "kontakt@mojastrona.pl",
    socials_json: [],
  });

  // 4. Utwórz wip
  await supabase.from("wip").insert({
    site_id: siteId,
    title: "Strona w budowie",
    desc: "Wkrótce tu będzie coś wspaniałego!",
  });

  revalidatePath("/dashboard");
  return { success: true, siteId };
}

export async function deleteSite(siteId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Sprawdź czy strona należy do użytkownika
  const { data: site } = await supabase
    .from("site_config")
    .select("user_id")
    .eq("id", siteId)
    .single();

  if (!site || site.user_id !== user.id) {
    throw new Error("Unauthorized");
  }

  // Soft delete - ustaw is_active na false
  const { error } = await supabase
    .from("site_config")
    .update({ is_active: false })
    .eq("id", siteId);

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
  return { success: true };
}
