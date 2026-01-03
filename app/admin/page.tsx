import {
  getFooterConfig,
  getSectionsData,
  getSiteConfig,
} from "@/lib/supabase/data";
import { LandingPagePreview } from "@/components/features/LandingPagePreview";
import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

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

      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute top-4 left-4 z-50">
          <SidebarTrigger className="bg-background shadow-xs fixed" />
        </div>

        <LandingPagePreview
          configSite={configSite}
          configSections={configSections}
          configFooter={configFooter}
        />
      </main>
    </>
  );
}
