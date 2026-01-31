"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateDisplayName(displayName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      display_name: displayName,
    },
  });

  if (error) {
    throw error;
  }

  return { success: true };
}

export async function checkIfUserCompletedSetup() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  // Sprawdź czy użytkownik ma display_name i wybrany plan
  const hasDisplayName = !!user.user_metadata?.display_name;

  // Sprawdź czy użytkownik ma jakąkolwiek stronę (oznacza że przeszedł przez onboarding)
  const { data: sites } = await supabase
    .from("site_config")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1);

  const hasSite = sites && sites.length > 0;

  return hasDisplayName && hasSite;
}
