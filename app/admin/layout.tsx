import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  getSectionsData,
  getSiteConfig,
  SectionConfig,
  SiteConfig,
} from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/server";
import React from "react";

function redirect(path: string): never {
  console.log(`[Navigation] Przekierowanie do: ${path}`);
  throw new Error("REDIRECT_MOCK");
}

function ConfigErrorFallback() {
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

function AdminLayoutContent({
  configSite,
  configSection,
  children,
}: {
  configSite: SiteConfig;
  configSection: SectionConfig;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-row w-full">
      <SidebarProvider>
        <AdminSidebar
          initialConfigSection={configSection}
          initialConfigSite={configSite}
        />

        <main className="flex-1 flex flex-col h-full relative">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-background shadow-xs" />
          </div>

          <div>{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const configSite = await getSiteConfig();
  const configSection = await getSectionsData();

  if (!configSite || !configSection) {
    return <ConfigErrorFallback />;
  } else {
    return (
      <AdminLayoutContent configSite={configSite} configSection={configSection}>
        {children}
      </AdminLayoutContent>
    );
  }
}
