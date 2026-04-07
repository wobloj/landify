import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardPanel from "@/components/features/DashboardPanel";
import { getUserSites, createNewSite, deleteSite } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Pobierz strony użytkownika
  const sites = await getUserSites();

  // Określ maksymalną liczbę stron na podstawie planu
  const plan = sites[0]?.plan || "free";
  const maxSites = plan === "free" ? 1 : plan === "basic" ? 2 : 3;

  // Wyciągnij dane użytkownika z Supabase auth object
  const userData = {
    username:
      user.user_metadata?.display_name || user.user_metadata?.full_name || "",
    email: user.email || "",
    plan,
  };

  // Server Actions do przekazania do komponentu klienta
  async function handleCreateSite() {
    "use server";
    await createNewSite();
  }

  async function handleDeleteSite(siteId: number) {
    "use server";
    await deleteSite(siteId);
  }

  return (
    <DashboardPanel
      sites={sites}
      maxSites={maxSites}
      onCreateSite={handleCreateSite}
      onDeleteSite={handleDeleteSite}
      userData={userData}
    />
  );
}
