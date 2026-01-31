import {
  getFooterConfig,
  getSectionsData,
  getSiteConfig,
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

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const configSite = await getSiteConfig();
  const configSections = await getSectionsData();
  const configFooter = await getFooterConfig();

  if (!configSite || !configSections) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-8">
        <div className="text-center p-6 border rounded-xl bg-white shadow-lg">
          <h1 className="text-xl font-bold text-red-600">
            Błąd Konfiguracji Strony
          </h1>
          <p className="text-gray-600 mt-2">
            Nie udało się załadować danych konfiguracyjnych strony.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminSidebar
        initialConfigSite={configSite}
        initialConfigSection={configSections}
        initialConfigFooter={configFooter}
      />

      <main className="flex-1 flex flex-col">
        {/* Header z przyciskiem zapisu */}
        <header className="sticky top-0 z-50 bg-sidebar border-b px-6 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Button>
              <Link href="/site">Podgląd strony</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <UnsavedChangesIndicator />
            <AutoSaveCountdown />
            <SaveButton />
          </div>
        </header>

        {/* Podgląd strony - scrollowalny */}
        <div className="flex-1 overflow-y-auto">
          <LandingPagePreview
            configSite={configSite}
            configSections={configSections}
            configFooter={configFooter}
          />
        </div>
      </main>
    </>
  );
}
