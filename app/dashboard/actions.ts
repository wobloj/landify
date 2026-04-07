"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionState } from "@/lib/types/types";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    {
      site_id: siteId,
      section_type: "images",
      sort_order: 3,
      title: "Moje obrazy",
      data_json: {
        desc: "Zdjęcia przedstawiające naszą firmę.",
        images: [
          {
            id: "ph5vr28zvi-1768917418902.jpeg",
            url: "https://asvbekkqnyerssncltdk.supabase.co/storage/v1/object/public/images/images/ph5vr28zvi-1768917418902.jpeg",
            order: 0,
          },
          {
            id: "f54hvo37fb9-1768980595279.jpg",
            url: "https://asvbekkqnyerssncltdk.supabase.co/storage/v1/object/public/images/images/f54hvo37fb9-1768980595279.jpg",
            order: 1,
          },
          {
            id: "wre385204km-1768980669083.jpg",
            url: "https://asvbekkqnyerssncltdk.supabase.co/storage/v1/object/public/images/images/wre385204km-1768980669083.jpg",
            order: 2,
          },
        ],
      },
      is_deleted: true,
    },
    {
      site_id: siteId,
      section_type: "video",
      sort_order: 4,
      title: "Moje wideo",
      data_json: {
        url: "https://www.youtube.com/watch?v=qjWkNZ0SXfo",
        desc: "Film przedstawiający nasze możliwości",
      },
      is_deleted: true,
    },
    {
      site_id: siteId,
      section_type: "blank",
      sort_order: 5,
      title: "Pusta sekcja",
      data_json: {
        desc: "Opis pustej sekcji",
        columns: [
          "Pierwsza kolumna pustej sekcji",
          "Druga kolumna pustej sekcji",
          "Trzecia kolumna pustej sekcji",
        ],
      },
      is_deleted: true,
    },
  ];

  await supabase.from("section_config").insert(defaultSections);

  // 3. Utwórz footer
  await supabase.from("footer").insert({
    site_id: siteId,
    copyright_text: "Moja Strona.",
    email: "kontakt@mojastrona.pl",
    socials_json: {
      socials: [
        {
          icon: "facebook",
          link: "https://facebook.com",
          social_name: "Facebook",
        },
        {
          icon: "instagram",
          link: "https://instagram.com",
          social_name: "Instagram",
        },
        {
          icon: "github",
          link: "https://github.com",
          social_name: "Github",
        },
      ],
    },
  });

  // 4. Utwórz wip
  await supabase.from("wip").insert({
    site_id: siteId,
    title: "Strona w budowie",
    desc: "Wkrótce tu będzie coś wspaniałego!",
  });

  // Wywołaj Edge Function w tle (nie blokuj użytkownika)
  // Używamy fetch, bo nie musimy czekać na koniec robienia zdjęcia
  fetch(`${SUPABASE_URL}/functions/v1/generate-screenshot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ siteId, slug }),
  }).catch((err) => console.error("Screenshot error:", err));

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

export async function updateUserAccount(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "Brak autoryzacji. Zaloguj się ponownie.",
      };
    }

    const newUsername = (formData.get("username") as string)?.trim() || "";
    // Normalizuj do lowercase - kluczowa poprawka
    const newEmail =
      (formData.get("email") as string)?.trim().toLowerCase() || "";
    const currentEmail = user.email?.toLowerCase() || "";

    const result: ActionState = { success: true, message: "" };

    // ── Nazwa użytkownika (osobny call) ───────────────────────────────────
    const currentDisplayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.displayName ||
      user.user_metadata?.full_name ||
      "";

    if (newUsername && newUsername !== currentDisplayName) {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          display_name: newUsername,
        },
      });

      if (error) {
        return {
          success: false,
          message: `Błąd zmiany nazwy: ${error.message}`,
        };
      }

      result.usernameUpdated = true;
    }

    // ── Email (bezpośrednia zmiana przez Admin API - bez potwierdzenia) ────
    if (newEmail && newEmail !== currentEmail) {
      console.log(
        "[updateUserAccount] Updating email from",
        currentEmail,
        "to",
        newEmail,
      );

      try {
        const adminClient = await createAdminClient();

        const { error } = await adminClient.auth.admin.updateUserById(user.id, {
          email: newEmail,
        });

        if (error) {
          console.error("[updateUserAccount] Email update error:", error);
          const msg = error.message?.toLowerCase() || "";

          if (
            msg.includes("already registered") ||
            msg.includes("email already") ||
            msg.includes("duplicate") ||
            msg.includes("already exists") ||
            msg.includes("in use") ||
            msg.includes("user already registered")
          ) {
            return {
              success: false,
              message: "Podany adres e-mail jest już zajęty przez inne konto.",
            };
          }

          if (msg.includes("invalid email")) {
            return {
              success: false,
              message: "Podany adres e-mail jest nieprawidłowy.",
            };
          }

          return {
            success: false,
            message: error.message || "Błąd zmiany adresu e-mail.",
          };
        }

        result.emailUpdated = true;
      } catch (err: any) {
        console.error("[updateUserAccount] Admin client error:", err);
        return {
          success: false,
          message: err?.message || "Błąd aktualizacji email.",
        };
      }
    }

    // Nic się nie zmieniło
    if (!result.usernameUpdated && !result.emailUpdated) {
      return { success: true, message: "Brak zmian do zapisania." };
    }

    // Komunikat zależny od tego co się zmieniło
    if (result.emailUpdated) {
      result.message = "Adres e-mail został zmieniony pomyślnie.";
    } else {
      result.message = "Zmiany zostały zapisane pomyślnie.";
    }

    revalidatePath("/dashboard");
    return result;
  } catch (error: any) {
    console.error("[updateUserAccount] Unexpected error:", error);
    return {
      success: false,
      message: error?.message || "Nieoczekiwany błąd podczas zapisu danych.",
    };
  }
}
