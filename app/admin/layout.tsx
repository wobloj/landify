import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSections, getSiteConfig, SiteConfig } from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/server";
import React from "react";

// Mock funkcji redirect
function redirect(path: string): never {
  console.log(`[Navigation] Przekierowanie do: ${path}`);
  throw new Error("REDIRECT_MOCK");
}

// Error Fallback Component
function ConfigErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-8">
      <div className="text-center p-6 border rounded-xl bg-white shadow-lg">
        <h1 className="text-xl font-bold text-red-600">
          Błąd Konfiguracji Strony
        </h1>
        <p className="text-gray-600 mt-2">
          Nie udało się załadować danych konfiguracyjnych strony. Sprawdź serwis
          danych (data.ts).
        </p>
      </div>
    </div>
  );
}

// Main Layout Content
function AdminLayoutContent({
  configSite,
  configSection,
  children,
}: {
  configSite: SiteConfig;
  configSection: any;
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
  try {
    // 1. Walidacja sesji
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/");
    }

    // 2. Pobranie danych do edycji
    const configSite = await getSiteConfig();
    const configSection = await getSections();

    console.log(configSection);

    // Return early before JSX construction if config is missing
    if (!configSite || !configSection) {
      return <ConfigErrorFallback />;
    }

    return (
      <AdminLayoutContent configSite={configSite} configSection={configSection}>
        {children}
      </AdminLayoutContent>
    );
  } catch (e) {
    if ((e as Error).message === "REDIRECT_MOCK") {
      return <div className="p-8 text-blue-500">Trwa przekierowanie...</div>;
    }
    throw e;
  }
}
