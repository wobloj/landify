import AdminSidebar from "@/components/features/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getSiteConfig } from "@/lib/supabase/data";
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
  config,
  children,
}: {
  config: any;
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-row w-full overflow-hidden">
      <SidebarProvider>
        <AdminSidebar initialConfig={config} />

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-4 left-4 z-50">
            <SidebarTrigger className="bg-white shadow-md border" />
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
    const config = await getSiteConfig();

    // Return early before JSX construction if config is missing
    if (!config) {
      return <ConfigErrorFallback />;
    }

    return <AdminLayoutContent config={config}>{children}</AdminLayoutContent>;
  } catch (e) {
    if ((e as Error).message === "REDIRECT_MOCK") {
      return <div className="p-8 text-blue-500">Trwa przekierowanie...</div>;
    }
    throw e;
  }
}
