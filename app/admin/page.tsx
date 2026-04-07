import {
  getFooterConfig,
  getSectionsData,
  getSiteConfig,
  getUserSites,
} from "@/lib/supabase/data";
import { LandingPagePreview } from "@/components/features/LandingPagePreview";
import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveButton } from "@/components/features/SaveButton";
import { UnsavedChangesIndicator } from "@/components/features/UnsavedChangesIndicator";
import { createClient } from "@/lib/supabase/server";
import { AutoSaveCountdown } from "@/components/features/AutoSaveCountdown";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Home } from "lucide-react";
import { notFound, redirect } from "next/navigation";

interface AdminPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  // ✅ Handle undefined searchParams
  let siteIdParam: string | undefined;

  if (searchParams) {
    const params = await searchParams;
    siteIdParam = params.site as string | undefined;
  }

  // Pobierz wszystkie strony użytkownika
  const allUserSites = await getUserSites();

  if (allUserSites.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-8">
        <div className="text-center p-6 border rounded-xl bg-white shadow-lg">
          <h1 className="text-xl font-bold text-red-600">Brak Strony</h1>
          <p className="text-gray-600 mt-2">
            Nie masz jeszcze żadnej strony. Utwórz swoją pierwszą stronę.
          </p>
          <Button asChild className="mt-4">
            <Link href="/create-site">Utwórz stronę</Link>
          </Button>
        </div>
      </div>
    );
  }

  let configSite;

  if (siteIdParam) {
    // Jeśli podano ?site=14
    const siteId = parseInt(siteIdParam);
    configSite = await getSiteConfig(siteId);

    // Sprawdź czy strona należy do użytkownika
    if (!configSite || !allUserSites.find((s) => s.id === siteId)) {
      console.error(
        `User ${user.id} tried to access site ${siteId} which doesn't belong to them`,
      );
      notFound();
    }
  } else {
    // Brak parametru - użyj pierwszej strony i przekieruj
    const firstSite = allUserSites[0];
    redirect(`/admin?site=${firstSite.id}`);
  }

  if (!configSite) {
    notFound();
  }

  // Pobierz dane dla wybranej strony
  const siteId = configSite.id;
  const [configSections, configFooter] = await Promise.all([
    getSectionsData(siteId),
    getFooterConfig(siteId),
  ]);

  if (!configSections) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-8">
        <div className="text-center p-6 border rounded-xl bg-white shadow-lg">
          <h1 className="text-xl font-bold">Wczytywanie...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <AdminSidebar
        configSite={configSite}
        configSections={configSections}
        configFooter={configFooter}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between h-14 border-b px-4 bg-sidebar">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/site/${configSite.site_slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <UnsavedChangesIndicator />
            <AutoSaveCountdown />
            <SaveButton siteId={siteId} />
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <LandingPagePreview
            configSite={configSite}
            configSections={configSections}
            configFooter={configFooter}
          />
        </div>
      </div>
    </div>
  );
}
